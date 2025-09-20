import { loadMainKeyboardAction } from "../../pages/main/support/navigation.js";
import { loadSummaryKeyboardAction } from "../../pages/summary/support/navigation.js";
import { ACTIVE_PAGE } from "./pages.js";

// Loaders

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