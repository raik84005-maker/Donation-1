console.log("state.js: loaded");

// We save the active mode to localStorage so when the user comes back
// 2 days later, the app remembers which side they were on last.
const MODE_KEY = "rampu_active_mode";

// Read which mode is currently active.
// If nothing is saved yet, default to "donation".
export function getActiveMode() {
    const saved = localStorage.getItem(MODE_KEY);
    const mode  = saved || "donation";
    console.log("getActiveMode:", mode);
    return mode;
}

// Save which mode is now active.
export function setActiveMode(mode) {
    localStorage.setItem(MODE_KEY, mode);
    console.log("setActiveMode: changed to", mode);
}

// Ask: is the screen currently showing THIS mode?
// Used by the buttons to decide: show view OR open popup.
export function isCurrentMode(mode) {
    const result = getActiveMode() === mode;
    console.log("isCurrentMode:", mode, "->", result);
    return result;
}