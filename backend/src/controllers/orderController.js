const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* =========================
   CREATE ORDER
========================= */

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const { shippingAddress } = req.body;

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalItems: cart.totalItems,
      totalAmount: cart.totalPrice,
      paymentMethod: "COD",
      orderStatus: "Pending",
    });

    // Update Product Stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
          soldCount: item.quantity,
        },
      });
    }

    // Clear Cart
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET MY ORDERS
========================= */

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ORDER DETAILS
========================= */

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("orderItems.product", "name images");

    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   REQUEST RETURN
========================= */

const requestReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be returned",
      });
    }

    if (order.returnRequest && order.returnRequest.isRequested) {
      return res.status(400).json({
        success: false,
        message: "Return request already submitted for this order",
      });
    }

    // Check 5-day limit
    const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - deliveryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 5) {
      return res.status(400).json({
        success: false,
        message: "Return period has expired. Returns are only accepted within 5 days of delivery.",
      });
    }

    const imagePath = req.file ? `/uploads/returns/${req.file.filename}` : "";

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: "An image showing the fault is required",
      });
    }

    if (!req.body.reason) {
      return res.status(400).json({
        success: false,
        message: "A reason for the return is required",
      });
    }

    order.returnRequest = {
      isRequested: true,
      reason: req.body.reason,
      faultImage: imagePath,
      status: "Pending",
      requestedAt: new Date(),
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request submitted successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADMIN - GET ALL ORDERS
========================= */

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADMIN - UPDATE STATUS
========================= */

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = req.body.orderStatus;

    if (req.body.orderStatus === "Delivered") {
      order.deliveredAt = new Date();
    }

    if (req.body.orderStatus === "Cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE ORDER
========================= */

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADMIN - GET ALL RETURNS
========================= */

const getAllReturns = async (req, res) => {
  try {
    const returns = await Order.find({ "returnRequest.isRequested": true })
      .populate("user", "name email phone")
      .populate("orderItems.product", "name images")
      .sort({ "returnRequest.requestedAt": -1 });

    res.status(200).json({
      success: true,
      count: returns.length,
      returns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADMIN - UPDATE RETURN STATUS
========================= */

const updateReturnStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || !order.returnRequest.isRequested) {
      return res.status(404).json({
        success: false,
        message: "Return request not found",
      });
    }

    const { status } = req.body;
    
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    order.returnRequest.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: `Return request ${status.toLowerCase()}`,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAllReturns,
  updateReturnStatus,
};
