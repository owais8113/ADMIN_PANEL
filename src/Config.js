import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBsA3I2ek2pXFViq16BlS2r4zOGYI-E7Do",
  authDomain: "react-dbfc1.firebaseapp.com",
  databaseURL: "https://react-dbfc1-default-rtdb.firebaseio.com",
  projectId: "react-dbfc1",
  storageBucket: "react-dbfc1.appspot.com",
  messagingSenderId: "718232077680",
  appId: "1:718232077680:web:2e74726d998df3a5513bb5",
  measurementId: "G-8RVC48Z8F7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth,fs,storage};