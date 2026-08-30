let accessToken: string | null = null;

export const tokenService = {
  getToken(): string | null {
    return accessToken;
  },

  setToken(token: string): void {
    accessToken = token;
  },

  clearToken(): void {
    accessToken = null;
  },
};
