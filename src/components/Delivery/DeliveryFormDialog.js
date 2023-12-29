import React, { useState, useEffect } from "react";
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
  Paper,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import { fireDB } from "../../database/firebase";
import { collection, getDocs} from 'firebase/firestore';
//import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
//import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const DeliveryFormDialog = ({
  open,
  onClose,
  onConfirm,
  selectedOrders,
  orders,
  deliveryBill,
  setDeliveryBill,
}) => {
  const getOrderDetails = (id) => {
    return orders.find((order) => order.id === id);
  };

  const renderOrderRows = () => {
    return selectedOrders.map((orderID, index) => {
      const orderDetails = getOrderDetails(orderID);
      return (
        <TableRow key={orderID}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{orderDetails.id}</TableCell>
          <TableCell>{orderDetails.type}</TableCell>
          <TableCell>{orderDetails.weight}</TableCell>
          {/*<TableCell>{orderDetails.deliveryTime}</TableCell>*/}
        </TableRow>
      );
    });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDeliveryBill((values) => ({ ...values, [name]: value }));
  };

  //const [creationDate, setCreationDate] = useState(new Date().toDateString());
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>Tạo Đơn Giao Hàng</DialogTitle>
      <DialogContent>
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mã đơn giao hàng"
                name="id"
                fullWidth
                value={deliveryBill.id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Điểm giao dịch"
                name="startGDpoint"
                fullWidth
                value={deliveryBill.GDpoint}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                name="createDate"
                fullWidth
                value={deliveryBill.createDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InputLabel htmlFor="date">Ngày tạo</InputLabel>
                    </InputAdornment>
                  ),
                }}
              />
              {/*<LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ngày Tạo Đơn"
                  value={creationDate}
                  onChange={(newValue) => {
                    setCreationDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                </LocalizationProvider>*/}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Số Lượng Đơn Hàng: {deliveryBill.counts}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h6">Thông Tin Đơn Hàng</Typography>
        <Table>
          <TableHead sx={{ backgroundColor: "#5CAF50" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>STT</TableCell>
              <TableCell sx={{ color: "#fff" }}>Mã Đơn Hàng</TableCell>
              <TableCell sx={{ color: "#fff" }}>Loại Hàng</TableCell>
              <TableCell sx={{ color: "#fff" }}>Cân Nặng</TableCell>
              {/*<TableCell sx={{ color: "#fff" }}>Thời gian chuyển đến</TableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>{renderOrderRows()}</TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          sx={{ color: "#4CAF50", "&:hover": { bgcolor: "#003e29" } }}
        >
          Hủy
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: "#4CAF50",
            color: "#fff",
            "&:hover": { bgcolor: "#003e29" },
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeliveryFormDialog;
