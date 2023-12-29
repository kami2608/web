import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Grid,
  TextField,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Buttonme from '../Buttonme/Buttonme';

const ShipmentDialog = ({ open, onClose, onConfirm, selectedOrders, orders }) => {
  const getOrderDetails = (id) => {
    return orders.find((order) => order.id === id);
  };

  const renderOrderRows = () => {
    if(selectedOrders) return selectedOrders.map((id, index) => {
      const orderDetails = getOrderDetails(id);
      return (
        <TableRow key={id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{orderDetails.orderID}</TableCell>
          <TableCell>{orderDetails.type}</TableCell>
          <TableCell>{orderDetails.weight}</TableCell>
          <TableCell>{orderDetails.deliveryTime}</TableCell>
        </TableRow>
      );
    });
    else return "";
  };

  const [creationDate, setCreationDate] = useState(new Date());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>Tạo Đơn Vận Chuyển</DialogTitle>
      <DialogContent>
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Tên Nhân Viên" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Địa Chỉ" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Điểm Chuyển Đến" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ngày Tạo Đơn"
                  value={creationDate}
                  onChange={(newValue) => {
                    setCreationDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Số Lượng Đơn Hàng: {selectedOrders ? selectedOrders.length : 0}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h6">
          Thông Tin Đơn Hàng
        </Typography>
        <Table>
          <TableHead sx={{ backgroundColor: "#5CAF50" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>STT</TableCell>
              <TableCell sx={{ color: "#fff" }}>Mã Đơn Hàng</TableCell>
              <TableCell sx={{ color: "#fff" }}>Loại Hàng</TableCell>
              <TableCell sx={{ color: "#fff" }}>Cân Nặng</TableCell>
              <TableCell sx={{ color: "#fff" }}>Thời gian chuyển đến</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderOrderRows()}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          sx={{ color: "#4CAF50", '&:hover': { bgcolor: '#003e29' } }}
        >
          Hủy
        </Button>


        <Buttonme content="Xác nhận" onClick={onConfirm} />

      </DialogActions>
    </Dialog>
  );
};

export default ShipmentDialog;


