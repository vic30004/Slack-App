import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBdnY2ufPI8XjS69bvdK1keEmKcBzu9rDw",
    authDomain: "react-slack-7b44a.firebaseapp.com",
    databaseURL: "https://react-slack-7b44a.firebaseio.com",
    projectId: "react-slack-7b44a",
    storageBucket: "react-slack-7b44a.appspot.com",
    messagingSenderId: "1019455246407",
    appId: "1:1019455246407:web:2d378db460c85c5880e162",
    measurementId: "G-DR602FZ1XK"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase