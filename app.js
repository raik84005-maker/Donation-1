console.log("app.js: started");

import { renderList }         from "./js/list.js";
import { setupPopup }         from "./js/popup.js";
import { renderExpenseList }  from "./js/expenseList.js";
import { setupExpensePopup }  from "./js/expensePopup.js";
import { getActiveMode }      from "./js/state.js";

// When the page opens, restore the section order from the last visit.
// If last time the user was on expense view, show expense on top again.
const donationSection = document.getElementById("donation-section");
const expenseSection  = document.getElementById("expense-section");

if (getActiveMode() === "expense") {
    expenseSection.style.order  = "1";
    donationSection.style.order = "2";
    console.log("app.js: restored to expense view (last used)");
} else {
    donationSection.style.order = "1";
    expenseSection.style.order  = "2";
    console.log("app.js: restored to donation view (last used or default)");
}

renderList();
console.log("app.js: donation list drawn");

renderExpenseList();
console.log("app.js: expense list drawn");

setupPopup();
console.log("app.js: donation pop-up ready");

setupExpensePopup();
console.log("app.js: expense pop-up ready — app is fully ready");