import { User } from "@prisma/client";
import { UserResponseDTO } from "./auth.response.js";
import { IJwtPayload } from "../../types/index.js";

export const toUserResponse = (user: User): UserResponseDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const toJwtPayload = (user: User): IJwtPayload => {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
