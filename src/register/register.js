import {
    app
} from "../firebase_config.js";

// firebase-auth
import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// firebase-firestore
import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// collection ref
const colRef = collection(db, 'savora/users/user');



const signUpForm = document.querySelector(".sub1");
const registerBtn = document.querySelector(".register");


signUpForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    console.log("register")
    const email = signUpForm.email.value;
    const passwd = signUpForm.password.value;
    const cpasswd = signUpForm.cpassword.value;


    if (passwd === cpasswd) {

        createUserWithEmailAndPassword(auth, email, passwd)
        .then((userCredential) => {

            // Add email and password to the database
            addDoc(colRef, {
                email: email,
                type:"user" ,
                // profileImgUrl: "",
            })
                .then(() => {
                    window.location.replace("../dash/dash.html");
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                })
            signUpForm.password.value = '';
            signUpForm.cpassword.value = '';
        })
        .catch((error) => {

            switch(error.code){
                case "auth/email-already-in-use":
                    console.log("email already exists")
                    confirm("Invalid user or password")
                    break;
                default:
                    confirm("Invalid user or password")
                    console.log(error.code+":::::"+error.message)
            }
        });
    }
    else {
        alert("Password Doesn't match!");
    }

})