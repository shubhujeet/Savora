import { app } from "../firebase_config.js";

import {
  getAuth,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// Inititialising firebase auth
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// collection ref
// const colRefReg = collection(db, 'savora/users/user');

// collection ref
const colRef = collection(db, "savora/users/user");

let userList = [];

getDocs(colRef)
  .then((snapshot) => {
    // console.log(snapshot.docs);
    snapshot.docs.forEach((doc) => {
      userList.push({ ...doc.data(), id: doc.id });
    });

    console.log(userList);
  })
  .catch((err) => {
    console.log(err.code + "::" + err.message);
  });

console.log(userList.length);

const modal = document.querySelector(".modal");
const conf = document.getElementById("dialogConf");
conf.addEventListener("click", function (e) {
  modal.style.display = "none";
});

// local html varible
const signInForm = document.querySelector(".sub1");
const loginBtn = document.querySelector(".login");

signInForm.addEventListener("submit", (e) => {
  //     e.preventDefault()
  //     console.log(signInForm.email.value)
  // })

  // loginBtn.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = signInForm.email.value;
  const passwd = signInForm.password.value;

  if (email != null && passwd != null) {
    console.log("val are  there");
    signInWithEmailAndPassword(auth, email, passwd)
      .then((userCredential) => {
        console.log(userCredential);
        let adminFound = false;
        let visitorId = null;
        let adminId = null;
        for (let i = 0; i < userList.length; i++) {
          console.log(userList[i]["type"]);

          if (userList[i]["email"] == email) {
            if (
              userList[i]["type"] == "staff" ||
              userList[i]["type"] == "admin"
            ) {
              adminFound = true;
              adminId = userList[i]["id"]
              console.log("classified as admin");
              break;
            } else {
              adminFound = false;
              visitorId = userList[i]["id"]
              // confirm("Sign In successfull!");
              console.log("classified as user");
              break;
              // console.log(userCredential.user.email)
            }
          }
        }
        if (adminFound) {
          // modal.style.display = "flex";
          sessionStorage.setItem("user",adminId)
          sessionStorage.setItem("email",email)
          window.location.replace("../admin/dash/dash.html");
        } else {
          sessionStorage.setItem("user",visitorId)
          sessionStorage.setItem("email",email)
          window.location.replace("../dash/dash.html");
        }


      })
      .catch((error) => {
        switch (error.code) {
          case "auth/wrong-password":
            console.log("auth erorr");
            confirm("Invalid user or password");
            break;

          case "auth/user-not-found":
            console.log("user not found");
            confirm("Invalid user or password");
            break;

          default:
            confirm("Invalid user or password");
            console.log(error.code + "::::" + error.message);
        }
      });
  }
});

// Google Sign In  Popup implemetation

// const GoogleSignInReq = document.querySelector(".googleSignIn");
// const provider = new GoogleAuthProvider();

// const signUpGoogle = async () => {
//     try {
//         signInWithRedirect(auth, provider)

//     } catch (error) {
//         console.log(error)
//     }
// }

// const signUpGoogle = async () => {
//     try {
//         await signInWithPopup(auth, provider)
//         .then((result)=>{
//             const user = result.user;
//             console.log(user);
//         }).catch((err)=>{
//             console.log(err.code)
//             console.log(err.message)
//         })

//     } catch (error) {
//         console.log(error)
//     }
// }

// async function CheckIsAdmin(email) {

//     for (let i = 0; i < userList.length; i++) {
//         console.log("loop")
//         if (userList[i]['email'] == email) {
//             if (userList[i]['type'] == "staff" || userList[i]['type'] == "admin") {
//                 modal.style.display = "flex";
//                 console.log("async admin");
//                 return true;
//             }
//             else {
//                 // confirm("Sign In successfull!");
//                 console.log("async visitor");
//                 return false;
//                 // window.location.replace("../index/index5.html");
//             }
//         }
//     }

// }

async function checkAdmin(pos, email) {
  return new Promise((resolve, reject) => {
    if (userList[pos]["email"] == email) {
      if (
        userList[pos]["type"] == "staff" ||
        userList[pos]["type"] == "admin"
      ) {
        console.log("async admin");
        resolve(true);
      } else {
        // confirm("Sign In successfull!");
        console.log("async visitor");
        resolve(false);
        // window.location.replace("../index/index5.html");
      }
    }
  });
}

async function getIsAdmin(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(email);
      console.log(userList.length);
      for (let i = 0; i < userList.length; i++) {
        console.log(userList[i]["type"]);

        if (userList[i]["email"] == email) {
          if (
            userList[i]["type"] == "staff" ||
            userList[i]["type"] == "admin"
          ) {
            console.log("async admin");
            resolve(true);
          } else {
            // confirm("Sign In successfull!");
            console.log("async visitor");
            resolve(false);
            // window.location.replace("../index/index5.html");
          }
          // const isAdmin = await checkAdmin(i, email);
          // if (isAdmin) {
          //     resolve(true);
          // console.log(isAdmin);
        } else {
          resolve(false);
        }
      }
      resolve(false);
    }, 2000);
  });
}

// // When the page loadss
// const debugRedirectResult = async () => {
//     try {
//         let result = await getRedirectResult(auth)
//         console.log("debug result "+result);
//         if (result) {
//             // const details = getAdditionalUserInfo(result)
//             // console.log(details) // details.isNewUser to determine if a new or returning user
//             // console.log(result.user.email);
//             console.log("email"+result.user.email);
//             const isAdminValue = await getIsAdmin(result.user.email);
//             console.log("is Admin"+isAdminValue);
//             if (isAdminValue) {
//                 console.log(isAdminValue);
//                 modal.style.display = "flex";
//             }
//             else {
//                 console.log(isAdminValue);
//                 // window.location.replace("../index/index5.html");
//             }
//             console.log("end");

//         } else {
//             console.log("Fine");
//             // Everything is fine
//         }
//     } catch (error) {
//         console.log(error) // Debug errors from redirect response
//     }
// }
// debugRedirectResult();

// console.log(screen.width, screen.height);

// GoogleSignInReq.addEventListener("click", function () {

//     signUpGoogle();

// })

// const provider = new GoogleAuthProvider();
// signInWithRedirect(auth, provider);
// getRedirectResult(auth)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access Google APIs.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;

//     // The signed-in user info.
//     const user = result.user;

//     // IdP data available using getAdditionalUserInfo(result)
//     // ...
//   }).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.customData.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });

// window.alert = function (message) {
//     // Do nothing.
//     return true;
// };
