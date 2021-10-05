const mongoose = require('mongoose');
const Product = require('../models/products');

module.exports.createProduct = async (name, price, image, type) => {
  const product = new Product({
    name,
    price,
    image: image || '',
    type: type || '',
  });
  const prod = await product.save();
  return prod;
};

module.exports.getProducts = async (page, limit) => {
  const products = await Product.find({}).skip((page - 1) * limit).limit(limit);
  return products;
};

module.exports.getProductByName = async (name) => {
  const product = await Product.findOne({ name }).sort('name');
  return product;
};

module.exports.getProductById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const product = await Product.findById(id);
    return product;
  }
};

module.exports.updateSingle = async (_id, body) => {
  const product = await Product.findByIdAndUpdate(_id, body, { new: true });
  return product;
};

module.exports.deleteSingle = async (_id) => {
  const deletedInfo = await Product.deleteOne({ _id });
  return deletedInfo.deletedCount;
};
