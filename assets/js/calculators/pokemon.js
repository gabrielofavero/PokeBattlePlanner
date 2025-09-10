import { POKEMONS } from "../app.js";
import { loadMultiTypeResults } from "./multi-type.js";

export function loadPokemonSearch() {
    const content = document.getElementById('pokemon-search-content');
    const searchBox = content.querySelector(".search-box");
    const input = searchBox.querySelector('input');
    const results = content.querySelector('.search-result');
    const value = input.value.toLowerCase();

    const pokemon = getPokemon(value);

    if (pokemon == null) {
        input.value = '';
        results.classList.add('hidden');
        return;
    }

    //addTypeToSearchBox(searchBox, pokemon);
    loadMultiTypeResults(pokemon.types, 'pokemon-result');
    results.classList.remove('hidden');
}

function getPokemon(value) {
    const found = POKEMONS.find(p => p.subtitle.toLowerCase() === value.toLowerCase());
    if (found) return found;
    return POKEMONS.find(p => p.title.toLowerCase() === value.toLowerCase()) || null;
}