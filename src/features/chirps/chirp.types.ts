export interface ValidateChirpRequest {
  body: string;
}

export interface ValidateChirpResponse {
  cleanedBody: string;
}

export interface CreateChirpRequest {
  body: string;
  userId: string;
}

export interface CreateChirpResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  userId: string;
}

export interface GetAllChirpsResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  userId: string;
}
