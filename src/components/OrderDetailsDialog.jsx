// // OrderDetailsDialog.jsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";

const OrderDetailsDialog = ({ open, onClose, selectedOrderDetails }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#003e20", color: "#fff", padding: "10px" }}>
        Chi tiết đơn hàng
      </DialogTitle>
      <DialogContent dividers>
        {selectedOrderDetails && (
          <Card variant="outlined">
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Thông tin người gửi
              </Typography>
              <Typography variant="body2">
                Họ và tên: {selectedOrderDetails.senderName}
              </Typography>
              <Typography variant="body2">
                Địa chỉ: {selectedOrderDetails.senderAddress}
              </Typography>
              <Typography variant="body2">
                Số điện thoại: {selectedOrderDetails.senderPhone}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography gutterBottom variant="h6" component="div">
                Thông tin người nhận
              </Typography>
              <Typography variant="body2">
                Họ và tên: {selectedOrderDetails.receiverName}
              </Typography>
              <Typography variant="body2">
                Địa chỉ: {selectedOrderDetails.receiverAddress}
              </Typography>
              <Typography variant="body2">
                Số điện thoại: {selectedOrderDetails.receiverPhone}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography gutterBottom variant="h6" component="div">
                Thông tin hàng gửi
              </Typography>
              <Typography variant="body2">
                Phân loại: {selectedOrderDetails.type}
              </Typography>
              <Typography variant="body2">
                Khối lượng: {selectedOrderDetails.weight} kg
              </Typography>
              <Typography variant="body2">
                Giá cước: {selectedO
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "16px" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "#4CAF50",
            color: "#fff",
            "&:hover": { bgcolor: "#003e29" },
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
