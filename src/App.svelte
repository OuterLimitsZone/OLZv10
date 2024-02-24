<script>
  //🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗
  //This code connects the project to posthog for analytics
  //TODO: add in better cohort tracking
  import posthog from "posthog-js";
  if (
    !window.location.host.includes("127.0.0.1") &&
    !window.location.host.includes("localhost")
  ) {
    posthog.init("phc_ic3eJOOUVzJAFQiNhrjiSeK1hz5xZU2wmGrF8QFRvFc", {
      api_host: "https://app.posthog.com",
    });
  }
  //🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗
  //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  //This code connects the project to the firestore database
  //TODO: Nothing, this code is fine
  // @ts-ignore
  import { onMount, onDestroy } from "svelte";
  import { initializeApp } from "firebase/app";
  import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
  } from "firebase/auth";
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
    getDocs,
    arrayUnion,
    GeoPoint,
    where,
    addDoc,
    updateDoc,
    deleteField,
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
  const db = getFirestore(app);
  //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  //🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂

  const auth = getAuth(app);
  let userAuthID;

  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      // Session persistence is set
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error setting session persistence:", error);
    });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      userAuthID = user.uid;
      console.log(userAuthID);
    } else {
      signInAnonymously(auth)
        .then((userCredential) => {
          // The user is signed in with an anonymous account
          const user = userCredential.user;
          console.log("Anonymous User:", user);
        })
        .catch((error) => {
          // Handle errors here
          console.error("Error creating anonymous user:", error);
        });
    }
  });
  //🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂🛂
  //🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️
  //This code connects the project to the google maps api
  //TODO: Add a function that allows the map to start at a users current location in case they have already given us geolocation access

  import { Loader } from "@googlemaps/js-api-loader";

  let mapOptions = {
    mapId: "9fb0905de1a56702",
    disableDefaultUI: true,
    fullscreenControl: false,
    center: {
      lat: 31.755033802028862,
      lng: -106.3498107479434,
    },
    zoom: 13,
  };

  const loader = new Loader({
    apiKey: "AIzaSyBc-S84pU1_VSELNci_da0BDkdtu3wu6lk",
    version: "weekly",
    mapIds: ["9fb0905de1a56702"],
    //...additionalOptions,
  });

  let map;
  let targetLat = 42.398593;
  let targetLng = -71.144041;

  loader
    .importLibrary("maps")
    .then(({ Map }) => {
      map = new Map(document.getElementById("map"), mapOptions);
      map.addListener("center_changed", () => {
        let center = map.getCenter();
        targetLat = center.lat();
        targetLng = center.lng();
      });
      subscribeToData();
    })
    // @ts-ignore
    .catch((e) => {
      alert("error leading the google maps api :(");
    });
  //🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️
  //🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐
  //This code calls the geolocation api to set the map at the users current location
  //TODO: I should probably guide a user to enable geolocation if they want it in the future.

  function geolocationGetCurrentPosition(callback) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          let coords = { lat: latitude, lng: longitude };
          callback(coords);
        },
        function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("User denied the request for geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.log("The request to get user location timed out.");
              break;
          }
        },
        options,
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  //🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐
  //🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️
  //This code uploads user content to the firestore database
  //TODO: Come up with a better solution
  //⚠️⚠️⚠️⚠️⚠️WARNING I HAVE HARD CODED THE REFRENCE DOCUMENT THIS WILL BREAK AT 1MB OF DATA,⚠️⚠️⚠️⚠️⚠️
  //Note: you will need to come up with a method of recoding how close this document is to 1MB limit, and then move to a new document
  //when that limit is hit. Also you will need to fix the method for calling data to merge multiple documents. Sorry!

  let userInputText;
  let currentActiveDoc = "mvpdoc";
  let currentActiveDocRef = doc(db, "threads", currentActiveDoc);
  let imgUrl = "noimg";

  async function createNewThread() {
    const imageInput = document.getElementById("imageInput");

    // @ts-ignore
    if (imageInput.files[0]) {
      await uploadImage().then((url) => {
        imgUrl = url;
      });
    }

    let arrayID = crypto.randomUUID();
    let domid = crypto.randomUUID();

    let threadData = [
      {
        author: "Anon",
        GeoPoint: new GeoPoint(targetLat, targetLng),
        timestamp: Date.now(),
        text: userInputText,
        ReplyID: arrayID,
        DOMid: domid,
        alias: PFPseed,
        imgRef: imgUrl,
      },
    ];

    await updateDoc(currentActiveDocRef, { [arrayID]: threadData });

    userInputText = "";
    currentPopover = "PopoverinitialState";
    imgUrl = "noimg";
  }

  //replyID is updated in the DOM
  let replyID = "error";
  let geoBindToOP = "error";

  async function replyInThread() {
    const imageInput = document.getElementById("imageInput");

    // @ts-ignore
    if (imageInput.files[0]) {
      await uploadImage().then((url) => {
        imgUrl = url;
      });
    }

    let domid = crypto.randomUUID();
    let replyData = {
      author: "Anon",
      timestamp: Date.now(),
      text: userInputText,
      ReplyID: replyID,
      DOMid: domid,
      GeoPoint: geoBindToOP,
      alias: PFPseed,
      imgRef: imgUrl,
    };

    await updateDoc(currentActiveDocRef, { [replyID]: arrayUnion(replyData) });
    userInputText = "";
    currentPopover = "PopoverinitialState";
    imgUrl = "noimg";
  }

  //🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️
  //🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️
  import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";

  const storage = getStorage(app);

  async function uploadImage() {
    // @ts-ignore
    return new Promise(async (resolve, reject) => {
      const imageInput = document.getElementById("imageInput");
      // @ts-ignore
      const selectedFile = imageInput.files[0];

      if (selectedFile) {
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        try {
          // Upload the image to Firebase Storage
          await uploadBytes(storageRef, selectedFile);

          // Get the download URL of the uploaded image
          const imageUrl = await getDownloadURL(storageRef);

          // Now you can save 'imageUrl' in Firestore or use it to display the image on your site
          console.log("Image uploaded:", imageUrl);
          resolve(imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      } else {
        console.log("No image selected");
      }
    });
  }
  //🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️🖼️
  //📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡
  //TODO: Nothing, this code is fine
  //This code downloads user content from the firestore database when the site is opened

  let currentPopover = "PopoverinitialState";
  let masterPostArray = [];

  function subscribeToData() {
    const queryRef = query(collection(db, "threads"));

    return onSnapshot(
      queryRef,
      (querySnapshot) => {
        let tempArray = [];
        querySnapshot.forEach((doc) => {
          tempArray.push(...Object.values(doc.data()));
        });

        masterPostArray = tempArray;
        updateMarkers();
      },
      (error) => {
        console.log("Error fetching data:", error);
      },
    );
  }

  function updateMarkers() {
    if (masterPostArray.length === 0) {
      console.log("Empty array");
      return updateMarkers();
    } else {
      createThreadMarkersOnMap(masterPostArray, map);
    }
  }

  //📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡
  //📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍
  //This code adds makers for each post to the map
  //TODO: add in custom svg and add thread aging function

  function createThreadMarkersOnMap(dataArray, map) {
    dataArray.forEach((subArray) => {
      if (subArray.length > 0 && subArray[0].GeoPoint) {
        const { latitude, longitude } = subArray[0].GeoPoint;
        // @ts-ignore
        const position = new google.maps.LatLng(latitude, longitude);
        let DOMid = subArray[0].DOMid;
        // @ts-ignore
        const marker = new google.maps.Marker({
          position: position,
          map: map,
          // icon: {
          //   url: "path/to/custom/icon.png", // URL to a custom marker icon
          //   scaledSize: new google.maps.Size(50, 50), // scaling the icon
          // },
          title: subArray[0].text, // Example: Use the text for the marker's title
          // @ts-ignore
          animation: google.maps.Animation.DROP, // Optional animation
        });

        // @ts-ignore
        // const infowindow = new google.maps.InfoWindow({
        //   content: `<p>${subArray[0].text}</p>`, // Example content
        // });

        marker.addListener("click", () => {
          scrollToElement(DOMid);
          //console.log(DOMid);
          //infowindow.open(map, marker);
        });
      }
    });
  }

  //📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍
  //♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️
  //Scroll snaping function
  //TODO: Nothing, this code is fine
  function scrollToElement(DOMpostID) {
    let element = document.getElementById(DOMpostID);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      element.classList.add("blinking");

      setTimeout(() => {
        element.classList.remove("blinking");
      }, 2000);
    }
  }

  function moveMapToCurrentLocation() {
    geolocationGetCurrentPosition(function (coords) {
      map.setCenter({ lat: coords.lat, lng: coords.lng });
      //console.log(coords);
    });
  }
  //♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️♻️
  //🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯
  //This code proccess user generated text and rejects most spam
  //TODO: Re-implement this server side.
  // @ts-ignore
  async function normalizeText(newString) {
    // @ts-ignore
    return new Promise((resolve, reject) => {
      newString = newString.replace(/[\u0300-\u036f\u0489]/g, "");
      newString = newString.replace(
        /[\u200B-\u200F\uFEFF\u202A-\u202E\u2060-\u206F]/g,
        "",
      );
      newString = newString.replace(/[\s\uFEFF\xA0]+/g, "");
      newString = newString.normalize("NFC");
      newString = newString.toUpperCase();
      resolve(newString);
    });
  }

  // @ts-ignore
  async function hashStringSHA256(str) {
    // @ts-ignore
    return new Promise(async (resolve, reject) => {
      // Encode the string into a Uint8Array
      const encoder = new TextEncoder();
      const data = encoder.encode(str);

      // Hash the string using SHA-256
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);

      // Convert the hash to a hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      resolve(hashHex);
    });
  }

  // function findIdenticalHash(array, hashValue) {
  //   return new Promise(async(resolve , reject)=>{
  //     let hashstatus = await array.find((element) => element.hash === hashValue);
  //     if (hashstatus == true){
  //       reject('Hash is not new.')
  //     } else if (hashstatus == false){
  //       resolve("Hash is good")
  //     } else{
  //       alert('Hash has failed. If you are seeing this I broke something. Sorry please come back later.')
  //       reject()
  //     }
  //   })
  //   return
  // }

  // @ts-ignore
  async function findIdenticalHash(array, hashValue) {
    return new Promise((resolve, reject) => {
      let hashStatus = array.find((element) => element.hash === hashValue);

      if (hashStatus) {
        alert("New Threads need to have unique titles.");
        reject("Hash is not new.");
      } else {
        resolve("Hash is good");
      }
    });
  }
  //🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯
  //😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏
  //This code uses the varible PFPseed to generate user pictures with dicebear, we also save PFPseed to local storage
  import { createAvatar } from "@dicebear/core";
  import { loreleiNeutral } from "@dicebear/collection";

  let PFPseed = "Anon";

  function updateLocalStorageVariable(key, value, callback) {
    localStorage.setItem(key, value);
    if (typeof callback === "function") {
      callback();
    }
  }

  // @ts-ignore
  $: {
    updateLocalStorageVariable("currentAlias", PFPseed, () => {});
  }

  function checkLocalStorage() {
    if (localStorage.getItem("currentAlias")) {
      PFPseed = localStorage.getItem("currentAlias");
    } else {
      localStorage.setItem("currentAlias", "Anon");
      console.log("No Seed found creating new default " + PFPseed);
    }
  }

  checkLocalStorage();

  function dicebearGenerate(seed) {
    const avatar = createAvatar(loreleiNeutral, {
      seed: seed,
    });
    let dicebearGeneratedURI = avatar.toDataUriSync();
    //console.log("New Dicebear generated with seed: " + seed + dicebearGeneratedURI)
    return dicebearGeneratedURI;
  }

  // @ts-ignore
  $: PFPseed;
  //😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏
  //🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸
  //user map feature
  let hogmapState = false;
  let hogmapArray = [];
  let markersArray = [];
  let hogmapDocRef = doc(db, "hogmap", "mvphogmap");
  let intervalId;

  function toggleFunctionLoop() {
    if (hogmapState === true) {
      feedLiveGeoloactionToFirebase();

      intervalId = setInterval(feedLiveGeoloactionToFirebase, 3000);
    } else if (hogmapState === false) {
      feedLiveGeoloactionToFirebase();

      clearInterval(intervalId);
    }
  }

  async function feedLiveGeoloactionToFirebase() {
    geolocationGetCurrentPosition(async function (coords) {
      let hoglat = coords.lat;
      let hoglng = coords.lng;

      if (hogmapState === false) {
        hoglat = null;
        hoglng = null;
      }

      let userGeoPointMarker = {
        userAuthID: userAuthID,
        alias: PFPseed,
        GeoPoint: new GeoPoint(hoglat, hoglng),
      };

      await updateDoc(hogmapDocRef, {
        [userAuthID]: userGeoPointMarker,
      });
    });
  }

  function hogmapsubscribeToData() {
    const queryRef = query(collection(db, "hogmap"));
    return onSnapshot(
      queryRef,
      (querySnapshot) => {
        let tempArray = [];
        querySnapshot.forEach((doc) => {
          tempArray.push(doc.data());
        });
        hogmapArray = tempArray; // Update the array to trigger reactivity in Svelte
        createUserMarkers(hogmapArray, map, markersArray);
      },
      (error) => {
        console.log("Error fetching data:", error);
      },
    );
  }

  hogmapsubscribeToData();

  function createUserMarkers(dataArray, map, markersArray) {
    // Clear existing markers
    markersArray.forEach((marker) => {
      marker.setMap(null);
    });

    // Clear the markersArray
    markersArray.length = 0;

    // Iterate over each document in the dataArray
    dataArray.forEach((document) => {
      // Iterate over each user object in the document
      Object.values(document).forEach((userObject) => {
        const { GeoPoint, alias } = userObject;
        const { latitude, longitude } = GeoPoint;

        if (latitude !== 0 && longitude !== 0) {
          // @ts-ignore
          const position = new google.maps.LatLng(latitude, longitude);

          const customIcon = dicebearGenerate(alias);

          // @ts-ignore
          const marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: {
              url: customIcon, // URL to a custom marker icon
              // @ts-ignore
              scaledSize: new google.maps.Size(50, 50), // scaling the icon
            },
          });

          // Push the new marker to the markersArray
          markersArray.push(marker);
        }
      });
    });
  }
  //🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸
  //🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗
  //This code scrolls to posts based on the url
  let urlparams = new URLSearchParams(window.location.search);
  let urlparamsGoTo = urlparams.get("GoTo");
  // @ts-ignore
  $: if (masterPostArray.length > 0) {
    setTimeout(() => {
      scrollToElement(urlparamsGoTo);
    }, 1000);
  }

  let shareText = "Share";

  function shareLinkText() {
    shareText = "Copied!";
    setTimeout(() => {
      shareText = "Share";
    }, 1000);
  }
  //🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗
  //🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻
  //This code handles the fog of war effect
  let bermudaTriangle;
  let newUserPolygon = null;

  function spawnpolygon() {
    let tri;
    let spawnpoint = map.getCenter();
    tri = [
      { lat: spawnpoint.lat(), lng: spawnpoint.lng() },
      { lat: spawnpoint.lat() + 0.001, lng: spawnpoint.lng() + 0.001 },
      { lat: spawnpoint.lat() + 0.001, lng: spawnpoint.lng() - 0.001 },
      { lat: spawnpoint.lat(), lng: spawnpoint.lng() },
    ];

    // @ts-ignore
    bermudaTriangle = new google.maps.Polygon({
      paths: tri,
      strokeColor: "#FF0000",
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.15,
      editable: true,
    });

    bermudaTriangle.setMap(map);
  }

  async function savePolygonToFirebase() {
    newUserPolygon = JSON.stringify(
      bermudaTriangle.getPaths().getArray()[0].Fg,
    );
    let arrayID = crypto.randomUUID();
    await updateDoc(polyDataRef, {
      [arrayID]: JSON.parse(newUserPolygon),
    });
  }

  let drawnPolygons = new Set(); // Set to track drawn polygon IDs
  const polyDataRef = doc(db, "polygons", "mvpdocPoly");
  let currentpolygonId
  
  function drawPolygons() {
    // @ts-ignore
    const unsub = onSnapshot(doc(db, "polygons", "mvpdocPoly"), (doc) => {
      let dataArray = Object.entries(doc.data());
      dataArray.forEach((item) => {
        const polygonId = item[0];
        let coordinates = item[1];
        if (drawnPolygons.has(polygonId)) return;
        // @ts-ignore
        const polygon = new google.maps.Polygon({
          paths: coordinates,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });

        polygon.setMap(map);
        drawnPolygons.add(polygonId);

        // @ts-ignore
        google.maps.event.addListener(
          polygon,
          "dblclick",
          async function (event) {
            currentpolygonId = polygonId
            currentPopover = "Popoverpolygon";
            bermudaTriangle = polygon;
            polygon.setEditable(true);
          },
        );
      });
    });
  }

  async function deletePolyFromDB() {
    await updateDoc(polyDataRef, { [currentpolygonId]: deleteField() });
  }

  drawPolygons();

  //🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻
  //💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩
  //This is bad dumb code that I regret, but it works.

  //🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛
  //debugging code

  //🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑
