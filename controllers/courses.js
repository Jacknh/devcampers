const asyncHandler = require("../utils/asyncHandler");
const Course = require("../models/Course");

exports.getCourses = asyncHandler(async (req, res, next) => {
  var { bootcampId } = req.params;
  var query;

  if (bootcampId) {
    query = Course.find({ bootcamp: bootcampId });
  } else {
    query = Course.find();
  }

  var courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});
