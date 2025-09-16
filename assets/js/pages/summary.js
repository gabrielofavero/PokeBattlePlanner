import { stopPixiApp } from "../support/lava-background.js";
import { loadMovesRadar } from "../ui/moves-radar.js";
import { setActivePage } from "../app.js";
import { PARTY } from "./party.js";
import { selectItem } from "../ui/navigation/navigation.js";

const INFO_ICON = {
    icon: document.querySelector('.summary-icon.info'),
    content: document.querySelector('.summary-info'),
    action: loadSummaryInfo
}

const MOVES_ICON = {
    icon: document.querySelector('.summary-icon.moves'),
    content: document.querySelector('.summary-moves'),
    action: loadMovesInfo
}

const SUMMARY_PARTY_DIVS = Array.from(document.querySelectorAll('.summary-party-pokemon'));

const TOP_MENU_ICONS = [INFO_ICON, MOVES_ICON]

export function loadSummaryListeners() {
    for (const icon of TOP_MENU_ICONS) {
        icon.icon.addEventListener('click', icon.action);
    }

    for (const summaryPokemon of SUMMARY_PARTY_DIVS) {
        summaryPokemon.addEventListener('click', () => loadPokemonSummary(summaryPokemon))
    }

    document.querySelector('.summary-top-menu .summary-icon.arrow.left').addEventListener('click', summaryMoveLeft);
    document.querySelector('.summary-top-menu .summary-icon.arrow.right').addEventListener('click', summaryMoveRight);
    document.querySelector('.summary-party-pokemons .summary-icon.arrow.up').addEventListener('click', summaryMoveUp);
    document.querySelector('.summary-party-pokemons .summary-icon.arrow.down').addEventListener('click', summaryMoveDown);
}


export function openSummary(index=0) {
    setActivePage('summary');
    stopPixiApp();
    document.body.style.background = "linear-gradient(to top right, #015dba, #002c59)";
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('summary-page').style.display = '';
    const partyPokemon = SUMMARY_PARTY_DIVS[index];
    loadPokemonSummary(partyPokemon);
}

function loadSummaryData() {

}


// Menu Actions

function loadTopMenuItem(index) {
    for (let i = 0; i < TOP_MENU_ICONS.length; i++) {
        const icon = TOP_MENU_ICONS[i];
        if (i === index) {
            icon.content.style.display = ''
            icon.icon.classList.add('selected');
        } else {
            icon.content.style.display = 'none'
            icon.icon.classList.remove('selected');
        }
    }
}

function loadSummaryInfo() {
    loadTopMenuItem(0);
}

function loadMovesInfo() {
    loadTopMenuItem(1);
    loadMovesRadar();
}

// Menu Navigation

function summaryHorizontalMove(direction='right') {
    const currentIndex = TOP_MENU_ICONS.findIndex(el =>
        el.icon.classList.contains('selected')
      );
    const newIndex = direction == 'right' ? currentIndex + 1 : currentIndex - 1;
    TOP_MENU_ICONS[getNextActionIndex(newIndex, TOP_MENU_ICONS.length)].action();
}

export function summaryMoveRight() {
    summaryHorizontalMove();
}

export function summaryMoveLeft() {
    summaryHorizontalMove('left');
}

// Party Actions
function loadPokemonSummary(summaryPokemon, direction) {
    const currentIndex = parseInt(summaryPokemon.getAttribute('party-number')) - 1;
    let newIndex = !direction ? currentIndex : direction == 'up' ? currentIndex - 1 : currentIndex + 1;
    newIndex = getNextActionIndex(newIndex, PARTY.length);

    selectItem(newIndex, SUMMARY_PARTY_DIVS);
    
    console.log(PARTY[newIndex]);
    loadSummaryData(newIndex);
    loadMovesRadar();
}

// Party Navigation
export function summaryMoveUp() {
    summaryVerticalMove('up');
}

export function summaryMoveDown() {
    summaryVerticalMove('down');
}

function summaryVerticalMove(direction) {
    const summaryPokemon = document.querySelector('.summary-party-pokemon.selected');
    loadPokemonSummary(summaryPokemon, direction)
}


// Helpers
function getNextActionIndex(index, arrLength) {
    if (index == arrLength) {
        return 0;
    }

    if (index < 0) {
        return arrLength - 1;
    }

    return index;
}