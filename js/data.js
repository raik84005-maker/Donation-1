console.log("data.js: loaded");

// The list starts EMPTY. Every person is added from the Add Donation pop-up.
const donations = [];
console.log("data.js: list started empty, total:", donations.length);

// How many donations are saved in total
export function getTotalCount() {
    return donations.length;
}

// The number the next person will get (1, 2, 3 ...)
export function getNextNumber() {
    const next = donations.length + 1;
    console.log("getNextNumber:", next);
    return next;
}

// Save one new donation
export function addDonation(name, amount, date) {
    donations.push({ name: name, amount: amount, date: date });
    console.log("addDonation: saved", { name, amount, date }, "| total now:", donations.length);
}

// Give back only the LAST few donations (we use 5), each with its real number
export function getLatestDonations(count) {
    const start = Math.max(0, donations.length - count);
    console.log("getLatestDonations: total", donations.length, "| start from index", start);

    return donations.slice(start).map(function (item, i) {
        return {
            number: start + i + 1,
            name: item.name,
            amount: item.amount,
            date: item.date
        };
    });
}    
// NEW FUNCTION: gives back everything that is OLDER than the latest `keepLatest` records
// Example: 7 donations, keepLatest=5 → returns records 1 and 2
export function getOlderDonations(keepLatest) {
    const end = Math.max(0, donations.length - keepLatest);
    console.log("getOlderDonations: keepLatest:", keepLatest, "| older count:", end);
    if (end === 0) {
        console.log("getOlderDonations: nothing older, returning empty");
        return [];
    }
    return donations.slice(0, end).map(function (item, i) {
        return { number: i + 1, name: item.name, amount: item.amount, date: item.date };
    });
}
