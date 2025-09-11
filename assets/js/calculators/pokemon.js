import { addPokemonToSearchBox } from "../ui/search-bar.js";
import { loadMultiTypeResults } from "./multi-type.js";

var POKEMON;

export function loadPokemonSearch() {
    const content = document.getElementById('pokemon-search-content');
    const searchBox = content.querySelector(".search-box");
    const input = searchBox.querySelector('input');
    const results = content.querySelector('.search-result');

    if (POKEMON == null) {
        input.value = '';
        results.classList.add('hidden');
        return;
    }

    addPokemonToSearchBox(searchBox, POKEMON)
    loadMultiTypeResults(POKEMON.types, 'pokemon-result');
    results.classList.remove('hidden');
}

export function storePokemonSearchResult(pokemon, input) {
    POKEMON = pokemon;
    input.value = POKEMON.title;
}

export function getPokemonSpriteSrc(pokemon) {
    return `./assets/img/pokemons/${pokemon.hrefIcon}.png`
}

export function getPokemonSpriteAlt(pokemon) {
    return `${pokemon.title}: ${pokemon.subtitle}`
}