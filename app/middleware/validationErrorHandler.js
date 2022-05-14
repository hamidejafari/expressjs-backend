const { validationResult } = require("express-validator");

const validationErrorHandler = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorObject = {}
    errors.array().forEach((error) => {
      errorObject[error.param] = []
    });
    errors.array().forEach((error) => {
      errorObject[error.param].push(error.msg)
    });
    return res.status(400).json({ error: errorObject });
  }
  return next();
};

module.exports = validationErrorHandler;
