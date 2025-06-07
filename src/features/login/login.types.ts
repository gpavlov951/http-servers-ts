export interface LoginRequest {
  email: string;
  password: string;
  expiresInSeconds?: number;
}
