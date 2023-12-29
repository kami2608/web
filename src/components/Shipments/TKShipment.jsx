// Đơn chuyển hàng từ điểm tâp kết gửi đến điểm tập kết nhận startTKpoint -> endTKpoint
import React, { useState, useEffect } from "react";
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
  Pagination
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShipmentDialog from "../Dialog/ShipmentDialog";
import OrderDetailsDialog from "../Dialog/OrderDetailsDialog";
import Buttonme from "../Buttonme/Buttonme";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB, updateDataFromFireStoreAndDexie, addDataToDexieTable, syncDexieToFirestore, updateDataFromDexieTable, addDataToFireStoreAndDexie } from "../../database/cache";
import { changeDateForm, changeDateForm2, AutocompleteInput, formatDeliveryTime } from "../utils";

function createDataOrder({
  id,
  date,
  type,
  weight,
  senderName,
  senderPhone,
  senderAddress,
  receiverName,
  receiverPhone,
  receiverAddress,
  cost,
  startGDpoint,
  startTKpoint,
  endTKpoint,
  endGDpoint,
  startGDpointName,
  startTKpointName,
  endTKpointName,
  endGDpointName,
  status,
  orderStatus,
}) {
  return {
    id,
    date,
    type,
    weight,
    senderName,
    senderPhone,
    senderAddress,
    receiverName,
    receiverPhone,
    receiverAddress,
    cost,
    startGDpoint,
    startTKpoint,
    endTKpoint,
    endGDpoint,
    startGDpointName,
    startTKpointName,
    endTKpointName,
    endGDpointName,
    status,
    orderStatus,
  };
}

