const express = require("express");
const router = express.Router({ mergeParams: true });
const { getReviews, getReview } = require("../controllers/reviews");
const advancedResults = require("../middlewares/advancedResults");
const Review = require("../models/Review");

router
  .route("/")
  .get(
    advancedResults(Review, { path: "bootcamp", select: "name description" }),
    getReviews
  );

router.route("/:id").get(getReview);

module.exports = router;
