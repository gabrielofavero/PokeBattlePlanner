import { loadLavaBackground } from "./support/lava-background.js";

var POKEMONS;
var MOVES;

document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById('search').value = '';
    POKEMONS = await getJson('./assets/data/pokemons.json');
    MOVES = await getJson('./assets/data/moves.json');
    loadLavaBackground();
    loadEventListeners();
});

function loadEventListeners() {
    const search = document.getElementById('search');
    const suggestions = document.getElementById('search-suggestions');

    search.addEventListener('input', () => {
        const value = search.value.trim().toLowerCase();

        if (value.length >= 2) {
            const filtered = POKEMONS.filter(opt =>
                opt.name.toLowerCase().includes(value)
            ).slice(0, 3);

            suggestions.innerHTML = "";

            if (filtered.length > 0) {
                filtered.forEach(opt => {
                    const item = document.createElement('div');
                    item.className = 'search-suggestion-item';
                    item.innerHTML = `<img class="pokemon-small" src="./assets/img/pokemons/${opt.hrefId}.png" alt=""><span>${opt.name}</span>`;
                    item.onclick = () => {
                        search.value = opt.name;
                        suggestions.style.display = 'none';
                    };
                    suggestions.appendChild(item);
                });
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        } else {
            suggestions.style.display = 'none';
        }
    });
}




export async function getJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}