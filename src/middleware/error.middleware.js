const notFoundHandler = (req, _res, next) => {
  next({
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({
    message,
    errors: error.errors || undefined,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
