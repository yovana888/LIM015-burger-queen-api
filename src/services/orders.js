const mongoose = require('mongoose');
const Order = require('../models/orders');

module.exports.createOrder = async (userId, client, products) => {
  const arrayOfProducts = [];
  await products.forEach((p) => {
    arrayOfProducts.push({ qty: p.qty, productId: mongoose.Types.ObjectId(p.productId) });
  });
  const order = new Order({
    userId,
    client: client || '',
    products: arrayOfProducts,
  });
  await order.save();
  return order.populate('products.productId');
};

module.exports.getOrdersDb = async (page, limit) => {
  const orders = await Order.find({}).sort({ dateProcessed: 'desc' }).populate('products.productId').skip((page - 1) * limit)
    .limit(limit);
  return orders;
};

module.exports.getOrderById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const order = await Order.findById(id).populate('products.productId');
    return order;
  }
};

module.exports.updateSingle = async (_id, body) => {
  const orderUpdated = await Order.findByIdAndUpdate(_id, body, { new: true }).populate('products.productId');
  return orderUpdated;
};

module.exports.deleteSingle = async (_id) => {
  const deletedInfo = await Order.deleteOne({ _id });
  return deletedInfo.deletedCount;
};
