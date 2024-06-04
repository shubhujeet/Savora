import { uniqueList, newPlanList, planList } from "../myPlan/myPlan.js";
import { app } from "../firebase_config.js";

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
  ref,
  getStorage,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

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
} else {
  login.style.display = "none";
  myPlan.style.display = "flex";
  logout.style.display = "flex";
  upload.style.display = "flex";
  profile.style.display = "flex"
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


// Inititialising firebase auth
// const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// // Storage ref
// const storageRef = ref(storage, "/savora/video/" + fileNm);

// collection ref
const colRef = collection(db, "/savora/recipe/recipes");

const myPlanColRef = collection(db, `/savora/users/user/${user}/myplans`);

// contributor
// "ghoshshubhujeet@gmail.com"
// filenm
// "choccolatePaste.mp4"
// id
// "bkk7ALlmDqDLlockJP7B"
// ingredients
// "chocolate, milk"
// recipenm
// "Chocolate Paste"

const recipeCollectionsShorts = [];
// Fetching videos

getDocs(colRef)
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      recipeCollectionsShorts.push({ ...doc.data(), id: doc.id });
    });
  })
  .catch((error) => {
    console.log("error occured");
    console.log(err.code + "::" + err.message);
  });

setTimeout(() => {
  console.log(recipeCollectionsShorts);
  load();
}, 3000);

function load(params) {
  for (let obj of recipeCollectionsShorts) {
    console.log(obj);
    createVideoTemplate(obj);
  }
}

const filterCon = document.querySelector("[data-filter-container]");
const filterTemplate = document.querySelector("[data-filter-template]");
const addFilterBtn = document.querySelector(".addFilterBtn");
const clearFilter = document.querySelector(".clearFilter");

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
      searchVideoRecipe(name);
    });
  } else {
    console.log("template not fetched");
  }
}

const searchBarInp = document.querySelector(".searchBar");

searchBarInp.addEventListener("keyup", (e) => {
  searchVideoRecipe();
});

