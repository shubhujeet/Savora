import { app } from "../firebase_config.js";

import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
  doc,
  where,
  query,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import {
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getStorage,
  ref,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Collection Reference

// const colRef = collection(db,"/savora/users/user")

// Catch errors

// `/savora/users/user/${user}/myplans`
const user = sessionStorage.getItem("user");
const email = sessionStorage.getItem("email");
const login = document.querySelector(".login");
const logout = document.querySelector(".logout");
const myPlan = document.querySelector(".myPlan");
const upload = document.querySelector(".upload");
const profile = document.querySelector(".profile");
const userEmail = document.querySelector("#userEmail");
const userName = document.querySelector("#userName");
const profileImgUser = document.querySelector(".profileImgUser");
const allergies = document.querySelector("#allergies");
const foodRestriction = document.querySelector("#foodRestriction");

let users = [];

async function callToDB() {
  const q = query(
    collection(db, "savora", "users", "user"),
    where("email", "==", email)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push({ ...doc.data(), id: doc.id });
  });
}

callToDB();

const profileElement = document.querySelector("#profileElement");
function addImgToProfile(src) {
  profileElement.replaceChildren();
  let img = document.createElement("img");
  img.setAttribute("src", src);
  // img.classList.append("profilePic")
  img.style.width = "50px";
  img.style.height = "50px";
  img.style.borderRadius = "48%";
  profileElement.append(img);
}

let userImg = sessionStorage.getItem("userImg");
if (userImg) {
  addImgToProfile(userImg);
}

setTimeout((e) => {
  console.log(users);
  if (users[0].name) {
    userName.value = users[0].name;
  }
  if (users[0].profileImgUrl) {
    sessionStorage.setItem("userImg", users[0].profileImgUrl);
    profileImgUser.setAttribute("src", users[0].profileImgUrl);
    addImgToProfile(users[0].profileImgUrl);
  }
  if (users[0].allergies) {
    allergies.value = users[0].allergies;
  }
  if (users[0].foodRestriction) {
    foodRestriction.value = users[0].foodRestriction;
  }
}, 3000);

logout.addEventListener("click", (e) => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Logut successful !!");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("userImg");
      window.location.replace("../dash/dash.html");
    })
    .catch((error) => {
      // An error happened.
    });
});

console.log(user);

if (user == null) {
  login.style.display = "flex";
  logout.style.display = "none";
  myPlan.style.display = "none";
  upload.style.display = "none";
  profile.style.display = "none";
} else {
  login.style.display = "none";
  myPlan.style.display = "flex";
  logout.style.display = "flex";
  upload.style.display = "flex";
  profile.style.display = "flex";
  userEmail.value = email;
}

// Icon section

function uploadProcess(file, fileNm) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, "/savora/video/" + fileNm);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // progressBar.style.width = `${progress}%`;
        // progressText.textContent = `${progress}%`;

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        alert("upload failed!");

        reject(error);
      },
      async () => {
        // console.log("prompt");
        // let fileDesc = prompt(`Enter Content which should be displayed along with this file (${fileNm}):`);

        let profileUrl = "";

        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          profileUrl = downloadURL;
          console.log("File available at", downloadURL);

          let id = sessionStorage.getItem("user");
          const userRef = doc(db, "savora", "users", "user", id);

          await updateDoc(userRef, {
            profileImg: fileNm,
            profileImgUrl: profileUrl,
          })
            .then(() => {
              // orgFileList.push(fileNm)
              // fetchFile(fileNm, fileDesc)
              // let profileImgUser = document.querySelector(".profileImgUser")
              console.log(profileUrl, "file");
              profileImgUser.setAttribute("src", profileUrl);

              resolve();
            })
            .catch((error) => {
              alert("Error while uploading!");
              console.log(error.code);
              console.log(error.message);
            });
        });
      }
    );
  });
}

const addIcon = document.querySelector(".uploadFile");
addIcon.addEventListener("change", (e) => {
  console.log("click");
  let file = e.target.files;
  console.log(file[0].name);
  uploadProcess(file[0], file[0].name);
});

const personalForm = document.querySelector(".personalForm");
personalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let id = sessionStorage.getItem("user");
  const userRef = doc(db, "savora", "users", "user", id);
  await updateDoc(userRef, {
    name: personalForm.userName.value,
  }).then(() => {
    alert("Changes Saved Successfully!");
  });
});

const dietaryForm = document.querySelector(".dietaryForm");
dietaryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let id = sessionStorage.getItem("user");
  const userRef = doc(db, "savora", "users", "user", id);
  await updateDoc(userRef, {
    allergies: dietaryForm.allergies.value,
    foodRestriction: dietaryForm.foodRestriction.value,
  }).then(() => {
    alert("Changes Saved Successfully!");
  });
});

// View window change

const viewIng1 = document.querySelector(".viewIng1");
const viewIng2 = document.querySelector(".viewIng2");
const viewIng3 = document.querySelector(".viewIng3");
const page1 = document.querySelector(".page1");
const page2 = document.querySelector(".page2");
const page3 = document.querySelector(".page3");
// const saveView = document.querySelector(".saveView")

viewIng1.addEventListener("click", (e) => {
  page1.style.display = "block";
  page2.style.display = "none";
  page3.style.display = "none";
});

viewIng2.addEventListener("click", (e) => {
  page1.style.display = "none";
  page2.style.display = "block";
  page3.style.display = "none";
});

viewIng3.addEventListener("click", (e) => {
  page1.style.display = "none";
  page2.style.display = "none";
  page3.style.display = "block";
});

// saveView.addEventListener('click', (e) => {
//     alert("Changes saved!")
//     console.log('save')
// })
