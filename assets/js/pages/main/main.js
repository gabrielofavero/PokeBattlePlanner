import { loadLavaBackground } from "../../support/lava-background.js";
import { IS_EDITING_POKEMON, backToMain, savePokemon } from "./modules/party-management/edit-party-pokemon.js";
import { loadPokemonParty } from "./modules/party-management/party.js";
import { loadMainNavigationListeners } from "./support/navigation.js";
import { loadSearchBars, resetSearchBars } from "./support/search-bar.js";

const CONTENT_SUBPAGES = document.querySelectorAll('.content');

// Loaders
export function loadMainPage() {
    loadLavaBackground();
    resetSearchBars();
    loadSearchBars();
    loadPokemonParty();
    loadMainNavigationListeners();
}

export function goToMainPage(page) {
    if (typeof page === "string") {
        page = document.getElementById(page);
    }
    for (const content of CONTENT_SUBPAGES) {
        content.style.display = "none";
    }
    page.style.display = 'flex';
}

export function mainConfirmAction() {
    if (IS_EDITING_POKEMON) {
        savePokemon();
    }
}

export function mainBackAction() {
    if (IS_EDITING_POKEMON) {
        backToMain();
    }
}