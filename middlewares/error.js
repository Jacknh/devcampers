const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  var error = { ...err };
  error.message = err.message;

  // Id form is incorrect error
  if (err.name === "CastError") {
    error = new ErrorResponse(
      `Resource not found with the id of ${err.value}`,
      400
    );
  }
  // Duplicated field value
  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400)
  }
  // Validation error
  if (err.name === 'ValidationError') {
    let message = Object.values(err.errors).map(v => v.message);
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 400).json({ success: false, msg: error.message });
};

module.exports = errorHandler;
