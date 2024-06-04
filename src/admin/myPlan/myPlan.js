import { app } from "../../firebase_config.js";

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
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const auth = getAuth(app);

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

// import {
//   getMessaging,
//   getToken,
// } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging.js";

// Inititialising firebase auth
// const auth = getAuth(app);

// // Initialize Firebase Cloud Messaging and get a reference to the service
// const messaging = getMessaging(app);
// getToken(messaging, {
//   vapidKey:
//     "BHYWYC5gfVLXDxp3b2U-MrnPrp7blVBB1BHvjJJyk8QD1pPKo5uEYJaPfzVFoglWJbjQ8-ARS8ILFVoYCn0WeOc",
// })
//   .then((currentToken) => {
//     if (currentToken) {
//       // Send the token to your server and update the UI if necessary
//       // ...
//       console.log(currentToken);
//     } else {
//       // Show permission request UI
//       console.log(
//         "No registration token available. Request permission to generate one."
//       );
//       // ...
//     }
//   })
//   .catch((err) => {
//     console.log("An error occurred while retrieving token. ", err);
//     // ...
//   });

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// collection ref
const colRef = collection(db, `/savora/users/user/${user}/myplans`);

// planList :::{recipenm: 'Chocolate Paste', day: 'monday', listname: 'week3', ingredients: 'chocolate, milk', id: 'af4fz6Te5cApuGXKsnnd'}
export const planList = [];

// newplan list week : {recipenm: 'Chocolate Paste', ingredients: 'chocolate, milk', day: 'monday'}
export const newPlanList = {};

// import { uniqueList } from './myPlan.js';
export const uniqueList = new Set();

console.log("readding");
getDocs(colRef)
  .then((snapshot) => {
    // console.log(snapshot.docs);
    console.log("done doc recieved");
    snapshot.docs.forEach((doc) => {
      planList.push({ ...doc.data(), id: doc.id });
    });
    console.log("getting doc");
    console.log(planList);

    // Getting the unique list from the response object array

    if (planList.length != 0) {
      for (let i = 0; i < planList.length; i++) {
        console.log(planList[i].listname);
        if (uniqueList.has(String(planList[i].listname))) {
          newPlanList[String(planList[i].listname)].push(planList[i]);
        } else {
          uniqueList.add(planList[i].listname);
          newPlanList[String(planList[i].listname)] = [];
          newPlanList[String(planList[i].listname)].push(planList[i]);
        }
      }
      console.log(planList[0]["listname"], "planlist");
      // console.log(uniqueList.size, " length");
      console.log(Object.values(newPlanList), "newplanlist");
    }
  })
  .catch((err) => {
    console.log("error occured");
    console.log(err.code + "::" + err.message);
  });

// Getting list of all recipe

const recipeColRef = collection(db, "/savora/recipe/recipes");

// contributor
// "ghoshshubhujeet@gmail.com"
// filenm
// "chineeseBuns.mp4"
// id
// "9BArDOxMG5RzLlhb67JA"
// ingredients
// "yeast, water, sugar, oil, salt, flavor"
// recipenm
// "Chinese Bun"

export const allRecipeList = [];

getDocs(recipeColRef)
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      allRecipeList.push({ ...doc.data(), id: doc.id });
    });
  })
  .catch((error) => {
    console.log("error occured");
    console.log(err.code + "::" + err.message);
  });

setTimeout(() => {
  console.log(allRecipeList);
}, 5000);

const conCard = document.querySelector("[data-con-cards]");
const weekCardTemplate = document.querySelector("[data-card-week-template]");
const cardTemplate = document.querySelector("[data-card-template]");
const recipeTemplate = document.querySelector("[data-recipe-template]");
const close = document.querySelector(".close");
const view = document.querySelector(".view");

