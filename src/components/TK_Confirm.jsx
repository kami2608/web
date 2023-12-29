import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

import { visuallyHidden } from "@mui/utils";
import TK_Confirm from "./Filters/TK_Confirm";
import { create } from "@mui/material/styles/createTransitions";

const columns = [
    {
        id: "id",
        disablePadding: true,
        numeric: false,
        label: "ID",
    },
    {
        id: "shipmentID",
        disablePadding: true,
        numeric: false,
        label: "Mã đơn chuyển hàng",
    },
    {
        id: "gatheringPoint",
        disablePadding: true,
        numeric: false,
        label: "Từ điểm tập kết",
    },
    {
        id: "deliveryTime",
        disablePadding: true,
        numeric: false,
        label: "Thời gian chuyển đến",
    },
    {
        id: "counts",
        disablePadding: true,
        numeric: false,
        label: "Số lượng",
    },
    {
        id: "status",
        disablePadding: true,
        numeric: false,
        label: "Trạng thái",
    },
];

function createData(id, shipmentID, deliveryTime, count, status) {
    // Định dạng deliveryTime thành chuỗi "DD/MM/YY"
    const formattedDeliveryTime = moment(deliveryTime).format('DD/MM/YY');
    const countsNumber = Number(counts);
    return {
        id: String(id),
        shipmetID: String(shipmentID),
        deliveryTime: formattedDeliveryTime,
        counts: countsNumber,
        status: String(status),
    }
}

const data = [
    createData(
        "1",
        "S123",
        "16/12/2022",
        "10",
        "Chưa xác nhận",
    ),
    createData(
        "2",
        "S124",
        "6/1/2023",
        "14",
        "Chưa xác nhận",
    ),
    createData(
        "3",
        "S125",
        "16/2/2021",
        "7",
        "Chưa xác nhận",
    ),
    createData(
        "4",
        "S124",
        "25/10/2023",
        "10",
        "Chưa xác nhận",
    ),
    createData(
        "5",
        "S125",
        "17/9/2022",
        "8",
        "Chưa xác nhận",
    ),
    createData(
        "6",
        "S126",
        "7/12/2021",
        "18",
        "Chưa xác nhận",
    ),
];

export function getData() {
    return data;
}

function TKConfirm() {
    const DEFAULT_ORDER = "asc";
    const DEFAULT_ORDER_BY = "id";
    const DEFAULT_ROWS_PER_PAGE = 5;
    const [rows, setRows] = useState(data);

    //Sort
    function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function TK_TableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (newOrderBy) => (event) => {
      onRequestSort(event, newOrderBy);
    };
    return (
      <TableHead sx={{ bgcolor: "var(--secondary-color)" }}>
        <TableRow sx={{ bgcolor: "var(--secondary-color)" }}>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align="center"
              padding={column.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === column.id ? order : false}
              sx={{
                bgcolor: "var(--secondary-color)",
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : "asc"}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          </TableRow>
      </TableHead>
    );
  }

  TK_TableHead.PropTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
  const [page, setPage] = useState(0);
  const [visibleRows, setVisibleRows] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = useState(0);
  const [filteredRowCount, setFilteredRowCount] = useState(0);
  const [filters, setFilters] = useState({
    id: "",
    username: "",
    name: "",
    sex: "",
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
}

export default TKConfirm;