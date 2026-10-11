const errorMiddleware = (err, req, res, next) => {
  // Log diagnostic info on server side
  console.error("❌ Internal Server Error:", {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Handle Mongoose CastError or ValidationError cleanly
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: `Resource not found with specified identifier format.`,
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(", "),
    });
  }

  // Handle duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      error: `A record with this ${field} already exists.`,
    });
  }

  // Generic sanitized response
  const errorMessage =
    process.env.NODE_ENV === "development"
      ? err.message || "An unexpected server error occurred."
      : "An unexpected server error occurred. Please try again later.";

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
};

module.exports = errorMiddleware;
