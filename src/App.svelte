<script>
  //🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗🐗
  //Import posthog settings
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
  //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  //🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰
  // Cheking for unique string
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

  
  
  //🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️
  //🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️🎙️
  //Hello I am building a bad system for getting and saving posts for my website.
  //Each new thread creates a document in my database and all comments go into an array inside that document.
  //This creates an unnecessarily large amount of document requests for each user that tries to access my website.
  //I know a better way to do this would be to come up with some logic to shard a thread array over multiple documents and add pagination.
  //But this only becomes an issue when I have a ton of users accessing my site and I can't be bothered to figure it out now.
  //Forgive me for building this awfulness.
  //The following functions take input from users and upload it to my firestore database

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
  //Shit code I made to test something once

//   import { Loader } from '@googlemaps/js-api-loader';

// let mapContainer;

// onMount(async () => {
//   const loader = new Loader({
//     apiKey: "AIzaSyBc-S84pU1_VSELNci_da0BDkdtu3wu6lk", // Replace with your API key
//     version: "weekly",
//   });

//   loader.load().then(() => {
//     const map = new google.maps.Map(mapContainer, {
//       center: { lat: -34.397, lng: 150.644 },
//       zoom: 8,
//     });
//   });
// });






  function hell() {
    console.log(threadArray);
    setInterval(hell, 3000);
  }
  

  let currentPopover = "default";

  //🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑
</script>

<!-- 🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️🗺️ -->

<!-- <gmp-map
  center="42.39844512939453,-71.14396667480469"
  zoom="14"
  map-id="9fb0905de1a56702"
>
  <gmp-advanced-marker
    position="42.39844512939453,-71.14396667480469"
    title="My location"
  >
  </gmp-advanced-marker>
</gmp-map> -->

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
            <div>Map: </div>
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

<!-- 
<main>
  {#if conditionalRenderStatus == "home"}
    <div class="grid_containerMain">
      <div class="grid_Search">
        <input placeholder="Search ..." aria-label="Search threads" />
      </div>
      <div class="grid_Settings">
        <button
          class="max2rem"
          aria-label="Open settings"
          on:click={() => {
            conditionalRenderStatus = "settings";
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
            />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          </svg>
        </button>
      </div>

      <div class="grid_Map">
        <gmp-map center="42.39844512939453,-71.14396667480469" zoom="14" map-id="DEMO_MAP_ID">
          <gmp-advanced-marker position="42.39844512939453,-71.14396667480469" title="My location">
          </gmp-advanced-marker>
        </gmp-map>
      </div>

      <div class="grid_Threads">
        {#each threadArray as thread}
          <button
            on:click={() => {
              lastActiveDoc = thread.id;
              conditionalRenderStatus = "posts";
              updateChatArray();
            }}
            class="postStyle"
            aria-label="Open thread"
          >
            <b>{thread.username}</b>
            {thread.title}
          </button>
        {/each}
      </div>

      <div class="grid_ThreadTextbox">
        <input
          bind:value={userInputNewThreadTitle}
          aria-label="Set thread name"
          placeholder="Create a geo-thread here ..."
        />
      </div>

      <div class="grid_SendThread">
        <button
          on:click={() => {
            createNewThreadAsDoc();
            disableButtonTimeout();
          }}
          disabled={isDisabled}
          class="max2rem"
          aria-label="Create thread"
        >
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M21.498 12.911l.206 -.208a.984 .984 0 0 0 0 -1.407l-8.845 -8.948a1.233 1.233 0 0 0 -1.718 0l-8.845 8.949a.984 .984 0 0 0 0 1.407l8.845 8.949a1.234 1.234 0 0 0 1.718 -.001l.08 -.081"
            />
            <path
              d="M2 12c.004 .086 .103 .178 .296 .246l8.845 2.632c.459 .163 1.259 .163 1.718 0l2.634 -.784m5.41 -1.61l.801 -.238c.195 -.07 .294 -.156 .296 -.243"
            />
            <path d="M12 2.12v19.76" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
          </svg>
        </button>
      </div>
    </div>

    
  {:else if conditionalRenderStatus == "posts"}
    <div class="grid_containerPosts">
       
      <div class="grid_PostButtons1">
        <div class="Map">
          <marquee
            >I wanted to put a compass here but programing is hard.</marquee
          >
        </div>
      </div>

      <div class="Settings">
        <button
          on:click={() => {
            conditionalRenderStatus = "home";
          }}
          class="max2rem"
          aria-label="Return to Threads"
        >
          <svg width="30" height="30" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 14l-4 -4l4 -4" />
            <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
          </svg>
        </button>
      </div>

      <div class="grid_Posts">
        {#each postArray as post}
          <div class="postStyle" style="background-color: var(--grey3);">
            <p>{post.text}</p>
          </div>
        {/each}
      </div>

      <div class="grid_PostTextbox">
        <input
          bind:value={userInputNewPost}
          aria-label="Set post text"
          placeholder="Reply to this geo-thread here ..."
        />
      </div>

      <div class="grid_SendPost">
        <button
          on:click={() => {
            appendDoc();
            disableButtonTimeout();
          }}
          disabled={isDisabled}
          class="max2rem"
          aria-label="Send Post"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#2c3e50"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 14l11 -11" />
            <path
              d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
            />
          </svg>
        </button>
      </div>

      
      <div class="grid_PostButtons2">
        <div class="Map">
          <marquee> New post functions coming soon! </marquee>
        </div>
      </div>
    </div>
  {:else if conditionalRenderStatus == "settings"}
    <h1>Settings comming soon</h1>
    <button on:click={()=>{conditionalRenderStatus = "home";}}>Go back</button>
  {/if}
</main> -->
