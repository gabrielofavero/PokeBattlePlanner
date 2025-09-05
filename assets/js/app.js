import { loadLavaBackground } from "./support/lava-background.js";
import { loadSearchBars, resetSearchBars } from "./ui/search-bar.js";
import { loadTopBar } from "./ui/top-bar.js";

export var POKEMONS;
var MOVES;

document.addEventListener("DOMContentLoaded", async function () {
    POKEMONS = await getJson('./assets/data/pokemons.json');
    MOVES = await getJson('./assets/data/moves.json');
    resetSearchBars();
    loadLavaBackground();
    loadTopBar();
    loadSearchBars();
});


export async function getJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}