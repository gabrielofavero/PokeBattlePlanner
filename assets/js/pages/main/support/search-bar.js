import { setTypeBannersWithoutLogo } from "../../../support/banners.js";
import { POKEMONS, TYPES, getMoves, getName, getPokemonData } from "../../../support/data.js";
import { SEARCH_BAR_MULTI_TYPE_1, SEARCH_BAR_MULTI_TYPE_2 } from "../modules/calculators/multi-types.js";
import { getPokemonSearchBar, getPokemonShowdownSrc, getPokemonSpriteAlt } from "../modules/calculators/pokemon.js";
import { getSingleTypeSearchBar } from "../modules/calculators/single-type.js";
import { CURRENT_MOVES, CURRENT_POKEMON, getPartyMovesSearchBar, getPartySearchBar } from "../modules/party-management/party.js";

const SINGLE_SEARCH_BARS = [getPokemonSearchBar(), getSingleTypeSearchBar(), getPartySearchBar(), ...getPartyMovesSearchBar()];
const MULTI_SEARCH_BARS = [[SEARCH_BAR_MULTI_TYPE_1, SEARCH_BAR_MULTI_TYPE_2]]

// Loaders
export function loadSearchBars() {
    for (const searchBar of SINGLE_SEARCH_BARS) {
        const input = getInput(searchBar);
        input.addEventListener('input', () => loadSuggestions(searchBar));
    }

    for (const multiBar of MULTI_SEARCH_BARS) {
        for (let j = 1; j <= multiBar.length; j++) {
            const searchBar = multiBar[j - 1];
            const input = getInput(searchBar, j - 1);
            input.addEventListener('input', () => loadSuggestions(searchBar, j));
        }
    }
}

async function loadSuggestions(searchBar, j = 1) {
    const searchBox = searchBar.content.querySelectorAll(".button-box.search-bar")[j - 1];
    const input = searchBox.querySelector('input');
    const suggestions = searchBar.content.getElementsByClassName("search-suggestions")[j - 1];
    const results = searchBar.content.querySelector('.search-result');

    if (results) {
        results.classList.add('hidden');
    }

    const value = input.value.trim().toLowerCase();
    suggestions.innerHTML = "";
    clearSearchBox(searchBox);

    if (value.length >= 2) {
        const options = await searchBar.options(value);
        if (options.length > 0) {
            options.forEach(option => {
                const div = searchBar.option(option);
                div.onclick = () => {
                    searchBar.action(input, option);
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
    document.addEventListener("click", function hideOnClickOutsideSearchBar(e) {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
            document.removeEventListener("click", hideOnClickOutsideSearchBar); // cleanup
        }
    });
}

// Getters
function getInput(searchBar, index = 0) {
    return searchBar.content.querySelectorAll('input')[index]
}

export function getPokemonOptions(value) {
    const search = value.toLowerCase();

    let options = POKEMONS.filter(pokemon =>
        getName(pokemon).toLowerCase().includes(search)
    );

    options.sort((a, b) => {
        const aName = getName(a).toLowerCase();
        const bName = getName(b).toLowerCase();

        if (aName === search && bName !== search) return -1;
        if (bName === search && aName !== search) return 1;

        const aStarts = aName.startsWith(search);
        const bStarts = bName.startsWith(search);
        if (aStarts && !bStarts) return -1;
        if (bStarts && !aStarts) return 1;

        return aName.localeCompare(bName);
    });

    return options;
}

export function getPokemonOption(pokemon) {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item pokemon';
    item.textContent = getName(pokemon);
    return item;
}

export function getTypeOptions(value) {
    const options = TYPES.filter(type =>
        getName(type).toLowerCase().includes(value.toLowerCase())
    );

    options.sort((a, b) => getName(a).localeCompare(getName(b)));
    return options;
}

export function getFilteredTypeOptions(value, excludeName) {
    return getTypeOptions(value).filter(type =>
        getName(type).toLowerCase() !== (excludeName?.toLowerCase() ?? "")
    );
}

export async function getMoveOptions(value) {
    if (Object.keys(CURRENT_POKEMON).length === 0) {
        return [];
    }

    const pokemonData = await getPokemonData(CURRENT_POKEMON);
    const options = getMoves(pokemonData).filter(pokeMove => {
        return (
            getName(pokeMove).toLowerCase().includes(value.toLowerCase())
            && !CURRENT_MOVES.map(e => getName(e).toLowerCase()).includes(getName(pokeMove).toLowerCase())
        );
    });

    options.sort((a, b) => getName(a).localeCompare(getName(b)));
    return options;
}

export function getTypeOption(type) {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item type';
    item.textContent = getName(type);
    return item;
}

export function getMoveOption(move) {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item type';
    item.textContent = getName(move);
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
        searchBox.classList.remove(type.name);
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

export function addPokemonToSearchBox(searchBox, pokemonData) {
    const icon = searchBox.querySelector('.icon');
    const img = searchBox.querySelector('img');

    const types = searchBox.querySelector('.result-types');

    icon.style.display = 'none';

    img.src = getPokemonShowdownSrc(pokemonData);
    img.alt = getPokemonSpriteAlt(pokemonData);
    img.style.display = ''

    searchBox.classList = `button-box pokemon`;

    setTypeBannersWithoutLogo(types, pokemonData.types);
    types.style.display = '';
}

export function addTypeToSearchBox(searchBox, type) {
    const icon = searchBox.querySelector('.icon');
    const input = searchBox.querySelector('input');
    const name = getName(type);
    input.value = name;
    input.classList.add('title');
    icon.setAttribute('class', `icon type ${name}`);
    icon.innerHTML = `<use href="#type-${name}-icon"/>`;
    searchBox.classList = `button-box type ${name}`;
}