// Download text file
function download(filename, text) {
  const element = document.createElement("a");
  const blob = new Blob([text], {
    type: "plain/text",
  });

  const fileUrl = URL.createObjectURL(blob);

  element.setAttribute("href", fileUrl);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

if (close) {
  close.addEventListener("click", (e) => {
    view.style.display = "none";
  });
} else {
  console.log("Element with ID 'myButton' not found");
}

function checkListName(name) {
  for (let i = 0; i < planList.length; i++) {
    if (planList[0]["listname"] === name) {
      return true;
    }
  }
  return false;
}

const createBtn = document.querySelector(".create");

const listObj = [];
const reservedName = ["week1", "week2", "week3", "week4"];

if (createBtn) {
  createBtn.addEventListener("click", () => {
    let name = prompt("Enter the name of the List: ");
    if (name === null || name === undefined) {
      alert("Please provide a valid name to List.");
    } else if (name.trim().length == 0) {
      alert("Please provide a valid name to List.");
    } else if (reservedName.includes(name.toLowerCase())) {
      alert("Choose different name, Given name already exists!");
    } else {
      if (checkListName(name)) {
        alert("List name already exists!!");
      } else {
        addDoc(colRef, {
          listname: name,
          recipenm: "empty",
          ingredients: "empty",
          day: "empty",
        })
          .then(() => {
            let container = createCardTemplate(name);
            alert("Document added Successfully!");
          })
          .catch((error) => {
            console.log(error.code);
            console.log(error.message);
          });
      }
    }
    console.log(listObj);
  });
} else {
  console.log("create Btn Button not found");
}

function createCardTemplate(name) {
  // console.log(cardTemplate.content.cloneNode(true).children[0]);
  if (cardTemplate) {
    let listIng = [];
    const card = cardTemplate.content.cloneNode(true).children[0];
    // const newc = cardTemplate.content.cloneNode(true).children[0]
    // console.log(card)

    const rtitle = card.querySelector("[data-rtitle]");
    rtitle.textContent = name;

    const recipeList = card.querySelector("[data-recipe-list]");

    conCard.append(card);

    console.log(recipeList);


    let downloadBtn = card.querySelector(".download");
    downloadBtn.addEventListener("click", (e) => {
      console.log(listIng.length);
      if (listIng.length === 0) {
        alert("There is no recipe in the list!");
      } else {


        console.log(listIng);


        let list_title = "\n\t\tGrocery List\n";

        let text = list_title + listIng.join("\n\nRecipe\n\n");
        // console.log(text, "values");
        let filename = "ingredientsList.txt";
        download(filename, text);
      }
    });

    let d = card.querySelector(".deleteAll");
    d.addEventListener("click", async function (e) {
      if (confirm("Are you sure?") == true) {
        // console.log(e.target.parentElement.parentElement.parentElement.remove())
        console.log(e.target.parentElement.previousElementSibling.previousElementSibling.innerHTML)
        let didList = [];
        let listname =
          e.target.parentElement.previousElementSibling.previousElementSibling
            .innerHTML;

        console.log(listname)
        const q = query(
          colRef,
          where("listname", "==", listname)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          didList.push(doc.id);
          console.log(doc.id)

        });
        // console.log(didList)  
        console.log(didList, "list");

        for (let id of didList) {
          console.log(id, "id");
          await deleteDoc(doc(colRef, id))
            .then(() => {
              e.target.parentElement.parentElement.parentElement.remove();
              console.log("Document successfully deleted!");
            })
            .catch((err) => {
              console.log(err.code);
              console.log(err.message);
            });
        }
      } else {
      }
    });

    return [recipeList, listIng];
  } else {
    // console.log("cardTemplate doesn't exist !")
  }
}

let recipeObject = {};

function downloadIng() {

  console.log(recipeObject["ingredients"]);

  
  let body_val = recipeObject["ingredients"].split(",")
      
  console.log(typeof(body_val))
  let body_text_set = new Set()

  for(let i of body_val){
    body_text_set.add(i.toLowerCase());
  }

  body_val = []

  for(let x of body_text_set.values()){
    console.log(x)
    body_val.push(x)
  }

  body_val = body_val.sort()
  body_val = body_val.join("\n");


  let list_title = "\n\t\tGrocery List\n";
  let text = list_title + recipeObject["ingredients"];
  console.log(text);
  let filename = "ingredients.txt";
  download(filename, text);
  recipeObject = {};
}

let downloadViewIng = document.querySelector(".downloadViewIng");

if (downloadViewIng) {
  downloadViewIng.addEventListener("click", () => {
    downloadIng();
  });
}

