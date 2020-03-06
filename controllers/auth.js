const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
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
// @route   POST /api/v1/auth/login
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

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = (req, res, next) => {
  res.status(200).json({token: ''})
}

// @desc    Get the current logged in user
// @route   GET /me
// @access  Private
exports.getMe = (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
};

// @desc    Forgot password
// @route   POST /forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with the email"));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/v1/auth/resetpassword/${resetToken}`;

  const text = `You received the email to reset your password, please click this: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      to: req.body.email,
      text
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorResponse("Could not send email to reset password", 500)
    );
  }
};

// @desc    Reset password
// @route   PUT /resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedResetToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ success: true, data: "Password reset success" });
};

// @desc    Update user details(email, name)
// @route   PUT /updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { email: req.body.email, name: req.body.name },
    { new: true, runValidators: true }
  );

  res.status(200).json({data: user})
});

// @desc    Update user password
// @route   PUT /updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const validPassword = await user.matchPassword(req.body.currentPassword);

  if (!validPassword) {
    return next(new ErrorResponse('The current password is not valid', 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  res.status(200).json({data: 'Password changed'})
})