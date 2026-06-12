const Review = require("../models/Review");
const Product = require("../models/Product");

/* =========================
   UPDATE PRODUCT RATINGS
========================= */

const updateProductRatings = async (productId) => {
  const reviews = await Review.find({
    product: productId,
    isApproved: true,
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (acc, item) => acc + item.rating,
          0
        ) / totalReviews
      : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating:
      Number(averageRating.toFixed(1)),
    totalReviews,
  });
};

/* =========================
   CREATE REVIEW
========================= */

const createReview = async (req, res) => {
  try {
    const { product, rating, comment } =
      req.body;

    const reviewExists =
      await Review.findOne({
        user: req.user._id,
        product,
      });

    if (reviewExists) {
      return res.status(400).json({
        success: false,
        message:
          "You already reviewed this product",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
    });

    await updateProductRatings(product);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET PRODUCT REVIEWS
========================= */

const getProductReviews = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE REVIEW
========================= */

const updateReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    review.rating =
      req.body.rating || review.rating;

    review.comment =
      req.body.comment || review.comment;

    await review.save();

    await updateProductRatings(
      review.product
    );

    res.status(200).json({
      success: true,
      message: "Review updated",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE REVIEW
========================= */

const deleteReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const productId =
      review.product;

    if (
      review.user.toString() !==
      req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await review.deleteOne();

    await updateProductRatings(
      productId
    );

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL REVIEWS (ADMIN)
========================= */

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email profileImage")
      .populate("product", "name images category price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReview,
  deleteReview,
};