import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";

export class AuthRepository implements IAuthRepository {
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) {
    return prisma.user.create({ data });
  }

  async createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) {
    return prisma.refreshToken.create({ data });
  }

  async findRefreshToken(hashedRefreshToken: string) {
    return prisma.refreshToken.findUnique({
      where: { token: hashedRefreshToken },
    });
  }

  async deleteRefreshTokenByToken(
    hashedRefreshToken: string,
  ): Promise<boolean> {
    // deleteMany + a where clause on the unique `token` column is atomic
    // at the database level, unlike a separate findUnique -> delete(id)
    // pair. If two requests race on the same token, only one delete can
    // ever match a row; the second sees count 0 and knows it lost the race.
    const result = await prisma.refreshToken.deleteMany({
      where: { token: hashedRefreshToken },
    });

    return result.count > 0;
  }

  async deleteAllRefreshTokenByUserId(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
