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
  import { onMount, onDestroy } from "svelte";
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
    getDocs,
    arrayUnion,
    GeoPoint,
    where,
    updateDoc,
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
      lat: 42.39859201048314,
      lng: -71.14404203872255,
    },

    zoom: 14,
  };

  const loader = new Loader({
    apiKey: "AIzaSyBc-S84pU1_VSELNci_da0BDkdtu3wu6lk",
    version: "weekly",
    mapIds: ["9fb0905de1a56702"],
    //...additionalOptions,
  });

  let map;
  let coords;
  let targetLat = 42.398593;
  let targetLng = -71.144041;
  let one = 1;

  loader
    .importLibrary("maps")
    .then(({ Map }) => {
      map = new Map(document.getElementById("map"), mapOptions);
      map.addListener("center_changed", () => {
        let center = map.getCenter();
        targetLat = center.lat();
        targetLng = center.lng();
        //console.log(targetLat, targetLng, ++one);
      });
      addAdvancedMarkers(map);
    })
    .catch((e) => {
      alert("error leading the google maps api :(");
    });
  //🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️
  //📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍
  function addAdvancedMarkers(map) {
    const markerPosition = { lat: 42.398593, lng: -71.144041 };
    // @ts-ignore
    const marker = new google.maps.Marker({
      position: markerPosition,
      map: map,
      // icon: {
      //   url: "path/to/custom/icon.png", // URL to a custom marker icon
      //   scaledSize: new google.maps.Size(50, 50), // scaling the icon
      // },
      // @ts-ignore
      animation: google.maps.Animation.DROP, // Optional animation
      title: "Hello World!", // Tooltip text
    });

    marker.addListener("click", () => {
      alert("You touched a pin, good for you!");
    });
  }

  function createMarkers(mainArray, map) {
    mainArray.forEach((subArray) => {
      if (subArray.length > 0 && subArray[0].GeoPoint) {
        const firstObject = subArray[0];
        // @ts-ignore
        const position = new google.maps.LatLng(
          firstObject.lat,
          firstObject.lng,
        );

        // @ts-ignore
        const marker = new google.maps.Marker({
          position: position,
          map: map,
          // Add any other marker properties here, like title, icon, etc.
        });

        // Optionally, add more advanced features like info windows here.
      }
    });
  }
  //📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍
  //🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐
  //This code calls the geolocation api to set the map at the users current location
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function moveMapToCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Latitude: " + latitude + ", Longitude: " + longitude);
          map.setCenter({ lat: latitude, lng: longitude });
        },
        function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
          }
        },
        options,
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
  //🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐🌐
  //🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️
  //This code uploads user content to the firestore database
  //⚠️⚠️⚠️⚠️⚠️WARNING I HAVE HARD CODED THE REFRENCE DOCUMENT THIS WILL BREAK AT 1MB OF DATA,⚠️⚠️⚠️⚠️⚠️
  //Note: you will need to come up with a method of recoding how close this document is to 1MB limit, and then move to a new document
  //when that limit is hit. Also you will need to fix the method for calling data to merge multiple documents. Sorry!

  let userInputCurrentUsername = "Anon";
  let userInputText;
  let currentActiveDoc = "mvpdoc";
  let currentActiveDocRef = doc(db, "threads", currentActiveDoc);

  async function createNewThread() {
    let arrayID = crypto.randomUUID();

    let threadData = [
      {
        author: "Anon",
        GeoPoint: new GeoPoint(targetLat, targetLng),
        timestamp: new Date(),
        text: userInputText,
        ReplyID: arrayID,
      },
    ];

    await updateDoc(currentActiveDocRef, { [arrayID]: threadData });

    userInputText = "";
    currentPopover = "PopoverinitialState";

  }

  //PostID is updated in the DOM
  let postID = "error";
  async function replyInThread() {
    let replyData = {
      author: "Anon",
      timestamp: new Date(),
      text: userInputText,
      ReplyID: postID,
    };
    await updateDoc(currentActiveDocRef, { [postID]: arrayUnion(replyData) });
    userInputText = "";
    currentPopover = "PopoverinitialState";
  }

  //🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️
  //📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡
  //This code downloads user content from the firestore database when the site is opened

  let currentPopover = "PopoverinitialState";
  let masterPostArray = [];

  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(db, "threads"));
      let tempArray = [];
      querySnapshot.forEach((doc) => {
        tempArray.push(...Object.values(doc.data()));
      });
      masterPostArray = tempArray; // Trigger reactivity
    } catch {
      console.log("Data Fetch Failed.");
    }
  }

  function subscribeToData() {
    const queryRef = query(collection(db, "threads"));

    return onSnapshot(
      queryRef,
      (querySnapshot) => {
        let tempArray = [];
        querySnapshot.forEach((doc) => {
          tempArray.push(...Object.values(doc.data()));
        });
        masterPostArray = tempArray; // Update the array to trigger reactivity in Svelte
        console.log(masterPostArray);
      },
      (error) => {
        console.log("Error fetching data:", error);
      },
    );
  }

  let unsubscribe;

  onMount(() => {
    fetchData();
    unsubscribe = subscribeToData();
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe(); // Unsubscribe when the component is destroyed
    }
  });

  //📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡
  //🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯🚯

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

  let isDisabled = false;

  function disableButtonTimeout() {
    isDisabled = true;
    setTimeout(() => {
      isDisabled = false;
    }, 10000);
  }

  //💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩

  //🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛
  //debugging code

  let testarray = [
    [
      { text: "thread op 1" },
      { text: "reply 1" },
      { text: "reply 2" },
      { text: "reply 3" },
    ],
    [{ text: "thread op 2" }, { text: "reply 1" }],
    [
      { text: "thread op 3" },
      { text: "reply 1" },
      { text: "reply 2" },
      { text: "reply 3" },
      { text: "reply 4" },
      { text: "reply 5" },
    ],
    [{ text: "thread op 4" }, { text: "reply 1" }, { text: "reply 2" }],
  ];

  //🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑
