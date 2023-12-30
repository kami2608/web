import React, { useState, useRef, useEffect } from 'react';
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
  Box,
  TableContainer,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Buttonme from '../Buttonme/Buttonme';
import PrintShipmentDialog from './PrintShipmentDialog';
import ReactDOM from 'react-dom';

const ShipmentDialog = ({ open, onClose, onConfirm, orders, NVTKacc }) => {
  const [creationDate, setCreationDate] = useState(new Date());
  const [orderCode, setOrderCode] = useState('');
  const printRef = useRef();

  useEffect(() => {
    if (!NVTKacc) {
      console.log("NVTK null");
      return;
    }
    if (!orders || orders.length === 0) {
      console.log("orders is null or empty");
      return;
    }
    generateOrderCode();
  }, [NVTKacc, orders]);

  const generateOrderCode = () => {
    const randomNumber = Math.floor(Math.random() * 700) + 400;
    const formattedNumber = randomNumber.toString().padStart(3, '0');
    setOrderCode(`S${formattedNumber}`);
  };

  const handleConfirmClick = () => {
    // useEffect(() => {
    //   console.log("orderCode", orderCode, " creationDate ",creationDate );
    // });   
    creationDate.setDate(creationDate.getDate() + 1);
    const newDate = creationDate.toISOString().slice(0, 10);
    console.log("orderCode", orderCode, " creationDate ", newDate);
    onConfirm(orderCode, newDate);
    onClose();
  };


  const handlePrint = () => {
    // Nếu bạn muốn in trực tiếp từ component, bạn có thể sử dụng ReactDOM để render nó vào print window
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print</title>');

    // Link to external stylesheet for printing
    printWindow.document.write('<link rel="stylesheet" href="/printStyles.css" type="text/css" media="print"/>');

    printWindow.document.write('</head><body>');
    printWindow.document.body.appendChild(document.createElement("div")); // Tạo một container để render component PrintShipmentDialog
    ReactDOM.render(<PrintShipmentDialog orders={orders} employee={NVTKacc[0]} />, printWindow.document.body.lastChild);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus(); // Required for IE
    setTimeout(() => { // Đợi cho đến khi React render xong
      
      printWindow.print();
      printWindow.close();
    }, 1000);
  };


  if (!NVTKacc || !orders || orders.length === 0) {
    return null;
  }
  const employeeId = orders.length > 0 ? `${orders[0].startTKpoint}001` : null;
  const employee = NVTKacc.find(emp => emp.id === employeeId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#003e29", color: "#fff", padding: "10px" }}>
        Đơn chuyển hàng
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "#edf6f9" }}>
        <Box ref={printRef} sx={{ padding: "24px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mã đơn hàng"
                value={orderCode}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nhân viên tạo đơn"
                value={employee ? employee.name : ''}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Địa Chỉ"
                value={employee ? employee.tk : ''}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Điểm chuyển đến"
                value={orders[0].endTKpointName.startsWith("T")
                  ? orders[0].endGDpointName
                  : orders[0].endTKpointName}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ngày Tạo Đơn"
                  value={creationDate}
                  onChange={setCreationDate}
                  format="dd/MM/yyyy"
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Số Lượng Đơn Hàng: {orders.length}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#5CAF50" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>STT</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Mã đơn hàng</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Loại Hàng</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Cân Nặng</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Giá tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{order.weight} kg</TableCell>
                    <TableCell>{order.cost} đồng</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", padding: "10px" }}>
        <Button
          onClick={handleConfirmClick}
          variant="contained"
          sx={{ bgcolor: "#4CAF50", color: "#fff", '&:hover': { bgcolor: '#003e29' } }}
        >
          Xác nhận
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ bgcolor: '#4CAF50', color: "#fff", '&:hover': { bgcolor: '#003e29' } }}
        >
          Hủy
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          sx={{ bgcolor: "#4CAF50", color: "#fff", '&:hover': { bgcolor: '#003e29' } }}
        >
          In Đơn
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShipmentDialog;



