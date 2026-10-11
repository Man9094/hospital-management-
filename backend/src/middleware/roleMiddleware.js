/**
 * Server-side Role-Based Access Control (RBAC) middleware.
 * Verifies that the authenticated user possesses one of the allowed roles.
 *
 * @param {...string} allowedRoles - List of permitted roles
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Authentication required before role verification.",
      });
    }

    const userRole = req.user.role;

    // Super admin inherently has access across modules unless specifically restricted
    if (userRole === "super_admin") {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Access denied. Required role: ${allowedRoles.join(" or ")}. Your role is: ${userRole}.`,
      });
    }

    next();
  };
};

module.exports = {
  requireRole,
};
