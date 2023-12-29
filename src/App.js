import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import System from "./pages/System-Management/CEO";
import Account from "./pages/Account-Management/CEO";
import HeadGDAccount from "./pages/Account-Management/HeadGD";
import HeadTKAccount from "./pages/Account-Management/HeadTK";
import HomeCEO from "./pages/Home/CEO/Home";
import HomeGD from "./pages/Home/LeadGD/Home";
import HomeTK from "./pages/Home/LeadTK/Home";
import StatisticCEO from "./pages/Statistic/CEO";
import StatisticGD from "./pages/Statistic/GD";
import StatisticTK from "./pages/Statistic/TK";
import SignIn from "./components/Test/SignIn";
import { useEffect } from "react";
import { dexieDB } from "./database/cache";
import { collection, onSnapshot } from "firebase/firestore";
import { fireAuth, fireDB } from "./database/firebase";
import HomeGDV from "./pages/Home/GDV/Home";
import HomeNVTK from "./pages/Home/NVTK/Home";
import StickyHeadTable from "./components/Table/Test";
import StatisticGDV from "./pages/Statistic/GDV";
import GDShipment from "./components/Shipments/GDShipment";
import TKShipment from "./components/Shipments/TKShipment";
import GDConfirm from "./components/Confirmation/GDConfirm";
import TKConfirm from "./components/Confirmation/TKConfirm";
import MainPage from "./pages/MainPage";
import ShipmentGD from "./pages/NVTK/ShipmentGD";
import ShipmentTK from "./pages/NVTK/ShipmentTK";
import ConfirmGD from "./pages/NVTK/ConfirmGD";
import ConfirmTK from "./pages/NVTK/ConfirmTK";
import OrderStatus from "./components/OrderStatus";
import RegisOrder from "./pages/GDV/RegisOrder";
import ConfirmFromTK from "./pages/GDV/ConfirmFromTK";
import ShippingForm from "./pages/GDV/ShippingForm";
import ShippingConfirm from "./pages/GDV/ShippingConfirm";
import CreateTransToTK from "./pages/GDV/CreateTransToTK";


