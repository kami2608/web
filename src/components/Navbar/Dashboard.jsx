import React, { useState, useNavigate } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "./AppBar"; 
import Drawer from "./Drawer"; 
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import SidebarItems from "./SidebarItems";
import DashBoardComponent from "./DashBoardComponent"; 
import OrdersConfirm from "../OrderConfirm";
import ConfirmationFromTransactionPoint from "../ConfirmationFromTransactionPoint";

const darkGreenTheme = createTheme({
  palette: {
    primary: {
      main: '#003e29',
    },
    secondary: {
      main: '#4CAF50',
    },
  },
});

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const handleItemClick = (path) => {
    // Cập nhật URL mà không tải lại trang
    navigate(path);
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} toggleDrawer={toggleDrawer} />
        <Drawer open={open} SidebarItems={<SidebarItems />} />
        <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Các thành phần khác của bạn */}
            </Grid>
            <Routes>
            <Routes>
              <Route path="/dashboard" element={<DashBoardComponent />} />
              <Route path="/create-order-transaction-point" element={<OrdersConfirm />} />
              <Route path="/confirm-from-transaction-point" element={<ConfirmationFromTransactionPoint />} />
              {/* Thêm các Route khác ở đây */}
            </Routes>
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
