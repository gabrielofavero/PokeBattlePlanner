import { loadNextTopBarItem, selectTopBarItem } from "../../pages/main/main.js";
import { summaryMoveLeft, summaryMoveRight } from "../../pages/summary/summary.js";
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
                loadKeyDownMain(e);
                break;
            case 'summary':
                loadKeyDownSumamry(e);
        }
    });
}

function loadKeyDownMain(e) {
    switch (e.key.toLowerCase()) {
        case "x":
            loadNextTopBarItem();
    }
}

function loadKeyDownSumamry(e) {
    switch (e.key.toLowerCase()) {
        case "arrowright":
            summaryMoveRight();
            break;
        case "arrowleft": {
            summaryMoveLeft();
        }
    }
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