const searchVideoRecipe = (name = null) => {
  let searchVal = "";

  if (name === null) {
    searchVal = searchBarInp.value.toUpperCase();
  } else {
    searchVal = name.toUpperCase();
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

// Comment

let commentCon = document.querySelector(".commentCon");
let putComment = document.querySelector(".putComment");
let commentInp = document.querySelector("#commentInp");
// let sentimentCountTot = document.querySelector(".sentimentCountTot");
// let sentimentPosCount = document.querySelector(".sentimentPosCount");

function createCommentTemplate(parent, objComment) {
  let commentCard = commentTemplate.content.cloneNode(true).children[0];
  let commentorNm = commentCard.querySelector("#commentor");
  commentorNm.textContent = objComment["who"];

  let commentText = commentCard.querySelector("#commentText");
  commentText.textContent = objComment["comment"];

  // let commentSentiment = commentCard.querySelector(".commentSentiment");
  // commentSentiment.textContent = object["sentiment"];
  parent.append(commentCard);

  // if (object["sentiment"] === "Positive") {
  //   // sentimentPosCount.innerHTML +=1;
  // }

  // sentimentCountTot.innerHTML += 1
}

let objectOfVideo = {};

let commentTemplate = document.querySelector("[data-comment-template]");
putComment.addEventListener("click", async (e) => {
  let commentValue = commentInp.value.trim();
  let email = sessionStorage.getItem("email");
  if (commentValue.length != 0) {
    createCommentTemplate(commentCon, {
      who: email,
      comment: commentValue,
      // sentiment: sentiment,
    });

    await addDoc(
      collection(db, `/savora/recipe/recipes/${objectOfVideo["id"]}/comments`),
      {
        who: email,
        comment: commentValue,
      }
    )
      .then(() => {
        // orgFileList.push(fileNm)
        // fetchFile(fileNm, fileDesc)
        alert("commet added successfully!");
        commentInp.value = ""
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });

    objectOfVideo;

    objectOfVideo = {};
    commentInp.innerHTML = "";
  } else {
    alert("Comment Don't have any text to post!");
  }
});

let con2 = document.querySelector(".con2");
let con3 = document.querySelector(".con3");
let openVideoTag = document.querySelector(".openVideoTag");
let openVideoName = document.querySelector("#openVideoName");
let openVideoContributor = document.querySelector("#openVideoContributor");
let openVideoTimestamp = document.querySelector("#openVideoTimestamp");
let openVideoIngContent = document.querySelector("#openVideoIngContent");
let openVideoStepsContent = document.querySelector("#openVideoStepsContent");
let closeIcon = document.querySelector(".openVideoOpt i");

closeIcon.addEventListener("click", (e) => {
  console.log("click");
  con3.style.display = "none";
  con2.style.width = "96%";
});

// Creating Video template
const videoTemplate = document.querySelector("[data-video-template]");
const videoCon = document.querySelector(".con2");

function createVideoTemplate(object) {
  console.log(object);
  // console.log(videoTemplate.content.cloneNode(true).children[0])
  const videoCard = videoTemplate.content.cloneNode(true).children[0];

  let videoRNm = videoCard.querySelector(".recipeName");

  videoRNm.textContent = object["recipenm"];

  let videoTag = videoCard.querySelector(".videoTag");

  console.log(object["filenm"], object["ingredients"]);

  let optionbg = videoCard.querySelector(".optionbg");

  if (sessionStorage.getItem("user") != null) {
    optionbg.style.display = "flex";
  } else {
    optionbg.style.display = "none";
  }

  let objUrl = object["videoUrl"];
  videoTag.setAttribute("src", "" + objUrl);

  console.log(object["videoUrl"],"object video url")
  // getDownloadURL(ref(storage, "/savora/video/" + object["filenm"]))
  //   .then((url) => {
  //     console.log(url);
  //     // Or inserted into an <img> element
  //     videoTag.setAttribute("src", "" + url);
  //     objUrl = "" + url;
  //   })
  //   .catch((error) => {
  //     // Handle any errors
  //   });

  videoCon.append(videoCard);

  videoTag.addEventListener("click", (e) => {
    con2.style.width = "250px";
    con3.style.display = "block";
    console.log(object["contributor"]);
    openVideoTag.setAttribute("src", objUrl);
    openVideoName.innerHTML = object["recipenm"];
    openVideoContributor.innerHTML = object["contributor"];
    console.log(object['timestamp'])
    openVideoTimestamp.innerHTML = object["timestamp"];
    openVideoIngContent.innerHTML = object["ingredients"].replaceAll(",","<br>");
    openVideoStepsContent.innerHTML = object["steps"].replaceAll(".","<br>").replaceAll(",","<br>");

    objectOfVideo = object;
    commentCon.replaceChildren();

    let colRefComment = collection(
      db,
      `/savora/recipe/recipes/${object["id"]}/comments`
    );
    let commentList = [];
    // Fetching videos

    getDocs(colRefComment)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          commentList.push({ ...doc.data(), id: doc.id });
          console.log(commentList);
        });
      })
      .catch((error) => {
        console.log("error occured");
        console.log(err.code + "::" + err.message);
      });

    // console.log(commentList, object["recipenm"]);
    console.log("list", commentList.length);

    setTimeout(() => {
      for (let i = 0; i < commentList.length; i++) {
        if (
          commentList[i]["who"].trim() != "" &&
          commentList[i]["comment"].trim() != ""
        ) {
          createCommentTemplate(commentCon, commentList[i]);
        }
      }
    }, 500);
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
      "thurday",
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
          console.log(object['steps'])
          addDoc(myPlanColRef, {
            day: nm,
            ingredients: object["ingredients"],
            listname: week,
            recipenm: object["recipenm"],
            videoUrl:objUrl,
            steps:object['steps']
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

// createVideoTemplate();
// createVideoTemplate();
// createVideoTemplate();
// createVideoTemplate();

// let template2 = filterTemplate.content.cloneNode(true)
// console.log(template2)
// let fname2 = template2.querySelector(".filterBtn")
// fname2.textContent = "Chineesessssss"
// fname2.style.width = fname2.textContent.length * 8 + "px"

// filterCon.append(template2)

// // frontend
// const fwidth = document.querySelector('.filterBtn');

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
//     "./firebase-messaging-sw.js"
//   );
//   return registration;
// };

// checkPermission();
// registerSW();
