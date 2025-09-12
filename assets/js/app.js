import { loadLavaBackground } from "./support/lava-background.js";
import { loadPokemonPartiesListeners } from "./pages/party.js";
import { loadGamepadListeners } from "./ui/gamepad.js";
import { loadSearchBars, resetSearchBars } from "./ui/search-bar.js";
import { loadTopBar } from "./ui/navigation.js";

export var POKEMONS;
export var MOVES;
export const TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

export var SINGLE_TYPES;
export var MULTI_TYPES;

document.addEventListener("DOMContentLoaded", async function () {
    const success = await loadExternalData();
    if (!success) return;

    resetSearchBars();
    loadLavaBackground();
    loadTopBar();
    loadSearchBars();
    loadGamepadListeners();
    loadPokemonPartiesListeners();
});

async function loadExternalData() {
    try {
      const [pokemons, moves, single, multi] = await Promise.all([
        getJson('./assets/data/pokemons.json'),
        getJson('./assets/data/moves.json'),
        getJson('./assets/data/charts/single-types.json'),
        getJson('./assets/data/charts/multi-types.json')
      ]);
  
      POKEMONS = pokemons;
      MOVES = moves;
      SINGLE_TYPES = single;
      MULTI_TYPES = multi;
  
      return true;
    } catch (err) {
      console.error("Error loading JSON files:", err);
      return false;
    }
  }

export async function getJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}