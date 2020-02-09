const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"]
  },
  description: {
    type: String,
    required: [true, "Please add a description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Bootcamp"
  }
});

CourseSchema.statics.getAverageCost = async function(bootcampId) {
  const res = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);

  try {
    let averageCost = 0;
    if (res.length === 0) {
      averageCost = 0;
    } else {
      averageCost = Math.ceil(res[0].averageCost / 10) * 10;
    }
    await this.model("Bootcamp").findByIdAndUpdate(
      bootcampId,
      {
        averageCost
      },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error(error);
  }
};

CourseSchema.post("save", function() {
  this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre("remove", function(next) {
  this.constructor.getAverageCost(this.bootcamp);
  next();
});

module.exports = mongoose.model("Course", CourseSchema);
