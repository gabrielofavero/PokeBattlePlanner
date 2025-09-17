import { setActivePage } from "../../../app.js";
import { selectItem } from "../../../ui/navigation/navigation.js";
import { getMoveOption, getMoveOptions, getPokemonOption, getPokemonOptions } from "./search-bar.js";
import { RATINGS, getPokemonSpriteSrc } from "../pages/pokemon.js";
import { openSummary } from "../../summary/summary.js";
import { goToMainPage, openContextMenu, closeContextMenu } from "../main.js";

export var PARTY = [];
var CURRENT_PARTY_INDEX = -1;
var CURRENT_POKEMON = {};
export var CURRENT_MOVES = [];

const PARTY_BOXES = document.getElementsByClassName('party-pokemon');
const CONTEXT_MENU = document.getElementById('party-box').querySelector('.context-menu');

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
    document.getElementById('release-pokemon').addEventListener('click', () => savePokemon(true));
    document.getElementById('never-mind').addEventListener('click', () => closeContextMenu(CONTEXT_MENU, PARTY_BOXES[CURRENT_PARTY_INDEX]));

    document.getElementById('cancel-edit-pokemon').addEventListener('click', returnToPokemonSearch);
    document.getElementById('save-edit-pokemon').addEventListener('click', () => savePokemon(false));
    document.getElementById('delete-edit-pokemon').addEventListener('click', deletePartyInputs);


    for (const partyBox of PARTY_BOXES) {
        partyBox.addEventListener("click", () => {
            CURRENT_PARTY_INDEX = parseInt(partyBox.getAttribute("party-number")) - 1;
            selectItem(CURRENT_PARTY_INDEX, PARTY_BOXES);
            if (isPartyEmpty()) editPokemon()
            else openContextMenu(CONTEXT_MENU, PARTY_BOXES[CURRENT_PARTY_INDEX]);
        });
    }
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

function returnToPokemonSearch() {
    closeContextMenu(CONTEXT_MENU, PARTY_BOXES[CURRENT_PARTY_INDEX]);
    clearParty();
    CURRENT_PARTY_INDEX = -1;
    goToMainPage('pokemon-search-container');
}

function editPokemon() {
    setActivePage('edit-pokemon');
    loadPartyData();
    goToMainPage('edit-party-container');
    closeContextMenu(CONTEXT_MENU, PARTY_BOXES[CURRENT_PARTY_INDEX]);
}


// Getters
export function getSearchPartyPokemon() {
    return {
        content: document.getElementById('party-pokemon-content'),
        options: getPokemonOptions,
        option: getPokemonOption,
        action: searchBarPokemonAction
    }
}


export function getSearchPartyMoves() {
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

function savePokemon(toDelete = false) {
    const isEmpty = toDelete || (Object.keys(CURRENT_POKEMON).length == 0 && CURRENT_MOVES.length == 0);

    if (isEmpty) {
        if (!confirm("Do you really want to release this Pokémon?")) {
            return;
        }
    }

    PARTY[CURRENT_PARTY_INDEX] = {
        pokemon: isEmpty ? {} : CURRENT_POKEMON,
        moves: isEmpty ? [] : CURRENT_MOVES
    }

    localStorage.setItem('party', JSON.stringify(PARTY));

    loadPartyPokemonsHTML();
    returnToPokemonSearch();
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