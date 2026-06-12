const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const admin = require(
  "../middleware/adminMiddleware"
);

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
} = require(
  "../controllers/userController"
);

/* =========================
   ADMIN ONLY ROUTES
========================= */

router.get(
  "/",
  protect,
  admin,
  getUsers
);

router.get(
  "/:id",
  protect,
  admin,
  getUserById
);

router.put(
  "/:id",
  protect,
  admin,
  updateUser
);

router.put(
  "/role/:id",
  protect,
  admin,
  changeUserRole
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteUser
);

module.exports = router;