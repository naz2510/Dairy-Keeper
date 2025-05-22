import React, { useRef } from "react";
import { format, parseISO } from "date-fns";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PrintIcon from '@mui/icons-material/Print';

const BillPrint = ({ customer, sells, total, month }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const firstDate = sells[0]?.date || new Date().toISOString();
  const lastDate = sells[sells.length - 1]?.date || new Date().toISOString();
  const componentRef = useRef();

  const handleDownloadPDF = async () => {
    const input = componentRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Milk_Bill_${customer.fname}_${monthNames[month - 1]}.pdf`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Printable content */}
      <Paper
        elevation={3}
        sx={{ p: 3, maxWidth: '800px', mx: 'auto', mb: 4 }}
        ref={componentRef}
      >
        <Typography variant="h4" align="center" gutterBottom>
          DAIRY KEEPER
        </Typography>
        
        <Typography variant="h6" align="center" gutterBottom>
          Monthly Milk Bill - {monthNames[month - 1]}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography><strong>Customer ID:</strong> {customer.customerId}</Typography>
            <Typography><strong>Customer Name:</strong> {customer.fname} {customer.lname}</Typography>
          </Box>
          <Box>
            <Typography><strong>Period:</strong> {format(parseISO(firstDate), 'dd-MM-yyyy')} to {format(parseISO(lastDate), 'dd-MM-yyyy')}</Typography>
          </Box>
        </Box>
        
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Milk Type</TableCell>
              <TableCell sx={{ color: 'white' }}>Quantity (L)</TableCell>
              <TableCell sx={{ color: 'white' }}>Amount (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sells.map((sell, index) => (
              <TableRow key={index}>
                <TableCell>{format(parseISO(sell.date), 'dd-MM-yyyy')}</TableCell>
                <TableCell>{sell.type}</TableCell>
                <TableCell>{sell.quantity}</TableCell>
                <TableCell>₹{sell.cost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: '300px', borderTop: '1px solid #ccc', pt: 2 }}>
            <Typography variant="h6" align="right">
              Total Amount: ₹{total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center', fontStyle: 'italic' }}>
          <Typography variant="body2">
            Thank you for your business!
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Please pay by the 10th of next month
          </Typography>
        </Box>
      </Paper>

      {/* Download button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPDF}
          startIcon={<PrintIcon />}
          sx={{ px: 4, py: 2 }}
        >
          Download PDF
        </Button>
      </Box>
    </Box>
  );
};

export default BillPrint;