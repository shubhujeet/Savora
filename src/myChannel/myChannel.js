// firebase-app
import { app } from "../firebase_config.js";

// firebase-firestore
import {
  getFirestore,
  collection,
  deleteDoc,
  updateDoc,
  getDocs,
  addDoc,
  where,
  query,
  doc,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import {
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getStorage,
  ref,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const auth = getAuth(app);

// `/savora/users/user/${user}/myplans`

const user = sessionStorage.getItem("user");
const login = document.querySelector(".login");
const logout = document.querySelector(".logout");
const myPlan = document.querySelector(".myPlan");
const upload = document.querySelector(".upload");
const profile = document.querySelector(".profile");

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
}

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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Colection Ref
// const colRefImg = collection(db,);

const colRef = collection(db, "/savora/recipe/recipes");

let recipeCollection = [];
let email = sessionStorage.getItem("email");

const q = query(
  collection(db, "savora", "recipe", "recipes"),
  where("contributor", "==", email)
);

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  recipeCollection.push({ ...doc.data(), id: doc.id });
});

function addToMyUpload(parent, object) {
  let email = sessionStorage.getItem("email");

  if (email != null) {
    let myUploadCard = myUploadTemplate.content.cloneNode(true).children[0];

    let myUploadFileName = myUploadCard.querySelector(".myUploadedFileName");
    myUploadFileName.innerHTML = object["filenm"];

    parent.append(myUploadCard);

    let myUploadDelete = myUploadCard.querySelector(".myUploadDelete");

    myUploadDelete.addEventListener("click", async (e) => {
      let confirmValue = confirm(
        `Are you sure you want to delete ${object["recipenm"]}`
      );

      if (confirmValue) {
        let did = "";
        const q = query(
          collection(db, "savora", "recipe", "recipes"),
          where("filenm", "==", object["filenm"])
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          did = doc.id;
          console.log(did);
        });

        await deleteDoc(doc(colRef, did))
          .then(async () => {
            // Create a reference to the file to delete
            const desertRef = ref(storage, `/savora/video/${object["filenm"]}`);

            // Delete the file
            await deleteObject(desertRef)
              .then(() => {
                e.target.parentElement.parentElement.remove();
                alert("Document Deleted Successfully!");
                // File deleted successfully
              })
              .catch((error) => {
                // Uh-oh, an error occurred!
              });
          })
          .catch((error) => {
            console.log(error.code);
            console.log(error.message);
          });
      }
    });
  }
}

let myUploadTemplate = document.querySelector("[data-myUpload-template]");
let myUploads = document.querySelector(".myUploads");

for (let i = 0; i < recipeCollection.length; i++) {
  addToMyUpload(myUploads, recipeCollection[i]);
}

// getDocs(colRef)
//   .then((snapshot) => {
//     let d = [];
//     snapshot.docs.forEach((doc) => {
//       d.push({ ...doc.data(), id: doc.id });
//     });

//     for (let i = 0; i < d.length; i++) {
//       depList.push(d[i]["dept"]);
//       fetchDept(d[i]["dept"]);
//     }
//   })
//   .catch((err) => {
//     console.log(err.code + "::" + err.message);
//   });

const uploadBtn = document.querySelector(".uploadBtn");
const uploadVideoFile = document.querySelector(".uploadVideoFile");
const uploadForm = document.querySelector(".viewContent");
const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");
const view = document.querySelector(".view");
const viewClose = document.querySelector(".close");

viewClose.addEventListener("click", (e) => {
  view.style.display = "none";
});

uploadBtn.addEventListener("click", (e) => {
  console.log("click  ");
  view.style.display = "block";
});

let fileItem;
let fileName;

uploadVideoFile.addEventListener("change", (e) => {
  console.log(e.target.files[0]);
  fileItem = e.target.files[0];
  fileName = fileItem.name;
});

console.log("mychannel");

uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.log(fileName,fileItem)
  // console.log("click")
  let recpNm = uploadForm.recipeNm.value;
  let ingredients = uploadForm.ingredientInp.value;
  let recipeSteps = uploadForm.recipeStepsInp.value;
  console.log(
    uploadForm.recipeNm.value,
    uploadForm.ingredientInp.value,
    recipeSteps
  );

  let email = sessionStorage.getItem("email");

  uploadProcess(
    fileItem,
    fileName,
    recpNm,
    ingredients,
    recipeSteps,
    email
  ).then(() => {
    uploadForm.reset();
  });
});

function uploadProcess(
  file,
  fileNm,
  recpNm,
  ingredients,
  recipeSteps,
  contributorNm
) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, "/savora/video/" + fileNm);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

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

        let videoUrl = "";

        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          videoUrl = downloadURL;
          console.log("File available at", downloadURL);

          const d = new Date();
          let miliseconds = String(d.getTime());
          let fileNmM = miliseconds + fileNm

          await addDoc(collection(db, "/savora/recipe/recipes"), {
            filenm: fileNmM,
            recipenm: recpNm,
            ingredients: ingredients,
            contributor: contributorNm,
            steps: recipeSteps,
            videoUrl: videoUrl,
            timestamp: miliseconds,
          })
            .then(() => {
              // orgFileList.push(fileNm)
              // fetchFile(fileNm, fileDesc)
              addToMyUpload(myUploads, {
                filenm: fileNmM,
                recipenm: recpNm,
                ingredients: ingredients,
                contributor: contributorNm,
                steps: recipeSteps,
                videoUrl: videoUrl,
                timestamp: miliseconds,
              });
              alert("File upload successful!");
              resolve();
            })
            .catch((error) => {
              console.log(error.code);
              console.log(error.message);
            });
        });
      }
    );
  });
}

