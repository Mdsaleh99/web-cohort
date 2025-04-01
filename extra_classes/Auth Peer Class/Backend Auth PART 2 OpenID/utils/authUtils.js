import crypto from "crypto";

// generate a secure random state parameter for CSRF protection
export const generateState = () => {
  return crypto.randomBytes(32).toString("hex");
};

// generate a nonce value to prevent replay attacks
export const generateNonce = () => {
  return crypto.randomBytes(32).toString("hex");
};
