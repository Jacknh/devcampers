const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../utils/asyncHandler')

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ data: bootcamps });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp) {
      next(new ErrorResponse(`Resource not found with the id of ${req.params.id}`, 400))
    } 
    else {
      res.status(200).json({data: bootcamp})
    }
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.create(req.body);
    res.status(200).json({ msg: "Create a new bootcamp", data });  
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if(!bootcamp) {
      next(
        new ErrorResponse(
          `Resource not found with the id of ${req.params.id}`,
          400
        )
      );
    }
    else {
      res.status(200).json({data: bootcamp})
    }
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp) {
      next(
        new ErrorResponse(
          `Resource not found with the id of ${req.params.id}`,
          400
        )
      );
    }
    else {
      res.status(200).json({data: bootcamp})
    }
});
