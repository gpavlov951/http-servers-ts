export class BadRequestError extends Error {
  public readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  public readonly statusCode = 401;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  public readonly statusCode = 403;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  public readonly statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export type CustomError =
  | BadRequestError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;

export function isCustomError(error: unknown): error is CustomError {
  return (
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError
  );
}
