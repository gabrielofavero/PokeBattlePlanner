import { stopPixiApp } from "../../ui/lava-background.js";
import { selectItem } from "../../ui/navigation/navigation.js";
import { PAGES, setActivePage } from "../../ui/navigation/pages.js";
import { PARTY } from "../main/modules/party.js";
import { loadMovesRadar } from "./modules/moves-radar.js";
import { loadSummaryNavigationListeners } from "./support/navigation.js";

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

export function loadSummaryPage() {
    loadSummaryListeners();
}


function loadSummaryListeners() {
    for (const icon of TOP_MENU_ICONS) {
        icon.icon.addEventListener('click', icon.action);
    }

    for (const summaryPokemon of SUMMARY_PARTY_DIVS) {
        summaryPokemon.addEventListener('click', () => loadPokemonSummary(summaryPokemon))
    }

    loadSummaryNavigationListeners();
}


export function openSummary(index = 0) {
    setActivePage(PAGES.SUMMARY);
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

// Party Actions
export function loadPokemonSummary(summaryPokemon, direction) {
    const currentIndex = parseInt(summaryPokemon.getAttribute('party-number')) - 1;
    let newIndex = !direction ? currentIndex : direction == 'up' ? currentIndex - 1 : currentIndex + 1;
    newIndex = getNextActionIndex(newIndex, PARTY.length);

    selectItem(newIndex, SUMMARY_PARTY_DIVS);

    console.log(PARTY[newIndex]);
    loadSummaryData(newIndex);
    loadMovesRadar();
}


// Helpers
export function getNextActionIndex(index, arrLength) {
    if (index == arrLength) {
        return 0;
    }
    if (index < 0) {
        return arrLength - 1;
    }
    return index;
}