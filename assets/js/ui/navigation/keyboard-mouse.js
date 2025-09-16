import { ACTIVE_PAGE } from "../../app.js";
import { summaryMoveLeft, summaryMoveRight } from "../../pages/summary.js";

const PAGES = document.querySelectorAll('.content');

// Loaders
export function loadNavigation() {
    loadMouseActions();
    loadKeyDownActions();
}

// Actions
function loadMouseActions() {
    document.querySelectorAll(".top-bar-item").forEach(item => {
        item.addEventListener("click", () => selectTopBarItem(item));
    });
    document.getElementById('next-top-bar-item').addEventListener("click", loadNextTopBarItem);
}

function loadKeyDownActions() {
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

export function loadNextTopBarItem() {
    const selected = document.querySelector(".top-bar-item.selected");
    let next = selected?.nextElementSibling;
    if (!next || !next.classList.contains("top-bar-item")) {
        next = document.querySelectorAll('.top-bar-item')[0];
    }
    selectTopBarItem(next);
}

export function goToPage(page) {
    for (const content of PAGES) {
        content.style.display = "none";
    }
    page.style.display = 'flex';
}

export function goToPageWithId(id) {
    const page = document.getElementById(id);
    goToPage(page);
}

function selectTopBarItem(item) {
    if (!item) return;

    document.querySelectorAll(".top-bar-item").forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");

    // loadDefaultBackgroundColor();
    goToPage(document.getElementById(item.getAttribute("to-show")));
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




