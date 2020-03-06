const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require("../controllers/reviews");
const advancedResults = require("../middlewares/advancedResults");
const Review = require("../models/Review");
const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advancedResults(Review, { path: "bootcamp", select: "name description" }),
    getReviews
  )
  .post(protect, authorize("admin", "user"), createReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("admin", "user"), updateReview)
  .delete(protect, authorize("admin", "user"), deleteReview);

module.exports = router;
