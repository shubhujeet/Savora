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

const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);



let users = [];

async function callToDB() {
  let email = sessionStorage.getItem("email")
  const q = query(
    collection(db, "savora", "users", "user"),
    where("email", "==", email)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push({ ...doc.data(), id: doc.id });
  });

  if (users[0].profileImgUrl) {
    sessionStorage.setItem("userImg", users[0].profileImgUrl);
    addImgToProfile(users[0].profileImgUrl);
  }
}

callToDB();


// console.log("Image clicked!");
//     sessionStorage.setItem("currentRecipe", object["name"]);
//     window.location.href = "../Home/home.html";

const kheer = document.querySelector("#kheer")
const burger = document.querySelector("#burger")
const fruits = document.querySelector("#fruits")
const kadha = document.querySelector("#kadha")


kheer.addEventListener("click",()=>{
  console.log("Image clicked!");
    sessionStorage.setItem("currentRecipe", "kheer ");
    window.location.href = "../Home/home.html";
})

burger.addEventListener("click",()=>{
  console.log("Image clicked!");
    sessionStorage.setItem("currentRecipe","burger ");
    window.location.href = "../Home/home.html";

})


fruits.addEventListener("click",()=>{
  console.log("Image clicked!");
    sessionStorage.setItem("currentRecipe", "fruits ");
    window.location.href = "../Home/home.html";

})

kadha.addEventListener("click",()=>{
  console.log("Image clicked!");
    sessionStorage.setItem("currentRecipe", "kadha ");
    window.location.href = "../Home/home.html";

})

const Italian = document.querySelector("#Italian");
const Mexican = document.querySelector("#Mexican");
const American = document.querySelector("#American");
const Indian = document.querySelector("#Indian");
const Japanese = document.querySelector("#Japanese");
const Chinese = document.querySelector("#Chinese");
const Korean = document.querySelector("#Korean");
const recipeTemplate = document.querySelector("[data-recipe-card]");

sessionStorage.setItem("currentRecipe", "");

