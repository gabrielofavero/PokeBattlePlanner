import { POKEMONS } from "../../../app.js";
import { PARTY } from "./party.js";
import { addPokemonToSearchBox, getPokemonOption, getPokemonOptions } from "../support/search-bar.js";
import { loadMultiTypeResults } from "./multi-types.js";

var POKEMON;

export const RATINGS = {
    "very-strong": "Very Strong",
    "strong": "Strong",
    "neutral": "Neutral",
    "weak": "Weak",
    "very-weak": "Very Weak",
}

export const EFFECTIVINESS = {
    "4": "very-strong",
    "2": "strong",
    "1": "neutral",
    "½": "weak",
    "¼": "very-weak"
}

export function getPokemonSearchBar() {
    return {
        content: document.getElementById('pokemon-search-content'),
        options: getPokemonOptions,
        option: getPokemonOption,
        action: searchBarAction
    }
}

function searchBarAction(input, option) {
    POKEMON = option;
    input.value = POKEMON?.title || '';
    const title = input.value;

    if (!POKEMON || title != POKEMON.title) {
        POKEMON = findPokemonByTitle(title);
        input.value = POKEMON.title
    }

    const content = document.getElementById('pokemon-search-content');
    const searchBox = content.querySelector(".button-box");
    const results = content.querySelector('.search-result');
    const suggestions = content.querySelector(".search-suggestions");

    suggestions.style.display = 'none';

    if (POKEMON == null) {
        results.classList.add('hidden');
        return;
    }

    addPokemonToSearchBox(searchBox, POKEMON)
    loadMultiTypeResults(POKEMON.types, 'pokemon-result', PARTY);
    results.classList.remove('hidden');
}

export function getPokemonImgContainer(pokemon) {
    return `<div class="img-container"><img src="${getPokemonSpriteSrc(pokemon)}" alt="${getPokemonSpriteAlt(pokemon)}"></div>`
}

export function getPokemonSpriteSrc(pokemon) {
    return `./assets/img/pokemons/sprites/${pokemon.hrefIcon}.png`
}

export function getPokemonSpriteAlt(pokemon) {
    return `${pokemon.title}: ${pokemon.subtitle}`
}

function findPokemonByTitle(title) {
    return POKEMONS.find(pokemon => pokemon.title.toLowerCase() === title.toLowerCase()) || null;
}

export function setPokemonImgContainers(target, partyPokemons) {
    target.innerHTML = '';
    for (const partyPokemon of partyPokemons) {
        target.innerHTML += getPokemonImgContainer(partyPokemon.pokemon);
    }
}