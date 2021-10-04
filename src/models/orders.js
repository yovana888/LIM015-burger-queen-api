const { Schema, model } = require('mongoose');

const orderSchema = Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: false,
    },
    products: [
      {
        qty: {
          type: Number,
          default: 1,
        },
        productId: {
          ref: 'Product',
          type: Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: 'dateEntry', updatedAt: 'dateProcessed' },
    versionKey: false,
  },
);

module.exports = model('Order', orderSchema);
