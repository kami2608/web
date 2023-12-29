import { Box, Grid, Stack, Typography } from "@mui/material";
import Page from "../../components/Page";
import { BarChart } from "@mui/x-charts/BarChart";
import BarsDataset from "../../components/Chart/Barchart";
import ToggleSwitch from "../../components/TripleToggleSwitch/TripleToggleSwitch";
import { useEffect, useState } from "react";
import { updateGraph } from "./ChartFunction";
import Select from "../../components/Filter/Select";
import { dexieDB } from "../../database/cache";
import { useLiveQuery } from "dexie-react-hooks";
import { itemsCEO } from "../../components/Navbar/ItemInfor";

const StatisticCEO = () => {
  const orders = useLiveQuery(() => dexieDB.table("orderHistory").toArray());
  const ordersGD = useLiveQuery(() =>
  dexieDB.table("orderHistory").toArray().then((result) =>
    result.filter((order) => {
       if (order.currentLocation && typeof order.currentLocation === "string") {
       return order.currentLocation.substring(0, 2) === "GD";
      }
    })
  )
);
const ordersTK = useLiveQuery(() =>
  dexieDB.table("orderHistory").toArray().then((result) =>
    result.filter((order) => {
       if (order.currentLocation && typeof order.currentLocation === "string") {
       return order.currentLocation.substring(0, 2) === "TK";
      }
    })
  )
);
  // const ordersTK = useLiveQuery(() =>
  //   dexieDB
  //     .table("orderHistory")
  //     .toArray()
  //     .then((result) =>
  //       result.filter((order) => order.currentLocation.substring(0, 2) === "TK")
  //     )
  // );
  const [graph, setGraph] = useState([
    {
      id: "statistic",
      data: Array.from({ length: 6 }, (_, i) => {
        return {
          x: 2018 + i,
          send: 0,
          receive: 0,
        };
      }),
    },
  ]);
  const [graphGD, setGraphGD] = useState([
    {
      id: "statistic",
      data: Array.from({ length: 6 }, (_, i) => {
        return {
          x: 2018 + i,
          send: 0,
          receive: 0,
        };
      }),
    },
  ]);
  const [graphTK, setGraphTK] = useState([
    {
      id: "statistic",
      data: Array.from({ length: 6 }, (_, i) => {
        return {
          x: 2018 + i,
          send: 0,
          receive: 0,
        };
      }),
    },
  ]);

  const [timeView, setTimeView] = useState("Năm");
  const [GDcenter, setGDcenter] = useState("Tất cả");
  const [TKcenter, setTKcenter] = useState("Tất cả");
  const [filteredGD, setFilteredGD] = useState([]);
  const [filteredTK, setFilteredTK] = useState([]);
  const [sentDateList, setSentDateList] = useState([]);
  const [receiveDateList, setReceiveDateList] = useState([]);
  const [GDsentDateList, setGDSentDateList] = useState([]);
  const [GDreceiveDateList, setGDReceiveDateList] = useState([]);
  const [TKsentDateList, setTKSentDateList] = useState([]);
  const [TKreceiveDateList, setTKReceiveDateList] = useState([]);

  const GDcenterOption = ["Tất cả"];
  for (let i = 1; i <= 64; i++) {
    const GDItem = `GD${i.toString().padStart(2, "0")}`;
    GDcenterOption.push(GDItem);
  }

  const TKcenterOption = ["Tất cả"];
  for (let i = 1; i <= 21; i++) {
    const TKItem = `TK${i.toString().padStart(2, "0")}`;
    TKcenterOption.push(TKItem);
  }

  useEffect(() => {
    if (!ordersGD) return;
    setFilteredGD(
      GDcenter === "Tất cả"
        ? ordersGD
        : ordersGD.filter((order) => order.currentLocation === GDcenter)
    );
  }, [ordersGD, GDcenter]);

  console.log(GDcenter);

  useEffect(() => {
    if (!ordersTK) return;
    setFilteredTK(
      TKcenter === "Tất cả"
        ? ordersTK
        : ordersTK.filter((order) => order.currentLocation === TKcenter)
    );
  }, [ordersTK, TKcenter]);

  useEffect(() => {
    if (!orders) return;
    setSentDateList(
      orders
        .filter(
          (order) =>
            order.historyID.slice(-1) === "1" ||
            order.historyID.slice(-1) === "2"
        )
        .map((order) => order["date"])
    );
    setReceiveDateList(
      orders
        .filter(
          (order) =>
            order.historyID.slice(-1) === "3" ||
            order.historyID.slice(-1) === "4"
        )
        .map((order) => order["date"])
    );
  }, [orders]);

  useEffect(() => {
    if (!filteredGD) return;
    setGDSentDateList(
      filteredGD
        .filter((order) => order.historyID.slice(-1) === "1")
        .map((order) => order["date"])
    );
    setGDReceiveDateList(
      filteredGD
        .filter((order) => order.historyID.slice(-1) === "4")
        .map((order) => order["date"])
    );
  }, [filteredGD]);

  useEffect(() => {
    if (!filteredTK) return;
    setTKSentDateList(
      filteredTK
        .filter((order) => order.historyID.slice(-1) === "2")
        .map((order) => order["date"])
    );
    setTKReceiveDateList(
      filteredTK
        .filter((order) => order.historyID.slice(-1) === "3")
        .map((order) => order["date"])
    );
  }, [filteredTK]);

  // console.log(sentDateList);
  // console.log(receiveDateList);

  useEffect(
    () =>
      updateGraph(sentDateList, receiveDateList, timeView, graph[0], setGraph),
    [sentDateList, receiveDateList, timeView]
  );
  useEffect(
    () =>
      updateGraph(
        GDsentDateList,
        GDreceiveDateList,
        timeView,
        graphGD[0],
        setGraphGD
      ),
    [GDsentDateList, GDreceiveDateList, timeView]
  );
  useEffect(
    () =>
      updateGraph(
        TKsentDateList,
        TKreceiveDateList,
        timeView,
        graphTK[0],
        setGraphTK
      ),
    [TKsentDateList, TKreceiveDateList, timeView]
  );
  const switchTime = (mode) => setTimeView(mode);
  const selectGDcenter = (center) => setGDcenter(center);
  const selectTKcenter = (center) => setTKcenter(center);
  //console.log(filteredGD);

  return (
    <Page items={itemsCEO}>
      <Grid container justifyContent="center" spacing={0} height={1}>
        {/* c1 */}
        <Grid item lg={6} md={6} xs={12}>
          <Stack sx={{ height: "100%" }}>
            <Box
              sx={{
                width: "98%",
                height: {
                  xs: "10%",
                  sm: "6%",
                  md: "6%",
                  lg: "6%",
                },
                borderRadius: 2,
                // pb: "var(--padding-item)",
                mt: "10px",
                //ml: "30px",
                ml: "10px",
                mr: "100px",
              }}
            >
              <ToggleSwitch
                values={["Tháng", "Quý", "Năm"]}
                selected={timeView}
                onChange={switchTime}
              />
            </Box>
            <Box
              sx={{
                bgcolor: "var(--secondary-color)",
                borderRadius: 2,
                p: "var(--padding-item)",
                mt: "10px",
                ml: "10px",
                mb: "10px",
                height: "90%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Inter",
                    fontSize: {
                      xs: "15px",
                      sm: "20px",
                      md: "22px",
                      lg: "22px",
                    },
                    color: "var(--title-color)",
                    zIndex: 1,
                  }}
                >
                  Thống kê số lượng hàng gửi, hàng nhận toàn quốc
                </Typography>
              </Stack>
              <Box
                sx={{
                  bgcolor: "var(--secondary-color)",
                  borderRadius: 2,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  p: 1,
                  pt: 0,
                  mt: 2,
                  width: 1,
                  height: "90%",
                }}
              >
                <BarsDataset
                  data={graph}
                  view={"all"}
                  label1={"Hàng gửi"}
                  label2={"Hàng nhận"}
                />
              </Box>
            </Box>
          </Stack>
        </Grid>
        {/* c2,3 */}
        <Grid item lg={6} md={6} xs={12}>
          <Stack sx={{ height: "100%" }}>
            {/* c2 */}
            <Box
              sx={{
                bgcolor: "var(--secondary-color)",
                borderRadius: 2,
                p: "var(--padding-item)" / 2,
                m: "10px",
                height: "50%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Inter",
                    fontSize: {
                      xs: "15px",
                      sm: "20px",
                      md: "22px",
                      lg: "22px",
                    },
                    paddingLeft: "20px",
                    color: "var(--title-color)",
                    zIndex: 1,
                  }}
                >
                  Thống kê theo điểm giao dịch
                </Typography>
                <Select options={GDcenterOption} onSelect={selectGDcenter} />
              </Stack>
              <Box
                sx={{
                  bgcolor: "var(--secondary-color)",
                  borderRadius: 2,
                  height: "50%",
                }}
              >
                <BarsDataset
                  data={graphGD}
                  label1={"Hàng gửi"}
                  label2={"Hàng nhận"}
                />
              </Box>
            </Box>
            {/* c3 */}
            <Box
              sx={{
                bgcolor: "var(--secondary-color)",
                borderRadius: 2,
                p: "var(--padding-item)" / 2,
                ml: "10px",
                mb: "10px",
                mr: "10px",
                height: "50%",
              }}
            >
              <Stack
                direction={"row"}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Inter",
                    fontSize: {
                      xs: "15px",
                      sm: "20px",
                      md: "22px",
                      lg: "22px",
                    },
                    paddingLeft: "20px",
                    color: "var(--title-color)",
                    zIndex: 1,
                  }}
                >
                  Thống kê theo điểm tập kết
                </Typography>
                <Select options={TKcenterOption} onSelect={selectTKcenter} />
              </Stack>
              <Box
                sx={{
                  bgcolor: "var(--secondary-color)",
                  borderRadius: 2,
                  p: 1,
                  height: "50%",
                }}
              >
                <BarsDataset
                  data={graphTK}
                  label1={"Hàng đi"}
                  label2={"Hàng đến"}
                />
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
};

export default StatisticCEO;
