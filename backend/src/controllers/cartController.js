const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* =========================
   CALCULATE CART TOTALS
========================= */

const calculateCartTotals = (cart) => {
  cart.totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  cart.totalPrice = cart.items.reduce(
    (total, item) =>
      total + item.quantity * item.price,
    0
  );
};

/* =========================
   GET USER CART
========================= */

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      select:
        "name price images stock discountPrice",
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADD TO CART
========================= */

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } =
      req.body;

    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem =
      cart.items.find(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (existingItem) {
      existingItem.quantity += Number(
        quantity
      );
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
        price:
          product.discountPrice > 0
            ? product.discountPrice
            : product.price,
      });
    }

    calculateCartTotals(cart);

    await cart.save();
    
    await cart.populate({
      path: "items.product",
      select: "name price images stock discountPrice",
    });

    res.status(200).json({
      success: true,
      message:
        "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE CART ITEM
========================= */

const updateCartItem = async (
  req,
  res
) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() ===
        req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Cart item not found",
      });
    }

    item.quantity = Number(quantity);

    calculateCartTotals(cart);

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name price images stock discountPrice",
    });

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   REMOVE CART ITEM
========================= */

const removeCartItem = async (
  req,
  res
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !==
        req.params.productId
    );

    calculateCartTotals(cart);

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name price images stock discountPrice",
    });

    res.status(200).json({
      success: true,
      message:
        "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   CLEAR CART
========================= */

const clearCart = async (
  req,
  res
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};