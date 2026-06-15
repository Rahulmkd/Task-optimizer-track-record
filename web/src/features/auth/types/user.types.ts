export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
