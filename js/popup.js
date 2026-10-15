console.log("popup.js: loaded");

import { addDonation, getNextNumber }   from "./data.js";
import { todayText }                     from "./utils.js";
import { renderList }                    from "./list.js";
import { setActiveMode, isCurrentMode }  from "./state.js";
import { renderExpenseList }             from "./expenseList.js";

const addBtn          = document.getElementById("add-donation-btn");
const popup           = document.getElementById("donation-popup");
const doneBtn         = document.getElementById("popup-done-btn");
const cancelBtn       = document.getElementById("popup-cancel-btn");
const popupNumber     = document.getElementById("popup-number");
const popupName       = document.getElementById("popup-name");
const popupAmount     = document.getElementById("popup-amount");
const popupDate       = document.getElementById("popup-date");
const popupError      = document.getElementById("popup-error");
const donationSection = document.getElementById("donation-section");
const expenseSection  = document.getElementById("expense-section");
console.log("popup.js: all HTML pieces found");

// ── STEP A: Switch the screen to show the donation view (NO popup) ──────────
function switchToDonationView() {
    console.log("switchToDonationView: switching screen to donation side");

    setActiveMode("donation");

    // Move donation section to top, expense to bottom
    donationSection.style.order = "1";
    expenseSection.style.order  = "2";

    // Page-turn animation: donation slides in from the LEFT
    // (like turning back to the previous page in a book)
    donationSection.style.animation = "pageSlideFromLeft 0.35s ease-out";
    setTimeout(function () {
        donationSection.style.animation = "";
    }, 400);

    renderList();        // donation shows 5 rows
    renderExpenseList(); // expense shrinks to 1 row
    console.log("switchToDonationView: done");
}

// ── STEP B: Open the popup form (only when already on donation view) ─────────
function openDonationPopup() {
    console.log("openDonationPopup: opening the add donation form");

    popupNumber.value = getNextNumber();
    popupName.value   = "";
    popupAmount.value = "";
    popupDate.value   = todayText();
    popupError.classList.add("hidden");

    popup.classList.remove("hidden");
    popup.classList.add("flex");
    popupName.focus();
    console.log("openDonationPopup: popup visible, next number:", popupNumber.value);
}

function closePopup() {
    popup.classList.add("hidden");
    popup.classList.remove("flex");
    console.log("closePopup (donation): popup hidden");
}

function submitDonation() {
    console.log("submitDonation: Done pressed");

    const nameValue   = popupName.value.trim();
    const amountValue = Number(popupAmount.value);
    const dateValue   = popupDate.value;
    console.log("submitDonation: values:", { nameValue, amountValue, dateValue });

    if (nameValue === "" || amountValue <= 0 || dateValue === "") {
        popupError.classList.remove("hidden");
        console.log("submitDonation: STOP — something is empty");
        return;
    }

    addDonation(nameValue, amountValue, dateValue);
    closePopup();
    renderList();
    renderExpenseList();
    console.log("submitDonation: saved and lists updated");
}

export function setupPopup() {

    // ── THE KEY LOGIC: 1st click vs 2nd click ──────────────────────────────
    addBtn.addEventListener("click", function () {
        if (isCurrentMode("donation")) {
            // Already on donation view → open the popup form
            console.log("Add Donation button: already on donation view → opening popup");
            openDonationPopup();
        } else {
            // Not on donation view yet → switch the screen first, no popup
            console.log("Add Donation button: not on donation view yet → switching view");
            switchToDonationView();
        }
    });

    cancelBtn.addEventListener("click", closePopup);
    doneBtn.addEventListener("click", submitDonation);

    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            console.log("donation popup: dark background clicked, closing");
            closePopup();
        }
    });

    console.log("setupPopup: all donation buttons connected");
}