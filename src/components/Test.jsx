import React, { useState } from "react";
import {
  AppBar,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Paper,
  Toolbar,
  Box,
  DatePicker,
  selectedDate,
  Autocomplete,
  Card,
  CardContent,
  Input,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid } from "@mui/x-data-grid";

const OrdersConfirm = () => {
  const [selectedTransactionPoint, setSelectedTransactionPoint] =
    useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: "DH123",
      locationBefore: "Xuân Thủy",
      deliveryTime: "2023-11-17",
      status: "Chưa xác nhận",
      details: {
        sender: "John Doe",
        senderAddress: "ABC",
        senderPhone: "1234",
        receiver: "Jane Doe",
        receiverAddress: "AA",
        receiverPhone: "1234",
        orderId: "DH123",
        itemName: "Product A",
        weight: "5 kg",
        itemType: "Electronics",
        price: "3 USD",
      },
    },
    {
      id: 2,
      orderId: "DH124",
      locationBefore: "Tô Hiệu",
      deliveryTime: "2023-11-18",
      status: "Chưa xác nhận",
      details: {
        sender: "John Doe",
        senderAddress: "ABC",
        senderPhone: "1234",
        receiver: "Jane Doe",
        receiverAddress: "AA",
        receiverPhone: "1234",
        orderId: "DH123",
        itemName: "Product A",
        weight: "5 kg",
        itemType: "Electronics",
        price: "3 USD",
      },
    },
    {
      id: 3,
      orderId: "DH125",
      locationBefore: "Phạm Văn Đồng",
      deliveryTime: "2023-11-7",
      status: "Chưa xác nhận",
      details: {
        sender: "John Doe",
        senderAddress: "ABC",
        senderPhone: "1234",
        receiver: "Jane Doe",
        receiverAddress: "AA",
        receiverPhone: "1234",
        orderId: "DH123",
        itemName: "Product A",
        weight: "5 kg",
        itemType: "Electronics",
        price: "3 USD",
      },
    },
  ]);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openDetailsOrders, setOpenDetailsOrders] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const handleCheckboxChange = (orderId) => {
    const newSelectedOrders = selectedOrders.includes(orderId)
      ? selectedOrders.filter((id) => id !== orderId)
      : [...selectedOrders, orderId];

    setSelectedOrders(newSelectedOrders);
  };

  const handleConfirmOrders = () => {
    setSelectedOrders((prevSelectedOrders) => {
      const updatedOrders = orders.map((order) =>
        prevSelectedOrders.includes(order.id)
          ? { ...order, status: "Đã xác nhận", confirmed: true }
          : order
      );
      setOrders(updatedOrders);
      return [];
    });
  };

  const clickDetailsOrders = (orderDetails) => {
    setSelectedOrderDetails(orderDetails);
    setOpenDetailsOrders(true);
  };

  const closeDetailsOrders = () => {
    setOpenDetailsOrders(false);
  };

  const filteredOrders = orders.filter((order) => {
    return (
      (!selectedTransactionPoint ||
        order.locationBefore === selectedTransactionPoint.label) &&
      (!selectedDate || order.deliveryTime.includes(selectedDate.label)) &&
      (!selectedMonth ||
        order.deliveryTime.includes(`-${selectedMonth.label}-`)) &&
      (!selectedYear ||
        order.deliveryTime.includes(`${selectedYear.label}-`)) &&
      (!selectedStatus ||
        (order.confirmed ? "Đã xác nhận" : "Chưa xác nhận") ===
          selectedStatus.label)
    );
  });

  const transactionPointList = [
    { label: "Xuân Thủy" },
    { label: "Trần Quốc Hoàn" },
    { label: "Tô Hiệu" },
    { label: "Phạm Văn Đồng" },
  ];
  const status = [{ label: "Chưa xác nhận" }, { label: "Đã xác nhận" }];
  const year = [
    { label: 2020 },
    { label: 2021 },
    { label: 2022 },
    { label: 2023 },
  ];
  const createArray = (start, end) => {
    let array = [];
    for (let i = start; i <= end; i++) {
      let object = { label: i };
      array.push(object);
    }
    return array;
  };
  const month = createArray(1, 12);
  const date = createArray(1, 31);

  const handleTransactionPointChange = (event, value) => {
    setSelectedTransactionPoint(value);
  };

  const handleDateChange = (event, value) => {
    setSelectedDate(value);
  };

  const handleMonthChange = (event, value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (event, value) => {
    setSelectedYear(value);
  };

  const handleStatusChange = (event, value) => {
    setSelectedStatus(value);
  };

  return (
    <Container>
      <div
        className="filter"
        style={{
          display: "flex",
          flexDirection: "row", // Arrange items horizontally
          gap: "10px", // Adjust the gap between items as needed
          alignItems: "center", // Align items vertically at the center
          width: "auto", // Adjust the width as needed
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={transactionPointList}
          value={selectedTransactionPoint}
          onChange={handleTransactionPointChange}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Điểm tập kết" variant="standard" />
          )}
        />
        <Autocomplete
          // onInputChange={(event, newInputValue) => {
          //     props.setDate(+newInputValue);
          // }}
          disablePortal
          id="combo-box-demo"
          options={date}
          value={selectedDate}
          onChange={handleDateChange}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Ngày" variant="standard" />
          )}
        />
        <Autocomplete
          // onInputChange={(event, newInputValue) => {
          //   props.setMonth(+newInputValue);
          // }}
          disablePortal
          id="combo-box-demo"
          options={month}
          value={selectedMonth}
          onChange={handleMonthChange}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Tháng" variant="standard" />
          )}
        />

        <Autocomplete
          // onInputChange={(event, newInputValue) => {
          //   props.setYear(+newInputValue);
          // }}
          disablePortal
          id="combo-box-demo"
          options={year}
          value={selectedYear}
          onChange={handleYearChange}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Năm" variant="standard" />
          )}
        />

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={status}
          value={selectedStatus}
          onChange={handleStatusChange}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Trạng thái" variant="standard" />
          )}
        />
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={selectedOrders.length === orders.length}
                onChange={() => {
                  const allSelected = selectedOrders.length === orders.length;
                  const newSelectedOrders = allSelected
                    ? []
                    : orders.map((order) => order.id);
                  setSelectedOrders(newSelectedOrders);
                }}
              />
            </TableCell>
            <TableCell>Mã đơn chuyển hàng</TableCell>
            <TableCell>Điểm tập kết trước</TableCell>
            <TableCell>Thời gian chuyển đến</TableCell>
            <TableCell>Chi tiết</TableCell>
            <TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleCheckboxChange(order.id)}
                />
              </TableCell>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>{order.locationBefore}</TableCell>
              <TableCell>{order.deliveryTime}</TableCell>
              <TableCell>
                <IconButton onClick={() => clickDetailsOrders(order.details)}>
                  <VisibilityIcon />
                </IconButton>

                <Dialog
                  open={openDetailsOrders}
                  onClose={closeDetailsOrders}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Order Details</DialogTitle>
                  <DialogContent>
                    {selectedOrderDetails && (
                      <Card>
                        <CardContent>
                          <Typography variant="h6">
                            Sender Information
                          </Typography>
                          <Typography>
                            Name: {selectedOrderDetails.sender}
                          </Typography>
                          <Typography>
                            Address: {selectedOrderDetails.senderAddress}
                          </Typography>
                          <Typography>
                            Phone: {selectedOrderDetails.senderPhone}
                          </Typography>
                          <Typography variant="h6">
                            Receiver Information
                          </Typography>
                          <Typography>
                            Name: {selectedOrderDetails.receiver}
                          </Typography>
                          <Typography>
                            Address: {selectedOrderDetails.receiverAddress}
                          </Typography>
                          <Typography>
                            Phone: {selectedOrderDetails.receiverPhone}
                          </Typography>
                          <Typography variant="h6">
                            Order Information
                          </Typography>
                          <Typography>
                            Order ID: {selectedOrderDetails.orderId}
                          </Typography>
                          <Typography>
                            Item Name: {selectedOrderDetails.itemName}
                          </Typography>
                          <Typography>
                            Weight: {selectedOrderDetails.weight}
                          </Typography>
                          <Typography>
                            Item Type: {selectedOrderDetails.itemType}
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeDetailsOrders} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" onClick={handleConfirmOrders}>
        Xác nhận
      </Button>
    </Container>
  );
};

export default OrdersConfirm;
