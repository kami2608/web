import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({


  // apiKey: "AIzaSyAF3bIMKaPnfUULyQnEtQbgeBc7-XfZv80",
  // authDomain: "upload-file-demo-d1beb.firebaseapp.com",
  // projectId: "upload-file-demo-d1beb",
  // storageBucket: "upload-file-demo-d1beb.appspot.com",
  // messagingSenderId: "456204958602",
  // appId: "1:456204958602:web:e1cb5712a2db746dcda673"

  // apiKey: "AIzaSyBnBaKJk_zc01_XmgR5A_mjv5cKGWypY2I",
  // authDomain: "magic-post2.firebaseapp.com",
  // projectId: "magic-post2",
  // storageBucket: "magic-post2.appspot.com",
  // messagingSenderId: "746792341563",
  // appId: "1:746792341563:web:f3f3ede47e51bfa191cc1e"

  // apiKey: "AIzaSyBrUUxrvEmUl5KJ1DCoFxFDeuYVfKTIsww",
  // authDomain: "magic-post1.firebaseapp.com",
  // projectId: "magic-post1",
  // storageBucket: "magic-post1.appspot.com",
  // messagingSenderId: "318952366608",
  // appId: "1:318952366608:web:94a5c380dcac947e01a095"

  // apiKey: "AIzaSyB4iOWmclb_p_YVm8QdUIO9o6RECiXYsvo",
  // authDomain: "magicpost-224ab.firebaseapp.com",
  // projectId: "magicpost-224ab",
  // storageBucket: "magicpost-224ab.appspot.com",
  // messagingSenderId: "439957681033",
  // appId: "1:439957681033:web:e686930222e6e3e9d0e758",
  // measurementId: "G-9VLC22ZD47"

  // apiKey: "AIzaSyDI4OBEa7Zh7w0mo9G-dyYf0cjjSQx_uwI",
  // authDomain: "magic-post-21f3f.firebaseapp.com",
  // projectId: "magic-post-21f3f",
  // storageBucket: "magic-post-21f3f.appspot.com",
  // messagingSenderId: "968165012418",
  // appId: "1:968165012418:web:d60163f26d79ac342cdc5b"

  apiKey: "AIzaSyA4wm1g4e8b9kpv_x1jayoBuRP-xNvI84c",
  authDomain: "magic-post-vip.firebaseapp.com",
  projectId: "magic-post-vip",
  storageBucket: "magic-post-vip.appspot.com",
  messagingSenderId: "709874716113",
  appId: "1:709874716113:web:89a954043a6199222da4f0"
});

const fireDB = getFirestore(app);
const fireAuth = getAuth(app);

await setPersistence(fireAuth, browserLocalPersistence);

export { fireDB, fireAuth };