function createRecipeTemplate(
  container,
  object,
  listArray = null,
  dayArray = null,
  count = null
) {
  // console.log(recipeTemplate.content.cloneNode(true).children[0]);

  if (recipeTemplate) {
    const newRecipe = recipeTemplate.content.cloneNode(true).children[0];

    const rname = newRecipe.querySelector("[data-recipe-name]");
    rname.textContent = object["recipenm"];

    const inglist = newRecipe.querySelector("[data-ing-list]");
    inglist.textContent = object["ingredients"];

    container.append(newRecipe);
    if (listArray != null) {
      listArray.push(object["ingredients"]);
    }
    if (dayArray != null) {
      dayArray.push(object["ingredients"]);
    }

    let d = newRecipe.querySelector(".delete");
    d.addEventListener("click", async function (e) {
      if (confirm("Are you sure?")) {
        console.log(
          e.target.parentElement.previousElementSibling.previousElementSibling
            .innerHTML,
          "inner html content to view\n\n\n"
        );
        let recipenm =
          e.target.parentElement.previousElementSibling.previousElementSibling
            .innerHTML;
        let did = "";
        console.log(recipenm)
        const q = query(
          colRef,
          where("recipenm", "==", recipenm)
        );
        await getDocs(q).then(async (snapshot) => {
          snapshot.forEach(async (doc) => {
            did = doc.id;
          });
          
          console.log(did, colRef, "did");
          await deleteDoc(doc(colRef, did))
            .then(() => {
              console.log("asdadaddd")
              e.target.parentElement.parentElement.parentElement.parentElement.parentElement.remove();

              if (count) {
                count.innerHTML = parseInt(count.innerHTML) - 1;
              }
              alert("Document Deleted Successfully!");
            })
            .catch((error) => {
              console.log(error.code);
              console.log(error.message);
            });
        });
      } else {
      }
    });

    let downloadBtn = newRecipe.querySelector(".downloadIng");
    downloadBtn.addEventListener("click", () => {

      let body_val = object["ingredients"].split(",")
      
      console.log(typeof(body_val))
      let body_text_set = new Set()

      for(let i of body_val){
        body_text_set.add(i.toLowerCase());
      }

      body_val = []

      for(let x of body_text_set.values()){
        console.log(x)
        body_val.push(x)
      }

      body_val = body_val.sort()
      body_val = body_val.join("\n");

      let list_title = "\n\t\tGrocery List\n";
      let text = list_title + body_val;
      console.log(text);
      let filename = "ingredients.txt";
      download(filename, text);
    });

    const getBtn = newRecipe.querySelector(".getRecipe");

    getBtn.addEventListener("click", (e) => {
      console.log(object, "printing object");
      view.style.display = "block";
      let viewHeader = document.querySelector(".header");
      let viewIngContent = document.querySelector(".viewIngContent");
      let viewSteps = document.querySelector(".viewSteps");

      recipeObject = object;

      viewHeader.innerHTML = object["recipenm"];
      viewIngContent.innerHTML = object["ingredients"].replaceAll(",", "<br>");
      console.log(object)
      console.log(object['steps'])
      viewSteps.innerHTML = String(object["steps"]).replaceAll(".","<br>").replaceAll(",", ". <br>");

      // console.log(view.children[0])
    });

    // const notfBtn = newRecipe.querySelector(".reminder");

    // notfBtn.addEventListener("click", function (e) {
    //   if (document.hidden != "false") {
    //     Notification.requestPermission().then((perm) => {
    //       const notification = new Notification("Time to cook!", {
    //         body: object['recipenm'],
    //         //   data: { hello: object['recipenm'] },
    //       });
    //       notification.addEventListener("error", (e) => {
    //         alert("error");
    //       });
    //       notification.onclick = (e) => {
    //         e.preventDefault();
    //         window.open("./myPlan.html");
    //       };
    //       if (perm === "granted") {
    //         notification.close();
    //       }
    //     });
    //   }
    // });
  } else {
    // console.log("recipecard not found");
  }
}

