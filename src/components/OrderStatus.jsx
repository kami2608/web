import React, { useEffect, useState } from "react";
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Grid, Card, CardContent, useMediaQuery
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB } from "../database/cache";


const darkGreenTheme = createTheme({
  palette: {
    primary: {
      main: '#003300',
    },
    secondary: {
      main: '#f1f2ec',
    },
    background: {
      default: '#e0e0e0',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '20px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#f0f0f0',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#4caf50',
          '& th': {
            color: '#ffffff',
            fontWeight: 'bold',
          },
        },
      },
    },
    // Other component overrides
  },
});

function getStatusIcon(status) {
  switch (status) {
    case 'Đang chờ xử lý':
      return <CheckCircleOutlineIcon color="action" />;
    case 'Đang vận chuyển':
      return <LocalShippingIcon color="primary" />;
    case 'Đã giao':
      return <CheckCircleOutlineIcon color="success" />;
    default:
      return <AccessTimeIcon color="success" />;
  }
}

const changeDateForm = (date) => {
  if (typeof date === "string") {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  } else {
    return "";
  }
};

function createDataOrder({
  id, senderName, senderPhone, senderAddress, receiverName,
  receiverPhone, receiverAddress, type, weight, cost,
  startGDpoint, startTKpoint, endTKpoint, endGDpoint, status, date
}) {
  return {
    id, senderName, senderPhone, senderAddress, receiverName,
    receiverPhone, receiverAddress, type, weight, cost,
    startGDpoint, startTKpoint, endTKpoint, endGDpoint, status,
    date: changeDateForm(date)
  };
}

function createDataOrderHistory({
  historyID, orderID, date, currentLocation, Description, orderStatus,
}) {
  return {
    historyID, orderID, date: changeDateForm(date),
    currentLocation, Description, orderStatus,
  };
}

const OrderStatus = () => {
  //const orderID = "DH002";
  const orderID = localStorage.getItem("orderCode");
  const dataOrders = useLiveQuery(() =>
    dexieDB
      .table("orders")
      .filter((item) => item.id === orderID)
      .toArray()
  );

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (dataOrders) {
      setOrders(dataOrders.map(createDataOrder));
    }
  }, [dataOrders]);

  const orderHistories = useLiveQuery(() =>
    dexieDB
      .table("orderHistory")
      .filter((item) => item.orderID === orderID)
      .toArray()
  );
  const [orderHistory, setOrderHistory] = useState([]);
  useEffect(() => {
    if (orderHistories) {
      setOrderHistory(orderHistories.map(createDataOrderHistory));
    }
  }, [orderHistories]);

  const isMobile = useMediaQuery(darkGreenTheme.breakpoints.down('sm'));

  const renderCard = (title, content) => (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {content.map((text, index) => (
          <Typography key={index}>{text}</Typography>
        ))}
      </CardContent>
    </Card>
  );

  if (!orders || orders.length === 0) {
    return <Typography>Loading...</Typography>;
  }

  return (
    // <ThemeProvider theme={darkGreenTheme}>
    //   <Container maxWidth={isMobile ? 'sm' : 'md'} sx={{ my: 4 }}>
    //     <Typography variant="h4" gutterBottom component="div" sx={{ color: darkGreenTheme.palette.primary.main }}>
    //       Thông tin đơn hàng
    //     </Typography>
    <ThemeProvider theme={darkGreenTheme}>
      <Container maxWidth={isMobile ? 'sm' : 'md'} sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom component="div" sx={{ color: darkGreenTheme.palette.primary.main, marginBottom: '20px' }}>
          Thông tin đơn hàng
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {renderCard("Thông tin người gửi", [
              `Họ và tên: ${orders[0].senderName}`,
              `Địa chỉ: ${orders[0].senderAddress}`,
              `Số điện thoại: ${orders[0].senderPhone}`
            ])}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderCard("Thông tin người nhận", [
              `Họ và tên: ${orders[0].receiverName}`,
              `Địa chỉ: ${orders[0].receiverAddress}`,
              `Số điện thoại: ${orders[0].receiverPhone}`
            ])}
          </Grid>
        </Grid>

        {renderCard("Chi tiết đơn hàng", [
          `Loại hàng: ${orders[0].type}`,
          `Cân nặng: ${orders[0].weight}`,
          `Giá tiền: ${orders[0].cost} đồng`
        ])}

        <Typography variant="h4" gutterBottom component="div" sx={{ color: darkGreenTheme.palette.primary.main }}>
          Trạng thái đơn hàng
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{backgroundColor: "green"}}>
                <TableCell>STT</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Vị trí</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderHistory.map((history, index) => (
                <TableRow key={history.historyID}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{history.date}</TableCell>
                  <TableCell>{history.Description}</TableCell>
                  <TableCell>{history.currentLocation}</TableCell>
                  <TableCell>{getStatusIcon(history.orderStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default OrderStatus;
