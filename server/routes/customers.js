const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");


// !------------------------------------------------------------------------------------------------
// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// !------------------------------------------------------------------------------------------------
// Get one customer
router.get("/:id", getCustomer, (req, res) => {
  res.json(res.customer);
});


// !------------------------------------------------------------------------------------------------
// Create customer
router.post("/", async (req, res) => {
  const customer = new Customer({
    fname: req.body.fname,
    lname: req.body.lname,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// !------------------------------------------------------------------------------------------------
// Update customer
router.patch("/:id", getCustomer, async (req, res) => {
  if (req.body.fname != null) {
    res.customer.fname = req.body.fname;
  }
  if (req.body.lname != null) {
    res.customer.lname = req.body.lname;
  }
  if (req.body.phone != null) {
    res.customer.phone = req.body.phone;
  }
  if (req.body.address != null) {
    res.customer.address = req.body.address;
  }
  if (req.body.city != null) {
    res.customer.city = req.body.city;
  }

  try {
    const updatedCustomer = await res.customer.save();
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// !------------------------------------------------------------------------------------------------
// Delete customer
router.delete("/:id", getCustomer, async (req, res) => {
  try {
    await res.customer.deleteOne();
    res.json({ message: "Deleted Customer" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// !------------------------------------------------------------------------------------------------
//get customer
async function getCustomer(req, res, next) {
  console.log("getCustomer: Fetching customer with ID:", req.params.id);

  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    if (customer == null) {
      console.log("getCustomer: No customer found.");
      return res.status(404).json({ message: "Cannot find customer" });
    }
  } catch (err) {
    console.error("getCustomer: Error occurred -", err);
    return res.status(500).json({ message: err.message });
  }

  res.customer = customer;
  console.log("getCustomer: Customer found:", customer);
  next();
}

module.exports = router;
