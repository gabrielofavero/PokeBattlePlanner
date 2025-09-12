import { goToPageWithId } from "../ui/navigation.js";
import { getMoveOption, getMoveOptions, getPokemonOption, getPokemonOptions } from "../ui/search-bar.js";

var PARTY = [];
var CURRENT_PARTY = 0;
var CURRENT_POKEMON = {};
var CURRENT_MOVES = [];

export const SEARCH_PARTY_POKEMON = {
    content: document.getElementById('party-pokemon'),
    options: getPokemonOptions,
    option: getPokemonOption,
    action: loadPartyPokemonSearch,
    storeAction: storePartyPokemon
}

export const SEARCH_PARTY_MOVE_1 = getSearchPartyMove(1);
export const SEARCH_PARTY_MOVE_2 = getSearchPartyMove(2);
export const SEARCH_PARTY_MOVE_3 = getSearchPartyMove(3);
export const SEARCH_PARTY_MOVE_4 = getSearchPartyMove(4);

export function loadPokemonPartiesListeners() {
    document.getElementById('cancel-edit-pokemon').addEventListener('click', returnToPokemonSearch);
    document.getElementById('save-edit-pokemon').addEventListener('click', saveParty);

    const partyPokemons = document.querySelectorAll(".party-pokemon");
    partyPokemons.forEach(partyBox => {
      partyBox.addEventListener("click", () => {
        CURRENT_POKEMON = partyBox.getAttribute('party-number');
        loadPartyPage();
        goToPageWithId('edit-party-container');
      });
    });
}

function loadPartyPage() {
    const i = CURRENT_PARTY - 1;
    if (PARTY[i]) {
        const container = document.getElementById('edit-party-container');
        const buttonBox = container.getElementsByClassName('button-box large')[i];
        const inputs = buttonBox.getElementsByClassName('clear-input');
        inputs[0].value = PARTY[i]?.pokemon?.title || '';
        for (let i = 0; i < 4; i++) {
            inputs[i+1].value = PARTY[i]?.moves[i]?.name || '';
        }
    }
}

function loadPartyPokemonSearch() {

}

function storePartyPokemon() {

}

function loadPartyMoveSearch() {

}

function storePartyMove() {

}

function getSearchPartyMove(j) {
    return {
        content: document.getElementById(`party-move-${j}`),
        options: getMoveOptions,
        option: getMoveOption,
        action: () => loadPartyMoveSearch(j),
        storeAction: () => storePartyMove(j)
    }
}

function clearParty() {
    CURRENT_PARTY = 0;
    CURRENT_POKEMON = {};
    CURRENT_MOVES = [];
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
    returnToPokemonSearch();
}