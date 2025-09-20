const CONTEXT_MENU = document.getElementById('party-box').querySelector('.context-menu');
let OUTSIDE_CLICK_LISTENER;

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

function contextMenuClickAction(e) {
    if (!CONTEXT_MENU.contains(e.target) && !getSelectedContextMenuItem().contains(e.target)) {
        closeContextMenu();
    }
}

function getSelectedContextMenuItem() {
    return document.querySelector('.party-pokemon.selected');
}