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

const ShipmentDetailsDialog = ({ open, onClose, shipmentDetails, clickDetailOrder }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#003e29', color: "#fff", padding: '10px' }}>
        Chi tiết đơn chuyển hàng
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#edf6f9" }}>
        {shipmentDetails && (
          <Box sx={{ padding: "24px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="#5CAF50"><strong>Tên nhân viên:</strong></Typography>
                <Typography variant="body2" gutterBottom>{shipmentDetails.employee.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="#5CAF50"><strong>Điểm giao dịch:</strong></Typography>
                <Typography variant="body2" gutterBottom>{shipmentDetails.employee.address}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="#5CAF50"><strong>Số lượng hàng:</strong></Typography>
                <Typography variant="body2" gutterBottom>{shipmentDetails.counts}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="#5CAF50"><strong>Ngày chuyển hàng:</strong></Typography>
                <Typography variant="body2" gutterBottom>{shipmentDetails.deliveryTime}</Typography>
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
                  {shipmentDetails.orders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      onClick={() => clickDetailOrder(order.details)}
                      sx={{ "&:hover": { backgroundColor: "#e8f5e9", cursor: "pointer" } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{order.orderID}</TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>{order.weight}</TableCell>
                      <TableCell>{order.price}</TableCell>
                    </TableRow>
                  ))}
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
