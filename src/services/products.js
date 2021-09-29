const Product = require("../models/products");
const mongoose = require("mongoose");

module.exports.createProduct = async (name, price, image, type) => {
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

module.exports.getProductById = async id => {
  if (mongoose.Types.ObjectId.isValid(id)) return await Product.findById(id);
};

module.exports.updateSingle = async (_id, body) => {
  return await Product.findByIdAndUpdate(_id, body, { new: true });
};

module.exports.deleteSingle = async _id => {
  const deletedInfo = await Product.deleteOne({ _id });
  return deletedInfo.deletedCount;
};
