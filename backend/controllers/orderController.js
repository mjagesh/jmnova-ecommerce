const Order = require("../models/Order");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({
          message: `${field} is required`,
        });
      }
    }

    // Get user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          message: "One of the products in the cart no longer exists",
        });
      }

      // Check stock
      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }

      const itemTotal = product.price * item.quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Currently shipping is free
    const shippingCost = 0;

    const total = subtotal + shippingCost;

    const order = await Order.create({
      user: req.user._id,

      items: orderItems,

      shippingAddress: {
        name: shippingAddress.name,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
      },

      subtotal,
      shippingCost,
      total,

      paymentStatus: "pending",
      orderStatus: "pending",
    });

    // Clear cart from MongoDB
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Failed to create order",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("items.product", "name slug image");

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      message: "Failed to get orders",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
