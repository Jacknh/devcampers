const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

exports.getCourses = asyncHandler(async (req, res, next) => {
  var { bootcampId } = req.params;

  if (bootcampId) {
    const courses = await Course.find({ bootcamp: bootcampId }).populate({
      path: "bootcamp",
      select: "name description"
    });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get a single course
// @route   GET /:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
  } else {
    res.status(200).json({ success: true, data: course });
  }
});

exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  } else {
    const course = await Course.create(req.body);

    res.status(200).json({ success: true, data: course });
  }
});

// @desc    Update a course
// @route   PUT /:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!course) {
    next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
  } else {
    res.status(200).json({ success: true, data: course });
  }
});

// @desc    Delete a course
// @route   DELETE /:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
  } else {
    await course.remove();
    res.status(200).json({ success: true, data: {} });
  }
});
