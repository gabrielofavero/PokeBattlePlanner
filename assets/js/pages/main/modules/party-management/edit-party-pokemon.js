import { hideBack, showBack, showConfirm } from "../../../../support/navigation/navigation.js";
import { goToMainPage } from "../../main.js";
import { closeContextMenu } from "../../support/context-menu.js";
import { CURRENT_MOVES, CURRENT_PARTY_INDEX, CURRENT_POKEMON, PARTY, clearParty, isPartyEmpty, loadPartyPokemonsHTML, returnToPokemonSearch, setParty } from "./party.js";

export var IS_EDITING_POKEMON = false;


export function loadEditPokemonListeners() {
    document.getElementById('delete-edit-pokemon').addEventListener('click', deletePartyInputs);
}

export function goToEditPokemonPage() {
    IS_EDITING_POKEMON = true;
    showConfirm();
    showBack();

    loadPartyData();
    goToMainPage('edit-party-container');
    closeContextMenu();
}

export function deletePartyInputs() {
    for (const input of document.getElementById('edit-party-container').querySelectorAll('input')) {
        input.value = '';
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
        moveContent.querySelector('input').value = getName(move) || '';
    }
}

export async function savePokemon() {
    setParty(CURRENT_PARTY_INDEX, CURRENT_POKEMON, CURRENT_MOVES);
    await loadPartyPokemonsHTML();
    backToMain();
}

export function backToMain() {
    IS_EDITING_POKEMON = false;
    returnToPokemonSearch();
    showConfirm();
    hideBack();
}