import { loadMainPage } from "./pages/main/main.js";
import { loadDeviceResponsiviness } from "./pages/main/support/devices.js";
import { loadSummaryPage } from "./pages/summary/summary.js";
import { loadExternalData } from "./support/data/data.js";
import { loadNavigation } from "./support/navigation/navigation.js";

document.addEventListener("DOMContentLoaded", async function () {
  await loadExternalData();

  loadMainPage();
  loadSummaryPage();
  loadNavigation();
  loadDeviceResponsiviness();

  hideErrorLogs('pixi.min.js');
  hideWarnLogs('pixi.min.js');
});

function hideErrorLogs(file) {
  window.addEventListener('error', function (event) {
    if (event.filename && event.filename.includes(file)) {
      event.preventDefault();
      return true;
    }
  });
}

function hideWarnLogs(file) {
  const originalWarn = console.warn;
  console.warn = function (...args) {
    const stack = new Error().stack;
    if (stack && stack.includes(file)) return;
    originalWarn.apply(console, args);
  };
}