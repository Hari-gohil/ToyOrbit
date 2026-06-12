const Category = require("../models/Category");
const slugify = require("slugify");

/* =========================
   CREATE CATEGORY
========================= */

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const categoryExists = await Category.findOne({
      name,
    });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
      description,
      image: req.file
        ? `/uploads/categories/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL CATEGORIES
========================= */

const getCategories = async (req, res) => {
  try {
    const categories =
      await Category.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SINGLE CATEGORY
========================= */

const getCategoryById = async (
  req,
  res
) => {
  try {
    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE CATEGORY
========================= */

const updateCategory = async (
  req,
  res
) => {
  try {
    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name =
      req.body.name || category.name;

    category.slug = slugify(
      category.name,
      {
        lower: true,
        strict: true,
      }
    );

    category.description =
      req.body.description ||
      category.description;

    if (req.file) {
      category.image = `/uploads/categories/${req.file.filename}`;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE CATEGORY
========================= */

const deleteCategory = async (
  req,
  res
) => {
  try {
    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};