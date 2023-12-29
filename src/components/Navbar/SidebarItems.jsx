import React, { useState } from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';
import ArticleIcon from '@mui/icons-material/Article';

const SidebarItems = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleCreateClick = () => {
    setOpenCreate(!openCreate);
  };

  const handleConfirmClick = () => {
    setOpenConfirm(!openConfirm);
  };

  return (
    <List component="nav">
      <ListItemButton component={Link} to="/dashboard">
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      
      <ListItemButton onClick={handleCreateClick}>
        <ListItemIcon><CreateIcon /></ListItemIcon>
        <ListItemText primary="Tạo đơn hàng" /> 
        {openCreate ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      
      <Collapse in={openCreate} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/create-order-transaction-point">
            <ListItemIcon><LocalShippingIcon /></ListItemIcon>
            <ListItemText primary="Đến điểm giao dịch" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/create-order-gathering-point">
            <ListItemIcon><LocalShippingIcon /></ListItemIcon>
            <ListItemText primary="Đến điểm tập kết" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={handleConfirmClick}>
        <ListItemIcon><CheckCircleIcon/></ListItemIcon>
        <ListItemText primary="Xác nhận" />
        {openConfirm ? <ExpandLessIcon/> : <ExpandMoreIcon />}
      </ListItemButton>
      
      <Collapse in={openConfirm} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/confirm-from-transaction-point">
            <ListItemIcon><ArticleIcon /></ListItemIcon>
            <ListItemText primary="Từ điểm giao dịch" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/confirm-from-gathering-point">
            <ListItemIcon><ArticleIcon /></ListItemIcon>
            <ListItemText primary="Từ điểm tập kết" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
};

export default SidebarItems;
