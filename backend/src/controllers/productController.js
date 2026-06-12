const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify");

/* =========================
   CREATE PRODUCT
========================= */

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      stock,
      brand,
      ageGroup,
      material,
      featured,
      sku,
    } = req.body;

    const product = await Product.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
      description,
      category,
      price,
      discountPrice,
      stock,
      brand,
      ageGroup,
      material,
      featured,
      sku,
      images:
        req.files?.map(
          (file) =>
            `/uploads/products/${file.filename}`
        ) || [],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL PRODUCTS
========================= */

const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const keyword = req.query.keyword || "";

    const category = req.query.category || "";

    const query = {
      isActive: true,
    };

    if (keyword) {
      query.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    const sortParam = req.query.sort || "";
    let sortOption = { createdAt: -1 };
    
    if (sortParam === "top_selling") {
      sortOption = { soldCount: -1 };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SINGLE PRODUCT
========================= */

const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      ).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */

const updateProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name =
      req.body.name || product.name;

    product.slug = slugify(
      product.name,
      {
        lower: true,
        strict: true,
      }
    );

    product.description =
      req.body.description ||
      product.description;

    product.category =
      req.body.category ||
      product.category;

    product.price =
      req.body.price || product.price;

    product.discountPrice =
      req.body.discountPrice ||
      product.discountPrice;

    product.stock =
      req.body.stock || product.stock;

    product.brand =
      req.body.brand || product.brand;

    product.ageGroup =
      req.body.ageGroup ||
      product.ageGroup;

    product.material =
      req.body.material ||
      product.material;

    product.featured =
      req.body.featured ??
      product.featured;

    product.sku =
      req.body.sku || product.sku;

    if (
      req.files &&
      req.files.length > 0
    ) {
      product.images = req.files.map(
        (file) =>
          `/uploads/products/${file.filename}`
      );
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE PRODUCT
========================= */

const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};