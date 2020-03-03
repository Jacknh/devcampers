const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

// @desc    Get all users
// @route   GET /users
// @access  Private/admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})

// @desc    Get single user
// @route   GET /users/:id
// @access  Private/admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('No such user', 400))
  }

  return res.status(200).json({data: user})
})

// @desc    Create user
// @route   POST /users
// @access  Private/admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (!user) {
    return next(new ErrorResponse('No such user', 400))
  }

  return res.status(200).json({data: user})
})

// @desc    Update user
// @route   PUT /users/:id
// @access  Private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

  if (!user) {
    return next(new ErrorResponse('No such user', 400))
  }

  return res.status(200).json({data: user})
})

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse('No such user', 400))
  }

  return res.status(200).json({data: {}})
})
