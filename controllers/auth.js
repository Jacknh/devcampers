const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Register user
// @route   POST /register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const token = user.getJsonWebToken();

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600 * 1000
      ),
      httpOnly: true
    })
    .json({ success: true, token });
});

// @desc    Login user
// @route   POST /login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }

  const token = user.getJsonWebToken();

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600 * 1000
      ),
      httpOnly: true
    })
    .json({ success: true, token });
});

// @desc    Get the current logged in user
// @route   GET /me
// @access  Private
exports.getMe = (req, res, next) => {
  res.status(200).json({ success: true, data: req.user })
}