const mongoose = require('mongoose');

const SellSchema = new mongoose.Schema({
  type: { type: String, enum: ['cow', 'buffalo'], required: true },
  date: { type: Date, required: true, default: Date.now },
  quantity: { type: Number, required: true },
  cost: { type: Number, required: true },
  customerId: { type: Number, required: true }  // Changed from cid to customerId
});

module.exports = mongoose.model('Sell', SellSchema);