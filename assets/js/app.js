import { loadPokemonParty } from "./pages/party.js";
import { loadSummaryListeners } from "./pages/summary.js";
import { getJson } from "./support/data.js";
import { loadLavaBackground } from "./support/lava-background.js";
import { loadGamepadListeners } from "./ui/navigation/gamepad.js";
import { loadNavigation } from "./ui/navigation/keyboard-mouse.js";
import { loadSearchBars, resetSearchBars } from "./ui/search-bar.js";

export var POKEMONS;
export var MOVES;
export const TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

export var SINGLE_TYPES;
export var MULTI_TYPES;

export var ACTIVE_PAGE = 'main';

document.addEventListener("DOMContentLoaded", async function () {
  const success = await loadExternalData();
  if (!success) return;

  resetSearchBars();
  loadLavaBackground();
  loadNavigation();
  loadSearchBars();
  loadGamepadListeners();
  loadPokemonParty();
  loadSummaryListeners()
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

export function setActivePage(value) {
  ACTIVE_PAGE = value;
}