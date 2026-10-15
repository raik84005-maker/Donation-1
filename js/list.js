console.log("list.js: loaded");

import { getLatestDonations, getTotalCount, getOlderDonations } from "./data.js"; // getOlderDonations is NEW
import { formatDate, formatAmount } from "./utils.js";
import { getActiveMode } from "./state.js";

const listBox  = document.getElementById("donation-list");
const listInfo = document.getElementById("list-info");
console.log("list.js: HTML pieces found:", { listBox, listInfo });

function makeRow(item) {
    const row = document.createElement("div");
    row.className = "grid grid-cols-12 gap-2 items-center bg-neutral-900 border border-white/5 rounded-xl px-2 py-3.5 text-sm";

    const colNumber = document.createElement("span");
    colNumber.className = "col-span-1 text-center text-gray-500";
    colNumber.textContent = item.number;

    const colName = document.createElement("span");
    colName.className = "col-span-4 text-white font-semibold truncate";
    colName.textContent = item.name;

    const colAmount = document.createElement("span");
    colAmount.className = "col-span-3 text-sky-300 font-bold";
    colAmount.textContent = formatAmount(item.amount);

    const colDate = document.createElement("span");
    colDate.className = "col-span-4 text-gray-400 text-xs";
    colDate.textContent = formatDate(item.date);

    row.append(colNumber, colName, colAmount, colDate);
    console.log("makeRow (donation): row", item.number, item.name);
    return row;
}

export function renderList() {
    const count = getActiveMode() === "donation" ? 5 : 1;
    console.log("renderList: mode is", getActiveMode(), "| showing", count, "rows");

    const latest = getLatestDonations(count);
    const total  = getTotalCount();

    listBox.innerHTML = "";

    if (total === 0) {
        listBox.innerHTML = '<p class="text-center text-gray-500 text-sm py-4">No donations yet. Press Add Donation to start.</p>';
        listInfo.textContent = "";
        console.log("renderList: list is empty");
        return;
    }

    // ── HISTORY TOGGLE: only when section is expanded (count === 5) ──────────
    if (count === 5) {
        const older = getOlderDonations(5);
        console.log("renderList: older records:", older.length);

        if (older.length > 0) {

            // The toggle button (the ▼ arrow)
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-sky-400 bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/20 rounded-xl transition";

            const arrowSpan = document.createElement("span");
            arrowSpan.textContent = "▼";

            const labelSpan = document.createElement("span");
            labelSpan.textContent = older.length + " older record" + (older.length > 1 ? "s" : "");

            toggleBtn.appendChild(arrowSpan);
            toggleBtn.appendChild(labelSpan);

            // The hidden box that holds the older rows
            const olderBox = document.createElement("div");
            olderBox.className = "flex flex-col gap-2"; // Tailwind layout classes
            olderBox.style.display = "none";            // hidden at the start

            // Build the older rows and put them inside olderBox
            older.forEach(function (item) {
                olderBox.appendChild(makeRow(item));
            });

            // When the arrow is pressed: show or hide the older rows
            toggleBtn.addEventListener("click", function () {
                if (olderBox.style.display === "none") {
                    // Show the older records
                    olderBox.style.display = "flex";
                    olderBox.style.flexDirection = "column";
                    arrowSpan.textContent = "▲";
                    labelSpan.textContent = "Hide older";
                    console.log("renderList toggle: older records shown");
                } else {
                    // Hide the older records again
                    olderBox.style.display = "none";
                    arrowSpan.textContent = "▼";
                    labelSpan.textContent = older.length + " older record" + (older.length > 1 ? "s" : "");
                    console.log("renderList toggle: older records hidden");
                }
            });

            listBox.appendChild(toggleBtn);
            listBox.appendChild(olderBox);

            // A thin line with "latest" label between older and the newest 5
            const separator = document.createElement("div");
            separator.className = "flex items-center gap-2 py-1";
            separator.innerHTML = '<div class="flex-1 h-px bg-white/10"></div><span class="text-[10px] text-gray-600 uppercase tracking-wider">latest</span><div class="flex-1 h-px bg-white/10"></div>';
            listBox.appendChild(separator);
        }
    }

    // ── LATEST ROWS ───────────────────────────────────────────────────────────
    latest.forEach(function (item) {
        listBox.appendChild(makeRow(item));
    });

    listInfo.textContent = "Showing latest " + latest.length + " of " + total;
    console.log("renderList: done ->", listInfo.textContent);
}