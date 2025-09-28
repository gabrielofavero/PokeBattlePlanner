import { getObjectName, setDB } from "../../support/data/data.js";
import { isPartyEmpty } from "../../support/data/pokemon.js";
import { hideBack, hideY, showBack, showConfirm, showY } from "../../support/navigation/navigation.js";
import { goToMainPage } from "../main/main.js";
import { CURRENT_MOVES, CURRENT_PARTY_INDEX, CURRENT_POKEMON, PARTY, clearParty, loadPartyPokemonsHTML, returnToPokemonSearch } from "../main/modules/party-management/party.js";
import { closeContextMenu } from "../main/support/context-menu.js";

export var IS_EDITING_POKEMON = false;

export function goToEditPokemonPage() {
    IS_EDITING_POKEMON = true;
    showConfirm();
    showBack();
    showY();

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
    const partyPokemon = PARTY[CURRENT_PARTY_INDEX];
    pokemonContent.querySelector('input').value = getObjectName(partyPokemon.pokemon);
    for (let j = 1; j <= 4; j++) {
        const moveContent = document.getElementById(`party-move-${j}-content`);
        const move = getObjectName(partyPokemon.moves[j - 1]);
        moveContent.querySelector('input').value = getObjectName(move) || '';
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
    hideY()
}

export async function setParty(index, pokemon = {}, moves = []) {
    PARTY[index] = { pokemon, moves };
    await setDB('party', PARTY);
}