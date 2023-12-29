import React from "react";
import {
    TextField,
    Autocomplete,
    Box,
    Grid
} from "@mui/material";
import { useState, useEffect } from "react";

export default function DetailFilter(props) {
    const [transactionPoint, setTransactionPoint] =
        useState([]);
    const [date, setDate] = useState([]);
    const [month, setMonth] = useState([]);
    const [year, setYear] = useState([]);
    const [status, setStatus] = useState([]);

    const createArray = (start, end) => {
        let array = [];
        for (let i = start; i <= end; i++) {
            let object = { label: i };
            array.push(object);
        }
        return array;
    };

    
    useEffect(() => {
        getDataForFilter();
    }, [])

    const getDataForFilter = async () => {
        let fakeData = {
            transactionPointList: [
                "Xuân Thủy",
                "Trần Quốc Hoàn",
                "Tô Hiệu",
                "Phạm Văn Đồng",
            ],
            months: createArray(1, 12),
            dates: createArray(1, 31),
            years: ["2020", "2021", "2022", "2023"],
            status: ["Đã xác nhận", "Chưa xác nhận"],
        }
        setTransactionPoint(fakeData.transactionPointList);
        setDate(fakeData.dates);
        setMonth(fakeData.months);
        setYear(fakeData.years);
        setStatus(fakeData.status);
    }


    return (
        <>
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
                    options={transactionPoint}
                    onInputChange={(event, newInputValue) => {
                        props.setTransactionPoint(newInputValue);
                      }}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Điểm tập kết" variant="standard" />
                    )}
                />
                <Autocomplete
                    onInputChange={(event, newInputValue) => {
                        props.setDate(newInputValue);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={date}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Ngày" variant="standard" />
                    )}
                />
                <Autocomplete
                    onInputChange={(event, newInputValue) => {
                      props.setMonth(newInputValue);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={month}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Tháng" variant="standard" />
                    )}
                />
                <Autocomplete
                    onInputChange={(event, newInputValue) => {
                      props.setYear(newInputValue);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={year}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Năm" variant="standard" />
                    )}
                />
                <Autocomplete
                    onInputChange={(event, newInputValue) => {
                      props.setStatus(newInputValue);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={status}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Trạng thái" variant="standard" />
                    )}
                />
            </div>
        </>
    );
}
