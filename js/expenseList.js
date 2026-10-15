console.log("expenseList.js: loaded");

import { getLatestExpenses, getExpenseTotalCount, getOlderExpenses } from "./expenseData.js"; // getOlderExpenses is NEW
import { formatDate, formatAmount } from "./utils.js";
import { getActiveMode } from "./state.js";

const listBox  = document.getElementById("expense-list");
const listInfo = document.getElementById("expense-list-info");
console.log("expenseList.js: HTML pieces found:", { listBox, listInfo });

function makeExpenseRow(item) {
    const row = document.createElement("div");
    row.className = "grid grid-cols-12 gap-2 items-center bg-rose-950/30 border border-rose-500/10 rounded-xl px-2 py-3.5 text-sm";

    const colNumber = document.createElement("span");
    colNumber.className = "col-span-1 text-center text-gray-500";
    colNumber.textContent = item.number;

    const colReason = document.createElement("span");
    colReason.className = "col-span-4 text-white font-semibold truncate";
    colReason.textContent = item.reason;

    const colAmount = document.createElement("span");
    colAmount.className = "col-span-3 text-rose-300 font-bold";
    colAmount.textContent = formatAmount(item.amount);

    const colDate = document.createElement("span");
    colDate.className = "col-span-4 text-gray-400 text-xs";
    colDate.textContent = formatDate(item.date);

    row.append(colNumber, colReason, colAmount, colDate);
    console.log("makeExpenseRow: row", item.number, item.reason);
    return row;
}

export function renderExpenseList() {
    const count = getActiveMode() === "expense" ? 5 : 1;
    console.log("renderExpenseList: mode is", getActiveMode(), "| showing", count, "rows");

    const latest = getLatestExpenses(count);
    const total  = getExpenseTotalCount();

    listBox.innerHTML = "";

    if (total === 0) {
        listBox.innerHTML = '<p class="text-center text-gray-500 text-sm py-4">No expenses yet. Press Expense Feature to start.</p>';
        listInfo.textContent = "";
        console.log("renderExpenseList: list is empty");
        return;
    }

    // ── HISTORY TOGGLE: only when section is expanded (count === 5) ──────────
    if (count === 5) {
        const older = getOlderExpenses(5);
        console.log("renderExpenseList: older records:", older.length);

        if (older.length > 0) {

            // The toggle button (the ▼ arrow)
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition";

            const arrowSpan = document.createElement("span");
            arrowSpan.textContent = "▼";

            const labelSpan = document.createElement("span");
            labelSpan.textContent = older.length + " older record" + (older.length > 1 ? "s" : "");

            toggleBtn.appendChild(arrowSpan);
            toggleBtn.appendChild(labelSpan);

            // The hidden box that holds the older rows
            const olderBox = document.createElement("div");
            olderBox.className = "flex flex-col gap-2";
            olderBox.style.display = "none"; // hidden at the start

            older.forEach(function (item) {
                olderBox.appendChild(makeExpenseRow(item));
            });

            // When the arrow is pressed: show or hide the older rows
            toggleBtn.addEventListener("click", function () {
                if (olderBox.style.display === "none") {
                    olderBox.style.display = "flex";
                    olderBox.style.flexDirection = "column";
                    arrowSpan.textContent = "▲";
                    labelSpan.textContent = "Hide older";
                    console.log("renderExpenseList toggle: older records shown");
                } else {
                    olderBox.style.display = "none";
                    arrowSpan.textContent = "▼";
                    labelSpan.textContent = older.length + " older record" + (older.length > 1 ? "s" : "");
                    console.log("renderExpenseList toggle: older records hidden");
                }
            });

            listBox.appendChild(toggleBtn);
            listBox.appendChild(olderBox);

            // A thin line with "latest" label between older and the newest 5
            const separator = document.createElement("div");
            separator.className = "flex items-center gap-2 py-1";
            separator.innerHTML = '<div class="flex-1 h-px bg-rose-500/20"></div><span class="text-[10px] text-gray-600 uppercase tracking-wider">latest</span><div class="flex-1 h-px bg-rose-500/20"></div>';
            listBox.appendChild(separator);
        }
    }

    // ── LATEST ROWS ───────────────────────────────────────────────────────────
    latest.forEach(function (item) {
        listBox.appendChild(makeExpenseRow(item));
    });

    listInfo.textContent = "Showing latest " + latest.length + " of " + total;
    console.log("renderExpenseList: done ->", listInfo.textContent);
}