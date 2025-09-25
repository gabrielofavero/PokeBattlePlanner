import { POKEMONS, decodeTitle, getObjectName } from "../../../../support/data/data.js";
import { findPokemonByTitle, getPokemonData } from "../../../../support/data/pokemon.js";
import { getCombinedTypes } from "../../../../support/data/type.js";
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

    input.value = getObjectName(pokemon);
    const title = input.value;


    const searchBox = content.querySelector(".button-box");
    const suggestions = content.querySelector(".search-suggestions");

    suggestions.style.display = 'none';

    const pokemonData = await getPokemonData(pokemon);

    addPokemonToSearchBox(searchBox, pokemonData)
    loadPokemonResult(pokemon.types, 'pokemon-result', PARTY);

    results.classList.remove('hidden');
}

async function loadPokemonResult(types) {
    const combinedTypes = await getCombinedTypes(types[0], types[1]);

    const data = [
        combinedTypes['4'],
        combinedTypes['2'],
        combinedTypes['0.5'],
        combinedTypes['0.25'],
    ];

    for (let i = 0; i < data.length; i++) {
        const target = document.getElementById(`pokemon-result-${i + 1}`);
        if (data[i]?.isPokemon) {
            setPokemonImgContainers(target, data[i].result);
        } else {
            setTypeBannersWithoutLogo(target, data[i]?.result || data[i]);
        }
    }
}