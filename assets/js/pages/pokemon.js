import { addPokemonToSearchBox, getPokemonOption, getPokemonOptions } from "../ui/search-bar.js";
import { loadMultiTypeResults } from "./multi-types.js";

var POKEMON;

export const SEARCH_POKEMON = {
    content: document.getElementById('pokemon-search-content'),
    options: getPokemonOptions,
    option: getPokemonOption,
    action: loadPokemonSearch
}

function loadPokemonSearch(pokemon, input) {
    POKEMON = pokemon;
    input.value = POKEMON?.title || '';
    const content = document.getElementById('pokemon-search-content');
    const searchBox = content.querySelector(".button-box");
    const results = content.querySelector('.search-result');

    if (POKEMON == null) {
        results.classList.add('hidden');
        return;
    }

    addPokemonToSearchBox(searchBox, POKEMON)
    loadMultiTypeResults(POKEMON.types, 'pokemon-result');
    results.classList.remove('hidden');
}

export function getPokemonSpriteSrc(pokemon) {
    return `./assets/img/pokemons/${pokemon.hrefIcon}.png`
}

export function getPokemonSpriteAlt(pokemon) {
    return `${pokemon.title}: ${pokemon.subtitle}`
}