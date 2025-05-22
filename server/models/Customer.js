const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customerId: { type: Number, unique: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true }
}, { timestamps: true });

// Auto-increment customerId
CustomerSchema.pre('save', async function(next) {
  if (!this.customerId) {
    const lastCustomer = await this.constructor.findOne({}, {}, { sort: { 'customerId': -1 } });
    this.customerId = lastCustomer ? lastCustomer.customerId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Customer', CustomerSchema);