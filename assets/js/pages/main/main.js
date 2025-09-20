import { loadLavaBackground } from "../../ui/lava-background.js";
import { hideBack, showConfirm } from "../../ui/navigation/navigation.js";
import { PAGES, setActivePage } from "../../ui/navigation/pages.js";
import { loadPokemonParty } from "./modules/party.js";
import { loadSearchBars, resetSearchBars } from "./modules/search-bar.js";

const CONTENT_SUBPAGES = document.querySelectorAll('.content');
export const CONTEXT_MENU = document.getElementById('party-box').querySelector('.context-menu');
let OUTSIDE_CLICK_LISTENER;

// Loaders
export function loadMainPage() {
    loadLavaBackground();
    resetSearchBars();
    loadSearchBars();
    loadPokemonParty();
}

// Top Bar
export function selectTopBarItem(item) {
    if (!item) return;

    document.querySelectorAll(".top-bar-item").forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");

    setActivePage(PAGES.MAIN);
    showConfirm();
    hideBack();

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

export function goToMainPage(page) {
    if (typeof page === "string") {
        page = document.getElementById(page);
    }
    for (const content of CONTENT_SUBPAGES) {
        content.style.display = "none";
    }
    page.style.display = 'flex';
}

// Context Menu

function contextMenuClickAction(e) {
    if (!CONTEXT_MENU.contains(e.target) && !getSelectedContextMenuItem().contains(e.target)) {
        closeContextMenu();
    }
}

function getSelectedContextMenuItem() {
    return document.querySelector('.party-pokemon.selected');
}

export function openContextMenu() {
    const toOpen = getSelectedContextMenuItem();
    if (!toOpen) return;

    toOpen.classList.add('selected');
    CONTEXT_MENU.style.display = '';

    OUTSIDE_CLICK_LISTENER = (e) => contextMenuClickAction(e);
    setTimeout(() => {
        document.addEventListener('click', OUTSIDE_CLICK_LISTENER);
    }, 0);
}

export function closeContextMenu() {
    const toClose = getSelectedContextMenuItem();
    if (!toClose) return;

    toClose.classList.remove('selected');
    CONTEXT_MENU.style.display = 'none';

    if (OUTSIDE_CLICK_LISTENER) {
        document.removeEventListener('click', OUTSIDE_CLICK_LISTENER);
        OUTSIDE_CLICK_LISTENER = null;
    }
}
