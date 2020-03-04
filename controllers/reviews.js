const asyncHandler = require('../utils/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Review = require('../models/Review')

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const bootcampId = req.params.bootcampId;
    const reviews = await Review.find({bootcamp: bootcampId}).populate({
      path: 'bootcamp',
      select: 'name description'
    })

    res.status(200).json({data: reviews});
  }
  else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc    Get a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({path: 'bootcamp', select: 'name description'})

  if (!review) {
    return next(new ErrorResponse(`No such review with the id of ${req.params.id}`, 404))
  }

  res.status(200).json({data: review})
})