// import * as React from "react";
// import PropTypes from "prop-types";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import CssBaseline from "@mui/material/CssBaseline";
// import useScrollTrigger from "@mui/material/useScrollTrigger";
// import Box from "@mui/material/Box";
// import FormHelperText from "@mui/material/FormHelperText";
// import Fab from "@mui/material/Fab";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import Fade from "@mui/material/Fade";
// import Paper from "@mui/material/Paper";
// import Button from "@mui/material/Button";
// import bgimg from "../assets/images/bg.png";
// import TextField from "@mui/material/TextField";
// import Stack from "@mui/material/Stack";
// import { Link } from "react-router-dom";
// import SearchIcon from "@mui/icons-material/Search";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
// import GroupsIcon from "@mui/icons-material/Groups";
// import "../assets/styles/Landing.css";
// import Divider from "@mui/material/Divider";
// import useMediaQuery from "@mui/material/useMediaQuery";

// function ScrollTop(props) {
//   const { children, window } = props;
//   const trigger = useScrollTrigger({
//     target: window ? window() : undefined,
//     disableHysteresis: true,
//     threshold: 100,
//   });

//   const handleClick = (event) => {
//     const anchor = (event.target.ownerDocument || document).querySelector(
//       "#back-to-top-anchor"
//     );

//     if (anchor) {
//       anchor.scrollIntoView({
//         block: "center",
//       });
//     }
//   };

//   return (
//     <Fade in={trigger}>
//       <Box
//         onClick={handleClick}
//         role="presentation"
//         sx={{ position: "fixed", bottom: 16, right: 16 }}
//       >
//         {children}
//       </Box>
//     </Fade>
//   );
// }

// ScrollTop.propTypes = {
//   children: PropTypes.element.isRequired,
//   window: PropTypes.func,
// };

// export default function BackToTop(props) {
//   const match = useMediaQuery("(max-width:800px)");

