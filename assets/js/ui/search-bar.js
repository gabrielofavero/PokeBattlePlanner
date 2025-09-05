import { POKEMONS, TYPES } from "../app.js";
import { loadMultiTypeSearch } from "../calculators/multi-type.js";
import { loadPokemonSearch } from "../calculators/pokemon.js";
import { loadSingleTypeSearch } from "../calculators/single-type.js";
import { firstCharToUppercase } from "../support/text-formatter.js";

const SEARCH_POKEMON = {
    bar: document.getElementById('search-pokemon'),
    suggestions: document.getElementById('search-suggestions-pokemon'),
    options: getPokemonOptions,
    option: getPokemonOption,
    action: loadPokemonSearch,
}

const SEARCH_SINGLE_TYPE = {
    bar: document.getElementById('search-single-type'),
    suggestions: document.getElementById('search-suggestions-single-type'),
    options: getTypeOptions,
    option: getTypeOption,
    action: loadSingleTypeSearch
}

const SEARCH_MULTI_TYPE_1 = {
    bar: document.getElementById('search-multi-type-1'),
    suggestions: document.getElementById('search-suggestions-multi-type-1'),
    options: getType1Options,
    option: getTypeOption,
    action: loadMultiTypeSearch
}

const SEARCH_MULTI_TYPE_2 = {
    bar: document.getElementById('search-multi-type-2'),
    suggestions: document.getElementById('search-suggestions-multi-type-2'),
    options: getType2Options,
    option: getTypeOption,
    action: loadMultiTypeSearch
}

export function loadSearchBars() {
    SEARCH_POKEMON.bar.addEventListener('input', () => loadSearchBar(SEARCH_POKEMON));
    SEARCH_SINGLE_TYPE.bar.addEventListener('input', () => loadSearchBar(SEARCH_SINGLE_TYPE));
    SEARCH_MULTI_TYPE_1.bar.addEventListener('input', () => loadSearchBar(SEARCH_MULTI_TYPE_1));
    SEARCH_MULTI_TYPE_2.bar.addEventListener('input', () => loadSearchBar(SEARCH_MULTI_TYPE_2));
}

export function resetSearchBars() {
    SEARCH_POKEMON.bar.value = '';
    SEARCH_SINGLE_TYPE.bar.value = '';
    SEARCH_MULTI_TYPE_1.bar.value = '';
    SEARCH_MULTI_TYPE_2.bar.value = '';
}

function loadSearchBar(search) {
    const value = search.bar.value.trim().toLowerCase();
    search.suggestions.innerHTML = "";

    if (value.length >= 2) {
        const options = search.options(value);
        if (options.length > 0) {
            options.forEach(option => {
                const item = search.option(option);
                item.onclick = () => {
                    search.bar.value = option?.title || firstCharToUppercase(option);
                    search.suggestions.style.display = 'none';
                    search.action();
                };
                search.suggestions.appendChild(item);
            });
            search.suggestions.style.display = 'block';
        } else {
            search.suggestions.style.display = 'none';
        }
    } else {
        search.suggestions.style.display = 'none';
    }

    // Hide when clicking outside
    document.addEventListener("click", function hideOnClickOutside(e) {
        if (!search.bar.contains(e.target) && !search.suggestions.contains(e.target)) {
            search.suggestions.style.display = 'none';
            document.removeEventListener("click", hideOnClickOutside); // cleanup
        }
    });
}


// Search Pokémon
function getPokemonOptions(value) {
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

function getPokemonOption(option) {
    const item = document.createElement('div');
    const titleBox = `<div class="flex-column"><span>${option.title}</span><span class="pokemon-variant">${option.subtitle}</span></div>`;
    item.className = 'search-suggestion-item pokemon';
    item.innerHTML = `<img class="${!option.subtitle ? 'pokemon-small' : ''}" src="./assets/img/pokemons/${option.hrefIcon}.png" alt=""> ${titleBox}`;
    return item;
}

// Search Type
function getTypeOptions(value) {
    const typeValues = Object.values(TYPES);

    const options = typeValues.filter(type =>
        type.toLowerCase().includes(value.toLowerCase())
    );

    options.sort((a, b) => a.localeCompare(b));
    return options;
}

function getFilteredTypeOptions(value, exclude) {
    return getTypeOptions(value).filter(type =>
        type.toLowerCase() !== (exclude?.toLowerCase() ?? "")
    );
}

function getType1Options(value) {
    return getFilteredTypeOptions(value, SEARCH_MULTI_TYPE_2.bar.value)
}

function getType2Options(value) {
    return getFilteredTypeOptions(value, SEARCH_MULTI_TYPE_1.bar.value)
}

function getTypeOption(type) {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item type';
    item.innerHTML = `<img src="./assets/img/types/${type}.svg" alt=""> ${firstCharToUppercase(type)}`;
    return item;
}