function createCardWeekTemplate(week) {
  if (weekCardTemplate) {
    let weekCard = weekCardTemplate.content.cloneNode(true).children[0];
    let weekCardTitle = weekCard.querySelector("[data-rtitle]");
    weekCardTitle.textContent = week;
    conCard.append(weekCard);
    // List for downloading ingredients
    let ingList = [];
    let ingListM = [];
    let ingListT = [];
    let ingListW = [];
    let ingListTh = [];
    let ingListF = [];
    let ingListSa = [];
    let ingListSu = [];

    // Initialization
    let monday = weekCard.querySelector("#monday");
    let mondayDetails = weekCard.querySelector(".monday-details");
    let tuesday = weekCard.querySelector("#tuesday");
    let tuesdayDetails = weekCard.querySelector(".tuesday-details");
    let wednesday = weekCard.querySelector("#wednesday");
    let wednesdayDetails = weekCard.querySelector(".wednesday-details");
    let thursday = weekCard.querySelector("#thursday");
    let thursdayDetails = weekCard.querySelector(".thursday-details");
    let friday = weekCard.querySelector("#friday");
    let fridayDetails = weekCard.querySelector(".friday-details");
    let saturday = weekCard.querySelector("#saturday");
    let saturdayDetails = weekCard.querySelector(".saturday-details");
    let sunday = weekCard.querySelector("#sunday");
    let sundayDetails = weekCard.querySelector(".sunday-details");

    let downloadRM = weekCard.querySelector("#downloadRM");
    let deleteRM = weekCard.querySelector("#deleteRM");
    let addRM = weekCard.querySelector("#addRM");
    let downloadRT = weekCard.querySelector("#downloadRT");
    let deleteRT = weekCard.querySelector("#deleteRT");
    let addRT = weekCard.querySelector("#addRT");
    let downloadRW = weekCard.querySelector("#downloadRW");
    let deleteRW = weekCard.querySelector("#deleteRW");
    let addRW = weekCard.querySelector("#addRW");
    let downloadRTh = weekCard.querySelector("#downloadRTh");
    let deleteRTh = weekCard.querySelector("#deleteRTh");
    let addRRTh = weekCard.querySelector("#addRTh");
    let downloadRF = weekCard.querySelector("#downloadRF");
    let deleteRF = weekCard.querySelector("#deleteRF");
    let addRF = weekCard.querySelector("#addRF");
    let downloadRSa = weekCard.querySelector("#downloadRSa");
    let deleteRSa = weekCard.querySelector("#deleteRSa");
    let addRSa = weekCard.querySelector("#addRSa");
    let downloadRSu = weekCard.querySelector("#downloadRSu");
    let deleteRSu = weekCard.querySelector("#deleteRSu");
    let addRSu = weekCard.querySelector("#addRSu");

    let countM = weekCard.querySelector("#countM");
    let countT = weekCard.querySelector("#countT");
    let countW = weekCard.querySelector("#countW");
    let countTh = weekCard.querySelector("#countTh");
    let countF = weekCard.querySelector("#countF");
    let countSa = weekCard.querySelector("#countSa");
    let countSu = weekCard.querySelector("#countSu");

    let addedRecipe = [];

    function getWeekDayList(week, day) {
      let weekDayList = [];
      for (let i = 0; i < planList.length; i++) {
        if (
          planList[i]["listname"].toLowerCase() === week.toLowerCase() &&
          planList[i]["day"].toLowerCase() === day.toLowerCase()
        ) {
          weekDayList.push(planList[i]["recipenm"]);
        }
      }
      return weekDayList;
    }

    addRM.addEventListener("click", (e) => {
      console.log(
        "planList",
        planList,
        "\nnewPlanList",
        newPlanList,
        "\nAllRecipeList",
        allRecipeList
      );
      searchView.style.display = "flex";
      let weekDayListNm = getWeekDayList(week, "monday");

      for (let i = 0; i < planList.length; i++) {
        if (!addedRecipe.includes(planList[i]["recipenm"])) {
          console.log(planList[i]["recipenm"], planList[i]["id"]);
          listRecipe(planList[i], weekDayListNm, "monday", week);
          addedRecipe.push(planList[i]["recipenm"]);
        }
      }

      for (let i = 0; i < allRecipeList.length; i++) {
        if (!addedRecipe.includes(allRecipeList[i]["recipenm"])) {
          listRecipe(allRecipeList[i], weekDayListNm, "monday", week);
          addedRecipe.push(allRecipeList[i]["recipenm"]);
        }
      }
    });

    addRT.addEventListener("click", (e) => {
      searchView.style.display = "flex";
      let weekDayListNm = getWeekDayList(week, "tuesday");

      for (let i = 0; i < planList.length; i++) {
        if (!addedRecipe.includes(planList[i]["recipenm"])) {
          listRecipe(planList[i], weekDayListNm, "tuesday", week);
          addedRecipe.push(planList[i]["recipenm"]);
        }
      }

      for (let i = 0; i < allRecipeList.length; i++) {
        if (!addedRecipe.includes(allRecipeList[i]["recipenm"])) {
          listRecipe(allRecipeList[i], weekDayListNm, "tuesday", week);
          addedRecipe.push(allRecipeList[i]["recipenm"]);
        }
      }
    });
    addRW.addEventListener("click", (e) => {
      searchView.style.display = "flex";
      let weekDayListNm = getWeekDayList(week, "wednesday");

      for (let i = 0; i < planList.length; i++) {
        if (!addedRecipe.includes(planList[i]["recipenm"])) {
          listRecipe(planList[i], weekDayListNm, "wednesday", week);
          addedRecipe.push(planList[i]["recipenm"]);
        }
      }

      for (let i = 0; i < allRecipeList.length; i++) {
        if (!addedRecipe.includes(allRecipeList[i]["recipenm"])) {
          listRecipe(allRecipeList[i], weekDayListNm, "wednesday", week);
          addedRecipe.push(allRecipeList[i]["recipenm"]);
        }
      }
    });

    addRRTh.addEventListener("click", (e) => {
      searchView.style.display = "flex";
      let weekDayListNm = getWeekDayList(week, "thursday");

      for (let i = 0; i < planList.length; i++) {
        if (!addedRecipe.includes(planList[i]["recipenm"])) {
          listRecipe(planList[i], weekDayListNm, "thursday", week);
          addedRecipe.push(planList[i]["recipenm"]);
        }
      }

      for (let i = 0; i < allRecipeList.length; i++) {
        if (!addedRecipe.includes(allRecipeList[i]["recipenm"])) {
          listRecipe(allRecipeList[i], weekDayListNm, "thursday", week);
          addedRecipe.push(allRecipeList[i]["recipenm"]);
        }
      }
    });

    addRF.addEventListener("click", (e) => {
      searchView.style.display = "flex";
      let weekDayListNm = getWeekDayList(week, "friday");

      for (let i = 0; i < planList.length; i++) {
        if (!addedRecipe.includes(planList[i]["recipenm"])) {
          listRecipe(planList[i], weekDayListNm, "friday", week);
          addedRecipe.push(planList[i]["recipenm"]);
        }
      }

      for (let i = 0; i < allRecipeList.length; i++) {
        if (!addedRecipe.includes(allRecipeList[i]["recipenm"])) {
          listRecipe(allRecipeList[i], weekDayListNm, "friday", week);
          addedRecipe.push(allRecipeList[i]["recipenm"]);
        }
      }
    });

    addRSa.addEventListener("click", (e) => {
      searchView.style.display = "flex";
      let weekDayListNm = getWeekDayList(week, "saturday");

      for (let i = 0; i < planList.length; i++) {
        if (!addedRecipe.includes(planList[i]["recipenm"])) {
          listRecipe(planList[i], weekDayListNm, "saturday", week);
          addedRecipe.push(planList[i]["recipenm"]);
        }
      }

      for (let i = 0; i < allRecipeList.length; i++) {
        if (!addedRecipe.includes(allRecipeList[i]["recipenm"])) {
          listRecipe(allRecipeList[i], weekDayListNm, "saturday", week);
          addedRecipe.push(allRecipeList[i]["recipenm"]);
        }
      }
    });

    addRSu.addEventListener("click", (e) => {
      searchView.style.display = "flex";
      let weekDayListNm = getWeekDayList(week, "sunday");

      for (let i = 0; i < planList.length; i++) {
        if (!addedRecipe.includes(planList[i]["recipenm"])) {
          listRecipe(planList[i], weekDayListNm, "sunday", week);
          addedRecipe.push(planList[i]["recipenm"]);
        }
      }

      for (let i = 0; i < allRecipeList.length; i++) {
        if (!addedRecipe.includes(allRecipeList[i]["recipenm"])) {
          listRecipe(allRecipeList[i], weekDayListNm, "sunday", week);
          addedRecipe.push(allRecipeList[i]["recipenm"]);
        }
      }
    });

    async function removeDetailChildrenSpecific(detailsElement, day) {
      let didList = [];
      console.log(week,day);
      let q = query(
        colRef,
        where("listname", "==", week),
        where("day", "==", day)
      );
      let querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        didList.push(doc.id);
      });
      console.log(didList, "list");

      for (let id of didList) {
        console.log(id, "id");
        await deleteDoc(doc(colRef, id))
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch((err) => {
            console.log(err.code);
            console.log(err.message);
          });
      }

      // Loop through all children of the details element
      for (var i = 0; i < detailsElement.children.length; i++) {
        var child = detailsElement.children[i];

        // Check if the child is not the <summary> element
        if (child.tagName.toLowerCase() !== "summary") {
          // Remove the child from the <details> element
          detailsElement.removeChild(child);
        }
      }
    }

    deleteRM.addEventListener("click", (e) => {
      console.log("monday delete");
      if (confirm("Are you sure?") == true) {
        removeDetailChildrenSpecific(mondayDetails, "monday");
        countM.innerHTML = 0;
      }
    });

    deleteRT.addEventListener("click", (e) => {
      if (confirm("Are you sure?") == true) {
        removeDetailChildrenSpecific(tuesdayDetails, "tuesday");
        countT.innerHTML = 0;
      }
    });

    deleteRW.addEventListener("click", (e) => {
      if (confirm("Are you sure?") == true) {
        removeDetailChildrenSpecific(wednesdayDetails, "wednesday");
        countW.innerHTML = 0;
      }
    });

    deleteRTh.addEventListener("click", (e) => {
      if (confirm("Are you sure?") == true) {
        removeDetailChildrenSpecific(thursdayDetails, "thursday");
        countTh.innerHTML = 0;
      }
    });

    deleteRF.addEventListener("click", (e) => {
      if (confirm("Are you sure?") == true) {
        removeDetailChildrenSpecific(fridayDetails, "friday");
        countF.innerHTML = 0;
      }
    });

    deleteRSa.addEventListener("click", (e) => {
      if (confirm("Are you sure?") == true) {
        removeDetailChildrenSpecific(saturdayDetails, "saturday");
        countSa.innerHTML = 0;
      }
    });

    deleteRSu.addEventListener("click", (e) => {
      if (confirm("Are you sure?") == true) {
        removeDetailChildrenSpecific(sundayDetails, "sunday");
        countSu.innerHTML = 0;
      }
    });

    function downloadCall(ingList, day) {
      if (ingList.length === 0) {
        alert("There is no recipe in the list!");
      } else {

        console.log(ingList)

        let myListSet = new Set()

        for(let x of ingList){
          let ing = x.split(",")
          for(let y of ing){
            myListSet.add(y.toLowerCase())
          }
        }

        let body_val = []

        for(let i of myListSet.values()){
          body_val.push(i)
        }

        body_val = body_val.sort()
        body_val = body_val.join("\n")

        console.log(body_val)


        let list_title = "\n\t\tGrocery List\n"
        let text = list_title + body_val;
        let filename = "ingredientsList.txt";
        download(filename, `Recipe ${week} ${day}\n` + text);
      }
    }

    downloadRM.addEventListener("click", (e) => {
      downloadCall(ingListM, "Monday");
    });

    downloadRT.addEventListener("click", (e) => {
      downloadCall(ingListT, "Tuesday");
    });

    downloadRW.addEventListener("click", (e) => {
      downloadCall(ingListW, "Wednesday");
    });

    downloadRTh.addEventListener("click", (e) => {
      downloadCall(ingListTh, "Thursday");
    });

    downloadRF.addEventListener("click", () => {
      downloadCall(ingListF, "Friday");
    });

    downloadRSa.addEventListener("click", () => {
      downloadCall(ingListSa, "Saturday");
    });

    downloadRSu.addEventListener("click", () => {
      downloadCall(ingListSu, "Sunday");
    });

    // console.log(week);
    console.log(newPlanList);
    for (let weekNm in newPlanList) {
      // console.log(weekNm);
      if (weekNm.toLocaleLowerCase() === week.toLowerCase()) {
        // console.log(weekNm)
        // console.log(newPlanList[weekNm].length);
        for (let i = 0; i < newPlanList[weekNm].length; i++) {
          // console.log(newPlanList[weekNm][i]["day"])
          if (newPlanList[weekNm][i]["day"] == monday.innerHTML.toLowerCase()) {
            // console.log("monday");
            createRecipeTemplate(
              mondayDetails,
              newPlanList[weekNm][i],
              ingList,
              ingListM,
              countM
            );
            countM.innerHTML = parseInt(countM.innerHTML) + 1;
          } else if (
            newPlanList[weekNm][i]["day"] === tuesday.innerHTML.toLowerCase()
          ) {
            createRecipeTemplate(
              tuesdayDetails,
              newPlanList[weekNm][i],
              ingList,
              ingListT,
              countT
            );
            countT.innerHTML = parseInt(countT.innerHTML) + 1;
          } else if (
            newPlanList[weekNm][i]["day"] === wednesday.innerHTML.toLowerCase()
          ) {
            createRecipeTemplate(
              wednesdayDetails,
              newPlanList[weekNm][i],
              ingList,
              ingListW,
              countW
            );
            countW.innerHTML = parseInt(countW.innerHTML) + 1;
          } else if (
            newPlanList[weekNm][i]["day"] === thursday.innerHTML.toLowerCase()
          ) {
            createRecipeTemplate(
              thursdayDetails,
              newPlanList[weekNm][i],
              ingList,
              ingListTh,
              countTh
            );
            countTh.innerHTML = parseInt(countTh.innerHTML) + 1;
          } else if (
            newPlanList[weekNm][i]["day"] === friday.innerHTML.toLowerCase()
          ) {
            createRecipeTemplate(
              fridayDetails,
              newPlanList[weekNm][i],
              ingList,
              ingListF,
              countF
            );
            countF.innerHTML = parseInt(countF.innerHTML) + 1;
          } else if (
            newPlanList[weekNm][i]["day"] === saturday.innerHTML.toLowerCase()
          ) {
            createRecipeTemplate(
              saturdayDetails,
              newPlanList[weekNm][i],
              ingList,
              ingListSa,
              countSa
            );
            countSa.innerHTML = parseInt(countSa.innerHTML) + 1;
          } else if (
            newPlanList[weekNm][i]["day"] === sunday.innerHTML.toLowerCase()
          ) {
            createRecipeTemplate(
              sundayDetails,
              newPlanList[weekNm][i],
              ingList,
              ingListSu,
              countSu
            );
            countSu.innerHTML = parseInt(countSu.innerHTML) + 1;
          } else {
            // console.log("wrong week name");
            console.log(newPlanList[weekNm][i]["day"], "wrong day recipenm");
          }
        }
        // console.log(newPlanList[weekNm].length)
      }
    }

    let downloadBtn = weekCard.querySelector(".downloadS");
    downloadBtn.addEventListener("click", (e) => {
      console.log(ingList.length);
      if (ingList.length === 0) {
        alert("There is no recipe in the list!");
      } else {

        console.log(ingList)

        let myListSet = new Set()

        for(let x of ingList){
          let ing = x.split(",")
          for(let y of ing){
            myListSet.add(y.toLowerCase())
          }
        }

        let body_val = []

        for(let i of myListSet.values()){
          body_val.push(i)
        }

        body_val = body_val.sort()
        body_val = body_val.join("\n")

        console.log(body_val)



        let list_title = "\n\t\tGrocery List\n"
        let text = list_title + body_val;
        let filename = "ingredientsList.txt";
        download(filename, text);
      }
    });

    function removeDetailChildren(detailsElement) {
      // Loop through all children of the details element
      for (var i = 0; i < detailsElement.children.length; i++) {
        var child = detailsElement.children[i];

        // Check if the child is not the <summary> element
        if (child.tagName.toLowerCase() !== "summary") {
          // Remove the child from the <details> element
          detailsElement.removeChild(child);
        }
      }
    }

    let d = weekCard.querySelector(".deleteAllS");
    d.addEventListener("click", async function (e) {
      if (confirm("Are you sure?") == true) {
        let didList = [];
        // console.log(colRef);
        console.log(week)
        const q = query(
          colRef,
          where("listname", "==", week)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          didList.push(doc.id);
        });
        console.log(didList, "list");

        for (let id of didList) {
          console.log(id, "id");
          await deleteDoc(doc(colRef, id))
            .then(() => {
              console.log("Document successfully deleted!");
              // alert("Document successfully deleted!")
            })
            .catch((err) => {
              console.log(err.code);
              console.log(err.message);
            });
        }

        removeDetailChildren(mondayDetails);
        removeDetailChildren(tuesdayDetails);
        removeDetailChildren(wednesdayDetails);
        removeDetailChildren(thursdayDetails);
        removeDetailChildren(fridayDetails);
        removeDetailChildren(saturdayDetails);
        removeDetailChildren(sundayDetails);
      }
    });
  }
}

