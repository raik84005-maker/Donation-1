console.log("expensePopup.js: loaded");

import { addExpense, getNextExpenseNumber } from "./expenseData.js";
import { todayText }                         from "./utils.js";
import { renderExpenseList }                 from "./expenseList.js";
import { setActiveMode, isCurrentMode }      from "./state.js";
import { renderList }                        from "./list.js";

const expenseBtn      = document.getElementById("expense-btn");
const popup           = document.getElementById("expense-popup");
const doneBtn         = document.getElementById("popup-expense-done-btn");
const cancelBtn       = document.getElementById("popup-expense-cancel-btn");
const popupNumber     = document.getElementById("popup-expense-number");
const popupReason     = document.getElementById("popup-expense-reason");
const popupAmount     = document.getElementById("popup-expense-amount");
const popupDate       = document.getElementById("popup-expense-date");
const popupError      = document.getElementById("popup-expense-error");
const donationSection = document.getElementById("donation-section");
const expenseSection  = document.getElementById("expense-section");
console.log("expensePopup.js: all HTML pieces found");

// ── STEP A: Switch the screen to show the expense view (NO popup) ────────────
function switchToExpenseView() {
    console.log("switchToExpenseView: switching screen to expense side");

    setActiveMode("expense");

    // Move expense section to top, donation to bottom
    expenseSection.style.order  = "1";
    donationSection.style.order = "2";

    // Page-turn animation: expense slides in from the RIGHT
    // (like turning forward to the next page in a book)
    expenseSection.style.animation = "pageSlideFromRight 0.35s ease-out";
    setTimeout(function () {
        expenseSection.style.animation = "";
    }, 400);

    renderExpenseList(); // expense shows 5 rows
    renderList();        // donation shrinks to 1 row
    console.log("switchToExpenseView: done");
}

// ── STEP B: Open the popup form (only when already on expense view) ──────────
function openExpensePopup() {
    console.log("openExpensePopup: opening the add expense form");

    popupNumber.value = getNextExpenseNumber();
    popupReason.value = "";
    popupAmount.value = "";
    popupDate.value   = todayText();
    popupError.classList.add("hidden");

    popup.classList.remove("hidden");
    popup.classList.add("flex");
    popupReason.focus();
    console.log("openExpensePopup: popup visible, next number:", popupNumber.value);
}

function closePopup() {
    popup.classList.add("hidden");
    popup.classList.remove("flex");
    console.log("closePopup (expense): popup hidden");
}

function submitExpense() {
    console.log("submitExpense: Done pressed");

    const reasonValue = popupReason.value.trim();
    const amountValue = Number(popupAmount.value);
    const dateValue   = popupDate.value;
    console.log("submitExpense: values:", { reasonValue, amountValue, dateValue });

    if (reasonValue === "" || amountValue <= 0 || dateValue === "") {
        popupError.classList.remove("hidden");
        console.log("submitExpense: STOP — something is empty");
        return;
    }

    addExpense(reasonValue, amountValue, dateValue);
    closePopup();
    renderExpenseList();
    renderList();
    console.log("submitExpense: saved and lists updated");
}

export function setupExpensePopup() {

    // ── THE KEY LOGIC: 1st click vs 2nd click ──────────────────────────────
    expenseBtn.addEventListener("click", function () {
        if (isCurrentMode("expense")) {
            // Already on expense view → open the popup form
            console.log("Expense button: already on expense view → opening popup");
            openExpensePopup();
        } else {
            // Not on expense view yet → switch the screen first, no popup
            console.log("Expense button: not on expense view yet → switching view");
            switchToExpenseView();
        }
    });

    cancelBtn.addEventListener("click", closePopup);
    doneBtn.addEventListener("click", submitExpense);

    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            console.log("expense popup: dark background clicked, closing");
            closePopup();
        }
    });

    console.log("setupExpensePopup: all expense buttons connected");
}