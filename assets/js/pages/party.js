import { goToPageWithId } from "../ui/navigation.js";
import { getMoveOption, getMoveOptions, getPokemonOption, getPokemonOptions } from "../ui/search-bar.js";
import { RATINGS, getPokemonSpriteSrc } from "./pokemon.js";

var PARTY = [];
var CURRENT_PARTY = 0;
var CURRENT_POKEMON = {};
var CURRENT_MOVES = [];

export const SEARCH_PARTY_POKEMON = {
    content: document.getElementById('party-pokemon-content'),
    options: getPokemonOptions,
    option: getPokemonOption,
    action: loadPartyPokemonSearch
}

export const SEARCH_PARTY_MOVE_1 = getSearchPartyMove(1);
export const SEARCH_PARTY_MOVE_2 = getSearchPartyMove(2);
export const SEARCH_PARTY_MOVE_3 = getSearchPartyMove(3);
export const SEARCH_PARTY_MOVE_4 = getSearchPartyMove(4);


export function loadPokemonParty() {
    const data = localStorage.getItem('party');
    if (data) {
        PARTY = JSON.parse(data);
    }
    loadPokemonPartiesListeners();
    loadPartyPokemonSearch();
}

function loadPokemonPartiesListeners() {
    document.getElementById('cancel-edit-pokemon').addEventListener('click', returnToPokemonSearch);
    document.getElementById('save-edit-pokemon').addEventListener('click', saveParty);
    document.getElementById('delete-edit-pokemon').addEventListener('click', deletePartyInputs);

    const partyPokemons = document.querySelectorAll(".party-pokemon");
    partyPokemons.forEach(partyBox => {
      partyBox.addEventListener("click", () => {
        CURRENT_PARTY = partyBox.getAttribute('party-number');
        loadPartyData();
        goToPageWithId('edit-party-container');
      });
    });
}

function loadPartyData() {
    const i = CURRENT_PARTY - 1;

    if (!PARTY[i]) {
        clearParty();
        return;
    }

    const pokemonContent = document.getElementById('party-pokemon-content');
    pokemonContent.querySelector('input').value = PARTY[i]?.pokemon?.title || '';
    for (let j = 1; j <= 4; j++) {
        const moveContent = document.getElementById(`party-move-${j}-content`);
        const move = PARTY[i]?.moves[j-1];
        moveContent.querySelector('input').value = move?.name || '';
    }
}

function loadPartyPokemonSearch() {
    const partyMembers = document.getElementsByClassName('party-pokemon');

    for (let i = 0; i < 6; i++) {
        const partyMember = partyMembers[i];
        const partyText = partyMember.querySelector('.party-text');
        const partyPill = partyText.querySelector('.party-pill');
        const partyName = partyText.querySelector('.party-name');
        const partyImg = partyMember.querySelector('.party-img');

        const isEmpty = !PARTY[i];

        partyText.style.display = isEmpty ? 'none': '';
        partyImg.style.display = isEmpty ? 'none': '';

        partyName.textContent = isEmpty ? '' : PARTY[i].pokemon.title;

        for (const rating in RATINGS) {
            partyPill.classList.remove(rating);
        }

        partyPill.style.display = 'none';

        // To-Do: add rating here

        partyImg.querySelector('img').src = isEmpty ? '' : getPokemonSpriteSrc(PARTY[i].pokemon)
    }
}

function loadPartyMoveSearch(move, input) {
    const j = input.getAttribute('data-move');
    CURRENT_MOVES[j-1] = move;
    input.value = CURRENT_MOVES[j-1].name;
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
    CURRENT_PARTY = 0;
    CURRENT_POKEMON = {};
    CURRENT_MOVES = [];
    deletePartyInputs();
}

function returnToPokemonSearch() {
    clearParty();
    goToPageWithId('pokemon-search-container');
}

function saveParty() {
    const i = CURRENT_PARTY - 1;

    if (!CURRENT_POKEMON && CURRENT_MOVES.length == 0) {
        PARTY[i] = undefined;
        return;
    }

    PARTY[i] = {
        pokemon: CURRENT_POKEMON,
        moves: CURRENT_MOVES
    }
    localStorage.setItem('party', JSON.stringify(PARTY));

    loadPartyPokemonSearch();
    returnToPokemonSearch();
}

function deletePartyInputs() {
    for (const input of document.getElementById('edit-party-container').querySelectorAll('input')) {
        input.value = '';
    }
}