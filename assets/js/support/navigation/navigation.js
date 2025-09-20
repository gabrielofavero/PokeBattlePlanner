import { goToMainPage, mainBackAction, mainConfirmAction } from "../../pages/main/main.js";
import { loadGamepadListeners } from "./gamepad.js";
import { loadKeyboardListeners } from "./keyboard-mouse.js";
import { ACTIVE_PAGE, PAGES } from "./pages.js";

export function loadNavigation() {
    loadKeyboardListeners();
    loadGamepadListeners();
}

export function selectItem(index, arr) {
    for (let i = 0; i < arr.length; i++) {
        const div = arr[i];
        if (i === index) {
            div.classList.add('selected');
        } else {
            div.classList.remove('selected');
        }
    }
}

function toggleDisplay(type, display) {
    switch (ACTIVE_PAGE) {
        case (PAGES.SUMMARY):
            document.getElementById(`${type}-summary`).style.display = display;
            return;
        default:
            document.getElementById(`${type}-main`).style.display = display;
    }
}

export function showConfirm() {
    toggleDisplay('confirm', '')
}

export function hideConfirm() {
    toggleDisplay('confirm', 'none')
}

export function showBack() {
    toggleDisplay('back', '')
}

export function hideBack() {
    toggleDisplay('back', 'none')
}

export function confirmAction() {
    switch (ACTIVE_PAGE) {
        case (PAGES.MAIN):
            mainConfirmAction();
    }
}

export function backAction() {
    switch (ACTIVE_PAGE) {
        case (PAGES.MAIN):
            mainBackAction();
            return;
        case (PAGES.SUMMARY):
            goToMainPage();
    }
}