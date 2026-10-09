import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
          validate: {
            validator: Number.isInteger,
            message: 'Quantity must be a whole number',
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CartModal =
  mongoose.models.Cart ||
  mongoose.model('Cart', cartSchema);

export default CartModal;