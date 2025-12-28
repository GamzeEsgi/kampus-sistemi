const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['kitap', 'not', 'ekipman']
  },
  type: {
    type: String,
    required: true,
    enum: ['satılık', 'ödünç']
  },
  price: {
    type: Number,
    required: function() {
      return this.type === 'satılık';
    },
    min: 0
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

