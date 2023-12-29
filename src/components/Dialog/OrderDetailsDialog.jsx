// // OrderDetailsDialog.jsx

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import Buttonme from '../Buttonme/Buttonme';

const OrderDetailsDialog = ({ open, onClose, order }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#003e20', color: "#fff",padding: '10px' }}>
        Chi tiết đơn hàng
      </DialogTitle>
      <DialogContent dividers>
        {order && (
          <Card variant="outlined">
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Thông tin người gửi
              </Typography>
              <Typography variant="body2">Họ và tên: {order.senderName}</Typography>
              <Typography variant="body2">Địa chỉ: {order.senderAddress}</Typography>
              <Typography variant="body2">Số điện thoại: {order.senderPhone}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography gutterBottom variant="h6" component="div">
              Thông tin người nhận
              </Typography>
              <Typography variant="body2">Họ và tên: {order.receiverName}</Typography>
              <Typography variant="body2">Địa chỉ: {order.receiverAddress}</Typography>
              <Typography variant="body2">Số điện thoại: {order.receiverPhone}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography gutterBottom variant="h6" component="div">
              Thông tin đơn hàng
              </Typography>
              <Typography variant="body2">Loại hàng: {order.type}</Typography>
              <Typography variant="body2">Cân nặng: {order.weight} kg</Typography>
              <Typography variant="body2">Giá tiền: {order.cost} đồng</Typography>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
       <Buttonme content="Đóng" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
