const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

const protect = asyncHandler(async (req, res, next) => {
  var token = null;
  var { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('No authorized to access to this route', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(
      new ErrorResponse("No authorized to access to this route", 401)
    );
  }
  
})

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse(`The user role ${req.user.role} can not access to this route`, 403));
  }
  next()
}

module.exports = {
  protect,
  authorize
}