// // Getting the images count
// getDocs(colRefImg)
//     .then((snapshot) => {
//         snapshot.docs.forEach((doc) => {
//             imagesList.push({ ...doc.data(), id: doc.id })
//         })

//         for (let i = 0; i < imagesList.length; i++) {
//             console.log(imagesList[i]['orgFile'])
//             orgFileList.push(imagesList[i]['orgFile'])
//             fetchFile(imagesList[i]['orgFile'], imagesList[i]['desc'])
//         }
//         console.log(orgFileList);
//     }).catch(err => {
//         console.log(err.code + "::" + err.message);
//     })

// function checkArray(arr, val) {
//     for (let i = 0; i < arr.length; i++) {

//         if (arr[i].toLowerCase() == val.toLowerCase()) {
//             return true;
//         }
//     }
//     return false;
// }

// uploadFile.addEventListener("change", async function (e) {

//     let files = e.target.files
//     for (let i = 0; i < files.length; i++) {

//         if (checkArray(orgFileList, files[i].name)) {
//             alert(" x File already exist!")
//         }
//         else {
//             let url = await uploadProcess(files[i], files[i].name);
//         }

//     }
// })

// function uploadProcess(file, orgFile) {
//     return new Promise((resolve, reject) => {
//         const storageRef = ref(storage, "departments/"+deptName+"/" + orgFile);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         uploadTask.on('state_changed',
//             (snapshot) => {
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 console.log('Upload is ' + progress + '% done');

//                 switch (snapshot.state) {
//                     case 'paused':
//                         console.log('Upload is paused');
//                         break;
//                     case 'running':
//                         console.log('Upload is running');
//                         break;
//                 }
//             },
//             (error) => {
//                 // Handle unsuccessful uploads
//                 reject(error)

//             },
//             async () => {
//                 console.log("prompt");
//                 let fileDesc = prompt(`Enter Content which should be displayed along with this file (${orgFile}):`);
//                 await addDoc(collection(db, `/sm/departments/${deptName}`), {
//                     orgFile: orgFile,
//                     desc: fileDesc
//                 })
//                     .then(() => {
//                         orgFileList.push(orgFile)
//                         fetchFile(orgFile, fileDesc)
//                         resolve()
//                     })
//                     .catch((error) => {
//                         console.log(error.code);
//                         console.log(error.message);
//                     })

//             }
//         );
//     })
// }

// imageRefs.addEventListener("click", async function (e) {

//     if (e.target.id == "deleteFile") {
//         // confirm("Delete file");
//         // confirm(e.target.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML)

//         if (confirm("Deleting any file will permanently remove the file.\n This process will be irrecoverable.\nAre you sure you want to delete the file?") == true) {
//             let ele = e.target.parentElement.previousElementSibling.previousElementSibling
//             // confirm(ele)
//             let did = "";
//             const q = query(collection(db, `/sm/departments/${deptName}`), where("orgFile", "==", ele.innerHTML));
//             await getDocs(q)
//                 .then((querySnapshot) => {

//                     querySnapshot.forEach((doc) => {
//                         console.log(doc.id, " => ", doc.data());
//                         did = doc.id;
//                     })
//                 })
//                 .catch(err => {
//                     console.log(err.code)
//                     console.log(err.message)
//                 })
//             // Create a reference to the file to delete
//             const deleteRef = ref(storage,"departments/"+deptName+"/" + ele.innerHTML);

//             // Delete the file from storage
//             deleteObject(deleteRef)
//                 .then(() => { })
//                 .catch((err) => { })

//             await deleteDoc(doc(db, "sm","departments", deptName, did));
//             e.target.parentElement.parentElement.parentElement.remove()

//         }

//     }
//     else if (e.target.id == "editFile") {
//         // confirm("edit file")
//         let newDesc = prompt('Enter New description:');
//         let ele = e.target.parentElement.previousElementSibling.previousElementSibling
//         // confirm(ele)
//         let did = "";
//         const q = query(collection(db, `/sm/departments/${deptName}`), where("orgFile", "==", ele.innerHTML));
//         await getDocs(q)
//             .then((querySnapshot) => {

//                 querySnapshot.forEach((doc) => {
//                     console.log(doc.id, " => ", doc.data());
//                     did = doc.id;
//                 })
//             })
//             .catch(err => {
//                 console.log(err.code)
//                 console.log(err.message)
//             })

//         await updateDoc(doc(db, "sm","departments",deptName, did), {
//             desc: newDesc
//         })
//             .then(() => {
//                 e.target.parentElement.previousElementSibling.innerHTML = newDesc;
//             })
//             .catch((err) => {
//                 console.log(err.code);
//                 console.log(err.message)
//             })
//     }
// })
