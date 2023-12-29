import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  InputAdornment,
  Grid,
  Stack,
  Paper,
  Fade,
  Fab,
  useScrollTrigger,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircle,
  Search,
  KeyboardArrowUpIcon,
  LocalShippingIcon,
  SupportAgentIcon,
  DeveloperBoardIcon,
  GroupsIcon,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import bgimg from "../assets/images/1.png";
import "../assets/styles/Landing.css";

function ScrollTop(props) {
  const { children } = props;
  // useScrollTrigger can be used here as well to show button when user scrolls down
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Fade in={trigger}>
      <Box onClick={handleClick} role="presentation" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        {children}
      </Box>
    </Fade>
  );
}

function App() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const navigate = useNavigate();
  const match = useMediaQuery("(max-width:800px)");

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLogin = () => {
    // Handle login logic here
    setOpen(false);
  };
  const handleSearch = () => {
    // Handle search logic here
    navigate("/orderStatus");
  };
  const handleSignIn = () => {
    // Handle sign-in logic here
    navigate("/dashboard");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar>
  <Toolbar sx={{ justifyContent: "space-between", background: "#f1f2ec" }}>
    <Typography
      variant="h6"
      component="div"
      sx={{ fontWeight: "bold", color: "#003e29" }}
    >
      <strong>MAGICPOST</strong> {/* Your logo or title goes here */}
    </Typography>
    <Button
      variant="contained"
      sx={{
        fontFamily: "Arial",
        fontWeight: "bold",
      }}
      startIcon={<AccountCircle />}
      onClick={handleClickOpen}
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

      <Toolbar id="back-to-top-anchor" />
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
      <Box
        maxWidth="sm"
        sx={{
          textAlign: "center",
          padding: 2, // Add padding if needed
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: Adds a semi-transparent overlay for better readability
          borderRadius: 1, // Optional: Adds rounded corners to the overlay
          marginY: 5, // Add vertical margin if needed
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#003e29" }}
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
            sx={{
              backgroundColor: "white", // Ensures the text field is visible on the background
              borderRadius: 1, // Adds rounded corners to the text field
            }}
          />
        </Box>
      </Box>
    </Grid>
  </Grid>
</Box>

      
      {/* Content from your first snippet starts here */}
      {/* Assume this is the content after scrolling down */}
      {/* You might need to adjust styles and layout as per your design */}
      {/* ... */}
      
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}

export default App;
