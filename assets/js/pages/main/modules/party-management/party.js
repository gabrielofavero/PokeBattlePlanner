import { selectItem } from "../../../../support/navigation/navigation.js";
import { openSummary } from "../../../summary/summary.js";
import { goToMainPage } from "../../main.js";
import { closeContextMenu, openContextMenu } from "../../support/context-menu.js";
import { getMoveOption, getMoveOptions, getPokemonOption, getPokemonOptions } from "../../support/search-bar.js";
import { RATINGS, getPokemonSpriteSrc } from "../calculators/pokemon.js";
import { backToMain, deletePartyInputs, goToEditPokemonPage } from "./edit-party-pokemon.js";

export var PARTY = [];
export var CURRENT_PARTY_INDEX = -1;
export var CURRENT_POKEMON = {};
export var CURRENT_MOVES = [];

const PARTY_BOXES = document.getElementsByClassName('party-pokemon');

// Loaders
export function loadPokemonParty() {
    initParty();
    const data = localStorage.getItem('party');
    if (data) {
        PARTY = JSON.parse(data);
    }
    loadPokemonPartiesListeners();
    loadPartyPokemonsHTML();
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
            if (isPartyEmpty()) editPokemon()
            else openContextMenu(PARTY_BOXES[CURRENT_PARTY_INDEX]);
        });
    }
}

function loadCurrentPokemon(partyBox) {
    CURRENT_PARTY_INDEX = parseInt(partyBox.getAttribute("party-number")) - 1;
    CURRENT_POKEMON = PARTY[CURRENT_PARTY_INDEX]?.pokemon || {};
    CURRENT_MOVES = PARTY[CURRENT_PARTY_INDEX]?.moves || [];
}

export function loadPartyPokemonsHTML() {
    for (let i = 0; i < 6; i++) {
        const partyMember = PARTY_BOXES[i];
        const partyText = partyMember.querySelector('.party-text');
        const partyPill = partyText.querySelector('.party-pill');
        const partyName = partyText.querySelector('.party-name');
        const partyImg = partyMember.querySelector('.party-img');

        const isEmpty = isPartyEmpty(i);

        partyText.style.display = isEmpty ? 'none' : '';
        partyImg.style.display = isEmpty ? 'none' : '';

        partyName.textContent = isEmpty ? '' : PARTY[i].pokemon.title;

        for (const rating in RATINGS) {
            partyPill.classList.remove(rating);
        }

        partyPill.style.display = 'none';

        // To-Do: add rating here

        partyImg.querySelector('img').src = isEmpty ? '' : getPokemonSpriteSrc(PARTY[i].pokemon)
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

// Setters
export function setParty(index, pokemon={}, moves=[]) {
    PARTY[index] = { pokemon, moves };
    localStorage.setItem('party', JSON.stringify(PARTY));
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
    CURRENT_POKEMON = pokemon;
    input.value = CURRENT_POKEMON.title;
}

function searchBarMoveAction(input, move) {
    const j = input.getAttribute('data-move');
    CURRENT_MOVES[j - 1] = move;
    input.value = CURRENT_MOVES[j - 1].name;
}

export function clearParty() {
    CURRENT_POKEMON = {};
    CURRENT_MOVES = [];
    deletePartyInputs();
}

function releasePokemon() {
    if (!confirm("Do you really want to release this Pokémon?")) {
        return;
    }
    setParty(CURRENT_PARTY_INDEX);
    loadPartyPokemonsHTML();
    backToMain();
}


// Validators
export function isPartyEmpty(i = CURRENT_PARTY_INDEX) {
    const party = PARTY[i];
    return (!party || (party.moves.length == 0 && Object.keys(party.pokemon).length == 0));
}