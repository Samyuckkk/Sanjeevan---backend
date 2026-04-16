const { validationResult } = require("express-validator");

const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next({
    statusCode: 400,
    message: "Validation failed",
    errors: result.array().map((item) => ({
      field: item.path,
      message: item.msg,
    })),
  });
};

module.exports = { validate };
