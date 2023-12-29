import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Box,
  TableSortLabel,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import VisibilityIcon from "@mui/icons-material/Visibility";
import Pagination from '@mui/material/Pagination';
import ShipmentDetailsDialog from "../Dialog/ShipmentDetailsDialog";
import OrderDetailsDialog from "../Dialog/OrderDetailsDialog";
import ShipmentTable from "../Table/ShipmentTable";
import Buttonme from "../Buttonme/Buttonme";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB, updateDataFromFireStoreAndDexie, updateDataFromDexieTable, addDataToFireStoreAndDexie, addDataToDexieTable, syncDexieToFirestore } from "../../database/cache";
import { AutocompleteInput, changeDateForm, formatDeliveryTime } from "../utils";

function createData({
  id,
  date,
  counts,
  ordersList,
  startGDpoint,
  startTKpoint,
  endTKpoint,
  endGDpoint,
  startGDpointName,
  startTKpointName,
  endTKpointName,
  endGDpointName,
  status
}) {
  return {
    id,
    date: changeDateForm(date),
    counts,
    ordersList,
    startGDpoint,
    startTKpoint,
    endTKpoint,
    endGDpoint,
    startGDpointName,
    startTKpointName,
    endTKpointName,
    endGDpointName,
    status,
  };
}

