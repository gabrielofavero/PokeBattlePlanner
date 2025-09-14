import { loadBlueBackground } from "../support/lava-background.js";

export function loadSummaryPage() {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('summary-page').style.display = '';
    loadBlueBackground();
}