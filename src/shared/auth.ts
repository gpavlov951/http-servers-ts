import bcrypt from "bcrypt";
import crypto from "crypto";
import type { Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header must start with 'Bearer '");
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    throw new Error("Token is missing from Authorization header");
  }

  return token;
}

export function getAPIKey(req: Request): string {
  const apiKey = req.get("authorization");

  if (!apiKey) {
    throw new Error("API key is missing");
  }

  const startsWith = "ApiKey ";
  const startsWithLength = startsWith.length;

  if (!apiKey.startsWith(startsWith)) {
    throw new Error(`API key must start with '${startsWith}'`);
  }

  const key = apiKey.substring(startsWithLength).trim();

  if (!key) {
    throw new Error("API key is missing");
  }

  return key;
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;

  const tokenPayload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: iat,
    exp: exp,
  };

  return jwt.sign(tokenPayload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decoded = jwt.verify(tokenString, secret) as JwtPayload;

    if (!decoded.sub || typeof decoded.sub !== "string") {
      throw new Error("Invalid token: missing or invalid user ID");
    }

    return decoded.sub;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    } else {
      throw error;
    }
  }
}

export function makeRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
