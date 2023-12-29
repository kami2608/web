import Dexie from "dexie";
import "firebase/auth";
import { fireAuth, fireDB } from "./firebase";
import {
  doc,
  setDoc,
  collection,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { useLiveQuery } from "dexie-react-hooks";

const dexieDB = new Dexie("cachedUser38");
dexieDB.version(1).stores({
  GDsystem: "id",
  TKsystem: "id",
  LeadGDacc: "id",
  LeadTKacc: "id",
  NVTKacc: "id",
  GDVacc: "id",
  orderHistory: "historyID, orderID, currentLocation",
  orders: "id",
  shipment: "id",
});


function syncDexieToFirestore(tableName, collectionName, fieldsToSync) {
  dexieDB[tableName].toArray().then((data) => {
    data.forEach(async (record) => {
      if (record.id) {
        const { id, ...dataFields } = record;
        const updateObject = {};
        fieldsToSync.forEach((field) => {
          updateObject[field] = dataFields[field];
        });

        const docRef = doc(fireDB, collectionName, id.toString());
        await setDoc(docRef, updateObject);
      }
    });
  });
}

async function deleteDataFromFireStoreAndDexie(collectionName, id) {
  try {
    const docRef = doc(fireDB, collectionName, id);
    await deleteDoc(docRef);
    await deleteDataFromDexieTable(collectionName, id);
    alert("Xóa tài khoản thành công!");
  } catch (error) {
    console.error("Loi khi xoa trong firestore: ", error);
  }
}

async function deleteDataFromDexieTable(tableName, id) {
  dexieDB
    .table(tableName)
    .where("id")
    .equals(id)
    .delete()
    .then(() => {
      console.log("xoa trong dexieDB");
    })
    .catch((error) => {
      console.error("Loi khi xoa data dexieDB", error);
    });
}

async function updateDataFromFireStoreAndDexie(collectionName, id, newData) {
  try {
    const docRef = doc(fireDB, collectionName, id);
    await updateDoc(docRef, newData);
    await updateDataFromDexieTable(collectionName, id, newData);
    alert("Cập nhật thông tin tài khoản thành công!");
  } catch (error) {
    console.error("Loi khi update trong firestore: ", error);
  }
}

async function updateDataFromDexieTable(tableName, id, newData) {
  try {
    await dexieDB.table(tableName).update(id, newData);
    console.log("update dexieDB");
  } catch (error) {
    console.error("Loi khi update data dexieDB", error);
  }
}

async function addDataToFireStoreAndDexie(collectionName, newData) {
  try {
    const docRef = doc(fireDB, collectionName, newData.id);
    await setDoc(docRef, newData);
    await addDataToDexieTable(collectionName, newData);
    if (collectionName === "GDsystem") {
      alert("Điểm giao dịch đã được thêm thành công");
    }
    if (collectionName === "TKsystem") {
      alert("Điểm tập kết đã được thêm thành công");
    }
    if (collectionName === "LeadGDacc") {
      alert("Tài khoản trưởng điểm giao dịch đã được thêm thành công");
    }
    if (collectionName === "LeadTKacc") {
      alert("Tài khoản trưởng điểm tập kết đã được thêm thành công");
    }
    if (collectionName === "NVTKacc") {
      alert("Tài khoản nhân viên điểm tập kết đã được thêm thành công");
    }
    if (collectionName === "GDVacc")
      alert("Tài khoản giao dịch viên đã được thêm thành công");
  } catch (error) {
    console.error("Loi khi add trong firestore: ", error);
  }
}

async function addDataToDexieTable(tableName, newData) {
  try {
    await dexieDB.table(tableName).add(newData);
    console.log("add dexieDB");
  } catch (error) {
    console.error("Loi khi add data dexieDB", error);
    console.log(dexieDB.table(tableName));
  }
}

const loadUserState = (email) => {
  localStorage.setItem("email", email);
  const idCenter = email.slice(0, email.indexOf("@")).toUpperCase();
  const id = "L" + idCenter;
  if (idCenter.length === 7)
    localStorage.setItem("id", "E" + idCenter.slice(0, 4));
  else if (id.slice(0, 3) === "LTK" || id.slice(0, 3) === "LGD")
    localStorage.setItem("id", id);
  else localStorage.setItem("id", "CEO");
  const role = id.slice(1, 3) === "TK" ? "LeadTKacc" : "LeadGDacc";
  //const center = id.slice(0, 2) === "TK" ? "TKsystem" : "GDsystem";
  const loadProfile = async () => {
    // const useDoc = await getDoc(doc(fireDB, role, localStorage.getItem("id")));
    // const data = useDoc.data();

    const data = await dexieDB
      .table(role)
      .get("L" + localStorage.getItem("id").slice(1));

    // const useDocCenter = await getDoc(doc(fireDB, center, idCenter));
    // const dataCenter = useDocCenter.data();
    // console.log(dataCenter);
    console.log(data);
    if ((role === "LeadGDacc" || role === "LeadTKacc") && data) {
      localStorage.setItem("phone", data.phone);
      localStorage.setItem("name", data.name);
      if (role === "LeadTKacc") {
        localStorage.setItem("center", data.tk);
        // localStorage.setItem("address", dataCenter.address);
      } else if (role === "LeadGDacc") {
        localStorage.setItem("center", data.gd);
        // localStorage.setItem("address", dataCenter.address);
      }
    } else {
      localStorage.setItem("name", "Trần Thị Trà Giang");
      localStorage.setItem("center", "Magic Post");
      localStorage.setItem("phone", "0868809172");
    }
  };
  loadProfile();
};

const clearUserState = () => {
  ["id", "name", "email", "phone", "center"].forEach((key) =>
    localStorage.setItem(key, "")
  );
};

export {
  dexieDB,
  loadUserState,
  clearUserState,
  deleteDataFromFireStoreAndDexie,
  deleteDataFromDexieTable,
  updateDataFromFireStoreAndDexie,
  updateDataFromDexieTable,
  addDataToFireStoreAndDexie,
  addDataToDexieTable,
  syncDexieToFirestore,
};

// Mới chỉ xử lí phần lấy id, chưa xử lí phần load profile
