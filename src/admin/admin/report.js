import { app } from "../../firebase_config.js";

import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
  or,
  doc,
  and,
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
  deleteObject,
  getStorage,
  ref,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// collection ref
const colRef = collection(db, "/savora/recipe/recipes");
const userColRef = collection(db, "/savora/users/user");
// collection(db, `/savora/recipe/recipes/${objectOfVideo["id"]}/comments`)

let recipeList = [];
let contributorList = [];
const totalReipeListCon = document.querySelector("#totalRecipeListCon");

getDocs(colRef)
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      recipeList.push({ ...doc.data(), id: doc.id });
    });
    // console.log(recipeList);

    recipeList.sort((a,b)=> b.timestamp - a.timestamp)

    for (let i = 0; i < recipeList.length; i++) {
      if (!contributorList.includes(recipeList[i].contributor)) {
        contributorList.push(recipeList[i].contributor);
      }
      // console.log(recipeList[i])
      addToMyUpload(totalReipeListCon, recipeList[i]);
    }
  })
  .catch((err) => {
    console.log("error occured");
    console.log(err.code + "::" + err.message);
  });

let usersList = [];

getDocs(userColRef)
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      usersList.push({ ...doc.data(), id: doc.id });
    });


    console.log(usersList);

    const totalRecipes = document.querySelector(".totalRecipes");
    const totalUsers = document.querySelector(".totalUsers");
    const totalCotributor = document.querySelector(".totalContributor");
    totalRecipes.innerHTML = recipeList.length;
    totalUsers.innerHTML = usersList.length;
    totalCotributor.innerHTML = contributorList.length;
  })
  .catch((error) => {
    console.log("error occured");
    console.log(err.code + "::" + err.message);
  });

const myUploadTemplate = document.querySelector("[data-myUpload-template]");

function addToMyUpload(parent, object) {
  let email = sessionStorage.getItem("email");

  if (email != null) {
    let myUploadCard = myUploadTemplate.content.cloneNode(true).children[0];

    let myUploadFileName = myUploadCard.querySelector(".recipeTimestamp");
    myUploadFileName.innerHTML = object["timestamp"];

    let contributorNm = myUploadCard.querySelector(".contributor")
    contributorNm.innerHTML = object["contributor"]

    let nameOfRecipe = myUploadCard.querySelector(".nameOfRecipe")
    nameOfRecipe.innerHTML = object['recipenm']

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

        await getDocs(q).then((snapshot) => {
          snapshot.forEach((doc) => {
            did = doc.id;
            console.log(did)
          });
        });

        console.log(did);

        await deleteDoc(doc(db, "/savora/recipe/recipes", did))
        .then(async () => {
          // Create a reference to the file to delete
          alert("Document deleted from DB");
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

const searchBarInp = document.querySelector(".searchBar");

searchBarInp.addEventListener("keyup", (e) => {
  searchRecipe2();
});

const searchRecipe2 = (name = null) => {
  let searchVal;
  if (!name) {
    searchVal = searchBarInp.value.toUpperCase();
  } else {
    searchVal = name;
  }

  const myList = document.querySelectorAll(".myUploadedFileNameCon");

  // console.log("\n\n\n search")
  for (var i = 0; i < myList.length; i++) {
    console.log(myList[i]);
    let match = myList[i].querySelector(".recipeTimestamp");
    // .innerHTML.toUpperCase();
    console.log(match, "/nfound");

    if (match) {
      let textValue = match.innerHTML || match.textContent;
      if (textValue.toUpperCase().indexOf(searchVal) > -1) {
        myList[i].style.display = "";
      } else {
        myList[i].style.display = "none";
        // console.log("\n\n\nnone")
      }
    }
  }
  console.log(searchVal);
};




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
