import { getObjectName } from "../../../../support/data/data.js";
import { getPokemonData, getPokemonMoveData, getPokemonSpriteSrc, isPartyMemberEmpty } from "../../../../support/data/pokemon.js";
import { selectItem } from "../../../../support/navigation/navigation.js";
import { backToMain, deletePartyInputs, goToEditPokemonPage, setParty } from "../../../edit-pokemon/edit-pokemon.js";
import { openSummary } from "../../../summary/summary.js";
import { goToMainPage } from "../../main.js";
import { closeContextMenu, openContextMenu } from "../../support/context-menu.js";
import { getMoveOption, getMoveOptions, getPokemonOption, getPokemonOptions } from "../../support/search-bar.js";

export var PARTY = [];
export var CURRENT_PARTY_INDEX = -1;
export var CURRENT_POKEMON = {};
export var CURRENT_MOVES = [];

const PARTY_BOXES = document.getElementsByClassName('party-pokemon');

// Loaders
export async function loadPokemonParty() {
    initParty();
    const data = localStorage.getItem('party');
    if (data) {
        PARTY = JSON.parse(data);
    }
    loadPokemonPartiesListeners();
    await loadPartyPokemonsHTML();
}

function loadPokemonPartiesListeners() {
    document.getElementById('edit-pokemon').addEventListener('click', goToEditPokemonPage);
    document.getElementById('check-summary').addEventListener('click', () => openSummary(CURRENT_PARTY_INDEX));
    document.getElementById('release-pokemon').addEventListener('click', releasePokemon);
    document.getElementById('never-mind').addEventListener('click', closeContextMenu);

    for (const partyBox of PARTY_BOXES) {
        partyBox.addEventListener("click", () => {
            loadCurrentPokemon(partyBox);
            selectItem(CURRENT_PARTY_INDEX, PARTY_BOXES);
            if (isPartyMemberEmpty()) goToEditPokemonPage()
            else openContextMenu(PARTY_BOXES[CURRENT_PARTY_INDEX]);
        });
    }

    for (const moveBox of getPartyMovesSearchBar()) {
        const input = moveBox.content.querySelector('input');
        input.addEventListener('focus', () => {
            if (Object.keys(CURRENT_POKEMON).length === 0) {
                input.placeholder = "Select a Pokémon first";
                input.blur();
                return;
            }
        });
    }
}

function loadCurrentPokemon(partyBox) {
    CURRENT_PARTY_INDEX = parseInt(partyBox.getAttribute("party-number")) - 1;
    CURRENT_POKEMON = PARTY[CURRENT_PARTY_INDEX]?.pokemon || {};
    CURRENT_MOVES = PARTY[CURRENT_PARTY_INDEX]?.moves || [];
}

export async function loadPartyPokemonsHTML() {
    for (let i = 0; i < 6; i++) {
        const partyMember = PARTY_BOXES[i];
        const partyText = partyMember.querySelector('.party-text');
        const partyPill = partyText.querySelector('.party-pill');
        const partyName = partyText.querySelector('.party-name');
        const partyImg = partyMember.querySelector('.party-img');

        const isEmpty = isPartyMemberEmpty(i);

        partyText.style.display = isEmpty ? 'none' : '';
        partyImg.style.display = isEmpty ? 'none' : '';

        partyName.textContent = isEmpty ? '' : getObjectName(PARTY[i].pokemon);

        // for (const rating in RATINGS) {
        //     partyPill.classList.remove(rating);
        // }

        partyPill.style.display = 'none';

        // To-Do: add rating here
        if (Object.keys(PARTY[i].pokemon).length === 0) {
            continue;
        }

        const pokemonData = await getPokemonData(PARTY[i].pokemon);
        partyImg.querySelector('img').src = isEmpty ? '' : getPokemonSpriteSrc(pokemonData)
    }
}

export function returnToPokemonSearch() {
    closeContextMenu();
    clearParty();
    CURRENT_PARTY_INDEX = -1;
    goToMainPage('pokemon-search-container');
}

// Getters
export function getPartySearchBar() {
    return {
        content: document.getElementById('party-pokemon-content'),
        options: getPokemonOptions,
        option: getPokemonOption,
        action: searchBarPokemonAction
    }
}


export function getPartyMovesSearchBar() {
    return [
        getSearchPartyMove(1),
        getSearchPartyMove(2),
        getSearchPartyMove(3),
        getSearchPartyMove(4)
    ];
}

function getSearchPartyMove(j) {
    return {
        content: document.getElementById(`party-move-${j}-content`),
        options: getMoveOptions,
        option: getMoveOption,
        action: searchBarMoveAction
    }
}

function initParty() {
    for (let i = 1; i <= 6; i++) {
        PARTY.push({
            pokemon: {},
            moves: CURRENT_MOVES
        });
    }
}

function searchBarPokemonAction(input, pokemon) {
    CURRENT_POKEMON = pokemon || {};
    input.value = getObjectName(CURRENT_POKEMON);

    if (Object.keys(CURRENT_POKEMON).length === 0) {
        return
    }

    for (const moveBox of getPartyMovesSearchBar()) {
        const input = moveBox.content.querySelector('input');
        input.placeholder = "-";
    }

    // Pre-cache data
    getPokemonData(CURRENT_POKEMON);
}

function searchBarMoveAction(input, move) {
    const j = input.getAttribute('data-move');
    CURRENT_MOVES[j - 1] = move.move;
    input.value = getObjectName(CURRENT_MOVES[j - 1]);

    // Pre-cache data
    getPokemonMoveData(CURRENT_MOVES[j - 1]);
}

export function clearParty() {
    CURRENT_POKEMON = {};
    CURRENT_MOVES = [];
    deletePartyInputs();
}

async function releasePokemon() {
    if (!confirm("Do you really want to release this Pokémon?")) {
        return;
    }
    setParty(CURRENT_PARTY_INDEX);
    await loadPartyPokemonsHTML();
    backToMain();
}


// Validators
