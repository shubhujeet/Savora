// import './style.css'

// firebase-app
import {
  app
} from "./firebase_config.js";

// firebase-auth
import {
  signOut,
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// firebase-firestore
import {
  doc,
  addDoc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



// Inititialising firebase auth
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// collection ref
const savora = collection(db, '/savora');

// const data = [];

// getDocs(savora)
//     .then((snapshot) => {
//         // console.log(snapshot.docs);
//         snapshot.docs.forEach((doc) => {
//             data.push({ ...doc.data(), id: doc.id });
//         })
//         console.log(data);
//     })
//     .catch(err => {
//         console.log(err.code + "::" + err.message);
//     })


// console.log(data)


const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10
}

// let pc = new RTCPeerConneciton(servers);
let pc = new RTCPeerConnection(servers)

let localStream = null
let remoteStream = null

// HTML elements
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');

webcamButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  pc.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  callButton.disabled = false;
  answerButton.disabled = false;
  webcamButton.disabled = true;
}


// 2. Create an offer
callButton.onclick = async () => {
  // Reference Firestore collections for signaling
  const offerCandidates = collection(savora, 'calls/offerCandidates');
  const answerCandidates = collection(savora, 'calls/answerCandidates');

  callInput.value = savora.id;
  console.log(savora.id)
  console.log(offerCandidates)

  // // Get candidates for caller, save to db
  pc.onicecandidate = event => {
    event.candidate
    if (event.candidate) {
      addDoc(collection(db, "savora", "calls", "offerCandidates"), event.candidate.toJSON())
    }

  };

  const offerDescription = await pc.createOffer()
  await pc.setLocalDescription(offerDescription)

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type
  }

  await updateDoc(doc(savora, "calls"), {
    offer: offer
  })

}

onSnapshot(collection(db, "savora", "calls", "answerCandidates"), (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const candidate = new RTCIceCandidate(change.doc.data());
      pc.addIceCandidate(candidate);
      console.log("New city added: ", change.doc.data());
    } else if (change.type === "modified") {
      console.log("City modified: ", change.doc.data());
    } else if (change.type === "removed") {
      console.log("City removed: ", change.doc.data());
    }
  });
});


// // When answered, add candidate to peer connection
// answerCandidates.onSnapshot(snapshot => {
//   snapshot.docChanges().forEach((change) => {
//     if (change.type === 'added') {
//       const candidate = new RTCIceCandidate(change.doc.data());
//       pc.addIceCandidate(candidate);
//     }
//   });
// });

hangupButton.disabled = false;



// 3. Answer the call with the unique ID
answerButton.onclick = async () => {
  // const callId = callInput.value;
  // const callDoc = firestore.collection('calls').doc(callId);
  // const answerCandidates = callDoc.collection('answerCandidates');

  const callId = doc(savora,"calls").id
  const answerCandidates = collection(savora,"calls","answerCandidates")

  console.log(callId)

  pc.onicecandidate = event => {
    if (event.candidate) {
      addDoc(collection(db, "savora", "calls", "answerCandidates"), event.candidate.toJSON())
    }
  };


  const callData = doc(savora,"calls")

  console.log(callData)
  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await updateDoc(doc(savora,"calls","answerCandidates"),{ answer });
onSnapshot(collection(db,"savora","calls","offerCandidates"),(snapshot)=>{
  snapshot.docChanges().forEach((change)=>{
    if (change.type === 'added') {
      let data = change.doc.data();
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  })
})


  // collection('offerCandidates').onSnapshot((snapshot) => {
  //   snapshot.docChanges().forEach((change) => {
  //     console.log(change)
  //     if (change.type === 'added') {
  //       let data = change.doc.data();
  //       pc.addIceCandidate(new RTCIceCandidate(data));
  //     }
  //   });
  // });


  hangupButton.disabled = false;
};

// 4. Hangup

hangupButton.onclick = async () => {
  pc.close();

  const callId = callInput.value;
  await collection('calls').doc(callId).delete();

  hangupButton.disabled = true;
}

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
