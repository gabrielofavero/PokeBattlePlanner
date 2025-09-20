import { selectTopBarItem } from "../../pages/main/main.js";
import { returnToPokemonSearch, savePokemon } from "../../pages/main/modules/party.js";
import { loadGamepadListeners } from "./gamepad.js";
import { loadKeyboardListeners, loadMouseListeners } from "./keyboard-mouse.js";
import { ACTIVE_PAGE, PAGES } from "./pages.js";


export function loadNavigation() {
    loadKeyboardListeners();
    loadMouseListeners();
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

export function goToPage(pageID) {
    const pages = document.querySelectorAll('.page');
    for (const page of pages) {
        page.style.display = 'none';
    }
    document.getElementById(pageID).style.display = '';
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
        case (PAGES.EDIT_POKEMON):
            savePokemon();
            return;
    }
}

export function backAction() {
    switch (ACTIVE_PAGE) {
        case (PAGES.EDIT_POKEMON):
            returnToPokemonSearch();
            return;
        case (PAGES.SUMMARY):
            goToPage('main');
            selectTopBarItem(document.querySelectorAll('.top-bar-item')[0]);
    }
}