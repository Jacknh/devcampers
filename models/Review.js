const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, "Please add a text"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function(bootcampId) {
  // 'this' -> model
  const res = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" }
      }
    }
  ]);

  try {
    let averageRating = res[0].averageRating;
    console.log(averageRating)
    await this.model("Bootcamp").findByIdAndUpdate(
      bootcampId,
      { averageRating },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.log(error)
  }
  
};

ReviewSchema.post("save", async function() {
  await this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre("remove", function() {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
