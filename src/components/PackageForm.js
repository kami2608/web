import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, FormLabel } from "@mui/material";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import { useEffect, useRef } from "react";
/*import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
//import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
//mport TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import RegisteredPackages from '../components/Tables/RegisteredPackages';*/
import {
  dexieDB,
  addDataToFireStoreAndDexie,
  addDataToDexieTable,
} from "../database/cache";
import { fireDB } from "../database/firebase";
import {
  doc,
  setDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AppP from "./Print";

export default function PackageForm() {
  const center = "GD10";
  const diemTK = "TK01";

  const defaultForm = {
    id: "",
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    type: "",
    weight: "",
    cost: "",
    startGDpoint: center,
    startTKpoint: diemTK,
    endTKpoint: "",
    endGDpoint: "",
  };
  const [inputs, setInputs] = useState(defaultForm);
  const [distance, setDistance] = useState("");
  const [regisDate, setRegisDate] = useState("");
  const [view, setView] = useState("Create");


  const genId = async () => {
    try {
      const lastRecord = await dexieDB.orders
      .reverse()
      .first();
     
      const stt = lastRecord ? parseInt(lastRecord.id.substring(2)) : 600;
      const newId = `DH${(stt+1).toString().padStart(3, "0")}`;
      setInputs((values) => ({ ...values, id: newId }));
    } catch (error) {
      console.error("Lỗi khi lấy số lượng bản ghi: ", error);
    }
    //Đọc trong firestore
    /*try {
      // Đọc tất cả các đơn hàng để lấy id của đơn hàng cuối cùng
      const ordersCollection = collection(fireDB, "orders");
      const querySnapshot = await getDocs(ordersCollection);

      // Tìm id cuối cùng
      let lastOrderId = "";
      querySnapshot.forEach((doc) => {
        const orderId = doc.id;
        lastOrderId = orderId;
      });

      // Tăng giá trị của id lên 1
      const stt = parseInt(lastOrderId.substring(2)) + 1;
      const newId = `DH${stt.toString().padStart(3, "0")}`;
      setInputs((values) => ({ ...values, id: newId }));
    } catch (error) {
      console.log("Lỗi khi tạo id đơn hàng", error);
    }*/
  };
  useEffect(() => {
    genId();
    return;
  }, [view]);

  
  const handleBack = () => {
    setView("Create");
    setInputs(defaultForm);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const calculateCost = (weight, distance) => {
    if (isNaN(weight) || isNaN(distance)) return "";
    else return weight * distance * 10000;
  };

  const handleDateChange = (event) => {
    setRegisDate(event.target.value);
  };

  const handleWeightChange = (event) => {
    const newWeight = event.target.value;
    setInputs((values) => ({ ...values, weight: newWeight }));
    setInputs((values) => ({
      ...values,
      cost: calculateCost(newWeight, distance),
    }));
  };

  const handleReceiverAddressChange = (event) => {
    setDistance(Math.floor(Math.random() * 5) + 1);
    setInputs((values) => ({
      ...values,
      cost: Math.round(calculateCost(inputs.weight, distance)),
    }));

    const reAddr = event.target.value;
    setInputs((values) => ({ ...values, receiverAddress: reAddr }));
    const splitAddr = reAddr.split(", ");
    if (splitAddr.length >= 2) {
      let city = splitAddr[splitAddr.length - 1];
      let district = splitAddr[splitAddr.length - 2];
  
      dexieDB.GDsystem.where("name")
        .equals(district)
        .first()
        .then((record) => {
          if (record) {
            setInputs((values) => ({ ...values, endGDpoint: record.id }));
          }
        });
      dexieDB.TKsystem.where("name")
        .equals(city)
        .first()
        .then((record) => {
          if (record) {
            setInputs((values) => ({ ...values, endTKpoint: record.id }));
          }
        });
  
    }
    
    
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    //Đưa weight và cost về dạng số
    let w = parseFloat(inputs.weight);
    let c = parseInt(inputs.cost);
    if (isNaN(w)) w = 0;
    if (isNaN(c)) c = 0;

    const submit = async () => {
      try {
        const newData = {
          ...inputs,
          //id,
          weight: w,
          cost: c,
          status: "Chưa xử lý",
        };
        //Thêm vào bảng orders trong FireStore
        const docRef = doc(fireDB, "orders", newData.id);
        setDoc(docRef, newData);
      
        //Thêm vào bảng orders trong dexie và firestore
        addDataToDexieTable("orders", {...newData, regisDate});

        //setInputs(defaultForm);
      } catch (error) {
        console.error("Loi khi add order trong fireDB:", error);
        alert("Loi khi add order trong fireDB");
      }

      //Thêm vào orderHistory trong firestore
      try {
        const orderHistory1 = {
          historyID: inputs.id + "_1",
          orderId: inputs.id,
          date: regisDate,
          currentLocation: center,
          orderStatus: "Đang chờ xử lý",
          Description: "Đơn hàng nhận tại điểm giao dịch " + center,
        };
        
        const docRef1 = doc(fireDB, "orderHistory", orderHistory1.historyID);
        setDoc(docRef1, orderHistory1);

        addDataToDexieTable("orderHistory", {...orderHistory1, id: inputs.id + "_1"});


        alert("Tạo đơn hàng thành công");
        setView("Print");
        //setInputs(defaultForm);
      } catch (error) {
        console.log("Lỗi khi tạo đơn hàng");
      }
    };

    const formValidate = () => {
      let error = 0;
      if (
        inputs.senderName == "" ||
        inputs.senderPhone == "" ||
        inputs.senderAddress == "" ||
        inputs.receiverName == "" ||
        inputs.receiverPhone == "" ||
        inputs.receiverName == "" ||
        inputs.type == "" ||
        inputs.weight == "" ||
        inputs.weight == 0 ||
        inputs.endTKpoint == "" ||
        inputs.endGDpoint == "" ||
        regisDate == ""
      ) {
        alert("Vui lòng nhập đầy đủ thông tin");
        error = 1;
      }

      if (error === 0) submit();
    };

    formValidate();
  };

  

  return (
    <>
      {view === "Print" && <AppP onBack={handleBack} form={inputs} />}
      {view === "Create" && (
        <>
          <h1> Ghi nhận bưu gửi của khách</h1>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
              flexGrow: 1,
              display: "inline",
              textAlign: "left",
            }}
            noValidate
            autoComplete="off"
          >
            
            <Stack direction="row" spacing={2}>
              <TextField
              required
              name="id"
              label="Mã đơn hàng"
              fullWidth
              value={inputs.id}
              onChange={handleChange}
              />
              <TextField
                required
                name="regisDate"
                type="date"
                fullWidth
                value={regisDate || ""}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InputLabel htmlFor="date">Ngày tạo</InputLabel>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
              
            </Stack>
            <Stack direction="row" spacing={2}>
            
            {/*Thông tin về 4 điểm GD/TK gửi nhận mà bưu gửi đi qua*/}
            <TextField
              required
              name="startGDpoint"
              label="Điểm giao dịch gửi"
              fullWidth
              value={inputs.startGDpoint}
              onChange={handleChange}
            />

            <TextField
              required
              name="startTKpoint"
              label="Điểm tập kết gửi"
              fullWidth
              value={inputs.startTKpoint}
              onChange={handleChange}
            />

            <TextField
              required
              name="endTKpoint"
              label="Điểm tập kết nhận"
              fullWidth
              value={inputs.endTKpoint}
              onChange={handleChange}
            />

            <TextField
              required
              name="endGDpoint"
              label="Điểm giao dịch nhận"
              fullWidth
              value={inputs.endGDpoint}
              onChange={handleChange}
            />
            </Stack>

            {/*Thông tin về người gửi*/}
            <h3>Thông tin người gửi</h3>
            <Stack direction="row" spacing={2}>
              <TextField
                required
                name="senderName"
                label="Họ tên"
                value={inputs.senderName}
                onChange={handleChange}
              />
              <TextField
                required
                name="senderPhone"
                label="Số điện thoại"
                value={inputs.senderPhone}
                onChange={handleChange}
              />
              <TextField
                required
                name="senderAddress"
                fullWidth
                label="Địa chỉ"
                value={inputs.senderAddress}
                onChange={handleChange}
              />
            </Stack>

            {/*Thông tin về người nhận*/}
            <div>
              <h3>Thông tin người nhận</h3>
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  name="receiverName"
                  label="Họ tên"
                  value={inputs.receiverName}
                  onChange={handleChange}
                />
                <TextField
                  required
                  name="receiverPhone"
                  label="Số điện thoại"
                  value={inputs.receiverPhone}
                  onChange={handleChange}
                />
                <TextField
                  required
                  name="receiverAddress"
                  fullWidth
                  label="Địa chỉ"
                  value={inputs.receiverAddress}
                  onChange={handleChange}
                  onBlur={handleReceiverAddressChange}
                />
              </Stack>
            </div>

            <div>
              <h3>Thông tin bưu gửi</h3>
              <Stack direction="row" spacing={2}>
                <FormControl
                  required
                  sx={{
                    display: "block",
                  }}
                >
                  <FormLabel>Loại bưu gửi</FormLabel>
                  <RadioGroup
                    row
                    name="type"
                    value={inputs.type}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Tài liệu"
                      control={<Radio />}
                      label="Tài liệu"
                    />
                    <FormControlLabel
                      value="Hàng hóa"
                      control={<Radio />}
                      label="Hàng hóa"
                    />
                  </RadioGroup>
                </FormControl>
                <TextField
                  required
                  name="weight"
                  label="Khối lượng"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">kg</InputAdornment>
                    ),
                  }}
                  value={inputs.weight}
                  onChange={handleWeightChange}
                />
                <TextField
                  required
                  name="cost"
                  label="Giá cước"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">VNĐ</InputAdornment>
                    ),
                    //readOnly: true,
                  }}
                  value={inputs.cost}
                  onChange={handleChange}
                />
              </Stack>
            </div>

            <Button variant="contained" onClick={handleSubmit}>
              Ghi nhận
            </Button>
          </Box>

          
        </>
      )}
    </>
  );
}



