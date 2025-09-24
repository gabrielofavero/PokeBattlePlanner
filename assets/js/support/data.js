export var POKEMONS;
var TYPES;

const BLOCKED_TYPES = ['stellar', 'unknown', 'shadow'];

export async function loadExternalData() {
    loadPokemons();
    loadTypes();
}

async function loadPokemons() {
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

async function loadTypes() {
    const types = localStorage.getItem('types');

    if (types) {
        TYPES = JSON.parse(types);
        return;
    }
    let start = new Date().getTime();
    TYPES = [];
    let finished = false
    let path = 'https://pokeapi.co/api/v2/type'
    while (!finished) {
        const data = await fetchFullPath(path);
        for (const result of data.results) {
            if (BLOCKED_TYPES.includes(result.name)) {
                continue;
            }
            TYPES.push(result);
        }
        path = data.next;
        if (!path) {
            finished = true;
            let end = new Date().getTime();
            console.log(`Loaded ${TYPES.length} Types in ${(end - start) / 1000} seconds.`);
        }
    }

    localStorage.setItem('types', JSON.stringify(TYPES));
}

export async function fetchFullPath(fullPath) {
    try {
        const res = await fetch(fullPath);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json;
    } catch (err) {
        console.error('Request failed:', err);
    }
}

export async function getPokemonData(pokemon) {
    const cachedData = localStorage.getItem(`pokemon-${pokemon.name}`);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    const pokemonData = await fetchFullPath(pokemon.url);
    localStorage.setItem(`pokemon-${pokemon.name}`, JSON.stringify(pokemonData));
    return pokemonData;
}


// Objects
export async function getJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

// Strings
export function firstCharToUppercase(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function decodeTitle(title) {
    return title.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}