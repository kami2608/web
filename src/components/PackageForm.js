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
      const count = await dexieDB.orders.count();
      const newId = `DH${count.toString().padStart(3, "0")}`;
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
  }, [view])

  
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
      cost: calculateCost(inputs.weight, distance),
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
        const t = {//các trường ngoại trừ id
          orderId: inputs.id,
          date: 0,
          currentLocation: 0,
          orderStatus: 0,
          Description: 0,
        }

        const orderHistory1 = {
          historyID: inputs.id + "_1",
          orderId: inputs.id,
          date: regisDate,
          currentLocation: center,
          orderStatus: "Đang chờ xử lý",
          Description: "Đơn hàng nhận tại điểm giao dịch " + center,
        };
        const orderHistory2 = {
          ...t,
          historyID: inputs.id + "_2",
        };
        const orderHistory3 = {
          ...t,
          historyID: inputs.id + "_3",
        };
        const orderHistory4 = {
          ...t,
          historyID: inputs.id + "_4",
        };
        const orderHistory5 = {
          ...t,
          historyID: inputs.id + "_5",
        };

        const docRef1 = doc(fireDB, "orderHistory", orderHistory1.historyID);
        setDoc(docRef1, orderHistory1);
        const docRef2 = doc(fireDB, "orderHistory", orderHistory2.historyID);
        setDoc(docRef2, orderHistory2);
        const docRef3 = doc(fireDB, "orderHistory", orderHistory3.historyID);
        setDoc(docRef3, orderHistory3);
        const docRef4 = doc(fireDB, "orderHistory", orderHistory4.historyID);
        setDoc(docRef4, orderHistory4);
        const docRef = doc(fireDB, "orderHistory", orderHistory5.historyID);
        setDoc(docRef, orderHistory5);

        addDataToDexieTable("orderHistory", {...orderHistory1, id: inputs.id + "_1"});
        addDataToDexieTable("orderHistory", {...t, id: inputs.id + "_2"});
        addDataToDexieTable("orderHistory", {...t, id: inputs.id + "_3"});
        addDataToDexieTable("orderHistory", {...t, id: inputs.id + "_4"});
        addDataToDexieTable("orderHistory", {...t, id: inputs.id + "_5"});

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
                name="regisDate"
                type="date"
                size="small"
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
              
              {/*<TextField required 
              name="regisTime"
              type="time" 
              size="small" 
              value={inputs.regisTime || ""}
              onChange={handleChange}>
              </TextField>*/}
            </Stack>
            <Stack direction="row" spacing={2}>
            <TextField
              required
              name="id"
              label="Mã đơn hàng"
              value={inputs.id}
              onChange={handleChange}
            />
            {/*Thông tin về 4 điểm GD/TK gửi nhận mà bưu gửi đi qua*/}
            <TextField
              required
              name="startGDpoint"
              label="Điểm giao dịch gửi"
              value={inputs.startGDpoint}
              onChange={handleChange}
            />

            <TextField
              required
              name="startTKpoint"
              label="Điểm tập kết gửi"
              value={inputs.startTKpoint}
              onChange={handleChange}
            />

            <TextField
              required
              name="endTKpoint"
              label="Điểm tập kết nhận"
              value={inputs.endTKpoint}
              onChange={handleChange}
            />

            <TextField
              required
              name="endGDpoint"
              label="Điểm giao dịch nhận"
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
                  label="Giá trị hàng"
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

