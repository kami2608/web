import React, { useEffect, useState } from "react";
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

const ShipmentDialog = ({
  open,
  onClose,
  onConfirm,
  selectedOrders,
  orders,
  shipment,
  setShipment,
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
          <TableCell>{orderDetails.cost}</TableCell>
        </TableRow>
      );
    });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setShipment((values) => ({ ...values, [name]: value }));
  };

  //const [creationDate, setCreationDate] = useState(new Date().toDateString());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>Tạo Đơn Vận Chuyển</DialogTitle>
      <DialogContent>
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mã đơn chuyển"
                name="id"
                fullWidth
                value={shipment.id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Từ: Điểm giao dịch gửi"
                name="startGDpoint"
                fullWidth
                value={shipment.startGDpoint}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Đến: Điểm tập kết gửi"
                name="startTKpoint"
                fullWidth
                value={shipment.startTKpoint}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                name="createDate"
                fullWidth
                value={shipment.createDate}
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
                Số Lượng Đơn Hàng: {shipment.Counts}
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
              <TableCell sx={{ color: "#fff" }}>Giá cước</TableCell>
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

export default ShipmentDialog;
