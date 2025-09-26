import { CURRENT_PARTY_INDEX, PARTY } from "../../pages/main/modules/party-management/party.js";
import { cloneObject, fetchFullPath, getObjectData, getObjectName } from "./data.js";
import { getBestAndWorstCandidates, getMultiTypeResultArray, getMultiplier } from "./type.js";

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

export async function getPokemonPartyScores(multipliers) {
    const best = [];
    const worst = [];

    if (isPartyEmpty()) {
        return { best, worst };
    }

    const party = [];
    for (let i = 0; i < PARTY.length; i++) {
        if (isPartyPokemonEmpty(i)) {
            continue;
        }
        const partyMember = {
            pokemon: await getPokemonData(PARTY[i].pokemon),
            moves: PARTY[i].moves,
            multiplier: 1,
        };
        const types = await getPartyMemberTypes(partyMember);
        let multiplier = 1;
        for (const type of types) {
            multiplier *= getMultiplier(multipliers, type);
        }
        partyMember.multiplier = multiplier;
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
        return [
            [],
            combinedTypes.damage_relations.double_damage_from,
            combinedTypes.damage_relations.half_damage_from,
            [],
            combinedTypes.damage_relations.no_damage_from,
            scores.best,
            scores.worst
        ];
    }

    return [
        combinedTypes['4'],
        combinedTypes['2'],
        combinedTypes['0.5'],
        combinedTypes['0.25'],
        combinedTypes['0'],
        scores.best,
        scores.worst
    ];
}