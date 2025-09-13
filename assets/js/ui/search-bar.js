import { MOVES, POKEMONS, TYPES } from "../app.js";
import { SEARCH_MULTI_TYPE_1, SEARCH_MULTI_TYPE_2 } from "../pages/multi-types.js";
import { CURRENT_MOVES, getSearchPartyMoves } from "../pages/party.js";
import { SEARCH_POKEMON, getPokemonSpriteAlt, getPokemonSpriteSrc } from "../pages/pokemon.js";
import { SEARCH_SINGLE_TYPE } from "../pages/single-type.js";
import { firstCharToUppercase } from "../support/data.js";
import { loadTypeContentBanners } from "./banners.js";

const SINGLE_SEARCH_BARS = [SEARCH_POKEMON, SEARCH_SINGLE_TYPE, ...getSearchPartyMoves()];
const MULTI_SEARCH_BARS = [[SEARCH_MULTI_TYPE_1, SEARCH_MULTI_TYPE_2]]

// Loaders
export function loadSearchBars() {
    for (const searchBar of SINGLE_SEARCH_BARS) {
        getInput(searchBar).addEventListener('input', () => loadSearchBar(searchBar));
    }

    for (const multiBar of MULTI_SEARCH_BARS) {
        for (let j = 1; j <= multiBar.length; j++) {
            const searchBar = multiBar[j - 1];
            getInput(searchBar, j-1).addEventListener('input', () => loadSearchBar(searchBar, j));
        }
    }
}

function loadSearchBar(search, j = 1) {
    const searchBox = search.content.getElementsByClassName("button-box")[j - 1];
    const input = searchBox.querySelector('input');
    const suggestions = search.content.getElementsByClassName("search-suggestions")[j - 1];
    const results = search.content.querySelector('.search-result');

    if (results) {
        results.classList.add('hidden');
    }

    const value = input.value.trim().toLowerCase();
    suggestions.innerHTML = "";
    clearSearchBox(searchBox);

    if (value.length >= 2) {
        const options = search.options(value);
        if (options.length > 0) {
            options.forEach(option => {
                const div = search.option(option);
                div.onclick = () => {
                    search.action(option, input);
                    suggestions.style.display = 'none';
                };
                suggestions.appendChild(div);
            });
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    } else {
        suggestions.style.display = 'none';
    }

    // Hide when clicking outside
    document.addEventListener("click", function hideOnClickOutside(e) {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
            document.removeEventListener("click", hideOnClickOutside); // cleanup
        }
    });
}

// Getters
function getInput(searchBar, index = 0) {
    return searchBar.content.querySelectorAll('input')[index]
}

export function getPokemonOptions(value) {
    const options = POKEMONS.filter(opt => {
        return opt.title.toLowerCase().includes(value) || opt.subtitle.toLowerCase().includes(value);
    });

    options.sort((a, b) => {
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
    return options;
}

export function getPokemonOption(pokemon) {
    const item = document.createElement('div');
    const titleBox = `<div class="flex-column"><span>${pokemon.title}</span><span class="pokemon-variant">${pokemon.subtitle}</span></div>`;
    item.className = 'search-suggestion-item pokemon';
    item.innerHTML = `<img src="${getPokemonSpriteSrc(pokemon)}" alt="${getPokemonSpriteAlt(pokemon)}"> ${titleBox}`;
    return item;
}

export function getTypeOptions(value) {
    const options = TYPES.filter(type =>
        type.toLowerCase().includes(value.toLowerCase())
    );

    options.sort((a, b) => a.localeCompare(b));
    return options;
}

export function getFilteredTypeOptions(value, exclude) {
    return getTypeOptions(value).filter(type =>
        type.toLowerCase() !== (exclude?.toLowerCase() ?? "")
    );
}

export function getTypeOption(type) {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item type';
    item.innerHTML = `<svg class="icon ${type}"><use href="#type-${type}-icon" /></svg> ${firstCharToUppercase(type)}`;
    return item;
}

export function getMoveOptions(value) {
    const exclude = CURRENT_MOVES.map(move => move?.name).filter(Boolean);

    const options = MOVES.filter(move => {
        return (
            move.name.toLowerCase().includes(value.toLowerCase()) &&
            !exclude.map(e => e.toLowerCase()).includes(move.name.toLowerCase())
        );
    });

    options.sort((a, b) => a.name.localeCompare(b.name));
    return options;
}

export function getMoveOption(move) {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item type';
    item.innerHTML = `<svg class="icon ${move.type}"><use href="#type-${move.type}-icon" /></svg> ${move.name}`;
    return item;
}

// Setters
export function resetSearchBars() {
    for (const searchBar of SINGLE_SEARCH_BARS) {
        getInput(searchBar).value = '';
    }

    for (const multiBar of MULTI_SEARCH_BARS) {
        for (let i = 0; i < multiBar.length; i++) {
            getInput(multiBar[i], i).value = '';
        }
    }
}

export function clearSearchBox(searchBox) {
    const icon = searchBox.querySelector('.icon');
    const img = searchBox.querySelector('img');
    const input = searchBox.querySelector('input');

    if (icon) {
        icon.setAttribute('class', 'icon');
        icon.innerHTML = `<use href="#search-icon"/>`;
    }

    input.classList = 'clear-input'

    searchBox.classList.remove('pokemon')
    searchBox.classList.remove('type')
    for (const type of TYPES) {
        searchBox.classList.remove(type);
    }

    if (img) {
        img.style.display = 'none'
        img.src = '';
        img.alt = '';

        if (icon) {
            icon.style.display = '';
        }

        searchBox.querySelector('.pokemon-variant').style.display = 'none';
        searchBox.querySelector('.result-types').style.display = 'none';
    }
}

export function addPokemonToSearchBox(searchBox, pokemon) {
    const icon = searchBox.querySelector('.icon');
    const img = searchBox.querySelector('img');

    const subtitle = searchBox.querySelector('.pokemon-variant');
    const types = searchBox.querySelector('.result-types');

    icon.style.display = 'none';

    img.src = getPokemonSpriteSrc(pokemon);
    img.alt = getPokemonSpriteAlt(pokemon);
    img.style.display = ''

    searchBox.classList = `button-box pokemon`;

    subtitle.textContent = pokemon.subtitle;
    subtitle.style.display = '';

    loadTypeContentBanners(types, pokemon.types);
    types.style.display = '';
}

export function addTypeToSearchBox(searchBox, type) {
    const icon = searchBox.querySelector('.icon');
    const input = searchBox.querySelector('input');
    input.value = type;
    input.classList.add('title');
    icon.setAttribute('class', `icon type ${type}`);
    icon.innerHTML = `<use href="#type-${type}-icon"/>`;
    searchBox.classList = `button-box type ${type}`;
}