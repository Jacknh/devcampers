const Bootcamp = require('../models/Bootcamp')

exports.getBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({ data: bootcamps });
  } catch (error) {
    res.status(400).json({msg: 'Failed to fetch all bootcamps'})
  }
};

exports.getBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp) {
      res.status(400).json({msg: 'No such bootcamp'})
    } 
    else {
      res.status(200).json({data: bootcamp})
    }
  } catch (error) {
    res.status(400).json({msg: 'Failed to fetch the bootcamp'})
  }
};

exports.createBootcamp = async (req, res) => {
  try {
    const data = await Bootcamp.create(req.body);
    res.status(200).json({ msg: "Create a new bootcamp", data });
  } catch (error) {
    res.status(400).json({ msg: 'Failed to create a bootcamp' })
  }
  
};

exports.updateBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if(!bootcamp) {
      res.status(400).json({msg: 'No such bootcamp'})
    }
    else {
      res.status(200).json({data: bootcamp})
    }
  } catch (error) {
    res.status(400).json({msg: 'Failed to update the bootcamp'})
  }
};

exports.deleteBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp) {
      res.status(400).json({msg: 'No such bootcamp'})
    }
    else {
      res.status(200).json({data: bootcamp})
    }
  } catch (error) {
    res.status(400).json({msg: 'Failed to delete the bootcamp'})
  }
};