function savedPlan() {
  console.log("saved");

  let weeks = ["Week1", "Week2", "Week3", "Week4"];
  for (let wnm of weeks) {
    createCardWeekTemplate(wnm);
    // console.log("creating tempalte");
  }

  // for (let x in newPlanList) {
  //   console.log(x, "saved");
  //   console.log(newPlanList[x]);

  //   if (!reservedName.includes(x)) {
  //     let recpObject = createCardTemplate(x);
  //     for (let j = 0; j < newPlanList[x].length; j++) {
  //       // console.log(j)
  //       if (newPlanList[x][j]["recipenm"] == "empty") {
  //       } else {
  //         createRecipeTemplate(
  //           recpObject[0],
  //           newPlanList[x][j],
  //           recpObject[1]
  //         );
  //       }
  //     }
  //   } else {
  //   }
  // }
}

setTimeout(savedPlan, 3000);

// View window change

const viewIng1 = document.querySelector(".viewIng1");
const viewIng2 = document.querySelector(".viewIng2");
// const viewIng3 = document.querySelector(".viewIng3")
const page1 = document.querySelector(".page1");
const page2 = document.querySelector(".page2");
// const page3 = document.querySelector(".page3");

if (viewIng1) {
  viewIng1.addEventListener("click", (e) => {
    page1.style.display = "block";
    page2.style.display = "none";
    // page3.style.display = "none";
  });
} else {
  console.log("viewIng1 doesn't exist");
}

