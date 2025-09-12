import { goToPageWithId } from "../ui/navigation.js";
import { getMoveOption, getMoveOptions, getPokemonOption, getPokemonOptions } from "../ui/search-bar.js";

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
}

function loadPokemonPartiesListeners() {
    document.getElementById('cancel-edit-pokemon').addEventListener('click', returnToPokemonSearch);
    document.getElementById('save-edit-pokemon').addEventListener('click', saveParty);

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

function loadPartyPokemonSearch(pokemon, input) {
    CURRENT_POKEMON = pokemon;
    input.value = CURRENT_POKEMON.title;
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

    for (const input of document.getElementById('edit-party-container').querySelectorAll('input')) {
        input.value = '';
    }
}

function returnToPokemonSearch() {
    clearParty();
    goToPageWithId('pokemon-search-container');
}

function saveParty() {
    const i = CURRENT_PARTY - 1;
    PARTY[i] = {
        pokemon: CURRENT_POKEMON,
        moves: CURRENT_MOVES
    }
    localStorage.setItem('party', JSON.stringify(PARTY));
    returnToPokemonSearch();
}