import { clearConfirmAction, mainBackAction, mainConfirmAction } from "../main.js";
import { loadNextTopBarItem, selectTopBarItem } from "./top-bar.js";

export function loadMainNavigationListeners() {
    document.getElementById('confirm-main').addEventListener('click', mainConfirmAction);
    document.getElementById('back-main').addEventListener('click', mainBackAction);
    document.getElementById('y-main').addEventListener('click', clearConfirmAction);
    document.querySelectorAll(".top-bar-item").forEach(item => {
        item.addEventListener("click", () => selectTopBarItem(item));
    });
    document.getElementById('next-top-bar-item').addEventListener("click", loadNextTopBarItem);
}

export function loadMainKeyboardAction(e) {
    switch (e.key.toLowerCase()) {
        case "x":
            loadNextTopBarItem();
    }
}

export function loadMainGamepadAction(button) {
    switch (button) {
        case "X":
        case "SQUARE":
            loadNextTopBarItem();
            break;
        case "A":
        case "CROSS":
            mainConfirmAction();
            break;
        case "B":
        case "CIRCLE":
            mainBackAction();
            break;
        case "Y":
        case "TRIANGLE":
            clearConfirmAction();
            break;
    }
}