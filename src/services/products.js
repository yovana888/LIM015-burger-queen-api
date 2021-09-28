const config = require("../config");
const Product = require("../models/products");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { secret } = config;

module.exports.createNewProduct = async (name, price, image, type) => {
  const product = new Product({
    name,
    price,
    image: image ? image : "",
    type: type ? type : "",
  });
  return await product.save();
};

module.exports.getProducts = async (page, limit) => {
  return await Product.find({})
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports.getProductByName = async name => {
  return await Product.findOne({ name });
};

module.exports.getProductId = async id => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Product.findById(id);
  }
};

module.exports.updateSingle = async (_id, body) => {
  return await Product.findByIdAndUpdate(_id, body, { new: true });
};

module.exports.deleteSingle = async _id => {
  const deletedInfo = await Product.deleteOne({ _id });
  return deletedInfo.deletedCount;
};
