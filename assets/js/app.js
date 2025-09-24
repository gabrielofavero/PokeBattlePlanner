import { loadMainPage } from "./pages/main/main.js";
import { loadSummaryPage } from "./pages/summary/summary.js";
import { getJson, loadExternalData } from "./support/data.js";
import { loadNavigation } from "./support/navigation/navigation.js";

export var MOVES;
export const TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

export var SINGLE_TYPES;
export var MULTI_TYPES;

document.addEventListener("DOMContentLoaded", async function () {
  await loadInternalData();
  await loadExternalData();

  loadMainPage();
  loadSummaryPage();
  loadNavigation();
});

async function loadInternalData() {
  try {
    const [moves, single, multi] = await Promise.all([
      getJson('./assets/data/moves.json'),
      getJson('./assets/data/charts/single-types.json'),
      getJson('./assets/data/charts/multi-types.json')
    ]);
    MOVES = moves;
    SINGLE_TYPES = single;
    MULTI_TYPES = multi;
  } catch (err) {
    console.error("Error loading JSON files:", err);
  }
}