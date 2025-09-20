import { TOP_MENU_ICONS, getNextActionIndex, loadPokemonSummary } from "../summary.js";

export function loadSummaryKeyboardAction(e) {
    switch (e.key.toLowerCase()) {
        case "arrowright":
            summaryMoveRight();
            break;
        case "arrowleft": {
            summaryMoveLeft();
        }
    }
}

export function loadSummaryGamepadAction(button) {
    switch (button) {
        case "UP":
            summaryMoveUp();
            break;
        case "DOWN":
            summaryMoveDown();
            break;
        case "LEFT":
            summaryMoveLeft();
            break;
        case "RIGHT":
            summaryMoveRight();
            break;
        case "B":
        case "CIRCLE":
            loadNextTopBarItem();
            break;
    }

}

export function loadSummaryNavigationListeners() {
    document.querySelector('.summary-top-menu .summary-icon.arrow.left').addEventListener('click', summaryMoveLeft);
    document.querySelector('.summary-top-menu .summary-icon.arrow.right').addEventListener('click', summaryMoveRight);
    document.querySelector('.summary-party-pokemons .summary-icon.arrow.up').addEventListener('click', summaryMoveUp);
    document.querySelector('.summary-party-pokemons .summary-icon.arrow.down').addEventListener('click', summaryMoveDown);
}

function summaryMoveUp() {
    summaryVerticalMove('up');
}

function summaryMoveDown() {
    summaryVerticalMove('down');
}

function summaryMoveLeft() {
    summaryHorizontalMove('left');
}

function summaryMoveRight() {
    summaryHorizontalMove();
}

function summaryVerticalMove(direction) {
    const summaryPokemon = document.querySelector('.summary-party-pokemon.selected');
    loadPokemonSummary(summaryPokemon, direction)
}

function summaryHorizontalMove(direction = 'right') {
    const currentIndex = TOP_MENU_ICONS.findIndex(el =>
        el.icon.classList.contains('selected')
    );
    const newIndex = direction == 'right' ? currentIndex + 1 : currentIndex - 1;
    TOP_MENU_ICONS[getNextActionIndex(newIndex, TOP_MENU_ICONS.length)].action();
}