const express = require('express');
const router = express.Router();
const Sell = require('../models/Sell');
const Customer = require('../models/Customer');

// Get all sells with customer details
router.get('/', async (req, res) => {
  try {
    const sells = await Sell.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: 'customerId',
          as: 'customer'
        }
      },
      { $unwind: '$customer' }
    ]);
    res.json(sells);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create sell
router.post('/', async (req, res) => {
  try {
    // Verify customer exists
    const customer = await Customer.findOne({ customerId: req.body.customerId });
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    const sell = new Sell({
      type: req.body.type,
      date: req.body.date,
      quantity: req.body.quantity,
      cost: req.body.cost,
      customerId: req.body.customerId
    });

    const newSell = await sell.save();
    res.status(201).json(newSell);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get sells by customer and month
router.get('/customer/:customerId/month/:month', async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    const year = new Date().getFullYear();
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const sells = await Sell.find({
      customerId: parseInt(req.params.customerId),
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });
    
    res.json(sells);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;