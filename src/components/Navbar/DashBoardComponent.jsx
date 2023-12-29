import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

export default function DashboardComponent() {
  return (
    <Grid container spacing={3}>
      {/* Thêm các widget hoặc thông tin bạn muốn hiển thị trên Dashboard tại đây */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Phần Tổng Quan
          </Typography>
          {/* Thêm nội dung hoặc biểu đồ */}
        </Paper>
      </Grid>
      {/* Các thành phần khác */}
    </Grid>
  );
}
