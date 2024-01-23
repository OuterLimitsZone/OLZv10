<script>
  //🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗
  //This code connects the project to posthog for analytics
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
  //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  //🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰
  //This code proccess user generated text and rejects most spam
  async function normalizeText(newString) {
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

  async function hashStringSHA256(str) {
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
  //🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰
  //🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️
  //This code connects the project to the google maps api
  import { Loader } from "@googlemaps/js-api-loader";
  let mapOptions = {
    mapId: "9fb0905de1a56702",
    disableDefaultUI: true,
    fullscreenControl: false,
    center: {
      lat: 42.398593,
      lng: -71.144041,
    },
    zoom: 14,
  };

  const loader = new Loader({
    apiKey: "AIzaSyBc-S84pU1_VSELNci_da0BDkdtu3wu6lk",
    version: "weekly",

    //...additionalOptions,
  });

  loader
    .importLibrary("maps")
    .then(({ Map }) => {
      new Map(document.getElementById("map"), mapOptions);
    })
    .catch((e) => {
      alert("error leading the google maps api :(");
    });

  //🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️
  //🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️
  //This code uploads user content to the firestore database 



  //🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️

  let shardArray = [];

  function pullShardArray() {}

  let userInputTitle;
  let userInputLat;
  let userInputLong;
  let userInputHash;
  let userInputTime;
  let userInputName;
  let userInputText;
  let userInputTags;
  let userInputNomalized;

  function appendShardArray() {
    let newtimestamp = new Date();
    let newConcatName =
      newtimestamp.toUTCString() + " " + userInputNewThreadTitle + " ";
    //create a new document in the root collection with the following data
    setDoc(doc(db, "root", newConcatName), {
      timestamp: serverTimestamp(),
      title: userInputNewThreadTitle,
      username: userInputCurrentUsername,
      location: new GeoPoint(liveLat, liveLong),
      // nomalized: titleNormalized,
      // hash: titleNormalizedAndHashed,
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
  }

  let threadArray = [];
  let postArray = [];

  onMount(async () => {
    const fetchRootData = () => {
      //query the databse for all documents in the root collection
      const rootCollection = collection(db, "root");
      const orderedQuery = query(rootCollection, orderBy("timestamp", "desc"));
      //add a listener to the db and on update clear and rewrite the posts array with new data
      onSnapshot(orderedQuery, (snapshot) => {
        threadArray = [];
        snapshot.forEach((doc) => {
          threadArray.push({ id: doc.id, ...doc.data() });
        });
      });
    };
    //loop this function
    fetchRootData();
  });

  let userInputCurrentUsername = "Anon";
  let userInputNewThreadTitle = "";
  let userInputNewPost = "";
  let liveLong = null;
  let liveLat = null;

  function liveGeoCheck() {
    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(success, error, options);

      function success(geo) {
        const crd = geo.coords;
        liveLong = crd.longitude;
        liveLat = crd.latitude;
        resolve(); // Resolve the promise after getting the position
      }

      function error(err) {
        console.log("unable to access geolocation", err);
        reject(err); // Reject the promise in case of an error
      }
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

  async function createNewThreadAsDoc() {
    //Start by requesting a new geolocation if position data is not already availible
    if (liveLat == null) {
      await liveGeoCheck();
    }

    let titleNormalized = await normalizeText(userInputNewThreadTitle);
    let titleNormalizedAndHashed = await hashStringSHA256(titleNormalized);

    const identicalHash = await findIdenticalHash(
      threadArray,
      titleNormalizedAndHashed,
    );
    if (identicalHash == "Hash is good") {
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
        username: userInputCurrentUsername,
        location: new GeoPoint(liveLat, liveLong),
        nomalized: titleNormalized,
        hash: titleNormalizedAndHashed,
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
    }
  }

  let isDisabled = false;

  function disableButtonTimeout() {
    isDisabled = true;
    setTimeout(() => {
      isDisabled = false;
    }, 10000);
  }

  let conditionalRenderStatus = "home";
  let lastActiveDoc = "";

  //Edit the current doc
  function appendDoc() {
    const mapData = {
      //Timestamp: serverTimestamp(),
      text: userInputNewPost,
      author: userInputCurrentUsername,
    };

    let lastDoc = doc(collection(db, "root"), lastActiveDoc);
    setDoc(lastDoc, { posts: arrayUnion(mapData) }, { merge: true });
    userInputNewPost = "";
  }

  function updateChatArray() {
    let docRef = doc(db, "root", lastActiveDoc);
    onSnapshot(docRef, (doc) => {
      const data = doc.data();
      postArray = data.posts;
    });
  }

  //💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩
  
  

  //🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛
  //debugging code
  let currentPopover = "default";

  function logloop() {
    console.log(threadArray);
    setInterval(logloop, 3000);
  }
  
  //🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑
</script>

<!-- 🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️ -->
<div id="map" style="height: 100%; border-radius:0%; "></div>

<div class="overlay">
  <div class="overlayPad">
    <!-- 🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩 -->
    <div class="topflex">
      <button>Create new thread</button>
      <button>Edit settings</button>
    </div>
    <!-- 🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕 -->
    <div class="midflex">
      {#if currentPopover === "default"}
        <div class="popover">
          <div class="popoverrow">
            <div>Map:</div>
            <button>Create a new thread</button>
          </div>

          <div class="popoverrow">
            <button>Create a new thread</button>
          </div>
        </div>
      {:else if currentPopover === "idk"}
        <div class="popover">
          <h2>create a new thread</h2>
          <input type="text" placeholder="title" />
          <input type="text" placeholder="location" />
          <input type="text" placeholder="name" />
          <input type="text" placeholder="time" disabled />
          <button>post</button>
        </div>
      {:else if currentPopover === "replyToPost"}
        <div class="popover"><p>create a new post</p></div>
      {:else if currentPopover === "home"}
        <div></div>
      {/if}
    </div>
    <!--🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖  -->
    <div class="botflex">
      {#each postArray as post}
        <div class="threadColumn">
          <div class="post">
            <p>{post.title}</p>
          </div>
        </div>
      {/each}

      <div class="threadColumn">
        <div class="post"></div>
        <div class="post"></div>
        <div class="post"></div>
        <div class="post"></div>
        <div class="post"></div>
        <div class="post"></div>
        <div class="post"></div>
        <div class="post"></div>
      </div>
      <div class="threadColumn">
        <div class="post"></div>
      </div>
    </div>
  </div>
</div>