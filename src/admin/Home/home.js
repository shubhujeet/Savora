import { uniqueList, newPlanList, planList } from "../myPlan/myPlan.js";
import { generateRecipeSteps } from "./recipeGenerator.js";
import { app } from "../../firebase_config.js";

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

// Inititialising firebase auth
const auth = getAuth(app);

const user = sessionStorage.getItem("user");
const login = document.querySelector(".login");
const logout = document.querySelector(".logout");
const myPlan = document.querySelector(".myPlan");
const upload = document.querySelector(".upload");
const profile = document.querySelector(".profile");
const report = document.querySelector(".report");

logout.addEventListener("click", (e) => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Logut successful !!");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("email")
      sessionStorage.removeItem("userImg")
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
  profile.style.display = "none"
  report.style.display = "none";
} else {
  login.style.display = "none";
  myPlan.style.display = "flex";
  logout.style.display = "flex";
  upload.style.display = "flex";
  profile.style.display = "flex";
  report.style.display = "flex";
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

// collection ref
const colRef = collection(db, "/savora/recipe/recipes");

const myPlanColRef = collection(db, `/savora/users/user/${user}/myplans`);

export const recipeCollections = [];

// getDocs(colRef)
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       recipeCollections.push({ ...doc.data(), id: doc.id });
//     });
//   })
//   .catch((error) => {
//     console.log("error occured");
//     console.log(err.code + "::" + err.message);
//   });

// setTimeout(() => {
//   console.log(recipeCollections);
// }, 5000);

async function searchRecipe(value) {
  if (value == "") {
    value = "Indian";
  }

  // What I want to fetch is label, images, ingredients, ingredientsLine, cuisineType
  const response = await fetch(
    `https://api.edamam.com/api/recipes/v2?app_id=92d54aa5&app_key=89285197738a9756c94c071df917e3ec&type=public&q=${value}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.hits.forEach((valueOf) => {
        let ingredient = [];
        // console.log(valueOf)
        valueOf.recipe.ingredients.forEach((e2) => {
          ingredient.push(e2.food);
        });

        let steps = generateRecipeSteps(ingredient);
        let no =
          parseInt(valueOf.recipe.totalTime / 60) +
          " m " +
          (parseInt(valueOf.recipe.totalTime) % 60) +
          " s";

        let time =
          Math.floor(valueOf.recipe.totalTime / 60) +
          "" +
          (valueOf.recipe.totalTime % 60);

        let myObject = {
          recipenm: valueOf.recipe.label,
          ingredients: ingredient.join(),
          imageurl: valueOf.recipe.image,
          steps: steps,
          calories: valueOf.recipe.calories,
          healthLabel: valueOf.recipe.healthLabels,
          mealType: valueOf.recipe.mealType,
          cuisineType: valueOf.recipe.cuisineType,
          dietLabels: valueOf.recipe.dietLabels,
          totalTime: no,
        };
        createRecipeTemplate(myObject);
      });
    });
}


const filterCon = document.querySelector("[data-filter-container]");
const filterTemplate = document.querySelector("[data-filter-template]");
const addFilterBtn = document.querySelector(".addFilterBtn");
const clearFilter = document.querySelector(".clearFilter");

let currentRecipe = sessionStorage.getItem("currentRecipe");

if (currentRecipe) {
  if (currentRecipe.trim().length != 0) {
    searchRecipe(currentRecipe);
    sessionStorage.setItem("currentRecipe", "");
  } else {
  }
}
else {
  searchRecipe("Indian");
}

clearFilter.addEventListener("click", async (e) => {
  let answer = confirm(
    "Are you sure you want to Remove All filters? This action is irreversible!!"
  );

  if (answer) {
    // console.log(clearFilter.previousElementSibling.children)
    const divsToDelete = document.querySelectorAll(".filterBtn"); // Replace "myDivClass" with the actual class you used
    divsToDelete.forEach((div) => div.remove());
    sessionStorage.removeItem("filters");
    storedFilters = [];
    sessionStorage.setItem("filters", JSON.stringify(storedFilters));
  }
});

addFilterBtn.addEventListener("click", (e) => {
  // e.preventDefault()
  let name = prompt("Enter the name of the List: ");
  if (name === null || name === undefined) {
    alert("Please provide a valid name to List.");
  } else if (name.trim().length == 0) {
    alert("Please provide a valid name to List.");
  } else {
    if (storedFilters.includes(name)) {
      alert("Filter already exits! \n Try using new name!");
    } else {
      console.log("creating on add");
      createFilterTeplate(name);
      storedFilters.push(name);
      sessionStorage.setItem("filters", JSON.stringify(storedFilters));
    }
  }
});

var storedFilters = [];

if (sessionStorage.getItem("filters") == null) {
  sessionStorage.setItem("filters", JSON.stringify(storedFilters));
}

console.log(sessionStorage.getItem("filters"));
// var storedFilters = ["abcd","efgh","ijkl","mnop","qrst","uvwx","yz"];
// sessionStorage.setItem("filters", JSON.stringify(storedFilters));
//...

function addFilters() {
  storedFilters = JSON.parse(sessionStorage.getItem("filters"));
  console.log(storedFilters);
  for (let nm of storedFilters) {
    // console.log(i)
    createFilterTeplate(nm);
  }
}

addFilters();

function createFilterTeplate(name) {
  console.log(filterTemplate);
  if (filterTemplate) {
    let template = filterTemplate.content.cloneNode(true);
    console.log(template);
    console.log("feteched one");
    console.log("feteched one");
    console.log("feteched one");
    console.log("feteched one");
    let fname = template.querySelector(".filterBtn");
    fname.textContent = name;
    fname.style.width = name.length * 15 + "px";
    fname.style.height = "30px";
    filterCon.append(template);

    // right Click: contextmenu
    fname.addEventListener("contextmenu", (e) => {
      // e.preventDefault();
      console.log("right click");
      let ans = confirm(`Are you sure you want to remove ${name} filter?`);
      // sessionStorage.getItem("filters");

      if (ans) {
        storedFilters = JSON.parse(sessionStorage.getItem("filters"));
        console.log(storedFilters);
        const firstRedIndex = storedFilters.indexOf(name);
        if (firstRedIndex !== -1) {
          storedFilters.splice(firstRedIndex, 1);
          sessionStorage.setItem("filters", JSON.stringify(storedFilters));
          e.target.remove();
        } else {
          alert("not found");
        }
      }
    });

    fname.addEventListener("click", (e) => {
      console.log("left click");
      searchRecipe(name);
      searchRecipe2(name);
    });
  } else {
    console.log("template not fetched");
  }
}

const searchBarInp = document.querySelector(".searchBar");

searchBarInp.addEventListener("keypress", (e) => {
  searchRecipe(searchBarInp.value.toUpperCase());
  searchRecipe2();
});

const searchRecipe2 = (name = null) => {
  let searchVal;
  if (!name) {
    searchVal = searchBarInp.value.toUpperCase();
  } else {
    searchVal = name;
  }

  const myList = document.querySelectorAll(".videoCon");

  // console.log("\n\n\n search")
  for (var i = 0; i < myList.length; i++) {
    console.log(myList[i]);
    let match = myList[i].querySelector(".recipeName");
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

let con2 = document.querySelector(".con2");
let con3 = document.querySelector(".con3");
let openVideoTag = document.querySelector(".openVideoTag");
let openVideoName = document.querySelector("#openVideoName");
let openVideoIngContent = document.querySelector("#openVideoIngContent");
let openVideoStepsContent = document.querySelector("#openVideoStepsContent");
let openVideoTotalTime = document.querySelector("#openVideoTotalTime");
let openVideoCalories = document.querySelector("#openVideoCalories");
let openVideoHealthLabels = document.querySelector("#openVideoHealthLabels");
let openVideoMealType = document.querySelector("#openVideoMealType");
let openVideoCuisineType = document.querySelector("#openVideoCuisineType");
let openVideoDietLabels = document.querySelector("#openVideoDietLabels");

let closeIcon = document.querySelector(".openVideoOpt i");

closeIcon.addEventListener("click", (e) => {
  console.log("click");
  con3.style.display = "none";
  con2.style.width = "96%";
});

// Creating Video template
const videoTemplate = document.querySelector("[data-video-template]");
const videoCon = document.querySelector(".con2");

function createRecipeTemplate(object) {
  console.log(object);
  // console.log(videoTemplate.content.cloneNode(true).children[0])
  const videoCard = videoTemplate.content.cloneNode(true).children[0];

  let videoRNm = videoCard.querySelector(".recipeName");

  videoRNm.textContent = object["recipenm"];

  let videoTag = videoCard.querySelector(".videoTag");
  videoTag.setAttribute("src", "" + object["imageurl"]);

  console.log(object["imageurl"], object["ingredients"]);
  // getDownloadURL(ref(storage, "/savora/video/"+object["filenm"]))
  //   .then((url) => {

  //     console.log(url)
  //     // Or inserted into an <img> element
  //     const videoTag = videoCard.querySelector(".videoTag");
  //     videoTag.setAttribute("src", "" + url);

  //   })
  //   .catch((error) => {
  //     // Handle any errors
  //   });

  videoCon.append(videoCard);

  let optionbg = videoCard.querySelector(".optionbg")

  if (sessionStorage.getItem("user") != null) {
    optionbg.style.display = "flex";
  } else {
    optionbg.style.display = "none";
  }

  videoTag.addEventListener("click", (e) => {
    con2.style.width = "250px";
    con3.style.display = "block";
    openVideoTag.setAttribute("src", object["imageurl"]);
    openVideoName.innerHTML = object["recipenm"];
    openVideoIngContent.innerHTML = object["ingredients"];
    openVideoStepsContent.innerHTML = object["steps"].join("<br>");
    openVideoCalories.innerHTML = object["calories"];
    // openVideoTotalTime.innerHTML = object["totalTime"];
    openVideoHealthLabels.innerHTML = object["healthLabel"].join("<br>");
    openVideoMealType.innerHTML = object["mealType"].join();
    openVideoCuisineType.innerHTML = object["cuisineType"].join();
    // openVideoDietLabels.innerHTML = object["dietLabels"].join();
  });

  const option = videoCard.querySelector(".optionbg");
  // const myPlannm = videoCard.querySelector("#customList");
  const optionCon = videoCard.querySelector(".optionCon");
  const optemplate = videoCard.querySelector("[data-options-template]");
  const optionsList = videoCard.querySelector("[data-options-list");
  const listName = videoCard.querySelector("[data-listName]");
  const listValue = videoCard.querySelector(".listValue");
  // const optionsListS = videoCard.querySelector(".optionsListS");

  const week1 = videoCard.querySelector("#week1");
  const week2 = videoCard.querySelector("#week2");
  const week3 = videoCard.querySelector("#week3");
  const week4 = videoCard.querySelector("#week4");

  function selectDay(week) {
    console.log(week);

    let weekName = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    for (let nm of weekName) {
      let wnode = optemplate.content.cloneNode(true);
      let wnodeNm = wnode.querySelector(".optionsBtn");
      wnodeNm.textContent = nm;
      // console.log(wnodeNm.textContent, "text content");
      listValue.append(wnode);

      wnodeNm.addEventListener("click", (e) => {
        // console.log("click"+nm)
        console.log(planList);

        let recpieNameFound = false;

        for (let plan in planList) {
          console.log(plan);
          if (
            planList[plan]["listname"] === week &&
            planList[plan]["day"] === nm
          ) {
            // console.log(planList[plan]["listname"] ,planList[plan]["day"])
            if (planList[plan]["recipenm"] === videoRNm.textContent) {
              recpieNameFound = true;
            }
          }
        }
        if (recpieNameFound) {
          alert(`Recipe is alerady added to your ${week} ${nm} plan`);
        } else {
          alert(`Recipe added to  ${nm} of ${week} `);
          addDoc(myPlanColRef, {
            day: nm,
            listname: week,
            ingredients: object["ingredients"],
            recipenm: object["recipenm"],
            imageurl: object["imageurl"],
            steps: object["steps"],
            calories: object["calories"],
            healthLabel: object["healthLabel"],
            mealType: object["mealType"],
            cuisineType: object["cuisineType"],
            dietLabels: object["dietLabels"],
            totalTime: object["totalTime"],
          })
            .then(() => {
              alert("Successfully added to myPlan!!", week);
            })
            .catch((error) => {
              console.log(error.code);
              console.log(error.message);
            });
        }
      });
    }
  }

  if (week1) {
    week1.addEventListener("click", () => {
      listValue.replaceChildren();
      optionsList.style.display = "flex";
      listName.innerHTML = week1.innerHTML;
      selectDay(week1.innerHTML);
    });
  }

  if (week2) {
    week2.addEventListener("click", () => {
      listValue.replaceChildren();
      optionsList.style.display = "flex";
      listName.innerHTML = week2.innerHTML;
      selectDay(week2.innerHTML);
    });
  }

  if (week3) {
    week3.addEventListener("click", () => {
      listValue.replaceChildren();
      optionsList.style.display = "flex";
      listName.innerHTML = week3.innerHTML;
      selectDay(week3.innerHTML);
    });
  }

  if (week4) {
    week4.addEventListener("click", () => {
      listValue.replaceChildren();
      optionsList.style.display = "flex";
      listName.innerHTML = week4.innerHTML;
      selectDay(week4.innerHTML);
    });
  }

  if (option) {
    option.addEventListener("mouseover", (e) => {
      optionCon.style.display = "block";
    });

    option.addEventListener("dblclick", (e) => {
      optionCon.style.display = "none";
    });
  } else {
  }

  if (optionCon) {
    optionCon.addEventListener("mouseleave", (e) => {
      optionCon.style.display = "none";
    });
  }

  // if (myPlannm) {
  //   myPlannm.addEventListener("click", (e) => {
  //     listValue.replaceChildren();
  //     optionCon.style.display = "none";
  //     optionsList.style.display = "flex";
  //     listName.innerHTML = myPlannm.innerHTML;
  //     getPlanList();
  //   });

  // } else {
  // }

  if (optionsList) {
    optionsList.addEventListener("mouseleave", (e) => {
      e.stopPropagation();
      optionsList.style.display = "none";
      listValue.replaceChildren();
    });
  }

  // if (optionsListS) {
  //   optionsListS.addEventListener("mouseleave", (e) => {
  //     e.stopPropagation();
  //     optionsListS.style.display = "none";
  //   });
  // }

  // if (optionCon) {
  //   document.addEventListener("click", (e) => {
  //     optionsList.style.display = "none";
  //     optionCon.style.display = "none";
  //     optionsListS.style.display = "none";
  //     listValue.replaceChildren();
  //   });
  // } else {
  // }

  //   function getPlanList() {
  //     let reservedName = ["week1", "week2", "week3", "week4"];

  //     if (uniqueList) {
  //       console.log(uniqueList, "unique list");
  //       uniqueList.forEach((element) => {
  //         if (!reservedName.includes(element)) {
  //           console.log(optemplate.content.cloneNode(true), "template in home");
  //           let node = optemplate.content.cloneNode(true);
  //           let nodeNm = node.querySelector(".optionsBtn");
  //           nodeNm.textContent = element;
  //           console.log(nodeNm.textContent, "text content");
  //           listValue.append(node);
  //           // console.log(element)

  //           nodeNm.addEventListener("click", (e) => {
  //             console.log("click", element);

  //             for (let x in newPlanList) {
  //               if (x === element) {
  //                 for (let j = 0; j < newPlanList[x].length; j++) {
  //                   if (newPlanList[x][j]["name"] === "recp4") {
  //                     alert(
  //                       `This plan is already added to your daily routine of :${x}`
  //                     );
  //                     break;
  //                   } else {
  //                     // Add to myplan
  //                     // addDoc(colRef, {
  //                     //   ingredients: "lemon",
  //                     //   listname: element,
  //                     //   recipenm: "recp4",
  //                     // })
  //                     //   .then(() => {
  //                     //     alert("Successfully added to myPlan!!", x);
  //                     //   })
  //                     //   .catch((error) => {
  //                     //     console.log(error.code);
  //                     //     console.log(error.message);
  //                     //   });
  //                     // break;
  //                   }
  //                 }
  //               }
  //             }
  //           });
  //         } else {
  //         }
  //       });
  //     }
  //   }
}