</script>

<!-- 🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️ -->
<div id="map" style="height: 100%; border-radius:0%; "></div>
<svg
  class="target , touchTransparent"
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
<div class="overlay">
  <div class="overlayPad">
    <!-- 🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩🎩 -->
    <div class="topflex">
      <div class="popoverrow" style="width: 100%;">
        <button
          on:click={() => {
            let targetClipboard = targetLat + ", " + targetLng;
            navigator.clipboard.writeText(targetClipboard);
          }}>Coordinates: {targetLat} {targetLng}</button
        >
      </div>
    </div>
    <!-- 🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕 -->
    <div class="midflex">
      {#if currentPopover === "PopoverinitialState"}
        <div class="popover , touchTransparent">
          <div class="popover">
            <button
              class="squarebutton"
              on:click={() => {
                currentPopover = "PopoverNewOP";
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                <path d="M9 12h6" />
                <path d="M12 9v6" />
              </svg>
            </button>
            <button class="squarebutton" on:click={moveMapToCurrentLocation}>
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
                <path d="M12 2l0 2" />
                <path d="M12 20l0 2" />
                <path d="M20 12l2 0" />
                <path d="M2 12l2 0" />
              </svg>
            </button>
          </div>
        </div>
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
        </div>
        <div class="popover">
          <div class="popoverrow" style="width: 100%;">
            <input
              type="text"
              style="width: 100%; height:4rem; "
              placeholder="Make a new Thread"
              bind:value={userInputText}
            />
          </div>
          <button class="squarebutton" on:click={createNewThread}>
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M15 9l-6 6" />
              <path d="M15 15v-6h-6" />
            </svg>
          </button>
        </div>
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
        </div>
        <div class="popover">
          <div class="popoverrow" style="width: 100%;">
            <input
              type="text"
              style="width: 100%; height:4rem; "
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
      {/if}
    </div>
    <!--🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖  -->
    <div class="botflex">
      {#if masterPostArray.length > 0}
        {#each masterPostArray as threadColumn}
          <div class="threadColumn">
            {#each threadColumn as post}
              <div class="post">
                <div class="popoverrow">
                  <button>Anon</button>
                  <button>Share</button>
                  <button>Like</button>
                  <button
                    on:click={() => {
                      currentPopover = "PopoverReply";
                      postID = post.ReplyID;
                      return postID;
                    }}>Reply</button
                  >
                </div>
                {post.text}
              </div>
            {/each}
          </div>
        {/each}
      {:else}
        <h1>Loading...</h1>
      {/if}
    </div>
  </div>
</div>
