const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const admin = require(
  "../middleware/adminMiddleware"
);

const {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} = require(
  "../controllers/reviewController"
);

/* =========================
   PUBLIC ROUTES
========================= */

router.get(
  "/product/:productId",
  getProductReviews
);

/* =========================
   ADMIN ROUTES
========================= */

router.get(
  "/admin/all",
  protect,
  admin,
  getAllReviews
);

/* =========================
   USER ROUTES
========================= */

router.post(
  "/",
  protect,
  createReview
);

router.put(
  "/:id",
  protect,
  updateReview
);

router.delete(
  "/:id",
  protect,
  deleteReview
);

module.exports = router;