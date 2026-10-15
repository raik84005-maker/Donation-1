console.log("utils.js: loaded");

// "2026-10-01" -> "01 Oct 2026"
export function formatDate(dateText) {
    const date = new Date(dateText + "T00:00:00");
    const pretty = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    console.log("formatDate:", dateText, "->", pretty);
    return pretty;
}

// 10000 -> "10,000"
export function formatAmount(amount) {
    const pretty = Number(amount).toLocaleString();
    console.log("formatAmount:", amount, "->", pretty);
    return pretty;
}

// Today's date as "2026-10-13" (uses the phone's own local date)
export function todayText() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const text = year + "-" + month + "-" + day;
    console.log("todayText:", text);
    return text;
}