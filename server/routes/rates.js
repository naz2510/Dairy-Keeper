const express = require('express');
const router = express.Router();
const Rate = require('../models/Rate');

// Get rates
router.get('/', async (req, res) => {
  try {
    const rates = await Rate.findOne();
    if (!rates) {
      const newRates = new Rate();
      await newRates.save();
      return res.json(newRates);
    }
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update rates
router.patch('/', async (req, res) => {
  try {
    const rates = await Rate.findOneAndUpdate(
      {},
      {
        rateC: req.body.rateC,
        rateB: req.body.rateB
      },
      { new: true, upsert: true }
    );
    res.json(rates);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;