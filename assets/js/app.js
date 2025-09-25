import { loadMainPage } from "./pages/main/main.js";
import { loadSummaryPage } from "./pages/summary/summary.js";
import { getJson, loadExternalData } from "./support/data.js";
import { loadNavigation } from "./support/navigation/navigation.js";

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
    const [multi] = await Promise.all([
      getJson('./assets/data/moves.json'),
      getJson('./assets/data/charts/multi-types.json')
    ]);
    MULTI_TYPES = multi;
  } catch (err) {
    console.error("Error loading JSON files:", err);
  }
}