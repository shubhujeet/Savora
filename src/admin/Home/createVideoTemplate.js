import { uniqueList, newPlanList } from "../myPlan/myPlan.js";
import { addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { videoTemplate, videoCon, colRef } from "./home.js";

export function createVideoTemplate() {
  // console.log(videoTemplate.content.cloneNode(true).children[0])
  const videoCard = videoTemplate.content.cloneNode(true).children[0];

  let videoRNm = videoCard.querySelector(".recipeName");

  videoRNm.textContent = "Biryani";

  videoCon.append(videoCard);

  const option = videoCard.querySelector(".optionbg");
  const myPlannm = videoCard.querySelector("#customList");
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

    let weekName = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday", "Sunday"];

    for (let nm of weekName) {
      let wnode = optemplate.content.cloneNode(true);
      let wnodeNm = wnode.querySelector(".optionsBtn");
      wnodeNm.textContent = nm;
      // console.log(wnodeNm.textContent, "text content");
      listValue.append(wnode);

      wnodeNm.addEventListener("click", (e) => {
        // console.log("click"+nm)
        console.log(newPlanList);

        for (let plan in newPlanList) {
          console.log(plan);
          // if((plan === week) && (plan["day"] === wnodeNm.textContent)) {
          //   console.log(plan ,plan["day"])
          // }
        }


      });

    }
  }

  if (week1) {
    week1.addEventListener("click", () => {
      listValue.replaceChildren();
      optionsList.style.display = "flex";
      listName.innerHTML = week1.innerHTML;
      // console.log("week1 on click")
      selectDay(week1.innerHTML);
    });
  }

  if (week2) {
    week2.addEventListener("click", () => {
      listValue.replaceChildren();
      // optionCon.style.display = "none";
      optionsList.style.display = "flex";
      listName.innerHTML = week2.innerHTML;
      // selectDayOfWeek(week2.innerHTML)
    });
  }

  if (week3) {
    week3.addEventListener("click", () => {
      listValue.replaceChildren();
      // optionCon.style.display = "none";
      optionsList.style.display = "flex";
      listName.innerHTML = week3.innerHTML;
      // selectDayOfWeek(week3.innerHTML)
    });
  }

  if (week4) {
    week4.addEventListener("click", () => {
      listValue.replaceChildren();
      // optionCon.style.display = "none";
      optionsList.style.display = "flex";
      listName.innerHTML = week4.innerHTML;
      // selectDayOfWeek(week4.innerHTML)
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

  if (myPlannm) {
    myPlannm.addEventListener("click", (e) => {
      listValue.replaceChildren();
      optionCon.style.display = "none";
      optionsList.style.display = "flex";
      listName.innerHTML = myPlannm.innerHTML;
      getPlanList();
    });

    optionCon.addEventListener("mouseleave", (e) => {
      optionCon.style.display = "none";
    });
  } else {
  }

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
  function getPlanList() {
    if (uniqueList) {
      console.log(uniqueList, "unique list");
      uniqueList.forEach((element) => {
        console.log(optemplate.content.cloneNode(true), "template in home");
        let node = optemplate.content.cloneNode(true);
        let nodeNm = node.querySelector(".optionsBtn");
        nodeNm.textContent = element;
        console.log(nodeNm.textContent, "text content");
        listValue.append(node);
        // console.log(element)
        nodeNm.addEventListener("click", (e) => {
          console.log("click", element);

          for (let x in newPlanList) {
            if (x === element) {
              for (let j = 0; j < newPlanList[x].length; j++) {
                if (newPlanList[x][j]["name"] === "recp4") {
                  alert(
                    `This plan is already added to your daily routine of :${x}`
                  );
                  break;
                } else {
                  // Add to myplan
                  addDoc(colRef, {
                    ingredients: "lemon",
                    listname: element,
                    recpnm: "recp4",
                  })
                    .then(() => {
                      alert("Successfully added to myPlan!!", x);
                    })
                    .catch((error) => {
                      console.log(error.code);
                      console.log(error.message);
                    });
                  break;
                }
              }
            }
          }
        });
      });
    }
  }
}
