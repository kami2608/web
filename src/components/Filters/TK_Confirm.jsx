import React from "react";
import {
    TextField,
    Autocomplete,
} from "@mui/material";
import { useState } from "react";

export default function DetailFilter({props}) {
    const [selectedTransactionPoint, setSelectedTransactionPoint] =
        useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

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
        </>

    );
}