</script>

<!-- 🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️ -->

<!-- 🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩 -->
<div class="topflex">
  <div class="flexrow" style="width: 100%;">
    <button
      on:click={() => {
        let targetClipboard = targetLat + ", " + targetLng;
        navigator.clipboard.writeText(targetClipboard);
      }}>Coordinates: {targetLat} {targetLng}</button
    >
  </div>
</div>
<!-- 🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕 -->
<div class="desktopFormat">
  <div class="midflex">
    <div id="map" style="height: 100%; border-radius:0%; "></div>
    <svg
      class="target , touchTransparent"
      class:invis={!(currentPopover === "PopoverinitialState")}
      width="44"
      height="44"
      viewBox="0 0 24 24"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r=".5" fill="currentColor" />
      <path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <path d="M12 3l0 2" />
      <path d="M3 12l2 0" />
      <path d="M12 19l0 2" />
      <path d="M19 12l2 0" />
    </svg>
    <div class="midMapOverlay , touchTransparent">
      {#if currentPopover === "PopoverinitialState"}
        <div class="flexrow">
          <button
            id="POP_UserProfile"
            class="squarebutton"
            on:click={() => {
              currentPopover = "PopoverAuth";
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path
                d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"
              />
            </svg>
          </button>
          <!-- 🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️ -->
          <button
            id="POP_centerMap"
            class="squarebutton"
            on:click={moveMapToCurrentLocation}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
              <path d="M12 2l0 2" />
              <path d="M12 20l0 2" />
              <path d="M20 12l2 0" />
              <path d="M2 12l2 0" />
            </svg>
          </button>
          <!-- 🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️ -->
          <button
            id="POP_NewThread"
            class="squarebutton"
            on:click={() => {
              currentPopover = "PopoverNewOP";
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          </button>
          <!-- 🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸🛸 -->
          <button
            id="POP_Radar"
            class="squarebutton"
            class:active={hogmapState}
            class:inactive={!hogmapState}
            on:click={() => {
              hogmapState = !hogmapState;
              toggleFunctionLoop();
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M21 12h-8a1 1 0 1 0 -1 1v8a9 9 0 0 0 9 -9" />
              <path d="M16 9a5 5 0 1 0 -7 7" />
              <path d="M20.486 9a9 9 0 1 0 -11.482 11.495" />
            </svg>
          </button>
          <!-- 🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻 -->
          <button
            id="POP_polygon"
            class="squarebutton"
            on:click={() => {
              currentPopover = "Popoverpolygon";
              spawnpolygon();
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M19 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M5 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M15 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M6.5 9.5l3.5 -3" />
              <path d="M14 5.5l3 1.5" />
              <path d="M18.5 10l-2.5 7" />
              <path d="M13.5 17.5l-7 -5" />
            </svg>
          </button>
          <!-- 🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫 -->
          <button
            id="POP_Ticket"
            class="squarebutton"
            on:click={() => {
              currentPopover = "PopoverTickets";
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 5l0 2" />
              <path d="M15 11l0 2" />
              <path d="M15 17l0 2" />
              <path
                d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2"
              />
            </svg>
          </button>
          <button
            id="POP_Satalite"
            class="squarebutton"
            on:click={() => {
              let currentMapType = map.getMapTypeId();

              if (currentMapType === "roadmap") {
                map.setMapTypeId("satellite");
              } else if (currentMapType === "satellite")
                map.setMapTypeId("roadmap");
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M13.5 4c4.694 0 8.5 2.686 8.5 6s-3.806 6 -8.5 6c-2.13 0 -4.584 -.926 -7.364 -2.777l-2.136 1.777v-3.33a46.07 46.07 0 0 1 -2 -1.67a46.07 46.07 0 0 1 2 -1.67v-3.33l2.135 1.778c2.78 -1.852 5.235 -2.778 7.365 -2.778z"
              />
              <path d="M10 15.5v4.5h6v-4" />
            </svg>
          </button>
        </div>
        <!-- 🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕🆕 -->
      {:else if currentPopover === "PopoverNewOP"}
        <div class="popover">
          <button
            class="squarebutton"
            on:click={() => {
              currentPopover = "PopoverinitialState";
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M10 10l4 4m0 -4l-4 4" />
            </svg>
          </button>

          <input type="file" accept="image/*" id="imageInput" />

          <input
            type="text"
            style="width: 100%; flex-grow:1; "
            placeholder="Make a new Thread"
            bind:value={userInputText}
          />
          <button
            class="squarebutton"
            on:click={() => {
              createNewThread();
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M15 9l-6 6" />
              <path d="M15 15v-6h-6" />
            </svg>
          </button>
        </div>
        <!-- ↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️↩️ -->
      {:else if currentPopover === "PopoverReply"}
        <div class="popover">
          <button
            class="squarebutton"
            on:click={() => {
              currentPopover = "PopoverinitialState";
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M10 10l4 4m0 -4l-4 4" />
            </svg>
          </button>
          <input type="file" accept="image/*" id="imageInput" />

          <div class="flexrow" style="flex-grow:1;">
            <input
              type="text"
              style="width: 100%; "
              placeholder="Send a Reply"
              bind:value={userInputText}
            />
          </div>
          <button on:click={replyInThread} class="squarebutton">
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M15 9l-6 6" />
              <path d="M15 15v-6h-6" />
            </svg>
          </button>
        </div>
        <!-- 🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔🆔 -->
      {:else if currentPopover === "PopoverAuth"}
        <div class="popover" style="justify-content:space-between;">
          <button
            class="squarebutton"
            on:click={() => {
              currentPopover = "PopoverinitialState";
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M10 10l4 4m0 -4l-4 4" />
            </svg>
          </button>
          <img
            src={dicebearGenerate(PFPseed)}
            style="height: 4rem;"
            alt="User Profile"
          />
          Welcome, <br />
          your account ID is: {userAuthID} <br />
          your account alias is: {PFPseed} <br />
          <input bind:value={PFPseed} maxlength="20" type="text" />
        </div>
        <!-- 🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃🔃 -->
      {:else if currentPopover === "Popoverpolygon"}
        <div class="flexrow">
          <!-- <button
            class="squarebutton"
            on:click={() => {
              currentPopover = "PopoverinitialState";
              bermudaTriangle.setMap(null);
              newUserPolygon = null;
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M10 10l4 4m0 -4l-4 4" />
            </svg>
          </button> -->
          <button
            class="squarebutton"
            id="savePolygonButton"
            on:click={() => {
              deletePolyFromDB();
              savePolygonToFirebase();
              currentPopover = "PopoverinitialState";
              bermudaTriangle.setMap(null);
              newUserPolygon = null;
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"
              />
              <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M14 4l0 4l-6 0l0 -4" />
            </svg>
          </button>
          <div class="flexgrow , flexrow , popover" style="width: 100%;">
            <div
              style="color:#FFF;  background-color:#000; width: 100px; height:20px;"
            >
              Dead Zone
            </div>
            <div
              style="color:#FFF;  background-color:rgb(0, 60, 255); width: 100px; height:20px;"
            >
              Event Zone
            </div>
          </div>
        </div>
      {:else if currentPopover === "PopoverTickets"}
        <button
          class="squarebutton"
          on:click={() => {
            currentPopover = "PopoverinitialState";
            bermudaTriangle.setMap(null);
            newUserPolygon = null;
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M10 10l4 4m0 -4l-4 4" />
          </svg>
        </button>
        <h1>yellow</h1>
      {/if}
    </div>
  </div>
  <!--🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖  -->
  <div class="botflex">
    {#if masterPostArray.length > 0}
      {#each masterPostArray as threadColumn}
        <div class="threadColumn">
          {#each threadColumn as post}
            <div class="post" id={post.DOMid}>
              <div class="flexrow">
                <button
                  style="flex-direction: row;  width: 2rem; height:2rem; overflow:hidden; background-color:#fff;"
                >
                  <img
                    src={dicebearGenerate(post.alias)}
                    alt="User Profile"
                  /></button
                >
                <button
                  on:click={() => {
                    let temp2 = post.DOMid;
                    let url = "https://outerlimits.zone/?GoTo=" + temp2;
                    navigator.clipboard.writeText(url);
                    shareLinkText();
                  }}>{shareText}</button
                >
                <button
                  on:click={() => {
                    let temp = post.GeoPoint;
                    const firebaseTOMapsFormat = {
                      lat: temp.latitude,
                      lng: temp.longitude,
                    };
                    map.panTo(firebaseTOMapsFormat);
                  }}>Map</button
                >
                <button
                  on:click={() => {
                    currentPopover = "PopoverReply";
                    replyID = post.ReplyID;
                    geoBindToOP = post.GeoPoint;
                    return replyID;
                  }}>Reply</button
                >
              </div>
              <b>{post.alias}:</b>
              {post.text}
              {#if post.imgRef !== "noimg"}
                <img src={post.imgRef} alt="Uploaded" />
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    {:else}
      <h1>Loading...</h1>
    {/if}
  </div>
</div>