const TKShipment = () => {
  const orderHistories = useLiveQuery(() =>
    dexieDB
      .table("orderHistory")
      .filter((item) => item.historyID.endsWith('2'))// && item.orderStatus === 'Đã xác nhận') // Lọc những orders đã được xác nhận chuyển từ startGDpoint -> startTKpoint
      .toArray()
  );

  const TKSystem = useLiveQuery(() =>
    dexieDB
      .table("TKsystem")
      .toArray()
  );

  const dataOrders = useLiveQuery(() =>
    dexieDB
      .table("orders")
      .filter((item) => item.startTKpoint === 'TK01' && item.endTKpoint !== 0)
      .toArray()
  );

  const dataShipments = useLiveQuery(() =>
    dexieDB
      .table("shipment")
      .filter((item) => item.startTKpoint === 'TK01' && item.endTKpoint !== 0)// && item.status === 'đã xác nhận') // startTKpoint -> endTKpoint
      .toArray()
  );

  const NVTKacc = useLiveQuery(() =>
    dexieDB
      .table("NVTKacc")
      .filter((row) => row.tk === "Hà Nội")
      .toArray());

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (orderHistories && dataOrders && TKSystem) {
      // Tạo map từ orderHistory
      const orderHistoryDateMap = new Map(
        orderHistories.map(item => [item.orderID, item.date])
      );
      // Tạo map từ TKSystem
      const TKSystemNameMap = new Map(
        TKSystem.map(item => [item.id, item.name])
      );
      // Cập nhật orders dựa trên dataOrders và map
      const updatedOrders = dataOrders.map(order => {
        const orderHistoryDate = orderHistoryDateMap.get(order.id);

        const newDate = new Date(orderHistoryDate);
        newDate.setDate(newDate.getDate() + 1);
        const _endTKpointName = TKSystemNameMap.get(order.endTKpoint);

        return {
          ...createDataOrder(order),
          endTKpointName: _endTKpointName,
          date: changeDateForm(orderHistoryDate),
          // date: changeDateForm(newDate.toISOString().slice(0, 10)), // Sau 1 ngày chuyển hàng thì mới nhận được hàng
        };
      }
      );
      setOrders(updatedOrders);
    }
  }, [orderHistories, dataOrders, TKSystem]);

  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openCreateShipment, setOpenCreateShipment] = useState(false);
  const [openDetailsOrder, setOpenDetailsOrder] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [selectedTKpoint, setSelectedTKpoint] =
    useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const clickDetailOrder = (order) => {
    setSelectedOrderDetails(order);
    setOpenDetailsOrder(true);
  };
  const closeDetailsOrder = () => {
    setOpenDetailsOrder(false);
  };
  const clickCreateShipment = () => {
    setOpenCreateShipment(true);
  };

  const handleConfirmShipment = async (shipmentID, shipmentDate) => {
    try {
      console.log("selcted orer", selectedOrders);
      //  Update the orders' status in DexieDB and local state
      const updatedOrders = orders.map(order => ({
        ...order,
        orderStatus: selectedOrders.includes(order.id) ? "Đã tạo đơn" : order.orderStatus
      }));

      // // Apply the updates to DexieDB
      await Promise.all(updatedOrders.map(order =>
        updateDataFromDexieTable('orders', order.id, { orderStatus: order.orderStatus })
      ));

      // Step 2: Create a new shipment 
      const newShipment = {
        id: shipmentID, //  generated ID from ShipmentDialog
        counts: selectedOrders.length,
        details: selectedOrders.map(orderId => ({ orderId })),
        startTKpoint: 'TK01',
        endTKpoint: orders.find(order => selectedOrders.includes(order.id))?.endTKpoint,
        date: shipmentDate
      };

      // // Add the new shipment to DexieDB and Firestore
      await addDataToFireStoreAndDexie("shipment", newShipment);

      // Step 3: UpdateorderHistory 
      for (const order of selectedOrders) {
        const historyId = `${order.id}_2`;
        const newOrderHistory = {
          historyID: historyId,
          orderID: order.id,
          currentLocation: order.endTKpoint,
          Description: "Chuyển đến điểm tập kết nhận",
          orderStatus: "Đã tạo đơn",
          date: shipmentDate,
        };
        console.log('Order history updated/created:', newOrderHistory);

        // // Update or create the order history in DexieDB and Firestore
        // await addDataToFireStoreAndDexie("orderHistory", newOrderHistory);
      }

      // // Sync dexieDB to firestore
      // syncDexieToFirestore("shipment", "shipment", Object.keys(newShipment));
      // syncDexieToFirestore("orderHistory", "orderHistory", [historyId]);

      // Mock or log the operations for testing
      console.log(`Updating orders in DexieDB for shipmentID: ${shipmentID} with date: ${shipmentDate}`);
      console.log(`Creating new shipment in DexieDB with ID: ${shipmentID}`);


      // Step 4: Set updated orders to the state
      setOrders(updatedOrders);

      // Reset UI state
      setSelectedOrders([]);
      setOpenCreateShipment(false);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating database: ", error);
    }
  };


  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const closeCreateShipment = () => {
    setOpenCreateShipment(false);
    setSelectedOrders([]);
  };

  const orderIDs = orders.map(order => ({ label: order.id }));
  const TKpoints = [
    { label: "Bà Rịa - Vũng Tàu" },
    { label: "Bắc Ninh" },
    { label: "Bình Định" },
    { label: "Bình Dương" },
    { label: "Cần Thơ" },
    { label: "Đà Nẵng" },
    { label: "Đắk Lắk" },
    { label: "Đồng Nai" },
    { label: "Hà Nội" },
    { label: "Hà Tĩnh" },
    { label: "Hải Dương" },
    { label: "Hải Phòng" },
    { label: "Hồ Chí Minh" },
    { label: "Huế" },
    { label: "Khánh Hòa" },
    { label: "Ninh Thuận" },
    { label: "Quảng Ngãi" },
    { label: "Thái Nguyên" },
    { label: "Vĩnh Phúc" },
    { label: "Ninh Bình" },
    { label: "Thái Bình" }
  ];

  const year = [
    { label: 2023 },
    { label: 2022 },
    { label: 2021 },
    { label: 2020 },
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

  const handleTKpointChange = (event, value) => {
    setSelectedTKpoint(value);
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
  const handleOrderIDChange = (event, value) => {
    setSelectedOrderID(value);
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prevSelectedOrders => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter(id => id !== orderId);
      } else {
        return [...prevSelectedOrders, orderId];
      }
    });
  };

  const filteredOrders = orders.filter((order) => {
    const formattedDeliveryTime = formatDeliveryTime(order.date);
    return (
      (!selectedOrderID || order.id === selectedOrderID.label) &&
      (!selectedTKpoint ||
        ((order.endTKpoint) && (order.endTKpointName === selectedTKpoint.label))) &&
      (!selectedDate || formattedDeliveryTime.getDate() === parseInt(selectedDate.label)) &&
      (!selectedMonth || formattedDeliveryTime.getMonth() + 1 === parseInt(selectedMonth.label)) &&
      (!selectedYear || formattedDeliveryTime.getFullYear() === parseInt(selectedYear.label)) &&
      (!selectedStatus || (order.orderStatus === selectedStatus.label))
    );
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // Sorting function
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'des';
    }
    setSortConfig({ key, direction });
  };
  const getSortedData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: '20px' }}>
        <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
          {[
            { label: "Mã đơn hàng", options: orderIDs, value: selectedOrderID, onChange: handleOrderIDChange },
            { label: "Điểm tập kết", options: TKpoints, value: selectedTKpoint, onChange: handleTKpointChange },
            { label: "Ngày", options: date, value: selectedDate, onChange: handleDateChange },
            { label: "Tháng", options: month, value: selectedMonth, onChange: handleMonthChange },
            { label: "Năm", options: year, value: selectedYear, onChange: handleYearChange },
            { label: "Trạng thái", options: status, value: selectedStatus, onChange: handleStatusChange, minWidth: '200px' },
          ].map((inputProps, index) => (
            <Grid item xs={12} sm={6} md={2} lg={2} key={index}>
              <AutocompleteInput {...inputProps} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>
              <Checkbox
                checked={selectedOrders.length === filteredOrders.length}
                onChange={() => {
                  const allSelected = selectedOrders.length === filteredOrders.length;
                  setSelectedOrders(allSelected ? [] : filteredOrders.map((order) => order.id));
                }}
              />
            </TableCell>
            <TableCell>
              <strong>Mã đơn hàng</strong>
              <TableSortLabel
                active={sortConfig.key === 'id'}
                direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('id')}
              />
            </TableCell>
            <TableCell>
              <strong>Thời gian</strong>
              <TableSortLabel
                active={sortConfig.key === 'date'}
                direction={sortConfig.key === 'date' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('date')}
              />
            </TableCell>
            <TableCell>
              <strong>Đến điểm tập kết</strong>
              <TableSortLabel
                active={sortConfig.key === 'endTKpointName'}
                direction={sortConfig.key === 'endTKpointName' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('endTKpointName')}
              />
            </TableCell>
            <TableCell><strong>Chi tiết</strong></TableCell>
            <TableCell>
              <strong>Trạng thái</strong>
              <TableSortLabel
                active={sortConfig.key === 'status'}
                direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('status')}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getSortedData(filteredOrders)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((order) => (
              <TableRow
                key={order.id}
                sx={{
                  backgroundColor: order.orderStatus === "Đã tạo đơn" ? "#e8f5e9" : "inherit",
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
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
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.endTKpointName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => clickDetailOrder(order)} style={{ color: '#4CAF50' }}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{order.orderStatus}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
        <Pagination
          count={Math.ceil(filteredOrders.length / rowsPerPage)}
          page={page + 1}
          onChange={(event, newPage) => setPage(newPage - 1)}
        />
      </Box>

      <Box mt={2} mb={2}>
        <Buttonme title="Tạo đơn" onClick={clickCreateShipment} />
      </Box>

      <ShipmentDialog
        open={openCreateShipment}
        onClose={closeCreateShipment}
        onConfirm={(shipmentID, shipmentDate) => handleConfirmShipment(shipmentID, shipmentDate)}
        orders={orders.filter(order => selectedOrders.includes(order.id))}
        NVTKacc={NVTKacc}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Đã tạo đơn thành công"
      />

      <OrderDetailsDialog
        open={openDetailsOrder}
        onClose={closeDetailsOrder}
        order={selectedOrderDetails}
      />

    </Container>

  );
}

export default TKShipment;