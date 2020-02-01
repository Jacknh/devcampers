const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({ data: bootcamps });
  } catch (error) {
    next(error)
  }
};

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp) {
      next(new ErrorResponse(`Resource not found with the id of ${req.params.id}`, 400))
    } 
    else {
      res.status(200).json({data: bootcamp})
    }
  } catch (error) {
    next(error)
  }
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const data = await Bootcamp.create(req.body);
    res.status(200).json({ msg: "Create a new bootcamp", data });
  } catch (error) {
    next(error)
  }
  
};

exports.updateBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
};
