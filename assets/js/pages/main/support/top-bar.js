import { hideBack, hideY, showConfirm } from "../../../support/navigation/navigation.js";
import { PAGES, setActivePage } from "../../../support/navigation/pages.js";
import { goToMainPage } from "../main.js";

export function selectTopBarItem(item) {
    if (!item) return;

    document.querySelectorAll(".top-bar-item").forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");

    setActivePage(PAGES.MAIN);
    showConfirm();
    hideBack();
    hideY();

    goToMainPage(document.getElementById(item.getAttribute("to-show")));
}

export function loadNextTopBarItem() {
    const selected = document.querySelector(".top-bar-item.selected");
    let next = selected?.nextElementSibling;
    if (!next || !next.classList.contains("top-bar-item")) {
        next = document.querySelectorAll('.top-bar-item')[0];
    }
    selectTopBarItem(next);
}

export function goToFirstTopBarItem() {
    const first = document.querySelectorAll('.top-bar-item')[0];
    selectTopBarItem(first);
}