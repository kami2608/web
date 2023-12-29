import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Box,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Grid,
} from "@mui/material";

const ShipmentDetailsDialog = ({ open, onClose, shipment, orders, staff, clickDetailOrder }) => {
  // // Phân tách orderIDs từ shipment.ordersList
  if (!shipment) {
    console.log("shipment null");
    return;
  }
  const orderIDs = shipment.ordersList.split(',');

  // // Lấy tên nhân viên 
  let employeeID = "";
  if (shipment.startGDpoint !== 0) {
    employeeID = `${shipment.startGDpoint}001`;
  } else if (shipment.startTKpoint !== 0) {
    employeeID = `${shipment.startTKpoint}001`;
  }
  const employee = staff.find(emp => emp.id === employeeID);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#003e29', color: "#fff", padding: '10px' }}>
        Chi tiết đơn chuyển hàng
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "#edf6f9" }}>
        {shipment && (
          <Box sx={{ padding: "24px" }}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="#5CAF50"><strong>Tên nhân viên:</strong></Typography>
                <Typography variant="body2" gutterBottom>{employee ? employee.name : 'Không tìm thấy'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="#5CAF50"><strong>{shipment.startGDpoint !== 0 ? "Điểm giao dịch:" : "Điểm tập kết"}</strong></Typography>
                <Typography variant="body2" gutterBottom>{shipment.startGDpoint !== 0 ? shipment.startGDpointName : shipment.startTKpointName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="#5CAF50"><strong>Ngày chuyển hàng:</strong></Typography>
                <Typography variant="body2" gutterBottom>{shipment ? shipment.date : 'Không tìm thấy'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="#5CAF50"><strong>Số lượng</strong></Typography>
                <Typography variant="body2" gutterBottom>{shipment ? shipment.counts : 'Không tìm thấy'}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4 }} />

            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ backgroundColor: "#5CAF50" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>STT</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Mã đơn hàng</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Loại</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Cân nặng</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Giá tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderIDs.map((orderID, index) => {
                    const order = orders.find(o => o.id.trim() === orderID.trim());
                    return (
                      <TableRow
                        key={orderID}
                        index={index}
                       
                        onClick={() => {
                          clickDetailOrder(order);
                          console.log("order", order);}} 
                        sx={{ "&:hover": { backgroundColor: "#e8f5e9", cursor: "pointer" } }}
                      >
                        {order ? (
                          <>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.type}</TableCell>
                            <TableCell>{order.weight} kg</TableCell>
                            <TableCell>{order.cost} đồng</TableCell>
                          </>
                        ) : (
                          <TableCell colSpan={5}>Không tìm thấy thông tin cho đơn hàng: {orderID}</TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>


              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', padding: '10px' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ bgcolor: '#4CAF50', color: "#fff", '&:hover': { bgcolor: '#003e29' } }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShipmentDetailsDialog;