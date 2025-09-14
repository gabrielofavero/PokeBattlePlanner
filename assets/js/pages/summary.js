import { stopPixiApp } from "../support/lava-background.js";

export function loadSummaryPage() {
    stopPixiApp();
    document.body.style.background = "linear-gradient(to top right, #015dba, #002c59)";
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('summary-page').style.display = '';
}