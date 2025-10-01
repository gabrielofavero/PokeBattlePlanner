import { DEFAULT_DATA_LIMIT, cloneObject, getAllData, getDB, getObjectData, getObjectName, getTopN, setDB } from "./data.js";

export var TYPES;
const BLOCKED_TYPES = ['stellar', 'unknown', 'shadow'];

export async function loadTypes() {
    const types = await getDB('types');

    if (types) {
        TYPES = types;
        return;
    }

    TYPES = await getAllData(getTypesPath, 'Types', BLOCKED_TYPES);
    await setDB('types', TYPES);
}

function getTypesPath(offset = 0, dataLimit = DEFAULT_DATA_LIMIT) {
    return `https://pokeapi.co/api/v2/type?offset=${offset}&limit=${dataLimit}`
}

export function findTypeByName(typeName) {
    if (!typeName) return null;
    return TYPES.find(t => getObjectName(t).toLowerCase() === typeName.toLowerCase());
}

export async function getTypeData(type) {
    return await getObjectData('type', type);
}

export async function getCombinedTypes(type1, type2, direction = "from") {
    const [typeData1, typeData2] = await Promise.all([
        getTypeData(type1),
        getTypeData(type2)
    ]);

    const multiplier1 = getAllTypeMultipliers(typeData1, direction);
    const multiplier2 = getAllTypeMultipliers(typeData2, direction);

    const result = {};
    [4, 2, 1, 0.5, 0.25, 0].forEach(m => result[m] = []);

    for (const type of TYPES) {
        const totalMultiplier = multiplier1[type.name] * multiplier2[type.name];
        const key = String(totalMultiplier);
        if (result[key]) {
            result[key].push(type);
        }
    }

    return result;
}

// Single Scores
export function getTypeSingleScores(typeData) {
    const multipliers = getTypeSingleMultipliers(typeData);
    const filtered = multipliers.filter(m => m.score !== 1);

    const best = getBestTypeCandidates(filtered).slice(0, 3);
    const worst = getWorstTypeCandidates(filtered).slice(0, 3);

    return { best, worst };
}

export function getBestTypeCandidates(multipliers) {
    return multipliers.filter(m => m.score > 1)
        .sort((a, b) => b.score - a.score)
}

export function getWorstTypeCandidates(multipliers) {
    return multipliers.filter(m => m.score < 1)
        .sort((a, b) => a.score - b.score)
}

export function getTypeSingleMultipliers(typeData) {
    return TYPES.map(type => {
        const offense = getTypeMultiplier(typeData, type, "from");
        const defense = getTypeMultiplier(typeData, type, "to");
        const score = offense / defense;
        return { type, offense, defense, score };
    });
}

export function getTypeMultiplier(typeData, typeAgainst, direction) {
    if (!typeData || !typeAgainst) return 1;
    const relations = typeData.damage_relations;
    const doubleKey = direction === "from" ? "double_damage_from" : "double_damage_to";
    const halfKey = direction === "from" ? "half_damage_from" : "half_damage_to";
    const noneKey = direction === "from" ? "no_damage_from" : "no_damage_to";

    const targetName = getObjectName(typeAgainst);

    if (relations[noneKey].some(t => getObjectName(t) === targetName)) return 0;
    if (relations[doubleKey].some(t => getObjectName(t) === targetName)) return 2;
    if (relations[halfKey].some(t => getObjectName(t) === targetName)) return 0.5;
    return 1;
}

function getAllTypeMultipliers(typeData, direction) {
    const result = {};
    for (const type of cloneObject(TYPES)) {
        const multiplier = getTypeMultiplier(typeData, type, direction);
        result[type.name] = multiplier;
    }
    return result;
}

// Multi Scores
export function getTypeMultiScores(combinedTypesFrom, combinedTypesTo) {
    const multipliers = getMultiTypeMultipliers(combinedTypesFrom, combinedTypesTo);
    return getBestAndWorstCandidates(multipliers);
}

export function getMultiTypeMultipliers(combinedTypesFrom, combinedTypesTo) {
    return TYPES.map(type => {
        const offense = getCombinedTypeMultiplier(combinedTypesTo, type);
        const defense = getCombinedTypeMultiplier(combinedTypesFrom, type);
        const score = defense / offense;
        return { type, offense, defense, score };
    });
}

export function getBestAndWorstCandidates(arr) {
    const totalBest = arr.filter(x => x.score > 1).sort((a, b) => b.score - a.score);
    const totalWorst = arr.filter(x => x.score < 1).sort((a, b) => a.score - b.score);

    const best = getTopN(totalBest, 3);
    const worst = getTopN(totalWorst, 3);

    return { best, worst };
}

export function getCombinedTypeMultiplier(combinedTypes, typeAgainst) {
    for (const key of Object.keys(combinedTypes)) {
        if (combinedTypes[key].some(t => getObjectName(t) === getObjectName(typeAgainst))) {
            return parseFloat(key);
        }
    }
    return 1;
}

export function getSingleTypeResultArray(typeData, scores, isPokemon = false) {
    return [
        getBestScore(scores, isPokemon),
        getWorstScore(scores, isPokemon),
        typeData.damage_relations.double_damage_from,
        typeData.damage_relations.half_damage_from,
        typeData.damage_relations.no_damage_from,
        typeData.damage_relations.half_damage_to,
        typeData.damage_relations.double_damage_to,
        typeData.damage_relations.no_damage_to
    ]
}

export function getMultiTypeResultArray(combinedTypesFrom, combinedTypesTo, scores, isPokemon = false) {
    return [
        getBestScore(scores, isPokemon),
        getWorstScore(scores, isPokemon),
        combinedTypesFrom['4'],
        combinedTypesFrom['2'],
        combinedTypesFrom['0.5'],
        combinedTypesFrom['0.25'],
        combinedTypesFrom['0'],
        combinedTypesTo['4'],
        combinedTypesTo['2'],
        combinedTypesTo['0.5'],
        combinedTypesTo['0.25'],
        combinedTypesTo['0'],
    ];
}

function getBestScore(scores, isPokemon) {
    return isPokemon ? scores.best : scores.best.map(s => s.type);
}

function getWorstScore(scores, isPokemon) {
    return isPokemon ? scores.worst : scores.worst.map(s => s.type);
}

export async function getOffensiveType(move) {
    const moveData = await getPokemonMoveData(move);
    return moveData.power ? moveData.type : null;
}

export function getMultiplier(multipliers, type) {
    const score = multipliers.find(s => getObjectName(s.type) === getObjectName(type));
    return score ? score.score : 1;
}