import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2dEY0kxUX5k5Xc5iwV6zBGmotqwq1xAM",
  authDomain: "tezton-api.firebaseapp.com",
  projectId: "tezton-api",
  storageBucket: "tezton-api.appspot.com",
  messagingSenderId: "188657953111",
  appId: "1:188657953111:web:0399bd49721e7165a8b612"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);