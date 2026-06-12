const User = require("../models/User");

/* =========================
   GET ALL USERS
========================= */
const getUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          let: { userId: "$_id" },
          pipeline: [
            { 
              $match: { 
                $expr: { $eq: ["$user", "$$userId"] },
                orderStatus: { $ne: "Cancelled" } 
              } 
            }
          ],
          as: "orders"
        }
      },
      {
        $lookup: {
          from: "reviews",
          let: { userId: "$_id" },
          pipeline: [
            { 
              $match: { 
                $expr: { $eq: ["$user", "$$userId"] },
                isApproved: true 
              } 
            }
          ],
          as: "reviews"
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          addresses: 1,
          isActive: 1,
          createdAt: 1,
          orderCount: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalAmount" },
          reviewCount: { $size: "$reviews" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SINGLE USER
========================= */
const getUserById = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE USER
========================= */
const updateUser = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name =
      req.body.name || user.name;

    user.phone =
      req.body.phone || user.phone;

    user.role =
      req.body.role || user.role;

    user.isActive =
      req.body.isActive ??
      user.isActive;

    const updatedUser =
      await user.save();

    res.status(200).json({
      success: true,
      message: "User updated",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isActive:
          updatedUser.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE USER
========================= */
const deleteUser = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   CHANGE USER ROLE
========================= */
const changeUserRole = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = req.body.role;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User role updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
};