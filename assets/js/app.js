import { loadLavaBackground } from "./support/lava-background.js";

var POKEMONS;
var MOVES;

document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById('search').value = '';
    POKEMONS = await getJson('./assets/data/pokemons.json');
    MOVES = await getJson('./assets/data/moves.json');
    loadLavaBackground();
    loadTopBar();
    loadEventListeners();
});

function loadEventListeners() {
    document.getElementById('search').addEventListener('input', searchPokemon );

}

function loadTopBar() {
    const items = document.querySelectorAll(".top-bar-item");
    items.forEach(item => {
      item.addEventListener("click", () => {
        items.forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");
        
        items.forEach(i => {
          const sectionId = i.getAttribute("to-show");
          const section = document.getElementById(sectionId);
          if (section) section.style.display = "none";
        });
        
        const targetId = item.getAttribute("to-show");
        const target = document.getElementById(targetId);
        if (target) target.style.display = "flex";
      });
    });
}


function searchPokemon() {
    const search = document.getElementById('search');
    const suggestions = document.getElementById('search-suggestions');

    const value = search.value.trim().toLowerCase();
        suggestions.innerHTML = "";

        if (value.length >= 2) {
            // Filter by title OR subtitle
            const filtered = POKEMONS.filter(opt => {
                return opt.title.toLowerCase().includes(value) || opt.subtitle.toLowerCase().includes(value);
            });

            // Sort exact matches first
            filtered.sort((a, b) => {
                const aTitle = a.title.toLowerCase();
                const bTitle = b.title.toLowerCase();

                if (aTitle === value) return -1;
                if (bTitle === value) return 1;

                // optionally prioritize subtitle match
                const aSub = a.subtitle.toLowerCase();
                const bSub = b.subtitle.toLowerCase();
                if (aSub === value) return -1;
                if (bSub === value) return 1;

                return 0;
            });

            if (filtered.length > 0) {
                filtered.forEach(opt => {
                    const item = document.createElement('div');
                    const titleBox = `<div class="flex-column"><span>${opt.title}</span><span class="pokemon-variant">${opt.subtitle}</span></div>`;
                    item.className = 'search-suggestion-item';
                    item.innerHTML = `<img class="${!opt.subtitle ? 'pokemon-small' : ''}" src="./assets/img/pokemons/${opt.hrefIcon}.png" alt=""> ${titleBox}`;

                    item.onclick = () => {
                        search.value = opt.title;
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

}


export async function getJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}