const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a product description']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please specify a category']
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock count'],
      default: 0
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    rating: {
      type: Number,
      default: 4.5
    },
    numReviews: {
      type: Number,
      default: 12
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
