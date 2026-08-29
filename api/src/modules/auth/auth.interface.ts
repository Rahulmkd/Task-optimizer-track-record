import { Prisma, RefreshToken, User } from "@prisma/client";

export interface IAuthRepository {
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;

  createUser(data: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
  }): Promise<User>;

  createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;

  findRefreshToken(hashedRefreshToken: string): Promise<RefreshToken | null>;

  /**
   * Atomically deletes the refresh token row matching this hashed token,
   * if one exists. Returns true if a row was actually deleted.
   *
   * This replaces the old find-then-delete-by-id pattern: doing those as
   * two separate steps left a race window where two concurrent requests
   * using the same refresh token could both pass the "does it exist"
   * check before either delete ran.
   */
  deleteRefreshTokenByToken(hashedRefreshToken: string): Promise<boolean>;

  deleteAllRefreshTokenByUserId(userId: string): Promise<Prisma.BatchPayload>;
}
