export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
