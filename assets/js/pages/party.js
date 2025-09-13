import { goToPageWithId } from "../ui/navigation.js";
import { getMoveOption, getMoveOptions, getPokemonOption, getPokemonOptions } from "../ui/search-bar.js";
import { RATINGS, getPokemonSpriteSrc } from "./pokemon.js";

var PARTY = [];
var CURRENT_PARTY = 0;
var CURRENT_POKEMON = {};
export var CURRENT_MOVES = [];
const PARTY_BOXES = document.getElementsByClassName('party-pokemon');

export const SEARCH_PARTY_POKEMON = {
    content: document.getElementById('party-pokemon-content'),
    options: getPokemonOptions,
    option: getPokemonOption,
    action: loadPartyPokemonSearch
}


// Loaders
export function loadPokemonParty() {
    const data = localStorage.getItem('party');
    if (data) {
        PARTY = JSON.parse(data);
    }
    loadPokemonPartiesListeners();
    loadPartyPokemonsHTML();
}

function loadPokemonPartiesListeners() {
    document.getElementById('edit-pokemon').addEventListener('click', editPokemon);
    document.getElementById('check-summary').addEventListener('click', checkSummary);
    document.getElementById('release-pokemon').addEventListener('click', () => savePokemon(true));
    document.getElementById('never-mind').addEventListener('click', closeContextMenu);

    document.getElementById('cancel-edit-pokemon').addEventListener('click', returnToPokemonSearch);
    document.getElementById('save-edit-pokemon').addEventListener('click', savePokemon);
    document.getElementById('delete-edit-pokemon').addEventListener('click', deletePartyInputs);


    for (const partyBox of PARTY_BOXES) {
        partyBox.addEventListener("click", () => {
            CURRENT_PARTY = parseInt(partyBox.getAttribute("party-number"));
            if (isPartyEmpty()) editPokemon()
            else openContextMenu();
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

// Getters
export function getSearchPartyMoves() {
    return [
        getSearchPartyMove(1),
        getSearchPartyMove(2),
        getSearchPartyMove(3),
        getSearchPartyMove(4)
    ];
}

// Setters

// Validators

function isPartyEmpty(i = CURRENT_PARTY - 1) {
    const party = PARTY[i];
    return (!party || (party.moves.length == 0 && Object.keys(party.pokemon) == 0));
}

function loadPartyData() {
    if (isPartyEmpty()) {
        clearParty();
        return;
    }
    const i = CURRENT_PARTY - 1;
    const pokemonContent = document.getElementById('party-pokemon-content');
    pokemonContent.querySelector('input').value = PARTY[i]?.pokemon?.title || '';
    for (let j = 1; j <= 4; j++) {
        const moveContent = document.getElementById(`party-move-${j}-content`);
        const move = PARTY[i]?.moves[j - 1];
        moveContent.querySelector('input').value = move?.name || '';
    }
}

function loadPartyPokemonSearch(pokemon, input) {
    CURRENT_POKEMON = pokemon;
    input.value = CURRENT_POKEMON.title;
}

function loadPartyMoveSearch(move, input) {
    const j = input.getAttribute('data-move');
    CURRENT_MOVES[j - 1] = move;
    input.value = CURRENT_MOVES[j - 1].name;
}

function getSearchPartyMove(j) {
    return {
        content: document.getElementById(`party-move-${j}-content`),
        options: getMoveOptions,
        option: getMoveOption,
        action: loadPartyMoveSearch
    }
}

function clearParty() {
    CURRENT_POKEMON = {};
    CURRENT_MOVES = [];
    deletePartyInputs();
}

function returnToPokemonSearch() {
    closeContextMenu();
    clearParty();
    CURRENT_PARTY = 0;
    goToPageWithId('pokemon-search-container');
}

function savePokemon(deletion = false) {
    const i = CURRENT_PARTY - 1;
    const isEmpty = deletion || (!CURRENT_POKEMON && CURRENT_MOVES.length == 0);

    if (isEmpty) {
        if (!confirm("Do you really want to release this Pokémon?")) {
            return;
        }
    }

    PARTY[i] = {
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

// Context Menu
function loadContextMenu(display) {
    const partyBox = document.getElementById('party-box');
    const contextMenu = partyBox.querySelector('.context-menu');
    contextMenu.style.display = display;
}

function editPokemon() {
    loadPartyData();
    goToPageWithId('edit-party-container');
    closeContextMenu();
}

function openContextMenu() {
    PARTY_BOXES[CURRENT_PARTY - 1].classList.add('selected');
    loadContextMenu('');
}

function closeContextMenu() {
    if (!PARTY_BOXES[CURRENT_PARTY - 1]) {
        return;
    }

    PARTY_BOXES[CURRENT_PARTY - 1].classList.remove('selected');
    loadContextMenu('none');
}

function checkSummary() {

}

