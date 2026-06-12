const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const admin = require(
  "../middleware/adminMiddleware"
);

const upload = require("../middleware/uploadMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAllReturns,
  updateReturnStatus,
} = require(
  "../controllers/orderController"
);

/* =========================
   USER ROUTES
========================= */

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

/* =========================
   ADMIN ROUTES
========================= */

router.get(
  "/admin/all",
  protect,
  admin,
  getAllOrders
);

router.get("/returns", protect, admin, getAllReturns);
router.put("/returns/:id", protect, admin, updateReturnStatus);

router.put(
  "/admin/:id",
  protect,
  admin,
  updateOrderStatus
);

router.delete(
  "/admin/:id",
  protect,
  admin,
  deleteOrder
);

/* =========================
   DYNAMIC ROUTES (Must be at the bottom)
========================= */

router.get(
  "/:id",
  protect,
  getOrderById
);

router.post("/:id/return", protect, upload.single("faultImage"), requestReturn);

module.exports = router;