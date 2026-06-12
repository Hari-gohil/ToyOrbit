// const express = require("express");
// const router = express.Router();

// const protect = require("../middleware/authMiddleware");
// const admin = require("../middleware/adminMiddleware");

// router.get("/profile", protect, (req, res) => {
//   res.status(200).json({
//     success: true,
//     user: req.user,
//   });
// });

// router.post(
//   "/create-product",
//   protect,
//   admin,
//   createProduct
// );

// module.exports = router;


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
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require(
  "../controllers/productController"
);

/* =========================
   PUBLIC ROUTES
========================= */

router.get("/", getProducts);

router.get("/:id", getProductById);

/* =========================
   ADMIN ROUTES
========================= */

router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

module.exports = router;