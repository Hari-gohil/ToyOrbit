const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

/* =========================
   ADMIN DASHBOARD
========================= */

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalReturns,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ "returnRequest.isRequested": true }),
    ]);

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    const recentOrders =
      await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5);

    const orderStatusStats =
      await Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]);

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        totalReturns,
      },

      orderStatusStats,

      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};