if (viewIng2) {
  viewIng2.addEventListener("click", (e) => {
    page1.style.display = "none";
    page2.style.display = "block";
    // page3.style.display = "none";
  });
} else {
}

// viewIng3.addEventListener("click",(e)=>{
//     page1.style.display = "none"
//     page2.style.display = "none"
//     page3.style.display = "block"
// })

const findBtn = document.querySelector(".find");
const searchInp = document.querySelector(".searchInp");
const searchBar = document.querySelector(".search");

if (findBtn) {
  findBtn.addEventListener("click", (e) => {
    findBtn.style.display = "none";
    searchBar.style.display = "flex";

    conCard.replaceChildren();

    console.log(planList.length);

    let recipeName = [];

    console.log(recipeName, "recipe Name");
    for (let i = 0; i < planList.length; i++) {
      if (!recipeName.includes(planList[i]["recipenm"])) {
        recipeName.push(planList[i]["recipenm"]);
        createRecipeTemplate(conCard, planList[i]);
      }
    }
  });
} else {
  console.log("Find button not found!");
}

if (searchInp) {
  searchInp.addEventListener("focusout", (e) => {
    searchInp.classList.add("disappear");
    findBtn.style.display = "flex";
    searchBar.style.display = "none";
    searchInp.value = "";
  });

  // Search Functionality

  searchInp.addEventListener("keyup", (e) => {
    search();
  });
} else {
  console.log("Input field for searching not found!");
}

