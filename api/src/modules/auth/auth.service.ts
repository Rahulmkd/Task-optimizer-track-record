import { User } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import {
  REFRESH_TOKEN_TTL_MS,
  comparePassword,
  hashPassword,
  hashRefreshToken,
} from "../../utils/auth.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/Jwt.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toJwtPayload, toUserResponse } from "./auth.mapper.js";
import { LoginUserDTO, RegisterUserDTO } from "./auth.schema.js";

export class AuthService {
  constructor(private userRepo: IAuthRepository) {}

  async registerUser(data: RegisterUserDTO) {
    const { name, email, password, phoneNumber } = data;

    const existingUser = await this.userRepo.getUserByEmail(email);

    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.userRepo.createUser({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const tokens = await this.issueTokens(newUser);

    return { user: toUserResponse(newUser), ...tokens };
  }

  async loginUser(data: LoginUserDTO) {
    const { email, password } = data;

    const existingUser = await this.userRepo.getUserByEmail(email);

    // Compare against a dummy hash even when the user doesn't exist, so
    // login takes roughly the same amount of time either way and an
    // attacker can't use response timing to enumerate valid emails.
    const passwordToCompare =
      existingUser?.password ??
      "$2b$10$CwTycUXWue0Thq9StjUM0uJ8Zi1cd7d1Xrb1SxlOK4E.OKV0mV5Ee";

    const isPasswordCorrect = await comparePassword(
      password,
      passwordToCompare,
    );

    if (!existingUser || !isPasswordCorrect) {
      throw new AppError("Invalid credentials", 401);
    }

    const tokens = await this.issueTokens(existingUser);

    return { user: toUserResponse(existingUser), ...tokens };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepo.getUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUserResponse(user);
  }

  /** Logging out with no/unknown refresh token is a no-op, not an error. */
  async logout(refreshToken: string): Promise<void> {
    const hashedRefreshToken = hashRefreshToken(refreshToken);
    await this.userRepo.deleteRefreshTokenByToken(hashedRefreshToken);
  }

  async logoutAllDevices(userId: string): Promise<void> {
    await this.userRepo.deleteAllRefreshTokenByUserId(userId);
  }

  async refreshToken(oldRefreshToken: string) {
    let decoded;
    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch {
      throw new AppError("Invalid or expired refresh token", 403);
    }

    const hashedOldRefreshToken = hashRefreshToken(oldRefreshToken);

    const existingRefreshToken = await this.userRepo.findRefreshToken(
      hashedOldRefreshToken,
    );

    if (!existingRefreshToken) {
      throw new AppError("Refresh token not found or already used", 403);
    }

    // Atomically consume the token before doing anything else, so two
    // concurrent requests presenting the same refresh token can't both
    // succeed — the loser's delete affects 0 rows (see auth.repository.ts).
    const wasDeleted = await this.userRepo.deleteRefreshTokenByToken(
      hashedOldRefreshToken,
    );

    if (!wasDeleted) {
      throw new AppError("Refresh token not found or already used", 403);
    }

    if (existingRefreshToken.expiresAt < new Date()) {
      throw new AppError("Refresh token has expired, please log in again", 403);
    }

    const user = await this.userRepo.getUserById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return this.issueTokens(user);
  }

  /** Signs a fresh token pair for a user and persists the refresh token. */
  private async issueTokens(user: User) {
    const jwtPayload = toJwtPayload(user);

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    await this.userRepo.createRefreshToken({
      token: hashRefreshToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    return { accessToken, refreshToken };
  }
}
