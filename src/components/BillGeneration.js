import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Button, Typography, Paper, Select, MenuItem,
  FormControl, InputLabel, Grid, IconButton, CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PrintIcon from '@mui/icons-material/Print';
import BillPrint from './BillPrint';
import { useReactToPrint } from 'react-to-print';

const BillGeneration = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(false);
  const billRef = useRef();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleGenerateBill = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/sells/customer/${selectedCustomer}/month/${selectedMonth}`
      );

      if (response.data.length === 0) {
        alert('No records found for the selected customer and month');
        setBillData(null);
        return;
      }

      const customer = customers.find(c => c.customerId === parseInt(selectedCustomer));
      const total = response.data.reduce((sum, item) => sum + item.cost, 0);

      setBillData({
        customer,
        sells: response.data,
        total,
        month: selectedMonth
      });
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Error generating bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; }
      }
    `,
    documentTitle: `Milk_Bill_${billData?.customer?.fname}_${selectedMonth}`,
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: '200px', bgcolor: 'primary.main', p: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'secondary.main' }}>
          <Typography variant="h4" align="center" color="white">
            BILL GENERATION
          </Typography>
        </Paper>

        {/* Form Row */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="customer-select-label">Customer</InputLabel>
              <Select
                labelId="customer-select-label"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                label="Customer"
              >
                {customers.map(customer => (
                  <MenuItem key={customer.customerId} value={customer.customerId}>
                    {customer.customerId} - {customer.fname} {customer.lname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                label="Month"
              >
                {[
                  { value: 1, name: 'January' },
                  { value: 2, name: 'February' },
                  { value: 3, name: 'March' },
                  { value: 4, name: 'April' },
                  { value: 5, name: 'May' },
                  { value: 6, name: 'June' },
                  { value: 7, name: 'July' },
                  { value: 8, name: 'August' },
                  { value: 9, name: 'September' },
                  { value: 10, name: 'October' },
                  { value: 11, name: 'November' },
                  { value: 12, name: 'December' }
                ].map(month => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ height: '56px' }}
              onClick={handleGenerateBill}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'GENERATE BILL'}
            </Button>
          </Grid>
        </Grid>

        {/* Generated Bill */}
        {billData && (
          <Box sx={{ mt: 4 }}>
            <Box ref={billRef}>
              <BillPrint
                customer={billData.customer}
                sells={billData.sells}
                total={billData.total}
                month={billData.month}
              />
            </Box>
        
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BillGeneration;