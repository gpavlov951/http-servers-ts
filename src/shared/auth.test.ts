import { beforeAll, describe, expect, it } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";

describe("JWT Authentication", () => {
  const secret = "test-secret-key";
  const wrongSecret = "wrong-secret-key";
  const userID = "user123";
  let validToken: string;
  let expiredToken: string;
  let wrongSecretToken: string;

  beforeAll(() => {
    validToken = makeJWT(userID, 3600, secret);

    expiredToken = makeJWT(userID, -3600, secret);

    wrongSecretToken = makeJWT(userID, 3600, wrongSecret);
  });

  it("should create and validate a valid JWT", () => {
    const decodedUserID = validateJWT(validToken, secret);
    expect(decodedUserID).toBe(userID);
  });

  it("should reject JWTs signed with wrong secret", () => {
    expect(() => {
      validateJWT(wrongSecretToken, secret);
    }).toThrow("Invalid token");
  });

  it("should reject malformed tokens", () => {
    const malformedToken = "invalid.token.string";
    expect(() => {
      validateJWT(malformedToken, secret);
    }).toThrow("Invalid token");
  });

  it("should reject empty token string", () => {
    expect(() => {
      validateJWT("", secret);
    }).toThrow("Invalid token");
  });

  it("should create JWT with correct payload structure", () => {
    const token = makeJWT(userID, 3600, secret);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should handle different user IDs correctly", () => {
    const userID1 = "user1";
    const userID2 = "user2";

    const token1 = makeJWT(userID1, 3600, secret);
    const token2 = makeJWT(userID2, 3600, secret);

    const decodedUserID1 = validateJWT(token1, secret);
    const decodedUserID2 = validateJWT(token2, secret);

    expect(decodedUserID1).toBe(userID1);
    expect(decodedUserID2).toBe(userID2);
    expect(decodedUserID1).not.toBe(decodedUserID2);
  });

  it("should handle different expiration times", () => {
    const shortExpiryToken = makeJWT(userID, 1, secret);
    const longExpiryToken = makeJWT(userID, 7200, secret);

    expect(validateJWT(shortExpiryToken, secret)).toBe(userID);
    expect(validateJWT(longExpiryToken, secret)).toBe(userID);
  });
});

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const result = await checkPasswordHash("wrongPassword", hash1);
    expect(result).toBe(false);
  });

  it("should return false when using wrong password with different hash", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it("should generate different hashes for same password", async () => {
    const hash1Again = await hashPassword(password1);
    expect(hash1).not.toBe(hash1Again);
  });

  it("should validate correct password against newly generated hash", async () => {
    const newHash = await hashPassword(password1);
    const result = await checkPasswordHash(password1, newHash);
    expect(result).toBe(true);
  });
});
