exports.getBootcamps = (req, res) => {
  res.status(200).json({ msg: "Get all bootcamps" });
};

exports.getBootcamp = (req, res) => {
  res.status(200).json({ msg: `Get the bootcamp ${req.params.id}` });
};

exports.createBootcamp = (req, res) => {
  res.status(200).json({ msg: "Create a new bootcamp" });
};

exports.updateBootcamp = (req, res) => {
  res.status(200).json({ msg: `Update the bootcamp ${req.params.id}` });
};

exports.deleteBootcamp = (req, res) => {
  res.status(200).json({ msg: `Delete the bootcamp ${req.params.id}` });
};