const App = () => {
  const logPackageDataFromDexieDB = async () => {
    try {
      const packageData = await dexieDB.table("orderHistory").toArray();
      console.log("Dữ liệu từ bảng package trong DexieDB:", packageData);
    } catch (error) {
      console.error("Lỗi khi truy vấn dữ liệu từ DexieDB:", error);
    }
  };
  // useEffect(() => {
  //   logusersDataFromDexieDB();
  // })

  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "GDsystem"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("GDsystem").put({
          id: systemData.id,
          name: systemData.name,
          manage: systemData.manage,
          hotline: systemData.hotline,
          email: systemData.email,
          address: systemData.address,
          setDay: systemData.setDay,
          coverArea: systemData.coverArea,
          TKpoint: systemData.TKpoint,
        });
        return;
      });
      //logPackageDataFromDexieDB();
    });
    return () => listener();
  }, []);
  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "TKsystem"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("TKsystem").put({
          id: systemData.id,
          name: systemData.name,
          manage: systemData.manage,
          hotline: systemData.hotline,
          email: systemData.email,
          address: systemData.address,
          setDay: systemData.setDay,
        });
        return;
      });
      //logPackageDataFromDexieDB();
    });
    return () => listener();
  }, []);

  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "LeadGDacc"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("LeadGDacc").put({
          id: systemData.id,
          username: systemData.username,
          name: systemData.name,
          gd: systemData.gd,
          dob: systemData.dob,
          sex: systemData.sex,
          email: systemData.email,
          phone: systemData.phone,
          password: systemData.password,
        });
        return;
      });
      //logPackageDataFromDexieDB();
    });
    return () => listener();
  }, []);

  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "LeadTKacc"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("LeadTKacc").put({
          id: systemData.id,
          username: systemData.username,
          name: systemData.name,
          tk: systemData.tk,
          dob: systemData.dob,
          sex: systemData.sex,
          email: systemData.email,
          phone: systemData.phone,
          password: systemData.password,
        });
        return;
      });
      //logPackageDataFromDexieDB();
    });
    return () => listener();
  }, []);

  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "NVTKacc"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("NVTKacc").put({
          id: systemData.id,
          username: systemData.username,
          name: systemData.name,
          tk: systemData.tk,
          dob: systemData.dob,
          sex: systemData.sex,
          email: systemData.email,
          phone: systemData.phone,
          password: systemData.password,
        });
        return;
      });
      //logPackageDataFromDexieDB();
    });
    return () => listener();
  }, []);

  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "GDVacc"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("GDVacc").put({
          id: systemData.id,
          username: systemData.username,
          name: systemData.name,
          gd: systemData.gd,
          dob: systemData.dob,
          sex: systemData.sex,
          email: systemData.email,
          phone: systemData.phone,
          password: systemData.password,
        });
        return;
      });
      //logPackageDataFromDexieDB();
    });
    return () => listener();
  }, []);

  useEffect(() => {
    const listener = onSnapshot(
      collection(fireDB, "orderHistory"),
      (snapshot) => {
        snapshot.docChanges().forEach(async (system) => {
          const systemDoc = system.doc;
          const systemData = systemDoc.data();
          await dexieDB.table("orderHistory").put({
            historyID: systemData.historyID,
            orderID: systemData.orderID,
            date: systemData.date,
            currentLocation: systemData.currentLocation,
            Description: systemData.Description,
            orderStatus: systemData.orderStatus,
          });
          return;
        });
        //logPackageDataFromDexieDB();
      }
    );
    return () => listener();
  }, []);

  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "orders"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("orders").put({
          id: systemData.id,
          senderName: systemData.senderName,
          senderPhone: systemData.senderPhone,
          senderAddress: systemData.senderAddress,
          receiverName: systemData.receiverName,
          receiverPhone: systemData.receiverPhone,
          receiverAddress: systemData.receiverAddress,
          type: systemData.type,
          weight: systemData.weight,
          cost: systemData.cost,
          startGDpoint: systemData.startGDpoint,
          startTKpoint: systemData.startTKpoint,
          endTKpoint: systemData.endTKpoint,
          endGDpoint: systemData.endGDpoint,
          startGDpointName: systemData.startGDpointName,
          startTKpointName: systemData.startTKpointName,
          endTKpointName: systemData.endTKpointName,
          endGDpointName: systemData.endGDpointName,
          status: systemData.status,
          orderStatus: "Chưa tạo đơn",
        });
        return;
      });
      //logPackageDataFromDexieDB();
    });
    return () => listener();
  }, []);

  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "shipment"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("shipment").put({
          id: systemData.shipmentID,
          date: systemData.createDate,
          counts: systemData.Counts,
          ordersList: systemData.details,
          startGDpoint: systemData.startGDpoint,
          startTKpoint: systemData.startTKpoint,
          endTKpoint: systemData.endTKpoint,
          endGDpoint: systemData.endGDpoint,
          startGDpointName: systemData.startGDpointName,
          startTKpointName: systemData.startTKpointName,
          endTKpointName: systemData.endTKpointName,
          endGDpointName: systemData.endGDpointName,
          status: systemData.status,
        });
        return;
      });
      // logPackageDataFromDexieDB();
      // console.log("data from DexieDB: ", dexieDB.table("shipment").toArray());
    });
    return () => listener();
  }, []);

  useEffect(() => {
    const listener = onSnapshot(collection(fireDB, "delivery"), (snapshot) => {
      snapshot.docChanges().forEach(async (system) => {
        const systemDoc = system.doc;
        const systemData = systemDoc.data();
        await dexieDB.table("delivery").put({
          id: systemData.id,
          date: systemData.createDate,
          counts: systemData.counts,
          details: systemData.details,
          GDpoint: systemData.Gdpoint,
  //        startGDpointName: systemData.startGDpoint,
  //        startTKpointName: systemData.startTKpoint,
  //        endTKpointName: systemData.endTKpoint,
  //        endGDpointName: systemData.endGDpoint,
          status: systemData.status,
        });
        return;
      });
      // logPackageDataFromDexieDB();
      
    });
    return () => listener();
  });

  const navigate = useNavigate();
  const onSignIn = () => navigate("/home");
  const id = localStorage.getItem("id")
    ? localStorage.getItem("id").slice(0, 3)
    : "";
  console.log(localStorage.getItem("id"));
  return (
    <>
      <div className="App">
        <CssBaseline />

        <Routes>
          {/* <SignIn transfer={onSignIn} */}
          <Route path="/order-status" element={<OrderStatus />} />
          <Route
            path="/"
            element={
              <div className="Main">
                <MainPage tranfer={onSignIn} />
              </div>
            }
          />
          <Route
            path="/home"
            element={(() => {
              switch (id) {
                case "CEO":
                  return <HomeCEO />;
                case "LGD":
                  return <HomeGD />;
                case "LTK":
                  return <HomeTK />;
                case "EGD":
                  return <HomeGDV />;
                default:
                  return <HomeNVTK />;
              }
            })()}
          />
          <Route
            path="/statistic"
            element={
              id === "CEO" ? (
                <StatisticCEO />
              ) : id === "LGD" ? (
                <StatisticGD />
              ) : (
                <StatisticTK />
              )
            }
          />
          <Route
            path="/system"
            element={
              id === "CEO" ? <System /> : id === "LGD" ? <HomeGD /> : <HomeTK />
            }
          />
          <Route
            path="/account"
            element={
              id === "CEO" ? (
                <Account />
              ) : id === "LGD" ? (
                <HeadGDAccount />
              ) : (
                <HeadTKAccount />
              )
            }
          />
          {id == "EGD" && (
            <>
              <Route path="/regis" element={<RegisOrder />} />
              <Route
                path="/TKpoint/createShipment"
                element={<CreateTransToTK/>}
              />
              <Route
                path="/TKpoint/confirmShipment"
                element={<ConfirmFromTK />}
              />
              <Route
                path="/ship/createShipment"
                element={<ShippingForm />}
              />
              <Route path="/ship/confirmStatus" element={<ShippingConfirm />} />
              <Route path="/ship/statistic" element={<StatisticGDV />} />
            </>
          )}

          {id === "ETK" && (
            <>
              <Route path="/createShipment/toGD" element={<ShipmentGD />} />
              <Route path="/createShipment/toTK" element={<ShipmentTK />} />
              <Route path="/confirm/fromGD" element={<ConfirmGD />} />
              <Route path="/confirm/fromTK" element={<ConfirmTK />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
};

export default App;
