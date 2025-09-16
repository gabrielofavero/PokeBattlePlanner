import { stopPixiApp } from "../support/lava-background.js";
import { loadMovesRadar } from "../ui/moves-radar.js";

const TOP_MENU_ICONS = {
    info: {
        icon: document.querySelector('.summary-icon.info'),
        content: document.querySelector('.summary-info')
    },
    moves: {
        icon: document.querySelector('.summary-icon.moves'),
        content: document.querySelector('.summary-moves')
    },
}

export function loadSummary() {
    loadSummaryListeners();
}

function loadSummaryListeners() {
    TOP_MENU_ICONS.info.icon.addEventListener('click', loadSummaryInfo);
    TOP_MENU_ICONS.moves.icon.addEventListener('click', loadMovesInfo);
}

export function loadSummaryPage() {
    stopPixiApp();
    document.body.style.background = "linear-gradient(to top right, #015dba, #002c59)";
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('summary-page').style.display = '';
    loadMovesRadar();
}

function loadTopMenuItem(toShow, toHide) {
    toHide.content.style.display = 'none'
    toHide.icon.classList.remove('selected');
    toShow.content.style.display = ''
    toShow.icon.classList.add('selected');
}

function loadSummaryInfo() {
    loadTopMenuItem(TOP_MENU_ICONS.info, TOP_MENU_ICONS.moves);
}

function loadMovesInfo() {
    loadTopMenuItem(TOP_MENU_ICONS.moves, TOP_MENU_ICONS.info);
}