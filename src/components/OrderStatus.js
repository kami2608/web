
import React from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Card,
  CardContent
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003e29', // Example primary color
    },
    secondary: {
      main: '#f1f2ec', // Example secondary color
    },
  },
  typography: {
    fontFamily: [
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5', // Example head background color
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9', // Example odd row background color
          },
        },
      },
    },
  },
});

const orderData = {
  sender: "John Doe",
  recipient: "Jane Doe",
  sendDate: "2023-11-16",
  senderAddress: "123 Main St, City",
  recipientAddress: "456 Broad St, Town",
  deliveryStatus: "In transit"
};

const deliveryProcess = [
  { date: "2023-11-16", time: "10:00 AM", status: "Package received" },
  { date: "2023-11-16", time: "02:30 PM", status: "Out for delivery" },
  { date: "2023-11-16", time: "04:45 PM", status: "Delivered" }
];

function getStatusIcon(status) {
  switch (status) {
    case 'Package received':
      return <CheckCircleOutlineIcon color="success" />;
    case 'Out for delivery':
      return <LocalShippingIcon color="primary" />;
    case 'Delivered':
      return <CheckCircleOutlineIcon color="success" />;
    default:
      return <AccessTimeIcon color="action" />;
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom component="div">
          Thông tin đơn hàng
        </Typography>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
              Thông tin người gửi
            </Typography>
            <Typography>Họ và tên: {orderData.sender}</Typography>
            <Typography>Địa chỉ: {orderData.senderAddress}</Typography>
            <Typography>Số điện thoại: </Typography>
          </CardContent>
        </Card>
        {/* ... Repeat for Recipient and Delivery Information */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
            Thông tin người nhận
            </Typography>
            <Typography>Họ và tên: {orderData.recipient}</Typography>
            <Typography>Địa chỉ: {orderData.recipient}</Typography>
            <Typography>Số điện thoại: </Typography>
          </CardContent>
        </Card>

        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
              Trạng thái đơn hàng
            </Typography>
            <Typography>Ngày gửi: {orderData.sendDate}</Typography>
            <Typography>Trạng thái: {orderData.deliveryStatus}</Typography>
          </CardContent>
        </Card>

        <Typography variant="h4" gutterBottom component="div">
          Delivery Process
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Icon</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryProcess.map((step, index) => (
                <TableRow key={index}>
                  <TableCell>{step.date}</TableCell>
                  <TableCell>{step.time}</TableCell>
                  <TableCell>{step.status}</TableCell>
                  <TableCell>{getStatusIcon(step.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
}

export default App;
