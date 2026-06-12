const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require(
  "../controllers/cartController"
);

/* =========================
   ALL ROUTES PROTECTED
========================= */

router.get("/", protect, getCart);

router.post(
  "/add",
  protect,
  addToCart
);

router.put(
  "/update/:productId",
  protect,
  updateCartItem
);

router.delete(
  "/remove/:productId",
  protect,
  removeCartItem
);

router.delete(
  "/clear",
  protect,
  clearCart
);

module.exports = router;