import React, { useState, useEffect } from "react";
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
  IconButton,
  TextField,
  Box,
  Autocomplete,
  
  Tab,
  TableSortLabel,
  Grid,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeliveryDetailsDialog from "./DeliveryDetailsDialog";
import OrderDetailsDialog from "../OrderDetailsDialog";
import { dexieDB, updateDataFromFireStoreAndDexie } from "../../database/cache";
import { fireDB } from "../../database/firebase";
import { collection, doc, getDocs, getDoc, setDoc, query, where } from "firebase/firestore";


const DeliveryConfirm = () => {
  const center = "GD10";
  /*const fetchedDeliveryBills = [
    {
      id: "S246",
      createDate: "2023-05-20",
      counts: 1,
      startGDpoint: 0,
      startTKpoint: 0,
      endTKpoint: "TK01",
      endGDpoint: "GD01",
      details: "DH100",
    },
    {
      id: "S250",
      createDate: "2023-01-18",
      counts: 2,
      startGDpoint: 0,
      startTKpoint: 0,
      endTKpoint: "TK01",
      endGDpoint: "GD03",
      details: "DH113, DH114",
    },
    {
      id: "S251",
      createDate: "2023-03-19",
      counts: 1,
      startGDpoint: 0,
      startTKpoint: 0,
      endTKpoint: "TK01",
      endGDpoint: "GD03",
      details: "DH217",
    },
    {
      id: "S254",
      createDate: "2023-08-06",
      counts: 3,
      startGDpoint: 0,
      startTKpoint: 0,
      endTKpoint: "TK01",
      endGDpoint: "GD04",
      details: "DH130, DH131, DH132",
    },
  ];
  const displayDeliveryBills = fetchedDeliveryBills.map((bill) => ({
    ...bill,
    status: "Chưa xác nhận",
  }));*/

  const [deliveryBills, setDeliveryBills] = useState([]);
  const [openDetailsDelivery, setOpenDetailsDelivery] = useState(false); //quản lý trạng thái dialog DeliveryDetails
  const [selectedDeliveryBills, setSelectedDeliveryBills] = useState([]);
  const [selectedDeliveryDetails, setSelectedDeliveryDetails] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [filterByID, setFilterByID] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);


  const getDeliveryBills = async() => {
    const deliRef = collection(fireDB, "delivery");
    const q = query(deliRef, where('Gdpoint', '==', center), 
              where('status', '==', 'chưa xác nhận'));
    const querySnapshot = await getDocs(q);
    const fetchedDelis = [];
    querySnapshot.forEach((doc) => {
      fetchedDelis.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    for (let i=0; i<fetchedDelis.length; i++) {
      const orderIdArray = /*(shipmentDetails != null) ? */fetchedDelis[i].details.split(", ").map(id => id.trim());
      fetchedDelis[i].orderIdArray = orderIdArray;
    }
    setDeliveryBills(fetchedDelis);
    console.log(deliveryBills);
  }

  useEffect(() => {
    console.log("getDeli:");
    getDeliveryBills();
  }, []);

  //Sự kiện Xem chi tiết đơn chuyển; Nhấn VisibilityIcon
  const clickDetailsDelivery = (deliveryDetails) => {
    //Lấy thông tin order trong đơn giao hàng
    async function getOrdersByIdArray(orderIdArray) {
      try {
        // Mở kết nối đến cơ sở dữ liệu
       // await dexieDB.open();
    
        // Thực hiện truy vấn để lấy đơn hàng có id thuộc mảng orderIdArray
        const data = await dexieDB.orders
          .where('id')
          .anyOf(orderIdArray)
          .toArray();
    
        console.log('Đơn hàng có id thuộc mảng orderIdArray:', data);
        const newDeliDetails = {
          ...deliveryDetails,
          orders: data,
        }

        setSelectedDeliveryDetails(newDeliDetails);
        const newDelis = deliveryBills.map(obj => 
          (obj.id === deliveryDetails.id) ? newDeliDetails : obj) ;
  
        //console.log("Mảng newDelis: ", newDelis);
        // Cập nhật state với mảng mới
        setDeliveryBills(newDelis);
        //console.log("selectedDeliDetails", selectedDeliveryDetails);
        //console.log("Mảng deli", deliveryBills);
       
      } catch (error) {
        console.error('Lỗi khi truy vấn đơn hàng:', error);
      } 
    }
    if (deliveryDetails.orders == undefined) {
      getOrdersByIdArray(deliveryDetails.orderIdArray);
    } else {
      setSelectedDeliveryDetails(deliveryDetails);
      //console.log("ko cần dexie")
    }
    setOpenDetailsDelivery(true);
  };

  const closeDetailsDelivery = () => {
    setOpenDetailsDelivery(false);
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
    const newSelectedDeliveryBills = selectedDeliveryBills.includes(params.id)
      ? selectedDeliveryBills.filter((id) => id !== params.id)
      : [...selectedDeliveryBills, params.id];
    setSelectedDeliveryBills(newSelectedDeliveryBills);
    console.log("Đơn giao hàng đc chọn: ", selectedDeliveryBills);

    const orderArray = params.orderIdArray;
    const newSelectedOrders = selectedOrders.includes(orderArray[0])
      ? selectedOrders.filter((id) => !orderArray.includes(id))
      : [...selectedOrders, ...orderArray];
    setSelectedOrders(newSelectedOrders);
    console.log("Các DH đc chọn: ", selectedOrders);
  };

  // 2 hàm xử lý giao thành công/ không thành công
  const handleConfirmDelivery = async() => {
    if (selectedDeliveryBills.length > 0) {
      await submit(true);
    }
    const updatedDelis = deliveryBills.map(deli =>
      selectedDeliveryBills.includes(deli.id) ? { ...deli, status: "thành công" } : deli
    );
    setDeliveryBills(updatedDelis);

    setSelectedDeliveryBills([]);
    setSelectedOrders([]);
  };

  const handleUnsuccessfulDelivery = async() => {
    if (selectedDeliveryBills.length > 0) {
      await submit(false);
    }
    const updatedDelis = deliveryBills.map(deli =>
      selectedDeliveryBills.includes(deli.id) ? { ...deli, status: "không thành công" } : deli
    );
    setDeliveryBills(updatedDelis);
    setSelectedDeliveryBills([]);
    setSelectedOrders([]);
  }

  //Ghi vào CSDL
  const submit = async(isSuccess) => {
    const msg = isSuccess ? "thành công" : "không thành công"
    try {
      for (let i=0; i<selectedDeliveryBills.length; i++) {
        //cập nhật bảng delivery trong firestore
        const newData = {
          status: msg,
        }
        const docRef = doc(fireDB, "delivery", selectedDeliveryBills[i]);
        setDoc(docRef, newData, {merge: true});
        updateDataFromFireStoreAndDexie("delivery", selectedDeliveryBills[i], newData);
      }
      

      for (let i = 0; i < selectedOrders.length; i++) {
        //update dexie bảng orders
        await dexieDB.table("orders")
          .where("id")
          .equals(selectedOrders[i])
          .modify((order) => {
            order.status = "Đã giao" + msg + " cho người nhận";
          })

        //update bảng orderHistory trong firestore

        /*const docRef = doc(fireDB, "orderHistory", selectedOrders[i]+"_5");
        //const querySnapshot = getDoc(docRef);*/
        const newHistoryData = {
          
          currentLocation: "",
          orderStatus: "Đã giao" + msg + " cho người nhận",
          Description: "Đã giao" + msg + " cho người nhận",
        }
        updateDataFromFireStoreAndDexie("orderHistory", selectedOrders[i]+"_5", 
        newHistoryData);
      }
      alert ("Đã xác nhận đơn giao " + msg);
      
    } catch (error) {
      console.error('Loi khi xác nhận giao hàng:', error);
    }   
  };

  
  const deliveryID = deliveryBills.map((b) => ({ label: b.id }));
  const status = [{ label: "Chưa xác nhận" }, { label: "Thành công" }, { label: "Không thành công" }];
  const year = [
    { label: 2020 },
    { label: 2021 },
    { label: 2022 },
    { label: 2023 },
  ];
  const createArray = (start, end) => {
    let array = [];
    for (let i = start; i <= end; i++) {
      let object = { label: i.toString() };
      array.push(object);
    }
    return array;
  };
  const month = createArray(1, 12);
  const date = createArray(1, 31);

  /*  const handleTransactionPointChange = (event, value) => {
    setSelectedTransactionPoint(value);
  };*/

  const handleDeliveryIDChange = (event, value) => {
    setFilterByID(value);
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

  const formatTime = (time) => {
    if (time) {
      const [date, month, year] = time.split("/");
      return new Date(`${year}-${month}-${date}`);
    }
    return "";
  };

  // Các delivery thỏa mãn bộ lọc
  const filteredDeliveryBills = deliveryBills.filter((delivery) => {
    const formattedDate = formatTime(delivery.createDate);

    return (
      (!filterByID || 
        delivery.id === filterByID.label) &&
      (!selectedDate ||
        formattedDate.getDate() === parseInt(selectedDate.label)) &&
      (!selectedMonth ||
        formattedDate.getMonth() + 1 === parseInt(selectedMonth.label)) &&
      (!selectedYear ||
        formattedDate.getFullYear() === parseInt(selectedYear.label)) &&
      (!selectedStatus ||
        delivery.status === selectedStatus.label
      ))
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
    <Container>
      <h2>Xác nhận giao hàng</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2} lg={2}>
        
          <Autocomplete
            disablePortal
            options={deliveryID}
            value={filterByID}
            onChange={handleDeliveryIDChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Đơn giao hàng"
              />
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
                checked={selectedDeliveryBills.length === deliveryBills.length}
                onChange={() => {
                  const allSelected =
                    selectedDeliveryBills.length === deliveryBills.length;
                  setSelectedDeliveryBills(
                    allSelected
                      ? []
                      : deliveryBills.map((delivery) => delivery.id)
                  );
                  setSelectedOrders(
                    allSelected
                      ? []
                      : [].concat(...deliveryBills.map(deli => deli.orderIdArray))
                  )
                  console.log("Đơn chuyển được chọn: ", selectedDeliveryBills);
                  console.log("Các DH được chọn: ", selectedOrders);
                }}
              />
            </TableCell>
            <TableCell>
              <strong>Mã đơn giao hàng</strong>
              <TableSortLabel
                active={sortConfig.key === "id"}
                direction={
                  sortConfig.key === "id" ? sortConfig.direction : "asc"
                }
                onClick={() => sortData("id")}
              />
            </TableCell>
            <TableCell>
              <strong>Số lượng</strong>
              <TableSortLabel
                active={sortConfig.key === "counts"}
                direction={
                  sortConfig.key === "counts" ? sortConfig.direction : "asc"
                }
                onClick={() => sortData("counts")}
              />
            </TableCell>
            <TableCell>
              <strong>Ngày</strong>
              <TableSortLabel
                active={sortConfig.key === "createDate"}
                direction={
                  sortConfig.key === "createDate" ? sortConfig.direction : "asc"
                }
                onClick={() => sortData("createDate")}
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
          {getSortedData(filteredDeliveryBills).map((delivery) => (
            <TableRow
              key={delivery.id}
              sx={{
                backgroundColor:
                  delivery.status === "Đã xác nhận" ? "#e8f5e9" : "inherit",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedDeliveryBills.includes(delivery.id)}
                  onChange={() => handleCheckboxChange(delivery)}
                />
              </TableCell>
              <TableCell>{delivery.id}</TableCell>

              <TableCell>{delivery.counts}</TableCell>
              <TableCell>{delivery.createDate}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => clickDetailsDelivery(delivery)}
                  style={{ color: "#4CAF50" }}
                >
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
              <TableCell>{delivery.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

     

      <Box mt={2} mb={2}>
        <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#4CAF50", color: "#fff" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#003e29")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          onClick={handleConfirmDelivery}
        >
          Giao thành công
        </Button>

        <Button
          variant="contained"
          style={{ backgroundColor: "#4CAF50", color: "#fff" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#003e29")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          onClick={handleUnsuccessfulDelivery}
        >
          Giao không thành công
        </Button>
        </Stack>
      </Box>

      

      <DeliveryDetailsDialog
        open={openDetailsDelivery}
        onClose={closeDetailsDelivery}
        deliveryDetails={selectedDeliveryDetails}
        clickDetailOrder={clickDetailOrder}
      />
      <OrderDetailsDialog
        open={openDetailsOrder}
        onClose={closeDetailsOrder}
        selectedOrderDetails={selectedOrderDetails}
      />
    </Container>
  );
};

export default DeliveryConfirm;