const GDConfirm = () => {
  const dataShipments = useLiveQuery(() =>
    dexieDB
      .table("shipment")
      .filter((item) => item.startTKpoint === 'TK01' && item.startGDpoint !== 0)
      .toArray()
  );
  const GDSystem = useLiveQuery(() =>
    dexieDB
      .table("GDsystem")
      .toArray());
  const GDVacc = useLiveQuery(() =>
    dexieDB
      .table("GDVacc")
      .toArray());
  const dataOrders = useLiveQuery(() =>
    dexieDB
      .table("orders")
      .filter((item) => item.startTKpoint === 'TK01' && item.startGDpoint !== 0)
      .toArray()
  )
  const [shipments, setShipments] = useState([]);
  useEffect(() => {
    if (GDSystem && dataShipments) {
      // Tạo map từ GDSystem
      const GDSystemNameMap = new Map(
        GDSystem.map(item => [item.id, item.name])
      );
      // Cập nhật shipments dựa trên map
      const updatedShipments = dataShipments.map(shipment => {
        const _startGDpointName = GDSystemNameMap.get(shipment.startGDpoint);
        // console.log("startGPO", _startGDpointName, " ", shipment.startGDpoint);
        return ({
          ...createData(shipment),
          startGDpointName: _startGDpointName,
        });
      });
      setShipments(updatedShipments);
    }
  }, [GDSystem, dataShipments]);

  const [openDetailsShipment, setOpenDetailsShipment] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [selectedGDpoint, setSelectedGDpoint] =
    useState(null);
  const [selectedShipmentID, setSelectedShipmentID] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentShipment, setCurrentShipment] = useState(null);

  const clickDetailsShipment = (shipment) => {
    if (shipment) {
      setCurrentShipment(shipment);
      setOpenDetailsShipment(true);
    } else {
      console.log('Attempted to open details for a null shipment');
    }
  };

  const closeDetailsShipment = () => {
    setOpenDetailsShipment(false);
    setCurrentShipment(null);
  };

  const clickDetailOrder = (order) => {
    setSelectedOrderDetails(order);
    setOpenDetailsOrder(true);
  };
  const closeDetailsOrder = () => {
    setOpenDetailsOrder(false);
  };
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [openDetailsOrder, setOpenDetailsOrder] = useState(false);

  const handleCheckboxChange = (params) => {
    const newSelectedShipments = selectedShipments.includes(params)
      ? selectedShipments.filter((id) => id !== params)
      : [...selectedShipments, params];

    setSelectedShipments(newSelectedShipments);
  };

  async function getShipmentDetailsById(shipmentID) {
    const shipment = dataShipments.find(s => s.id === shipmentID);
    if (shipment) {
      // Nếu tìm thấy shipment, trả về dữ liệu sau khi đã chuyển đổi
      return shipment;
    } else {
      // Nếu không tìm thấy shipment, trả về null hoặc thông báo lỗi
      console.log(`Không tìm thấy shipment với ID: ${shipmentID}`);
      return null;
    }
  }

  const handleConfirmShipment = async () => {
    try {
      // Cập nhật state frontend
      const updatedShipments = shipments.map((shipment) =>
        selectedShipments.includes(shipment.id) && shipment.status === "chưa xác nhận"
          ? { ...shipment, status: "đã xác nhận" }
          : shipment
      );
      setShipments(updatedShipments);
      setSelectedShipments([]);
  
      // 1. Update shipment status in DexieDB (concurrently)
      const updateShipmentPromises = selectedShipments.map(async (shipmentID) => {
        if (updateShipmentPromises.status !== undefined)
        await dexieDB.shipment.put({ id: shipmentID, status: "đã xác nhận" });
      });
      await Promise.all(updateShipmentPromises);
  
      // 2. Update order histories in DexieDB (flattened promises for parallel execution)
      const updateHistoriesPromises = selectedShipments.flatMap(async (shipmentID) => {
        const shipment = await getShipmentDetailsById(shipmentID);
        if (!shipment || !shipment.ordersList) return [];
  
        return shipment.ordersList.split(",").map(async (orderId) => {
          const historyId = `${orderId}_2`;
          if (updateHistoriesPromises.orderStatus !== undefined)
          await dexieDB.orderHistory.put({ id: historyId, orderStatus: "Đã xác nhận" });
        });
      });
      await Promise.all(updateHistoriesPromises);
  
      // 3. Sync updated data to Firestore (in the background)
      syncDexieToFirestore("shipment", "shipment", ["status"])
        .catch(error => console.error("Error syncing shipments to Firestore:", error));
      syncDexieToFirestore("orderHistory", "orderHistory", ["orderStatus"])
        .catch(error => console.error("Error syncing order histories to Firestore:", error));
    } catch (error) {
      console.error("Error updating shipments and order histories:", error);
    }
  }
  

  const GDpoints = [
    { label: "Ba Đình" },
    { label: "Biên Hòa" },
    { label: "Bình Thạnh" },
    { label: "Buôn Ma Thuột" },
    { label: "Cầu Giấy" },
    { label: "Dĩ An" },
    { label: "Đống Đa" },
    { label: "Hai Bà Trưng" },
    { label: "Hải Châu" },
    { label: "Hoàn Kiếm" },
    { label: "Hồng Bàng" },
    { label: "Liên Chiểu" },
    { label: "Ngô Quyền" },
    { label: "Nha Trang" },
    { label: "Ninh Kiều" },
    { label: "Quy Nhơn" },
    { label: "Tân Bình" },
    { label: "Thanh Xuân" },
    { label: "Thủ Dầu Một" },
    { label: "Thủ Đức" },
    { label: "Vũng Tàu" },
    { label: "Sơn Trà" },
    { label: "Thanh Khê" },
    { label: "Tây Hồ" },
    { label: "Cẩm Lệ" },
    { label: "Bắc Từ Liêm" },
    { label: "Sơn Tây" },
    { label: "Quỳnh Phụ" },
    { label: "Tam Dương" },
    { label: "Hương Sơn" },
    { label: "Kinh Môn" },
    { label: "Tứ Kỳ" },
    { label: "Lập Thạch" },
    { label: "Sông Lô" },
    { label: "Phổ Yên" },
    { label: "Sơn Tịnh" },
    { label: "Yên Khánh" },
    { label: "Thuận Bắc" },
    { label: "Tiền Hải" },
    { label: "Tam Điệp" },
    { label: "Cẩm Xuyên" },
    { label: "Nam Sách" },
    { label: "Hồng Lĩnh" },
    { label: "Đồng Hỷ" },
    { label: "Hương Thủy" },
    { label: "Tư Nghĩa" },
    { label: "Yên Mô" },
    { label: "Phong Điền" },
    { label: "Hương Trà" },
    { label: "Ninh Hải" },
    { label: "Ninh Giang" },
    { label: "Bình Xuyên" },
    { label: "Bình Sơn" },
    { label: "Vĩnh Tường" },
    { label: "Đông Hưng" },
    { label: "Kim Sơn" },
    { label: "Từ Sơn" },
    { label: "Định Hóa" },
    { label: "Phú Bình" },
    { label: "Ninh Sơn" },
    { label: "Quế Võ" },
    { label: "Thái Thụy" },
    { label: "Trà Bồng" },
  ];
  const shipmentIDList = shipments.map(shipment => ({ label: shipment.id }));
  const status = [
    { label: "đã xác nhận" },
    { label: "chưa xác nhận" },
  ];
  const year = [
    { label: 2023 },
    { label: 2022 },
    { label: 2021 },
    { label: 2020 },
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

  const handleShipmentIDChange = (event, value) => {
    setSelectedShipmentID(value);
  }
  const handleGDpointChange = (event, value) => {
    setSelectedGDpoint(value);
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


  const filteredShipments = shipments.filter((shipment) => {
    const formattedDeliveryTime = formatDeliveryTime(shipment.date);
    return (
      (!selectedShipmentID ||
        shipment.id === selectedShipmentID.label) &&
      (!selectedGDpoint ||
        ((shipment.startGDpointName) && (shipment.startGDpointName === selectedGDpoint.label))) &&
      (!selectedDate || formattedDeliveryTime.getDate() === parseInt(selectedDate.label)) &&
      (!selectedMonth || formattedDeliveryTime.getMonth() + 1 === parseInt(selectedMonth.label)) &&
      (!selectedYear || formattedDeliveryTime.getFullYear() === parseInt(selectedYear.label)) &&
      (!selectedStatus || (shipment.status === selectedStatus.label))
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
    <Container>
      <Box sx={{ paddingTop: '20px' }}>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: 'darkgreen', marginBottom: '20px' }}>
          Xác nhận đơn hàng từ điểm giao dịch
        </Typography>
        <Grid container spacing={1} sx={{ marginBottom: '10px' }}>
          {[
            { label: "Đơn chuyển hàng", options: shipmentIDList, value: selectedShipmentID, onChange: handleShipmentIDChange },
            { label: "Điểm giao dịch", options: GDpoints, value: selectedGDpoint, onChange: handleGDpointChange },
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
          <TableRow style={{ backgroundColor: '#f5f5f5' }} >
            <TableCell>
              <Checkbox
                checked={selectedShipments.length === filteredShipments.length}
                onChange={() => {
                  const allSelected = selectedShipments.length === filteredShipments.length;
                  setSelectedShipments(allSelected ? [] : filteredShipments.map((shipment) => shipment.id));
                }}
              />
            </TableCell >
            <TableCell>
              <strong>Mã đơn chuyển hàng</strong>
              <TableSortLabel
                active={sortConfig.key === 'id'}
                direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('id')}
              />
            </TableCell>
            <TableCell>
              <strong>Thời gian chuyển đến</strong>
              <TableSortLabel
                active={sortConfig.key === 'date'}
                direction={sortConfig.key === 'date' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('date')}
              />
            </TableCell>
            <TableCell>
              <strong>Số lượng</strong>
              <TableSortLabel
                active={sortConfig.key === 'counts'}
                direction={sortConfig.key === 'counts' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('counts')}
              />
            </TableCell>
            <TableCell>
              <strong>Từ điểm giao dịch</strong>
              <TableSortLabel
                active={sortConfig.key === 'startGDpointName'}
                direction={sortConfig.key === 'startGDpointName' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('startGDpointName')}
              />
            </TableCell>
            <TableCell>
              <strong>Chi tiết</strong>
            </TableCell>
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
          {getSortedData(filteredShipments)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((shipment) => (
              <TableRow
                key={shipment.id}
                sx={{
                  backgroundColor: shipment.status === "đã xác nhận" ? "#e8f5e9" : "inherit",
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedShipments.includes(shipment.id)}
                    onChange={() => handleCheckboxChange(shipment.id)}
                  />
                </TableCell>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.date}</TableCell>
                <TableCell>{shipment.counts}</TableCell>
                <TableCell>{shipment.startGDpointName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => clickDetailsShipment(shipment)} style={{ color: '#4CAF50' }}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{shipment.status}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
        <Pagination
          count={Math.ceil(filteredShipments.length / rowsPerPage)}
          page={page + 1}
          onChange={(event, newPage) => setPage(newPage - 1)}
        />
      </Box>

      <Box mt={2} mb={2}>
        <Buttonme content="Xác nhận" onClick={handleConfirmShipment} />
      </Box>

      <ShipmentDetailsDialog
        open={openDetailsShipment}
        onClose={closeDetailsShipment}
        shipment={currentShipment}
        orders={dataOrders}
        staff={GDVacc}
        clickDetailOrder={clickDetailOrder}
      />

      <OrderDetailsDialog
        open={openDetailsOrder}
        onClose={closeDetailsOrder}
        orders={selectedOrderDetails}
      />

    </Container>
  );
};

export default GDConfirm;