import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  InputAdornment,
  Alert
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const RegisterCustomer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    address: "",
    city: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({
    phone: "",
    duplicatePhone: ""
  });
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer => 
      `${customer.fname} ${customer.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

{/* !========================================================================================================== */}

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      showNotification("Failed to fetch customers", "error");
    }
  };

{/* !========================================================================================================== */}

  const validatePhone = (phone) => {
    if (!/^\d{10}$/.test(phone)) {
      return "Phone number must be 10 digits";
    }
    return "";
  };

{/* !========================================================================================================== */}

  const checkDuplicatePhone = (phone, currentCustomerId = null) => {
    const exists = customers.some(customer => 
      customer.phone === phone && 
      (!currentCustomerId || customer._id !== currentCustomerId)
    );
    return exists ? "This phone number is already registered" : "";
  };

{/* !========================================================================================================== */}

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification({ ...notification, open: false }), 3000);
  };
{/* !========================================================================================================== */}

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
{/* !========================================================================================================== */}

  const clearSearch = () => {
    setSearchTerm("");
  };
{/* !========================================================================================================== */}

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "phone") {
      const phoneError = validatePhone(value);
      const duplicateError = checkDuplicatePhone(value, selectedCustomer?._id);
      setErrors({
        ...errors,
        phone: phoneError,
        duplicatePhone: duplicateError
      });
    }
  };

{/* !========================================================================================================== */}

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phoneError = validatePhone(formData.phone);
    const duplicateError = checkDuplicatePhone(formData.phone, selectedCustomer?._id);

    if (phoneError || duplicateError) {
      setErrors({
        phone: phoneError,
        duplicatePhone: duplicateError
      });
      return;
    }

    try {
      if (selectedCustomer) {
        await axios.patch(
          `http://localhost:5000/customers/${selectedCustomer._id}`,
          formData
        );
        showNotification("Customer updated successfully");
        // Update the customer in the local state
        setCustomers(prev => prev.map(c => 
          c._id === selectedCustomer._id ? { ...c, ...formData } : c
        ));
      } else {
        const response = await axios.post("http://localhost:5000/customers", formData);
        showNotification("Customer added successfully");
        // Add the new customer to the local state
        setCustomers(prev => [...prev, response.data]);
      }
      setFormData({ fname: "", lname: "", phone: "", address: "", city: "" });
      setSelectedCustomer(null);
      setSearchTerm("");
      setErrors({ phone: "", duplicatePhone: "" });
    } catch (error) {
      console.error("Error saving customer:", error);
      showNotification("Failed to save customer", "error");
    }
  };

{/* !========================================================================================================== */}

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      fname: customer.fname,
      lname: customer.lname,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
    });
    setErrors({ phone: "", duplicatePhone: "" });
    if (isMobile) setMobileOpen(false);
  };

{/* !========================================================================================================== */}

  const handleDelete = async () => {
    if (!selectedCustomer) {
      showNotification("No customer selected", "error");
      return;
    }

    try {
      const customerIdToDelete = selectedCustomer._id;
      
      await axios.delete(
        `http://localhost:5000/customers/${customerIdToDelete}`,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      showNotification("Customer deleted successfully");
      
      // Update both customers and filteredCustomers states
      setCustomers(prev => prev.filter(c => c._id !== customerIdToDelete));
      setFilteredCustomers(prev => prev.filter(c => c._id !== customerIdToDelete));
      
      // Reset form if we were editing the deleted customer
      if (selectedCustomer._id === customerIdToDelete) {
        setFormData({ fname: "", lname: "", phone: "", address: "", city: "" });
        setSelectedCustomer(null);
      }
      
    } catch (error) {
      let errorMessage = "Failed to delete customer";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout - server took too long to respond";
      } else if (error.response) {
        errorMessage = error.response.data?.message || 
                      `Server error (${error.response.status})`;
        
        if (error.response.status === 404) {
          errorMessage = "Customer not found (may have been already deleted)";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid request: " + (error.response.data.message || "bad data");
        }
      } else if (error.request) {
        errorMessage = "No response from server - check if backend is running";
      }
      
      showNotification(errorMessage, "error");
      console.error("Delete Error Details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response?.data,
        stack: error.stack
      });
      
    } finally {
      setOpenDeleteDialog(false);
    }
  };

{/* !========================================================================================================== */}

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  
{/* !========================================================================================================== */}

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
  
      <Box sx={{ width: "200px", bgcolor: "primary.main", p: 2 }}>
        <IconButton onClick={() => navigate("/")} sx={{ color: "white" }}>
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 200px)` }, mt: { xs: 7, md: 0 } }}>
        {!isMobile && (
          <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: "secondary.main" }}>
            <Typography variant="h4" align="center" color="white">
              CUSTOMER DETAILS
            </Typography>
          </Paper>
        )}


{/* !========================================================================================================== */}


        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search customers by name or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} size="small">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>


{/* !========================================================================================================== */}


        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Form Section */}
          <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, maxWidth: { md: "400px" }, width: "100%" }}>
            <TextField
              fullWidth
              label="First Name"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!!errors.phone || !!errors.duplicatePhone}
              helperText={errors.phone || errors.duplicatePhone}
              inputProps={{
                maxLength: 10,
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3, flexDirection: { xs: "column", sm: "row" } }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                fullWidth={isMobile}
                disabled={!!errors.phone || !!errors.duplicatePhone}
              >
                {selectedCustomer ? "UPDATE" : "ADD"}
              </Button>
              {selectedCustomer && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenDeleteDialog(true)}
                  fullWidth={isMobile}
                >
                  DELETE
                </Button>
              )}
            </Box>
          </Box>

{/* !========================================================================================================== */}


          {/* Table Section */}
          <Box sx={{ flex: 2, width: "100%", overflowX: "auto" }}>
            {isMobile ? (
              <Box>
                {filteredCustomers.length === 0 ? (
                  <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                    {searchTerm ? "No matching customers found" : "No customers available"}
                  </Typography>
                ) : (
                  filteredCustomers.map((customer) => (
                    <Paper key={customer._id} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1">
                        {customer.fname} {customer.lname}
                      </Typography>
                      <Typography variant="body2">Phone: {customer.phone}</Typography>
                      <Typography variant="body2">City: {customer.city}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <IconButton onClick={() => handleEdit(customer)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => {
                          setSelectedCustomer(customer);
                          setOpenDeleteDialog(true);
                        }}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))
                )}
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.main" }}>
                      <TableCell sx={{ color: "white" }}>ID</TableCell>
                      <TableCell sx={{ color: "white" }}>First Name</TableCell>
                      <TableCell sx={{ color: "white" }}>Last Name</TableCell>
                      <TableCell sx={{ color: "white" }}>Phone</TableCell>
                      <TableCell sx={{ color: "white" }}>City</TableCell>
                      <TableCell sx={{ color: "white" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          {searchTerm ? "No matching customers found" : "No customers available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer._id}>
                          <TableCell>{customer.customerId}</TableCell>
                          <TableCell>{customer.fname}</TableCell>
                          <TableCell>{customer.lname}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customer.city}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(customer)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => {
                              setSelectedCustomer(customer);
                              setOpenDeleteDialog(true);
                            }}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Box>


{/* !========================================================================================================== */}


      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedCustomer?.fname} {selectedCustomer?.lname}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


{/* !========================================================================================================== */}


      {/* Notification Snackbar */}
      {notification.open && (
        <Alert 
          severity={notification.severity} 
          onClose={() => setNotification({ ...notification, open: false })}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          {notification.message}
        </Alert>
      )}
    </Box>
  );
};

export default RegisterCustomer;
