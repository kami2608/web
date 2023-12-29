// import React from 'react';
// import {
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Checkbox,
//   IconButton,
//   TableSortLabel
// } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';

// const ShipmentTable = ({ shipments, onSort, sortConfig, onCheckboxChange, onDetailsClick }) => {
//   const createSortHandler = (property) => (event) => {
//     onSort(property);
//   };

//   return (
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell padding="checkbox">
//             <Checkbox
//               // Logic for select all
//               onChange={(event) => onCheckboxChange(event, 'all')}
//               // Checked state logic
//             />
//           </TableCell>
//           <TableCell>
//             <TableSortLabel
//               active={sortConfig.key === 'shipmentID'}
//               direction={sortConfig.key === 'shipmentID' ? sortConfig.direction : 'asc'}
//               onClick={createSortHandler('shipmentID')}
//             >
//               Mã đơn chuyển hàng
//             </TableSortLabel>
//           </TableCell>
          
//           <TableCell>
//               <strong>Từ điểm giao dịch</strong>
//               <TableSortLabel
//                 active={sortConfig.key === 'transactionPoint'}
//                 direction={sortConfig.key === 'transactionPoint' ? sortConfig.direction : 'asc'}
//                 onClick={() => sortData('transactionPoint')}
//               />
//             </TableCell>
//             <TableCell>
//               <strong>Số lượng</strong>
//               <TableSortLabel
//                 active={sortConfig.key === 'counts'}
//                 direction={sortConfig.key === 'counts' ? sortConfig.direction : 'asc'}
//                 onClick={() => sortData('counts')}
//               />
//             </TableCell>
//             <TableCell>
//               <strong>Thời gian chuyển đến</strong>
//               <TableSortLabel
//                 active={sortConfig.key === 'deliveryTime'}
//                 direction={sortConfig.key === 'deliveryTime' ? sortConfig.direction : 'asc'}
//                 onClick={() => sortData('deliveryTime')}
//               />
//             </TableCell>
//             <TableCell>
//               <strong>Chi tiết</strong>
//             </TableCell>
//             <TableCell>
//               <strong>Trạng thái</strong>
//               <TableSortLabel
//                 active={sortConfig.key === 'status'}
//                 direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
//                 onClick={() => sortData('status')}
//               />
//             </TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {shipments.map((shipment) => (
//           <TableRow
//             key={shipment.id}
//             hover
//             // Additional row styling if required
//           >
//             <TableCell padding="checkbox">
//               <Checkbox
//                 checked={/* Logic to determine if row is selected */}
//                 onChange={(event) => onCheckboxChange(event, shipment.id)}
//               />
//             </TableCell>
//             <TableCell>{shipment.shipmentID}</TableCell>
//               <TableCell>{shipment.transactionPoint}</TableCell>
//               <TableCell>{shipment.counts}</TableCell>
//               <TableCell>{shipment.deliveryTime}</TableCell>
//             <TableCell>
//               <IconButton
//                 aria-label="details"
//                 onClick={() => onDetailsClick(shipment)}
//               >
//                 <VisibilityIcon />
//               </IconButton>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

// export default ShipmentTable;
