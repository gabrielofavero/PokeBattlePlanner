import { loadMainPage } from "./pages/main/main.js";
import { loadSummaryPage } from "./pages/summary/summary.js";
import { loadExternalData } from "./support/data.js";
import { loadNavigation } from "./support/navigation/navigation.js";

document.addEventListener("DOMContentLoaded", async function () {
  await loadExternalData();

  loadMainPage();
  loadSummaryPage();
  loadNavigation();
});