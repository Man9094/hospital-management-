const { verifyToken, AUTH_COOKIE_NAME } = require("../utils/token");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // 1. Read token from HTTP-only cookie
    if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
      token = req.cookies[AUTH_COOKIE_NAME];
    }
    // 2. Fallback to Authorization header if provided
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: No valid session found. Please log in.",
      });
    }

    // 3. Verify JWT
    const decoded = verifyToken(token);
    if (!decoded || (!decoded.userId && !decoded.id)) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid or expired session. Please log in again.",
      });
    }

    // 4. Find user in MongoDB
    const query = decoded.userId ? { userId: decoded.userId } : { _id: decoded.id };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User not found.",
      });
    }

    // 5. Verify user is active
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        error: "Forbidden: Account is inactive or suspended. Please contact administrator.",
      });
    }

    // 6. Attach authenticated user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Authentication verification failed.",
    });
  }
};

module.exports = authMiddleware;