const user = sessionStorage.getItem("user");
const login = document.querySelector(".login");
const logout = document.querySelector(".logout");
const myPlan = document.querySelector(".myPlan");
const addBtn = document.querySelector(".addBtn");
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
      window.location.reload();
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
  addBtn.style.display = "none";
  upload.style.display = "none";
  profile.style.display = "none";
} else {
  login.style.display = "none";
  myPlan.style.display = "flex";
  logout.style.display = "flex";
  addBtn.style.display = "flex";
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

function createRecipeCard(object, parent) {
  const recipeCard = recipeTemplate.content.cloneNode(true).children[0];

  let reicpeImg = recipeCard.querySelector("#recipeImg");
  reicpeImg.setAttribute("src", object["src"]);

  let recipeNm = recipeCard.querySelector("#recipeName");
  recipeNm.textContent = object["name"];

  let reicpeIng = recipeCard.querySelector("#recipeIng");
  reicpeIng.textContent = object["ing"];

  parent.append(recipeCard);

  reicpeImg.addEventListener("click", function () {
    // Code to execute when the image is clicked
    console.log("Image clicked!");
    sessionStorage.setItem("currentRecipe", object["name"]);
    window.location.href = "../Home/home.html";
  });
}

function createRecipeCardCall(objectList, parent) {
  for (let i = 0; i < objectList.length; i++) {
    createRecipeCard(objectList[i], parent);
  }
}

// Data
let ItalianData = [
  {
    src: "../../assets/images/tomato-pasta.jpg",
    name: "Tomato-pasta",
    ing: "Pasta, tomato, garglic, olive oil, etc..",
  },
  {
    src: "../../assets/images/pizza.jpg",
    name: "Pizza",
    ing: "Dough, Tomato sauce, Mozzarella,..",
  },
  {
    src: "../../assets/images/tortellini.jpg",
    name: "Tortellini",
    ing: "Pasta dough, Cheese,Pepper, Flour..",
  },
  {
    src: "../../assets/images/tiramisu.jpg",
    name: "Tiramisu",
    ing: "Espresso,Eggs, Sugar, Cocoa powder..",
  },
];

let MexicanData = [
  {
    src: "../../assets/images/taco.jpg",
    name: "Taco",
    ing: "Cumin, paprika, garlic powder, onion powder..",
  },
  {
    src: "../../assets/images/burrito.jpg",
    name: "Burrito",
    ing: "Tortilla,Cooked rice, Cheese,Lettuce..",
  },
  {
    src: "../../assets/images/pozole-de-pollo.jpg",
    name: "Posole-De-Pollo",
    ing: "Onion, Garlic, oregano,cumin..",
  },
  {
    src: "../../assets/images/menudo.png",
    name: "Menudo",
    ing: "Onion, Garlic, Dried oregano, Bay leaves..",
  },
];

let AmericanData = [
  {
    src: "../../assets/images/french-fries.jpg",
    name: "French Fries",
    ing: "Potatoes, Vegetable oil, Salt..",
  },
  {
    src: "../../assets/images/pancake.jpg",
    name: "Pancake",
    ing: "All-purpose flour, Baking powder, Salt ..",
  },
  {
    src: "../../assets/images/french-toast.jpg",
    name: "French Toast",
    ing: "Bread, Eggs, Milk, Vanilla extract ..",
  },
  {
    src: "../../assets/images/cinnamon-rolls.jpg",
    name: "Cinnamon Roll",
    ing: "All-purpose flour, Yeast, Milk ..",
  },
];

let IndianData = [
  {
    src: "../../assets/images/samosa.jpg",
    name: "Samosa",
    ing: "All-purpose flour, Water, Salt, oil..",
  },
  {
    src: "../../assets/images/pakora.jpg",
    name: "Pakaude",
    ing: "Vegetables, Chickpea flour, Rice flour..",
  },
  {
    src: "../../assets/images/idli.jpg",
    name: "Idli",
    ing: "Rice,Urad dal, Salt, Water",
  },
  {
    src: "../../assets/images/rasgulla.jpg",
    name: "Rasgulla",
    ing: "Milk, Lemon juice or vinegar, Sugar, Water..",
  },
];

let JapaneseData = [
  {
    src: "../../assets/images/sushi.jpg",
    name: "Sushi",
    ing: "Sushi rice, Nori,Rice vinegar, Sugar, Salt..",
  },
  {
    src: "../../assets/images/tofu.jpg",
    name: "Tofu",
    ing: "Soybeans, Water, Coagulant, salt",
  },
  {
    src: "../../assets/images/miso-soup.jpg",
    name: "Miso Soup",
    ing: "Dashi, Miso paste, Tofu, Wakame, Green onions",
  },
  {
    src: "../../assets/images/onigiri.png",
    name: "Onigiri",
    ing: "Cooked sushi rice, Nori, salad, ..",
  },
];

let ChineseData = [
  {
    src: "../../assets/images/fried-rice.jpg",
    name: "Fried Rice",
    ing: "Cooked rice, Vegetables, Eggs, Soy sauce..",
  },
  {
    src: "../../assets/images/chow-mein.png",
    name: "Chow Mein",
    ing: "Noodles, Vegetables, Soy sauce, Garlic..",
  },
  {
    src: "../../assets/images/spring-roll.jpg",
    name: "Spring Roll",
    ing: "Shredded cabbage, Shredded carrots, Bean..",
  },
  {
    src: "../../assets/images/dumpling.png",
    name: "Dumpling",
    ing: "All-purpose flour, Water, Salt, vegetables..",
  },
];

let KoreanData = [
  {
    src: "../../assets/images/kimchi.jpg",
    name: "Kimchi",
    ing: "Napa cabbage, Korean radish, Garlic..",
  },
  {
    src: "../../assets/images/kimbap.jpg",
    name: "Kimbap",
    ing: "Sushi rice, Nori, Sesame oil, Sesame seeds..",
  },
  {
    src: "../../assets/images/stew.jpg",
    name: "Stew",
    ing: "Vegetables, Tomato paste, Salt, Pepper..</",
  },
  {
    src: "../../assets/images/bibimbap.jpg",
    name: "Bibimbap",
    ing: "Rice, Eggs, Gochujang, Sesame oil, Garlic ..",
  },
];

createRecipeCardCall(ItalianData, Italian);
createRecipeCardCall(MexicanData, Mexican);
createRecipeCardCall(AmericanData, American);
createRecipeCardCall(IndianData, Indian);
createRecipeCardCall(JapaneseData, Japanese);
createRecipeCardCall(ChineseData, Chinese);
createRecipeCardCall(KoreanData, Korean);
