const Product = require("../models/products");
const Order = require("../models/orders");
const mongoose = require("mongoose");

module.exports.createOrder = async (userId, client, products) => {
  const arrayOfProducts = [];
  await products.forEach(p => {
    arrayOfProducts.push({ qty: p.qty, productId: mongoose.Types.ObjectId(p.productId) });
  });
  const order = new Order({
    userId,
    client: client ? client : "",
    products: arrayOfProducts,
  });
  order.save();
  return order.populate("products.productId");
};

module.exports.getOrders = async (page, limit) => {
  return await Order.find({})
    .populate("products.productId")
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports.getOrderById = async id => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Order.findById(id).populate("products.productId");
  }
};

module.exports.updateSingle = async (_id, body) => {
  return await Order.findByIdAndUpdate(_id, body, { new: true }).populate("products.productId");
};

module.exports.deleteSingle = async _id => {
  const deletedInfo = await Order.deleteOne({ _id });
  return deletedInfo.deletedCount;
};
