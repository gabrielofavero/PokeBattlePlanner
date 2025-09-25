import { POKEMONS, decodeTitle, getName, getPokemonData } from "../../../../support/data.js";
import { addPokemonToSearchBox, getPokemonOption, getPokemonOptions } from "../../support/search-bar.js";

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

async function searchBarAction(input, pokemon) {
    if (!pokemon || Object.keys(pokemon).length === 0) {
        pokemon = findPokemonByTitle(title);
    }

    const content = document.getElementById('pokemon-search-content');
    const results = content.querySelector('.search-result');

    if (!pokemon || Object.keys(pokemon).length === 0) {
        results.classList.add('hidden');
    }

    input.value = getName(pokemon);
    const title = input.value;


    const searchBox = content.querySelector(".button-box");
    const suggestions = content.querySelector(".search-suggestions");

    suggestions.style.display = 'none';

    const pokemonData = await getPokemonData(pokemon);

    addPokemonToSearchBox(searchBox, pokemonData)
    // loadMultiTypeResults(pokemon.types, 'pokemon-result', PARTY);

    results.classList.remove('hidden');
}

export function getPokemonTitle(pokemon) {
    return decodeTitle(pokemon);
}

export function getPokemonImgContainer(pokemon) {
    return `<div class="img-container"><img src="${getPokemonSpriteSrc(pokemon)}" alt="${getPokemonSpriteAlt(pokemon)}"></div>`
}

export function getPokemonShowdownSrc(pokemonData) {
    return pokemonData.sprites.other.showdown.front_default || getPokemonSpriteSrc(pokemonData);
}

export function getPokemonSpriteSrc(pokemonData) {
    return pokemonData.sprites.front_default;
}

export function getPokemonArtworkSrc(pokemon) {
    const file = pokemon.missingArtwork ? 'unknown' : pokemon.id;
    return `./assets/img/pokemons/artworks/${file}.png`
}

export function getPokemonSpriteAlt(pokemonData) {
    return getName(pokemonData);
}

function findPokemonByTitle(title) {
    return POKEMONS.find(pokemon => getName(pokemon).toLowerCase() === title.toLowerCase()) || null;
}

export function setPokemonImgContainers(target, partyPokemons) {
    target.innerHTML = '';
    for (const partyPokemon of partyPokemons) {
        target.innerHTML += getPokemonImgContainer(partyPokemon.pokemon);
    }
}