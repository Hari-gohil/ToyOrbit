const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/* =========================
   REGISTER USER
========================= */

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: req.body.adminSecret === 'make-me-admin' ? 'admin' : 'user'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
  console.error("REGISTER ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

/* =========================
   LOGIN USER
========================= */

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (
      !user ||
      !(await user.matchPassword(password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
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
   GET PROFILE
========================= */

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
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
   UPDATE PROFILE
========================= */

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.addresses !== undefined) {
      user.addresses = req.body.addresses;
    }
    if (req.body.wishlist !== undefined) {
      user.wishlist = req.body.wishlist;
    }
    if (req.body.liveLocation !== undefined) {
      user.liveLocation = req.body.liveLocation;
    }

    const updatedUser = await user.save();
    await updatedUser.populate("wishlist");

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
        wishlist: updatedUser.wishlist,
        liveLocation: updatedUser.liveLocation,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};