const search = () => {
  const searchVal = searchInp.value.toUpperCase();
  const myList = document.querySelectorAll(".element");
  // const listTitle = document.querySelectorAll("[data-recipe-name]");

  // console.log("\n\n\n search")
  for (var i = 0; i < myList.length; i++) {
    console.log(myList[i]);
    let match = myList[i].querySelector("[data-recipe-name]");
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

  // if (searchVal.trim().length == 0) {
  //   for (var i = 0; i < listTitle.length; i++) {
  //     myList[i].style.display = "";
  //   }
  // }
  console.log(searchVal);
};

const refreshBtn = document.querySelector(".refresh");

if (refreshBtn) {
  refreshBtn.addEventListener("click", (e) => {
    conCard.replaceChildren();
    searchBar.style.display = "none";
    findBtn.style.display = "flex";
    let weeks = ["week1", "week2", "week3", "week4"];
    for (let wnm of weeks) {
      createCardWeekTemplate(wnm);
      // console.log("creating tempalte");
    }
  });
} else {
  // console.log("no button found");
}

const searchClose = document.querySelector(".searchClose");
const searchView = document.querySelector(".searchView");
const searchRecipeInp = document.querySelector(".searchRecipeInp");
const searchRecipeCardTemplate = document.querySelector(
  "[data-search-recipe-card]"
);
const searchRecipeCon = document.querySelector(".searchRecipeCon");

function listRecipe(object, daylist, day, week) {
  // console.log(object);
  let recipeCard = searchRecipeCardTemplate.content.cloneNode(true).children[0];

  // console.log(recipeCard);

  let recipeCardNm = recipeCard.querySelector(".recipeCardName");
  recipeCardNm.textContent = object["recipenm"];

  let recipeCardAddBtn = recipeCard.querySelector(".recipeCardAddBtn");
  let recipeCardHas = recipeCard.querySelector(".recipeCardHas");
  let recipeCardRemoveBtn = recipeCard.querySelector(".recipeCardRemoveBtn");

  if (daylist.includes(object["recipenm"])) {
    recipeCardAddBtn.style.display = "none";
    recipeCardHas.style.display = "flex";
    recipeCardRemoveBtn.style.display = "flex";
  } else {
    recipeCardRemoveBtn.style.display = "none";
    recipeCardHas.style.display = "none";
    recipeCardAddBtn.style.display = "flex";
  }

  searchRecipeCon.append(recipeCard);

  recipeCardRemoveBtn.addEventListener("click", async (e) => {
    let ans = confirm("Are you sure you want to remove it!");
    if (ans) {
      recipeCardRemoveBtn.style.display = "none";
      recipeCardHas.style.display = "none";
      recipeCardAddBtn.style.display = "flex";
      daylist = daylist.filter((day) => day !== object["recipenm"]);
    }
    console.log(object);
    console.log(object["id"]);

    console.log(object["id"], "list");

    await deleteDoc(doc(colRef, object["id"]))
      .then(() => {
        alert("Document Deleted Successfully!");
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  });

  recipeCardAddBtn.addEventListener("click", (e) => {
    recipeCardAddBtn.style.display = "none";
    recipeCardHas.style.display = "flex";
    recipeCardRemoveBtn.style.display = "flex";

    console.log(object["recipenm"], object["ingredients"]);
    addDoc(colRef, {
      listname: week,
      recipenm: object["recipenm"],
      ingredients: object["ingredients"],
      day: day,
      steps: object['steps'],

    })
      .then(() => {
        alert("Document added Successfully!");
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  });
}

if (searchClose) {
  searchClose.addEventListener("click", (e) => {
    searchView.style.display = "none";
    searchRecipeCon.replaceChildren();
    window.location.reload();
  });
}

if (searchRecipeInp) {
  searchRecipeInp.addEventListener("keyup", (e) => {
    searchRecipe();
  });
}

async function searchRecipe2(value) {
  if (value == "") {
    value = "Indian";
  }

  // What I want to fetch is label, images, ingredients, ingredientsLine, cuisineType
  const response = await fetch(
    `https://api.edamam.com/api/recipes/v2?app_id=92d54aa5&app_key=89285197738a9756c94c071df917e3ec&type=public&q=${value}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      // let ing = []
      console.log(data);
      // console.log(data.hits[0].recipe.ingredientLines.join())
      // console.log(data.hits[0].recipe.ingredientLines)
      // console.log(data.hits[0].recipe.cuisineType)
      // console.log(data.hits[0].recipe.images.REGULAR.url)
      // console.log(data.hits[0].recipe.label)
      // console.log(data.hits[10]["recipe"]["label"])
      // console.log(data)
      // console.log(data.hits[0].recipe.image)

      data.hits.forEach((valueOf) => {
        let myObject = {
          recipenm: valueOf.recipe.label,
          ingredients: valueOf.recipe.ingredientLines.join(),
          imageurl: valueOf.recipe.image,
        };
        listRecipe(myObject);
      });
    });
}

const searchRecipe = () => {
  let searchVal = searchRecipeInp.value.toUpperCase();
  let myList = document.querySelectorAll(".recipeCard");
  // const listTitle = document.querySelectorAll("[data-recipe-name]");

  // console.log("\n\n\n search")
  for (var i = 0; i < myList.length; i++) {
    console.log(myList[i]);
    let match = myList[i].querySelector(".recipeCardName");
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

  if (searchVal.trim().length == 0) {
    for (var i = 0; i < listTitle.length; i++) {
      myList[i].style.display = "";
    }
  }
  console.log(searchVal);
};

// // Service worker Registration
// const checkPermission = () => {
//   if (!("serviceWorker" in navigator)) {
//     throw new Error("No support for service worker!");
//   } else {
//     console.log("working");
//   }
// };

// const registerSW = async () => {
//   const registration = await navigator.serviceWorker.register(
//     "../firebase-messaging-sw.js"
//   );
//   return registration;
// };

// checkPermission();
// registerSW()
