import { POKEMONS, TYPES } from "../app.js";
import { loadMultiTypeSearch } from "../calculators/multi-type.js";
import { loadPokemonSearch } from "../calculators/pokemon.js";
import { loadSingleTypeSearch } from "../calculators/single-type.js";
import { firstCharToUppercase } from "../support/text-formatter.js";

const SEARCH_POKEMON = {
    content: document.getElementById('pokemon-search-content'),
    options: getPokemonOptions,
    option: getPokemonOption,
    action: loadPokemonSearch
}

const SEARCH_SINGLE_TYPE = {
    content: document.getElementById('single-type-search-content'),
    options: getTypeOptions,
    option: getTypeOption,
    action: loadSingleTypeSearch
}

const SEARCH_MULTI_TYPE_1 = {
    content: document.getElementById('multi-type-search-content'),
    options: getType1Options,
    option: getTypeOption,
    action: () => loadMultiTypeSearch(1)
}

const SEARCH_MULTI_TYPE_2 = {
    content: document.getElementById('multi-type-search-content'),
    options: getType2Options,
    option: getTypeOption,
    action: () => loadMultiTypeSearch(2)
}

export function loadSearchBars() {
    const pokemon = SEARCH_POKEMON.content.querySelector('input');
    const singleType = SEARCH_SINGLE_TYPE.content.querySelector('input');
    const multiType1 = SEARCH_MULTI_TYPE_1.content.querySelectorAll('input')[0];
    const multiType2 = SEARCH_MULTI_TYPE_2.content.querySelectorAll('input')[1];

    pokemon.addEventListener('input', () => loadSearchBar(SEARCH_POKEMON));
    singleType.addEventListener('input', () => loadSearchBar(SEARCH_SINGLE_TYPE));
    multiType1.addEventListener('input', () => loadSearchBar(SEARCH_MULTI_TYPE_1, 1));
    multiType2.addEventListener('input', () => loadSearchBar(SEARCH_MULTI_TYPE_2, 2));
}

export function resetSearchBars() {
    SEARCH_POKEMON.content.querySelector('input').value = '';
    SEARCH_SINGLE_TYPE.content.querySelector('input').value = '';
    SEARCH_MULTI_TYPE_1.content.querySelectorAll('input')[0].value = '';
    SEARCH_MULTI_TYPE_2.content.querySelectorAll('input')[1].value = '';
}

function loadSearchBar(search, j=1) {
    const input = search.content.querySelectorAll('input')[j-1];
    const suggestions = search.content.getElementsByClassName("search-suggestions")[j-1];
    const searchBox = search.content.getElementsByClassName("search-box")[j-1];
    const results = search.content.querySelector('.search-result');

    const value = input.value.trim().toLowerCase();
    suggestions.innerHTML = "";
    results.classList.add('hidden');
    clearSearchBox(searchBox);

    if (value.length >= 2) {
        const options = search.options(value);
        if (options.length > 0) {
            options.forEach(option => {
                const item = search.option(option);
                item.onclick = () => {
                    input.value = option?.title || firstCharToUppercase(option);
                    suggestions.style.display = 'none';
                    search.action();
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

    // Hide when clicking outside
    document.addEventListener("click", function hideOnClickOutside(e) {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
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
    item.innerHTML = `<img src="./assets/img/pokemons/${option.hrefIcon}.png" alt=""> ${titleBox}`;
    return item;
}

// Search Type
function getTypeOptions(value) {
    const options = TYPES.filter(type =>
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
    return getFilteredTypeOptions(value, SEARCH_MULTI_TYPE_2.content.querySelectorAll('input')[1].value)
}

function getType2Options(value) {
    return getFilteredTypeOptions(value, SEARCH_MULTI_TYPE_1.content.querySelectorAll('input')[0].value)
}

function getTypeOption(type) {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item type';
    item.innerHTML = `<svg class="icon ${type}"><use href="#type-${type}-icon" /></svg> ${firstCharToUppercase(type)}`;
    return item;
}

export function addTypeToSearchBox(searchBox, type) {
    const icon = searchBox.querySelector('.icon');
    const input = searchBox.querySelector('input');
    input.value = type;
    input.classList.add('title');
    icon.setAttribute('class', `icon type ${type}`);
    icon.innerHTML = `<use href="#type-${type}-icon"/>`;
    searchBox.classList = `search-box type ${type}`;
}

export function clearSearchBox(searchBox) {
    const icon = searchBox.querySelector('.icon');
    const input = searchBox.querySelector('input');
    input.classList = 'clear-input'
    icon.setAttribute('class', 'icon');
    icon.innerHTML = `<use href="#search-icon"/>`;
    searchBox.classList = 'search-box';
}