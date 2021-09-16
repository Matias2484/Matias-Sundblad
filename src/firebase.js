import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyD1p3ZlvLuVJFwUyt7_A1lFmml6ZlRPSmc",
  authDomain: "phone-login-6cd22.firebaseapp.com",
  databaseURL: "https://phone-login-312c8.firebaseio.com",
  projectId: "phone-login-6cd22",
  storageBucket: "phone-login-6cd22.appspot.com",
  messagingSenderId: "901690509860",
  appId: "1:901690509860:web:0531d0c439b171c0e3a6b1",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
