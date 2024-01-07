//🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
//Import firebase settings
import { onMount } from "svelte";
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  arrayUnion,
  GeoPoint,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxV7Bppe-A25QDWgIy16moouHxMkluOr4",
  authDomain: "ddm-v2.firebaseapp.com",
  projectId: "ddm-v2",
  storageBucket: "ddm-v2.appspot.com",
  messagingSenderId: "423698149665",
  appId: "1:423698149665:web:dd5aa2a7546b06183e8e60",
  measurementId: "G-L4JGZJ79D4",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);



let userInputCurrentUsername = "Anon";
let userInputNewThreadTitle = "test";
let userInputNewPost = "";
let liveLong = null;
let liveLat = null;

function createNewThreadAsDoc() {
  //Start by requesting a new geolocation
  if (!liveLat == null) {
    let newCryptoID = crypto.randomUUID();
    let newtimestamp = new Date();
    let newConcatName =
      newtimestamp.toUTCString() +
      " " +
      userInputNewThreadTitle +
      " " +
      newCryptoID;
    //create a new document in the root collection with the following data
    setDoc(doc(db, "root", newConcatName), {
      timestamp: serverTimestamp(),
      title: userInputNewThreadTitle,
      author: userInputCurrentUsername,
      location: new GeoPoint(liveLat, liveLong),
    });

    //add the title info as the first post in a new map to fix rendering bug
    const mapData = {
      text: userInputNewThreadTitle,
      author: userInputCurrentUsername,
    };
    //Merges the data above into the existing mapdata object
    let lastDoc = doc(collection(db, "root"), newConcatName);
    setDoc(lastDoc, { posts: arrayUnion(mapData) }, { merge: true });
    userInputNewPost = "";

    userInputNewThreadTitle = "";
  } else {

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.watchPosition(success, error, options);

    function success(geo) {
      const crd = geo.coords;
      liveLong = crd.longitude;
      liveLat = crd.latitude;
    }

    function error(err) {
        console.log("unable to access geolocation")
    }
  }
}

createNewThreadAsDoc();
