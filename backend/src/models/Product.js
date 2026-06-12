const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      unique: true,
      trim: true,
    },

    images: [
      {
        type:String,
      },
    ],

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    ageGroup: {
      type: String,
      enum: [
        "0-2 Years",
        "3-5 Years",
        "6-8 Years",
        "9-12 Years",
        "13+ Years",
      ],
      default: "3-5 Years",
    },

    material: {
      type: String,
      trim: true,
      default: "",
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================
   INDEXES
========================== */

productSchema.index({ name: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model(
  "Product",
  productSchema
);