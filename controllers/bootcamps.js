const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const geocoder = require("../utils/geocoder");

exports.getBootcamps = asyncHandler(async (req, res) => {
  var reqQuery = { ...req.query };
  let noQueryFields = ["select", "sort", "limit", "page"];
  noQueryFields.forEach(field => delete reqQuery[field]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  if (req.query.select) {
    let selectedStr = req.query.select.split(",").join(" ");
    query = query.select(selectedStr);
  }
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  let limit = parseInt(req.query.limit) || 20;
  let page = parseInt(req.query.page) || 1;
  let pagination = {};
  let total = await Bootcamp.countDocuments();

  if (page * limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (page > 1) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  query = query.skip((page - 1) * limit).limit(limit);

  const bootcamps = await query;

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate("courses");
  if (!bootcamp) {
    next(
      new ErrorResponse(
        `Resource not found with the id of ${req.params.id}`,
        400
      )
    );
  } else {
    res.status(200).json({ success: true, data: bootcamp });
  }
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const data = await Bootcamp.create(req.body);
  res.status(200).json({ success: true, data });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    next(
      new ErrorResponse(
        `Resource not found with the id of ${req.params.id}`,
        400
      )
    );
  } else {
    res.status(200).json({ success: true, data: bootcamp });
  }
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate("courses");
  if (!bootcamp) {
    next(
      new ErrorResponse(
        `Resource not found with the id of ${req.params.id}`,
        400
      )
    );
  } else {
    await bootcamp.remove();
    res.status(200).json({ success: true, data: bootcamp });
  }
});

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  const radius = distance / 3963; // 3963 is the radius of earth

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc      upload photo to bootcamp
// @route     /:id/photo
// @access    private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Resource not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please attach a file", 400));
  }

  const photo = req.files.photo;

  if (!photo.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please add a image file", 400));
  }

  photo.name = `photo_${req.params.id}${path.parse(photo.name).ext}`;

  photo.mv(`./public/photo/${photo.name}`, async err => {
    if (err) {
      return next(new ErrorResponse("Problem occurs on moving file", 500));
    }
    await Bootcamp.findByIdAndUpdate(
      req.params.id,
      { photo: photo.name },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({ success: true, data: photo.name });
  });
});
