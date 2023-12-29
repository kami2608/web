import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  IconButton,
  TextField,
  Box,
  Autocomplete,
  Grid,
  TableSortLabel,
  Paper,
  Typography,
  Snackbar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShipmentDialog from "./CreateShipmentDialog";
import OrderDetailsDialog from "../OrderDetailsDialog";
import { addDataToDexieTable, addDataToFireStoreAndDexie, dexieDB,  updateDataFromDexieTable, updateDataFromFireStoreAndDexie } from "../../database/cache";
import { useLiveQuery } from "dexie-react-hooks";
import { collection, getDocs, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { fireDB } from "../../database/firebase";

const TransToTK = () => {
  const center = "GD10";
  const diemTK = "TK01";
  //const [fetchedOrders, setFetchedOrders] = useState([]);

  const data = useLiveQuery(() =>
    dexieDB
      .table("orders")
      .filter((item) => item.startGDpoint == center && item.status == "Chưa xử lý")
      .toArray()
  );

  const [orders, setOrders] = useState([]);

  function createData(id, senderName, senderPhone, senderAddress, receiverName, receiverPhone, receiverAddress, type, weight,
    cost, status) {
    return {id, senderName, senderPhone, senderAddress, receiverName, receiverPhone, receiverAddress, type, weight,
    cost, status/*, startGDpoint, startTKpoint, endTKpoint, endGDpoint*/ };
  }

  
  useEffect(() => {
    if (data) {
      const newRows = data.map((item) => 
        createData( item.id,
            item.senderName,
            item.senderPhone,
            item.senderAddress,
            item.receiverName,
            item.receiverPhone,
            item.receiverAddress,
            
            item.type,
            item.weight,
            item.cost,
            item.status, 
            )
      );
      setOrders(newRows);
    }
    
  }, [data]);

  /*const updatedOrders = data.forEach((order) => ({
    ...order,
    status: "Chưa tạo đơn",
  }));*/

  const defaultForm = {
    id: "",
    createDate: "",
    Counts: 0,
    startGDpoint: center,
    startTKpoint: diemTK,
    endTKpoint: 0,
    endGDpoint: 0,
    details: "",
  };
  const [shipment, setShipment] = useState(defaultForm);

  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openCreateShipment, setOpenCreateShipment] = useState(false);
  const [openDetailsOrder, setOpenDetailsOrder] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const clickDetailOrder = (order) => {
    setSelectedOrderDetails(order);
    setOpenDetailsOrder(true);
  };
  const closeDetailsOrder = () => {
    setOpenDetailsOrder(false);
  };

  //Xử lý event khi nhấn Tạo đơn
  const clickCreateShipment = () => {
    if (selectedOrders.length == 0) {
      alert("Vui lòng chọn đơn hàng");
    } else {
      setShipment((values) => ({ ...values, Counts: selectedOrders.length }));
      let shipmentDetails = selectedOrders[0];
      for (let i = 1; i < selectedOrders.length; i++) {
        shipmentDetails += ", " + selectedOrders[i];
      }
      setShipment((values) => ({ ...values, details: shipmentDetails }));
      setOpenCreateShipment(true);
    }
  };

  const genId = async () => {
    try {
      const count = await dexieDB.shipment.count();
      const newId = `S${count.toString().padStart(3, "0")}`;
      setShipment((values) => ({ ...values, id: newId }));
    } catch (error) {
      console.error("Lỗi khi lấy số lượng bản ghi: ", error);
    }
    
  };
  useEffect(() => {
    genId();
    return;
  }, [data])

  //Xử lý Xác nhận tạo đơn
  const submit = async() => {
    try {
      const newData = {
        ...shipment,
        status: "chưa xác nhận"
        //id: "S490",  
      }
      //thêm vào bảng shipment trong firestore và dexie
      const docRef = doc(fireDB, "shipment", newData.id);
      setDoc(docRef, newData);
      addDataToDexieTable ("shipment", {...newData, id: shipment.id});

      
      for (let i = 0; i < selectedOrders.length; i++) {
        //update dexie bảng orders
        const data = orders.find(obj => obj.id === selectedOrders[i]);
        const newData = {...data, status: "Đang chuyển đến điểm TK gửi"};
        updateDataFromDexieTable("orders", selectedOrders[i], newData);

        //update bảng orderHistory
        const docRef = doc(fireDB, "orderHistory", selectedOrders[i]+"_2");
        const querySnapshot = getDoc(docRef);
        const newHistoryLine = {
          date: shipment.createDate,
          orderStatus: "Đã tạo đơn",
          currentLocation: diemTK,
          Description: "Chuyển đến điểm " + diemTK,
        }
        setDoc(docRef, newHistoryLine, {merge: true});

        await dexieDB.table("orderHistory")
          .where("id")
          .equals(selectedOrders[i]+"_2")
          .modify((record) => {
            record.date = shipment.createDate;
            record.orderStatus = "Đã tạo đơn";
            record.currentLocation = diemTK;
            record.Description = "Chuyển đến điểm " + diemTK;
          })

      }
      
      //
      
      setOpenSnackbar(true);
      setShipment(defaultForm);
    } catch (error) {
      console.error('Loi khi add shipment:', error);
    }
    
  };

  const formValidate = () => {
    if (
      //shipment.id == "" ||
      shipment.createDate == "" ||
      shipment.Counts == "" ||
      shipment.Counts == 0 ||
      shipment.startGDpoint == "" ||
      shipment.startTKpoint == ""
      //||shipment.details == ""
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else {
      submit();
      setOrders((prevOrders) => {
        return prevOrders.map((order) => ({
          ...order,
          status: selectedOrders.includes(order.id)
            ? "Đã tạo đơn"
            : order.status,
        }));
      });
      setSelectedOrders([]);

      setOpenCreateShipment(false);
      
    }
  };

  const handleConfirmShipment = () => {
    formValidate();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  //Hủy Tạo đơn chuyển, đóng shipmentDialog
  const closeCreateShipment = () => {
    setOpenCreateShipment(false);
    setShipment(defaultForm);
    setSelectedOrders([]);
  };

  //option cho autocomplete (bộ lọc)
  const orderID = orders.map((order) => ({ label: order.id }));

  const year = [
    { label: 2020 },
    { label: 2021 },
    { label: 2022 },
    { label: 2023 },
  ];
  const status = [{ label: "Chưa tạo đơn" }, { label: "Đã tạo đơn" }];
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

  /*const handleTransactionPointChange = (event, value) => {
    setSelectedTransactionPoint(value);
  };*/
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
  const handleOrderIDChange = (event, value) => {
    setSelectedOrderID(value);
  };

  //
  const handleCheckboxChange = (params) => {
    //Mảng selectedOrders chứa các orderID được chọn
    const newSelectedOrders = selectedOrders.includes(params)
      ? selectedOrders.filter((orderID) => orderID !== params)
      : [...selectedOrders, params];
    setSelectedOrders(newSelectedOrders);
  };

  const formatTime = (time) => {
    if (time) {
      const [date, month, year] = time.split("/");
    return new Date(`${year}-${month}-${date}`);
    }
    return "";
  };

  const filteredOrders = orders.filter((order) => {
    const formattedRegisDate = order.regisDate; //formatTime(order.regisDate);
    return (
      (!selectedOrderID || order.id === selectedOrderID.label) &&
      /*(!selectedTransactionPoint ||
        order.transactionPoint === selectedTransactionPoint.label) &&*/
      (!selectedDate ||
        formattedRegisDate.getDate() === parseInt(selectedDate.label)) &&
      (!selectedMonth ||
        formattedRegisDate.getMonth() + 1 === parseInt(selectedMonth.label)) &&
      (!selectedYear ||
        formattedRegisDate.getFullYear() === parseInt(selectedYear.label)) &&
      (!selectedStatus ||
        (order.confirmed ? "Đã tạo đơn" : "Chưa tạo đơn") ===
          selectedStatus.label)
    );
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Sorting function
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "des";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4">Tạo đơn chuyển hàng đến điểm tập kết</Typography>
      {/* Các bộ lọc */}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Autocomplete
            disablePortal
            options={orderID}
            value={selectedOrderID}
            onChange={handleOrderIDChange}
            renderInput={(params) => (
              <TextField {...params} label="Mã đơn hàng" />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Autocomplete
            disablePortal
            options={date}
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} label="Ngày" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Autocomplete
            disablePortal
            options={month}
            value={selectedMonth}
            onChange={handleMonthChange}
            renderInput={(params) => <TextField {...params} label="Tháng" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Autocomplete
            disablePortal
            options={year}
            value={selectedYear}
            onChange={handleYearChange}
            renderInput={(params) => <TextField {...params} label="Năm" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Autocomplete
            disablePortal
            options={status}
            value={selectedStatus}
            onChange={handleStatusChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Trạng thái"
                style={{ minWidth: "200px" }}
              />
            )}
          />
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>
              <Checkbox
                checked={selectedOrders.length === orders.length}
                onChange={() => {
                  const allSelected = selectedOrders.length === orders.length;
                  setSelectedOrders(
                    allSelected ? [] : orders.map((order) => order.id)
                  );
                }}
              />
            </TableCell>
            <TableCell>
              <strong>Mã đơn hàng</strong>
              <TableSortLabel
                active={sortConfig.key === "orderID"}
                direction={
                  sortConfig.key === "orderID" ? sortConfig.direction : "asc"
                }
                onClick={() => sortData("orderID")}
              />
            </TableCell>
            <TableCell>
              <strong>Loại hàng</strong>
              <TableSortLabel
                active={sortConfig.key === "type"}
                direction={
                  sortConfig.key === "type" ? sortConfig.direction : "asc"
                }
                onClick={() => sortData("type")}
              />
            </TableCell>
            <TableCell>
              <strong>Cân nặng</strong>
              <TableSortLabel
                active={sortConfig.key === "weight"}
                direction={
                  sortConfig.key === "weight" ? sortConfig.direction : "asc"
                }
                onClick={() => sortData("weight")}
              />
            </TableCell>
            {/*<TableCell>
              <strong>Từ điểm giao dịch</strong>
              <TableSortLabel
                active={sortConfig.key === "transactionPoint"}
                direction={
                  sortConfig.key === "transactionPoint"
                    ? sortConfig.direction
                    : "asc"
                }
                onClick={() => sortData("transactionPoint")}
              />
            </TableCell>*/}
            <TableCell>
              <strong>Ngày gửi</strong>
              <TableSortLabel
                active={sortConfig.key === "regisDate"}
                direction={
                  sortConfig.key === "regisDate" ? sortConfig.direction : "asc"
                }
                onClick={() => sortData("regisDate")}
              />
            </TableCell>
            <TableCell>
              <strong>Chi tiết</strong>
            </TableCell>
            <TableCell>
              <strong>Trạng thái</strong>
              <TableSortLabel
                active={sortConfig.key === "status"}
                direction={
                  sortConfig.key === "status" ? sortConfig.direction : "asc"
                }
                onClick={() => sortData("status")}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getSortedData(filteredOrders).map((order) => (
            <TableRow
              key={order.id}
              sx={{
                backgroundColor:
                  order.status === "Đã tạo đơn" ? "#e8f5e9" : "inherit",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleCheckboxChange(order.id)}
                />
              </TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.type}</TableCell>
              <TableCell>{order.weight}</TableCell>
              
              <TableCell>{order.regisDate || ""}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => clickDetailOrder(order)}
                  style={{ color: "#4CAF50" }}
                >
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={2} mb={2}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#4CAF50", color: "#fff" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#003e29")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          onClick={clickCreateShipment}
        >
          Tạo đơn
        </Button>
      </Box>

      <ShipmentDialog
        open={openCreateShipment}
        onClose={closeCreateShipment}
        onConfirm={handleConfirmShipment}
        selectedOrders={selectedOrders}
        orders={orders}
        shipment={shipment}
        setShipment={setShipment}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Đã tạo đơn chuyển thành công"
      />

      <OrderDetailsDialog
        open={openDetailsOrder}
        onClose={closeDetailsOrder}
        selectedOrderDetails={selectedOrderDetails}
      />
      
    </Container>
  );
};

export default TransToTK;

