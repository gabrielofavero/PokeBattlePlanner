import { POKEMONS } from "../app.js";

const SEARCH_POKEMON = document.getElementById('search-pokemon');

export function loadSearchBars() {
    SEARCH_POKEMON.addEventListener('input', searchPokemon);
}

export function resetSearchBars() {
    SEARCH_POKEMON.value = '';
}

function searchPokemon() {
    const suggestions = document.getElementById('search-suggestions');

    const value = SEARCH_POKEMON.value.trim().toLowerCase();
    suggestions.innerHTML = "";

    if (value.length >= 2) {
        const filtered = POKEMONS.filter(opt => {
            return opt.title.toLowerCase().includes(value) || opt.subtitle.toLowerCase().includes(value);
        });

        filtered.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();

            if (aTitle === value) return -1;
            if (bTitle === value) return 1;

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
                    SEARCH_POKEMON.value = opt.title;
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

    // ✅ Hide when clicking outside
    document.addEventListener("click", function hideOnClickOutside(e) {
        if (!SEARCH_POKEMON.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
            document.removeEventListener("click", hideOnClickOutside); // cleanup
        }
    });
}