import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ width: '200px', bgcolor: 'primary.main', p: 2 }}>
        <Typography variant="h6" color="white" sx={{ mt: 2 }}>
          Dairy Keeper
        </Typography>
      </Box>
      
      <Container sx={{ p: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'secondary.main' }}>
          <Typography variant="h4" align="center" color="white">
            DAIRY MANAGEMENT SYSTEM
          </Typography>
        </Paper>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '500px', mx: 'auto' }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/customers')}
            sx={{ py: 2, fontSize: '1.2rem' }}
          >
            CUSTOMER DETAILS
          </Button>
          
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/daily')}
            sx={{ py: 2, fontSize: '1.2rem' }}
          >
            DAILY DISTRIBUTION
          </Button>
          
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/bill')}
            sx={{ py: 2, fontSize: '1.2rem' }}
          >
            BILL GENERATION
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;