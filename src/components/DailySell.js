import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const DailySell = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState(new Date());
  const [rates, setRates] = useState({ rateC: 30, rateB: 40 });
  const [quantityC, setQuantityC] = useState(0);
  const [quantityB, setQuantityB] = useState(0);
  const [totalC, setTotalC] = useState(0);
  const [totalB, setTotalB] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCustomers();
    fetchRates();
  }, []);

  useEffect(() => {
    const newTotalC = quantityC * rates.rateC;
    const newTotalB = quantityB * rates.rateB;
    setTotalC(newTotalC);
    setTotalB(newTotalB);
    setTotal(newTotalC + newTotalB);
  }, [quantityC, quantityB, rates]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchRates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/rates");
      setRates(response.data);
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setSelectedCustomer(customerId);
    const customer = customers.find(
      (c) => c.customerId === parseInt(customerId)
    );
    if (customer) {
      setCustomerName(`${customer.fname} ${customer.lname}`);
    } else {
      setCustomerName("");
    }
  };

  const handleRateUpdate = async () => {
    try {
      await axios.patch("http://localhost:5000/rates", rates);
      alert("Rates updated successfully");
    } catch (error) {
      console.error("Error updating rates:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    try {
      const formattedDate = date; // Just use the Date object directly

      if (quantityC > 0) {
        await axios.post("http://localhost:5000/sells", {
          type: "cow",
          date: formattedDate, // Send as Date object
          quantity: quantityC,
          cost: totalC,
          customerId: parseInt(selectedCustomer),
        });
      }

      if (quantityB > 0) {
        await axios.post("http://localhost:5000/sells", {
          type: "buffalo",
          date: formattedDate, // Send as Date object
          quantity: quantityB,
          cost: totalB,
          customerId: parseInt(selectedCustomer),
        });
      }

      alert("Record saved successfully");
      handleClear();
    } catch (error) {
      console.error(
        "Error saving sell:",
        error.response?.data || error.message
      );
    }
  };

  const handleClear = () => {
    setQuantityC(0);
    setQuantityB(0);
    setTotal(0);
    setTotalC(0);
    setTotalB(0);
    setSelectedCustomer("");
    setCustomerName("");
    setDate(new Date());
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ width: "200px", bgcolor: "primary.main", p: 2 }}>
        <IconButton onClick={() => navigate("/")} sx={{ color: "white" }}>
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: "secondary.main" }}>
          <Typography variant="h4" align="center" color="white">
            DAILY DISTRIBUTION
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                  inputFormat="dd-MM-yyyy"
                />
              </LocalizationProvider>

              <FormControl fullWidth margin="normal">
                <InputLabel>Customer ID</InputLabel>
                <Select
                  value={selectedCustomer}
                  onChange={handleCustomerChange}
                  label="Customer ID"
                >
                  {customers.map((customer) => (
                    <MenuItem
                      key={customer.customerId}
                      value={customer.customerId}
                    >
                      {customer.customerId} - {customer.fname} {customer.lname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Customer Name"
                value={customerName}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                RATE PER LITRE
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ width: "150px" }}>COW MILK</Typography>
                <TextField
                  value={rates.rateC}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      rateC: parseFloat(e.target.value) || 0,
                    })
                  }
                  sx={{ mx: 2, width: "100px" }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ width: "150px" }}>BUFFALO MILK</Typography>
                <TextField
                  value={rates.rateB}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      rateB: parseFloat(e.target.value) || 0,
                    })
                  }
                  sx={{ mx: 2, width: "100px" }}
                />
              </Box>

              <Button
                variant="contained"
                onClick={handleRateUpdate}
                sx={{ mt: 2 }}
              >
                UPDATE RATES
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography sx={{ width: "150px" }}>COW MILK</Typography>
                <TextField
                  type="number"
                  value={quantityC}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      setQuantityC(value || 0);
                    }
                  }}
                  sx={{ mx: 2, width: "100px" }}
                />
                <TextField
                  label="Total"
                  value={totalC.toFixed(2)}
                  sx={{ width: "150px" }}
                  InputProps={{ readOnly: true }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography sx={{ width: "150px" }}>BUFFALO MILK</Typography>
                <TextField
                  type="number"
                  value={quantityB}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0 || e.target.value === "") {
                      setQuantityB(value || 0);
                    }
                  }}
                  sx={{ mx: 2, width: "100px" }}
                />
                <TextField
                  label="Total"
                  value={totalB.toFixed(2)}
                  sx={{ width: "150px" }}
                  InputProps={{ readOnly: true }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography sx={{ width: "150px", fontWeight: "bold" }}>
                  TOTAL
                </Typography>
                <TextField
                  label="Total"
                  value={total.toFixed(2)}
                  sx={{ width: "150px", ml: "210px" }}
                  InputProps={{ readOnly: true }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="contained" color="error" onClick={handleClear}>
                  CLEAR
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  BUY
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DailySell;
