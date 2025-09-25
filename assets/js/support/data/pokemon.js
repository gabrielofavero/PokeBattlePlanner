import { fetchFullPath, getObjectData } from "./data.js";

export var POKEMONS;

export async function loadPokemons() {
    const pokemons = localStorage.getItem('pokemons');

    if (pokemons) {
        POKEMONS = JSON.parse(pokemons);
        return;
    }
    let start = new Date().getTime();
    POKEMONS = [];
    let finished = false
    let path = 'https://pokeapi.co/api/v2/pokemon'
    while (!finished) {
        const data = await fetchFullPath(path);
        POKEMONS.push(...data.results);
        path = data.next;
        if (!path) {
            finished = true;
            let end = new Date().getTime();
            console.log(`Loaded ${POKEMONS.length} Pokemons in ${(end - start) / 1000} seconds.`);
        }
    }

    localStorage.setItem('pokemons', JSON.stringify(POKEMONS));
}

export async function getPokemonData(pokemon) {
    return await getObjectData('pokemon', pokemon);
}

export function getPokemonMoves(pokemonData) {
    const moves = pokemonData?.moves ?? [];
    return moves.map(m => m.move);
}

export async function getPokemonMoveData(move) {
    return await getObjectData('move', move);
}

function getPokemonImgContainer(pokemon) {
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
    return getObjectName(pokemonData);
}

export function findPokemonByTitle(title) {
    return POKEMONS.find(pokemon => getObjectName(pokemon).toLowerCase() === title.toLowerCase()) || null;
}

export function setPokemonImgContainers(target, partyPokemons) {
    target.innerHTML = '';
    for (const partyPokemon of partyPokemons) {
        target.innerHTML += getPokemonImgContainer(partyPokemon.pokemon);
    }
}