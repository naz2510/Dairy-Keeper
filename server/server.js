const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://dairyadmin:peenaz2297@cluster0.i0iq9xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Routes
const customerRoutes = require('./routes/customers');
const rateRoutes = require('./routes/rates');
const sellRoutes = require('./routes/sells');

app.use('/customers', customerRoutes);
app.use('/rates', rateRoutes);
app.use('/sells', sellRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});