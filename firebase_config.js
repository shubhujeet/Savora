import {
    initializeApp
 } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// import { 
//     auth
//  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

 const firebaseConfig = {
    apiKey: "AIzaSyCOJnfAEBKD0_f3V4dmIE032ry07fwd6Aw",
    authDomain: "contactform-f15cc.firebaseapp.com",
    databaseURL: "https://contactform-f15cc-default-rtdb.firebaseio.com",
    projectId: "contactform-f15cc",
    storageBucket: "contactform-f15cc.appspot.com",
    messagingSenderId: "890925609220",
    appId: "1:890925609220:web:d0140ea86147d23e856051"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);



