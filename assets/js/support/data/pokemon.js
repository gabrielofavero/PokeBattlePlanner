import { CURRENT_PARTY_INDEX, PARTY } from "../../pages/main/modules/party-management/party.js";
import { DEFAULT_DATA_LIMIT, getAllData, getDB, getObjectData, getObjectName, setDB } from "./data.js";
import { getBestAndWorstCandidates, getMultiTypeMultipliers, getMultiTypeResultArray, getMultiplier, getSingleTypeResultArray, getTypeMultiScores, getTypeSingleMultipliers, getTypeSingleScores } from "./type.js";

export var POKEMONS;

export async function loadPokemons() {
    const pokemons = await getDB('pokemons');

    if (pokemons) {
        POKEMONS = pokemons;
        return;
    }

    POKEMONS = await getAllData(getPokemonPath, 'Pokémons');
    await setDB('pokemons', POKEMONS);
}

function getPokemonPath(offset = 0, dataLimit = DEFAULT_DATA_LIMIT) {
    return `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${dataLimit}`
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
    return `<div class="img-container"><img src="${getPokemonShowdownSrc(pokemon)}" alt="${getPokemonSpriteAlt(pokemon)}"></div>`
}

export function getPokemonShowdownSrc(pokemonData) {
    return pokemonData.sprites.other.showdown.front_default || getPokemonSpriteSrc(pokemonData);
}

export function getPokemonSpriteSrc(pokemonData) {
    return pokemonData.sprites.front_default;
}

export function getPokemonArtworkSrc(pokemonData) {
    return pokemonData.sprites.other['official-artwork'].front_default;
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

// Party
export function isPartyEmpty() {
    let empty = true;
    for (let i = 0; i < PARTY.length; i++) {
        if (!isPartyMemberEmpty(i)) {
            empty = false;
            break;
        }
    }
    return empty;
}

export function isPartyMemberEmpty(i = CURRENT_PARTY_INDEX) {
    const party = PARTY[i];
    return (!party || Object.keys(party.pokemon).length == 0);
}

export function isPartyPokemonEmpty(index) {
    const party = PARTY[index];
    return (!party || Object.keys(party.pokemon).length == 0);
}

export function isPartyMovesEmpty(index) {
    const party = PARTY[index];
    return (!party || party.moves.length == 0);
}

export async function getSingleTypePartyScores(typeData, isPartyPresent) {
    if (!isPartyPresent) {
        return getTypeSingleScores(typeData);
    }
    const multipliers = getTypeSingleMultipliers(typeData);
    return await getPartyScores(multipliers);
}

export async function getMultiTypePartyScores(combinedTypesFrom, combinedTypesTo, isPartyPresent) {
    if (!isPartyPresent) {
        return getTypeMultiScores(combinedTypesFrom, combinedTypesTo);
    }

    const multipliers = getMultiTypeMultipliers(combinedTypesFrom, combinedTypesTo);
    const partyScores = await getPartyScores(multipliers);

    if (partyScores.best.length === 0 && partyScores.worst.length === 0) {
        return getTypeMultiScores(combinedTypesFrom, combinedTypesTo);
    }

    return partyScores;
}

async function getPartyScores(multipliers) {
    const party = [];

    for (let i = 0; i < PARTY.length; i++) {
        if (isPartyPokemonEmpty(i)) {
            continue;
        }

        const partyMember = {
            pokemon: await getPokemonData(PARTY[i].pokemon),
            moves: PARTY[i].moves,
            score: 1,
        };

        const types = await getPartyMemberTypes(partyMember);

        let score = 1;
        for (const type of types) {
            score *= getMultiplier(multipliers, type);
        }

        partyMember.score = score;
        party.push(partyMember);
    }

    return getBestAndWorstCandidates(party);
}

async function getPartyMemberTypes(partyMember) {
    const types = [];

    if (partyMember.moves.length === 0) {
        types.push(...await getPokemonTypes(partyMember.pokemon));
    } else {
        for (const move of partyMember.moves) {
            const offensiveType = await getOffensiveType(move);
            if (!offensiveType) {
                continue;
            }
            types.push(offensiveType);
        }
    }
    return types;
}

export async function getPokemonTypes(pokemonData) {
    return pokemonData.types.map(t => t.type);
}

export async function getOffensiveType(move) {
    const moveData = await getPokemonMoveData(move);
    return moveData.power ? moveData.type : null;
}

export function getPokemonResultArray(combinedTypes, scores, isSingleType) {
    if (isSingleType) {
        return getSingleTypeResultArray(combinedTypes, scores, true);
    }
    return getMultiTypeResultArray(combinedTypes.from, combinedTypes.to, scores, true);
}