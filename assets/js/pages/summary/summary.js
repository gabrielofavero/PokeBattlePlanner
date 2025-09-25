import { setTypeBannersMini } from "../../support/banners.js";
import { getPokemonArtworkSrc, getPokemonData, getPokemonSpriteAlt, getPokemonSpriteSrc } from "../../support/data/pokemon.js";
import { pauseLavaBackground, resumeLavaBackground } from "../../support/lava-background.js";
import { selectItem } from "../../support/navigation/navigation.js";
import { PAGES, setActivePage } from "../../support/navigation/pages.js";
import { PARTY } from "../main/modules/party-management/party.js";
import { loadMovesRadar } from "./modules/moves-radar.js";
import { loadSummaryNavigationListeners } from "./support/navigation.js";
import { loadMovesInfo, loadSummaryInfo } from "./support/top-menu.js";

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

export const TOP_MENU_ICONS = [INFO_ICON, MOVES_ICON]

export function loadSummaryPage() {
    loadSummaryListeners();
    loadSummaryNavigationListeners();
}


function loadSummaryListeners() {
    for (const icon of TOP_MENU_ICONS) {
        icon.icon.addEventListener('click', icon.action);
    }

    for (const partyPokemonDiv of SUMMARY_PARTY_DIVS) {
        partyPokemonDiv.addEventListener('click', () => loadPokemonSummary(partyPokemonDiv))
    }
}

export async function openSummary(index = 0) {
    pauseLavaBackground();
    setActivePage(PAGES.SUMMARY);
    document.body.style.background = "linear-gradient(to top right, #015dba, #002c59)";
    document.getElementById('main').style.display = 'none';
    document.getElementById('summary').style.display = '';
    const partyPokemonDiv = SUMMARY_PARTY_DIVS[index];
    loadPartyImages();
    loadPokemonSummary(partyPokemonDiv);
}

export function closeSummary() {
    resumeLavaBackground();
    document.getElementById('summary').style.display = 'none';
    document.getElementById('main').style.display = '';
    setActivePage(PAGES.MAIN);
}

// Load Data

async function loadPartyImages() {
    for (const div of SUMMARY_PARTY_DIVS) {
        const i = parseInt(div.getAttribute('party-number')) - 1;
        const noPokemon = Object.keys(PARTY[i].pokemon).length === 0;
        const img = div.querySelector('img');

        if (noPokemon) {
            img.src = '';
            img.alt = '';
        }

        const pokemonData = await getPokemonData(PARTY[i].pokemon);
        img.src = noPokemon ? '' : getPokemonSpriteSrc(pokemonData);
        img.alt = noPokemon ? '' : getPokemonSpriteAlt(pokemonData);
    }
}

function loadPokemonSummary(partyPokemonDiv) {
    const i = parseInt(partyPokemonDiv.getAttribute('party-number')) - 1;
    loadPokemonSummaryByIndex(i);
}

export function loadPokemonSummaryByIndex(i) {
    selectItem(i, SUMMARY_PARTY_DIVS);
    loadSummaryData(i);
    loadMovesRadar();
}

function loadSummaryData(index) {
    const pokemon = PARTY[index].pokemon;
    if (Object.keys(pokemon).length === 0) {
        return;
    }
    loadPreviewData(pokemon);
    loadSummaryInfoData(pokemon);
}

function loadPreviewData(pokemon) {
    const previewImg = document.querySelector('.summary-pokemon-preview-pokemon img');
    previewImg.src = getPokemonArtworkSrc(pokemon);
    previewImg.alt = getPokemonSpriteAlt(pokemon);

    document.querySelector('.summary-pokemon-preview-title .title').textContent = pokemon.title;
    
    const typeMini = document.querySelector('.summary-pokemon-preview-types');
    setTypeBannersMini(typeMini, pokemon.types);
}

function loadSummaryInfoData(pokemon) {
    const summaryInfo = document.querySelector('.summary-info');

    getDescription('name').textContent = pokemon.title;

    function getDescription(className) {
        return summaryInfo.querySelector(`.${className}`).querySelector('.summary-info-row-description');
    }
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