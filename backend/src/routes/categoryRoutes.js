const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const admin = require(
  "../middleware/adminMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require(
  "../controllers/categoryController"
);

/* =========================
   PUBLIC ROUTES
========================= */

router.get("/", getCategories);

router.get("/:id", getCategoryById);

/* =========================
   ADMIN ROUTES
========================= */

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createCategory
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteCategory
);

module.exports = router;