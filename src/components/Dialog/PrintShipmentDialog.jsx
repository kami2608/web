import React from 'react';
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import "../../assets/styles/Print.css";

const PrintShipmentDialog = ({ orders, employee }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" align="center">CÔNG TY CHUYỂN PHÁT MAGICPOST</Typography>
      <Typography variant="subtitle1" align="center">Số: ....../SCBI-GATE PASS</Typography>
      <Typography variant="subtitle1" align="center">Ngày .... tháng .... năm .......</Typography>

      <Typography variant="h5" align="center" sx={{ my: 2 }}>ĐƠN CHUYỂN HÀNG HÓA</Typography>

      <Box sx={{ my: 2 }}>  
        <Typography variant="body1">Họ và tên: {employee ? employee.name : 'N/A'}</Typography>
        <Typography variant="body1">Điện thoại: {employee ? employee.phone : 'N/A'}</Typography>
        <Typography variant="body1">Điểm tập kết: {employee ? employee.tk : 'N/A'}</Typography>
        <Typography variant="body1">
          Chuyển đến: {orders.length > 0 && (orders[0].endTKpointName.startsWith("T")
          ? orders[0].endGDpointName
          : orders[0].endTKpointName)}</Typography>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ my: 2 }}>
        <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: 2, fontWeight: 'bold' }}>STT</TableCell>
              <TableCell sx={{ border: 2, fontWeight: 'bold' }}>MÃ ĐƠN HÀNG</TableCell>
              <TableCell sx={{ border: 2, fontWeight: 'bold' }}>LOẠI HÀNG</TableCell>
              <TableCell sx={{ border: 2, fontWeight: 'bold' }}>CÂN NẶNG</TableCell>
              <TableCell sx={{ border: 2, fontWeight: 'bold' }}>GIÁ TIỀN</TableCell>
              <TableCell sx={{ border: 2, fontWeight: 'bold' }}>GHI CHÚ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell sx={{ border: 2 }}>{index + 1}</TableCell>
                <TableCell sx={{ border: 2}}>{order.id}</TableCell>
                <TableCell sx={{ border: 2 }}>{order.type}</TableCell>
                <TableCell sx={{ border: 2 }}>{order.weight} kg</TableCell>
                <TableCell sx={{ border: 2 }}>{order.cost} đồng</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-around' }}>
    
        <Typography variant="body1">Người thực hiện</Typography>
       
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography variant="body2">(*) Quy định chung:</Typography>
        
      </Box>
    </Box>
  );
};

export default PrintShipmentDialog;