//   return (
//     <React.Fragment>
//       <CssBaseline />
//       <AppBar>
//         <Toolbar
//           sx={{ justifyContent: "space-between", background: "#f1f2ec" }}
//         >
//           <Typography
//             variant="h6"
//             component="div"
//             sx={{ fontWeight: "bold", color: "#003e29" }}
//           >
//             <i>MAGICPOST</i>
//           </Typography>
//           <Link to="/Login">
//             <Button
//               id="button"
//               variant="contained"
//               sx={{
//                 fontFamily: "Arial",
//                 fontWeight: "bold",
//               }}
//             >
//               Đăng nhập
//             </Button>
//           </Link>
//         </Toolbar>
//       </AppBar>
//       <Toolbar id="back-to-top-anchor" />
//       <Box>
//         <Box
//           sx={{
//             backgroundImage: `url(${bgimg})`,
//             backgroundRepeat: "no-repeat",
//             backgroundSize: "cover",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "100vh",
//           }}
//         >
//           <div
//             style={{
//               textAlign: "center",
//               backgroundColor: "transparent",
//               marginTop: "-25px",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: "100px",
//                 color: "#f1f2ec",
//                 padding: "0",
//               }}
//             >
//               MAGICPOST
//             </Typography>
//             <i style={{ fontSize: "20px", padding: "0", color: "#f1f2ec" }}>
//               Fast & Reliable
//             </i>
//           </div>
//         </Box>
//         <Box
//           sx={{
//             minHeight: "30vh",
//             background: "#faf6ed",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Paper
//             sx={{
//               width: "100%",
//               padding: 2,
//               background: "transparent",
//               mt: 1,
//               boxShadow: "none",
//             }}
//           >
//             <Typography
//               sx={{
//                 textAlign: "center",
//                 fontWeight: "bold",
//                 color: "#003e29",
//                 mb: 4,
//                 fontSize: "1.5em",
//               }}
//             >
//               TRA CỨU BƯU GỬI
//             </Typography>
//             <Stack sx={{ alignItems: "center" }}>
//               <FormHelperText sx={{ width: "30%" }}>
//                 Tra nhiều mã thêm giấu phẩy giữa các mã
//               </FormHelperText>
//               <Stack
//                 spacing={1}
//                 direction="row"
//                 sx={{ mb: 2, justifyContent: "center", width: "30%" }}
//               >
//                 <TextField
//                   placeholder="Nhập mã bưu gửi"
//                   sx={{
//                     width: "100%",
//                     ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
//                       {
//                         borderColor: "#467061",
//                       },
//                   }}
//                 ></TextField>
//                 <Button
//                   id="button"
//                   variant="contained"
//                   sx={{
//                     margin: 0,
//                   }}
//                 >
//                   <SearchIcon />
//                 </Button>
//               </Stack>
//             </Stack>
//           </Paper>
//         </Box>
//         <Box id="thirdPanel">
//           <Paper
//             sx={{
//               width: "80%",
//               minHeight: "40vh",
//               boxShadow: "none",
//               backgroundColor: "transparent",
//             }}
//           >
//             <Stack
//               direction={`${match ? "column" : "row"}`}
//               spacing={4}
//               sx={{ mb: 4, alignItems: "center", mt: 2 }}
//             >
//               <LocalShippingIcon id="icon" />
//               <Paper id="content">
//                 <Typography>
//                   MagicPost là một công ty chuyển phát hàng hóa hàng đầu, mang
//                   đến cho khách hàng một dịch vụ vận chuyển nhanh chóng, tin cậy
//                   và tiện lợi. Với sứ mệnh làm cho việc gửi và nhận hàng trở nên
//                   đơn giản và dễ dàng, chúng tôi cam kết cung cấp cho khách hàng
//                   trải nghiệm vận chuyển tốt nhất.
//                 </Typography>
//               </Paper>
//               <Paper id="content">
//                 <Typography align="right">
//                   Với mạng lưới vận chuyển rộng khắp và đội ngũ nhân viên giàu
//                   kinh nghiệm, MagicPost đảm bảo sự chuyên nghiệp và hiệu quả
//                   trong việc vận chuyển hàng hóa của bạn. Chúng tôi hiểu rằng
//                   thời gian là quan trọng, vì vậy chúng tôi luôn nỗ lực để đảm
//                   bảo hàng hóa của bạn được giao đúng hẹn và với tốc độ nhanh
//                   nhất có thể.
//                 </Typography>
//               </Paper>
//               <SupportAgentIcon id="icon" />
//             </Stack>
//             <Stack
//               direction={`${match ? "column" : "row"}`}
//               spacing={4}
//               sx={{ mb: 10, alignItems: "center" }}
//             >
//               <DeveloperBoardIcon id="icon" />
//               <Paper id="content">
//                 <Typography>
//                   Điều hướng thông minh và công nghệ tiên tiến là những yếu tố
//                   quan trọng trong phương pháp làm việc của chúng tôi. Chúng tôi
//                   sử dụng hệ thống theo dõi hàng hóa tiên tiến để giúp bạn theo
//                   dõi mọi bước di chuyển của gói hàng của mình. Bằng cách sử
//                   dụng công nghệ tiên tiến, chúng tôi đảm bảo rằng thông tin vận
//                   chuyển của bạn luôn được bảo mật và an toàn.
//                 </Typography>
//               </Paper>
//               <Paper id="content">
//                 <Typography align="right">
//                   Sự hài lòng của khách hàng là ưu tiên hàng đầu của chúng tôi.
//                   Chúng tôi xem mỗi gói hàng là một cam kết để mang đến sự hài
//                   lòng và sự tin tưởng cho khách hàng. Với dịch vụ chuyển phát
//                   hàng hoá đa dạng và linh hoạt, MagicPost là đối tác tin cậy
//                   cho các doanh nghiệp và cá nhân có nhu cầu vận chuyển hàng hóa
//                   trên toàn quốc.
//                 </Typography>
//               </Paper>
//               <GroupsIcon id="icon" />
//             </Stack>
//             <Typography id="quote">
//               <i>
//                 Hãy để MagicPost đồng hành cùng bạn trong việc chuyển phát hàng
//                 hóa một cách đáng tin cậy và thuận tiện.
//               </i>
//             </Typography>
//           </Paper>
//         </Box>
//       </Box>
//       <Box
//         sx={{
//           minHeight: "15vh",
//           background: "#003e29",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Stack
//           direction="row"
//           sx={{
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <FormHelperText sx={{ color: "white", ml: 5 }}>
//             Copyright ©2023
//           </FormHelperText>
//           <Divider
//             orientation="vertical"
//             sx={{
//               height: "10vh",
//               borderColor: "white",
//               mr: 20,
//               ml: 20,
//             }}
//           />
//           <FormHelperText sx={{ color: "white", mr: 5 }}>
//             Designed by Webruh
//           </FormHelperText>
//         </Stack>
//       </Box>
//       <ScrollTop {...props}>
//         <Fab size="small" aria-label="scroll back to top">
//           <KeyboardArrowUpIcon />
//         </Fab>
//       </ScrollTop>
//     </React.Fragment>
//   );
// }