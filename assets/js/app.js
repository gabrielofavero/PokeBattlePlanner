import { loadMainPage } from "./pages/main/main.js";
import { loadSummaryPage } from "./pages/summary/summary.js";
import { getJson } from "./support/data.js";
import { loadNavigation } from "./ui/navigation/navigation.js";

export var POKEMONS;
export var MOVES;
export const TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

export var SINGLE_TYPES;
export var MULTI_TYPES;

document.addEventListener("DOMContentLoaded", async function () {
  const success = await loadExternalData();
  if (!success) alert("Cannot open the app because some data files could not be loaded. Please, try again.");

  loadMainPage();
  loadSummaryPage();
  loadNavigation();
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