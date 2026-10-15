console.log("expenseData.js: loaded");

// A separate storage drawer for expenses only
const STORAGE_KEY = "rampu_expenses";
const FIVE_MONTHS_MS = 5 * 30 * 24 * 60 * 60 * 1000;
console.log("expenseData.js: keeping data for 5 months (ms):", FIVE_MONTHS_MS);

function loadFromStorage() {
    console.log("loadFromStorage (expenses): checking localStorage...");
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        console.log("loadFromStorage (expenses): nothing found, starting empty");
        return [];
    }

    const saved = JSON.parse(raw);
    console.log("loadFromStorage (expenses): found", saved.expenses.length, "expenses, savedAt:", saved.savedAt);

    const age = Date.now() - saved.savedAt;
    console.log("loadFromStorage (expenses): age in days:", Math.floor(age / (24 * 60 * 60 * 1000)));

    if (age > FIVE_MONTHS_MS) {
        console.log("loadFromStorage (expenses): older than 5 months — clearing");
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }

    console.log("loadFromStorage (expenses): data is fresh, loaded OK");
    return saved.expenses;
}

function saveToStorage(expenses) {
    const package_ = {
        savedAt: Date.now(),
        expenses: expenses
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(package_));
    console.log("saveToStorage (expenses): saved", expenses.length, "at", new Date().toLocaleString());
}

const expenses = loadFromStorage();
console.log("expenseData.js: starting with", expenses.length, "expenses from storage");

export function getExpenseTotalCount() {
    return expenses.length;
}

export function getNextExpenseNumber() {
    const next = expenses.length + 1;
    console.log("getNextExpenseNumber:", next);
    return next;
}

export function addExpense(reason, amount, date) {
    expenses.push({ reason: reason, amount: amount, date: date });
    saveToStorage(expenses);
    console.log("addExpense: saved", { reason, amount, date }, "| total now:", expenses.length);
}

export function getLatestExpenses(count) {
    const start = Math.max(0, expenses.length - count);
    console.log("getLatestExpenses: total", expenses.length, "| showing from index", start);

    return expenses.slice(start).map(function (item, i) {
        return {
            number: start + i + 1,
            reason: item.reason,
            amount: item.amount,
            date: item.date
        };
    });
}
// NEW FUNCTION: gives back everything that is OLDER than the latest `keepLatest` records
export function getOlderExpenses(keepLatest) {
    const end = Math.max(0, expenses.length - keepLatest);
    console.log("getOlderExpenses: keepLatest:", keepLatest, "| older count:", end);
    if (end === 0) {
        console.log("getOlderExpenses: nothing older, returning empty");
        return [];
    }
    return expenses.slice(0, end).map(function (item, i) {
        return { number: i + 1, reason: item.reason, amount: item.amount, date: item.date };
    });
}