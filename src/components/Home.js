import React, { Fragment, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  CssBaseline,
  Grid,
  Stack,
} from "@mui/material";
import { AccountCircle, Search } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import bgimg from "../assets/images/1.png";
import logo from "../assets/images/logoo.png"
import "../assets/styles/Landing.css";

function App() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orderCode, setOrderCode] = useState("");

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    // Xử lý logic đăng nhập ở đây
    setOpen(false);
  };

  const handleSearch = () => {
    navigate("/orderStatus");
    // Xử lý logic tìm kiếm ở đây
    // <Link to="/orderStatus" />;
  };

  const handleSignIn = () => {
    // Xử lý logic đăng nhập ở đây
    navigate("/dashboard");
  };

  return (
    <Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar sx={{ justifyContent: "space-between", background: "#f1f2ec" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "#003e29" }}
          >
            {/* <img src={logo} alt="MagicPost Logo" style={{ height: '50px' }} /> */}
            <strong>MAGICPOST</strong>
          </Typography>
          <Button
            id="button"
            variant="contained"
            sx={{
              fontFamily: "Arial",
              fontWeight: "bold",
            }}
            onClick={handleClickOpen}
            startIcon={<AccountCircle />}
          >
            Đăng nhập
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Đăng nhập</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Tên tài khoản"
                type="text"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Mật khẩu"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Hủy
              </Button>
              <Button onClick={handleSignIn} color="primary">
                Đăng nhập
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundImage: `url(${bgimg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >

        <Grid container>
          <Grid item xs={12} md={6}>
            {/* Phần Tra cứu đơn hàng */}
            <Box
              maxWidth="sm"
              style={{
                // marginTop: "auto",
                // marginBottom: "auto",

                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                style={{ fontWeight: "bold", color: "#003e29" }}
              >
                TRA CỨU ĐƠN HÀNG
              </Typography>
              <Box mt={2}>
                <TextField
                  label="Nhập mã đơn hàng"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearch}>
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  style={{
                    backgroundColor: "white",
                  }}
                />
              </Box>
              
            </Box>
          </Grid>
        
        </Grid>
      </Box>
    </Fragment >
  );
}

export default App;