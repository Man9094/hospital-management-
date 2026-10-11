const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "medcore_hms_jwt_secret_key_change_in_production_2026";
const AUTH_COOKIE_NAME = "medcore-auth-token";

const signToken = (payload, expiresIn = "24h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const isProduction = process.env.NODE_ENV === "production";

/**
 * Generates cookie options suitable for both local development (HTTP)
 * and cross-domain production HTTPS (e.g. Vercel frontend + Render/Railway backend).
 */
const getAuthCookieOptions = (maxAgeMs) => {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    ...(maxAgeMs !== undefined ? { maxAge: maxAgeMs } : {}),
  };
};

module.exports = {
  JWT_SECRET,
  AUTH_COOKIE_NAME,
  signToken,
  verifyToken,
  getAuthCookieOptions,
};
