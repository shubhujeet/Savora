import { app } from "../firebase_config.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";


const auth = getAuth(app);

const forgotForm = document.querySelector(".forgotForm");

forgotForm.addEventListener("submit", function(e){
  e.preventDefault();
  const email = forgotForm.email.value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("password email send");
      alert("Password recovery email send, please check your email!");
      // Password reset email sent!
      // ..
      console.log("password email send");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });


})

// sendPasswordResetEmail(auth, "shubhujeet.ghosh.18161@ves.ac.in")
//   .then(() => {
//     console.log("password email send");
//     alert("password email send");
//     // Password reset email sent!
//     // ..
//     console.log("password email send");
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

//   import { getAuth, updatePassword } from "firebase/auth";

// const auth = getAuth();

// const user = auth.currentUser;
// const newPassword = getASecureRandomPassword();

// updatePassword(user, newPassword).then(() => {
//   // Update successful.
// }).catch((error) => {
//   // An error ocurred
//   // ...
// });