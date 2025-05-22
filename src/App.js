import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegisterCustomer from './components/RegisterCustomer';
import DailySell from './components/DailySell';
import BillGeneration from './components/BillGeneration';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#06603b',
    },
    secondary: {
      main: '#006666',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customers" element={<RegisterCustomer />} />
          <Route path="/daily" element={<DailySell />} />
          <Route path="/bill" element={<BillGeneration />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;