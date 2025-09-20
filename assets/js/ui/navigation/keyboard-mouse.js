import { loadNextTopBarItem, selectTopBarItem } from "../../pages/main/main.js";
import { loadMainKeyboardAction } from "../../pages/main/support/navigation.js";
import { loadSummaryKeyboardAction } from "../../pages/summary/support/navigation.js";
import { backAction, confirmAction } from "./navigation.js";
import { ACTIVE_PAGE } from "./pages.js";

// Loaders
export function loadMouseListeners() {
    document.getElementById('confirm-main').addEventListener('click', confirmAction);
    document.getElementById('back-main').addEventListener('click', backAction);

    document.querySelectorAll(".top-bar-item").forEach(item => {
        item.addEventListener("click", () => selectTopBarItem(item));
    });
    document.getElementById('next-top-bar-item').addEventListener("click", loadNextTopBarItem);
}

export function loadKeyboardListeners() {
    document.addEventListener("keydown", e => {
        if (isTyping()) return;
        switch (ACTIVE_PAGE) {
            case 'main':
                loadMainKeyboardAction(e);
                break;
            case 'summary':
                loadSummaryKeyboardAction(e);
        }
    });
}

// Validators
function isTyping() {
    const active = document.activeElement;
    return active && (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable
    );
}