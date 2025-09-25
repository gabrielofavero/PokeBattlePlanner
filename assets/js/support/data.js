export var POKEMONS;
export var TYPES;

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
            if (BLOCKED_TYPES.includes(getName(result))) {
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

async function getData(type, obj) {
    const start = new Date().getTime();
    const key = `${type}-${getName(obj)}`;
    const cachedData = localStorage.getItem(key);
    
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await fetchFullPath(obj.url);
    
    const end = new Date().getTime();
    console.log(`Loaded data for ${getName(obj)} in ${(end - start) / 1000} seconds.`);
    
    localStorage.setItem(key, JSON.stringify(data));
    return data;
}

export async function getPokemonData(pokemon) {
    return await getData('pokemon', pokemon);
}

export function findTypeByName(typeName) {
    return TYPES.find(t => getName(t).toLowerCase() === typeName.toLowerCase());
}

export async function getTypeData(type) {
    return await getData('type', type);
}

export async function getMoveData(move) {
    return await getData('move', move);
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

export function getName(objData) {
    return decodeTitle(objData?.move?.name ?? objData?.name ?? "");
}
