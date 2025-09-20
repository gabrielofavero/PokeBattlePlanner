import { PAGES, setActivePage } from "../../app.js";
import { hideBack, showConfirm } from "../../ui/navigation/navigation.js";

const CONTENT_SUBPAGES = document.querySelectorAll('.content');

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
export function openContextMenu(contextMenu, toOpen) {
    toOpen.classList.add('selected');
    contextMenu.style.display = '';
}

export function closeContextMenu(contextMenu, toClose) {
    if (!toClose) {
        return;
    }
    toClose.classList.remove('selected');
    contextMenu.style.display = 'none';
}

