const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
  rateC: { type: Number, required: true, default: 30 },
  rateB: { type: Number, required: true, default: 40 }
});

module.exports = mongoose.model('Rate', RateSchema);