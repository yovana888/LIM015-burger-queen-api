const { Schema, model } = require("mongoose");

const productSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: "dateEntry", updatedAt: "updatedAt" },
    versionKey: false,
  }
);

module.exports = model("Product", productSchema);
