import { selectItem, showBack, showConfirm } from "../../../ui/navigation/navigation.js";
import { PAGES, setActivePage } from "../../../ui/navigation/pages.js";
import { openSummary } from "../../summary/summary.js";
import { closeContextMenu, goToMainPage, openContextMenu } from "../main.js";
import { RATINGS, getPokemonSpriteSrc } from "../pages/pokemon.js";
import { getMoveOption, getMoveOptions, getPokemonOption, getPokemonOptions } from "./search-bar.js";

export var PARTY = [];
var CURRENT_PARTY_INDEX = -1;
var CURRENT_POKEMON = {};
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
    document.getElementById('edit-pokemon').addEventListener('click', editPokemon);
    document.getElementById('check-summary').addEventListener('click', () => openSummary(CURRENT_PARTY_INDEX));
    document.getElementById('release-pokemon').addEventListener('click', releasePokemon);
    document.getElementById('never-mind').addEventListener('click', closeContextMenu);

    document.getElementById('delete-edit-pokemon').addEventListener('click', deletePartyInputs);

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

function loadPartyPokemonsHTML() {
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

function loadPartyData() {
    if (isPartyEmpty()) {
        clearParty();
        return;
    }
    const pokemonContent = document.getElementById('party-pokemon-content');
    pokemonContent.querySelector('input').value = PARTY[CURRENT_PARTY_INDEX]?.pokemon?.title || '';
    for (let j = 1; j <= 4; j++) {
        const moveContent = document.getElementById(`party-move-${j}-content`);
        const move = PARTY[CURRENT_PARTY_INDEX]?.moves[j - 1];
        moveContent.querySelector('input').value = move?.name || '';
    }
}

export function returnToPokemonSearch() {
    closeContextMenu();
    clearParty();
    CURRENT_PARTY_INDEX = -1;
    goToMainPage('pokemon-search-container');
}

function editPokemon() {
    setActivePage(PAGES.EDIT_POKEMON);
    showConfirm();
    showBack();

    loadPartyData();
    goToMainPage('edit-party-container');
    closeContextMenu();
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

function clearParty() {
    CURRENT_POKEMON = {};
    CURRENT_MOVES = [];
    deletePartyInputs();
}

function backToMain() {
    localStorage.setItem('party', JSON.stringify(PARTY));
    loadPartyPokemonsHTML();
    returnToPokemonSearch();
}

function releasePokemon() {
    if (!confirm("Do you really want to release this Pokémon?")) {
        return;
    }
    PARTY[CURRENT_PARTY_INDEX] = {
        pokemon: {},
        moves: []
    }
    backToMain();
}

export function savePokemon() {
    PARTY[CURRENT_PARTY_INDEX] = {
        pokemon: CURRENT_POKEMON,
        moves: CURRENT_MOVES
    }
    backToMain();
}

function deletePartyInputs() {
    for (const input of document.getElementById('edit-party-container').querySelectorAll('input')) {
        input.value = '';
    }
}


// Validators
function isPartyEmpty(i = CURRENT_PARTY_INDEX) {
    const party = PARTY[i];
    return (!party || (party.moves.length == 0 && Object.keys(party.pokemon).length == 0));
}