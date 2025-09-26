import { cloneObject, fetchFullPath, getObjectData, getObjectName, getTopN } from "./data.js";

export var TYPES;

const BLOCKED_TYPES = ['stellar', 'unknown', 'shadow'];

export async function loadTypes() {
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
            if (BLOCKED_TYPES.includes(getObjectName(result))) {
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
export function getTypeSingleScores(typeData, multipliers = getSingleTypeMultipliers(typeData)) {
    multipliers.sort((a, b) => a.multiplier - b.multiplier);

    const filtered = multipliers.filter(r => r.multiplier !== 1);

    const worstCandidates = filtered.filter(r => r.multiplier < 1);
    const bestCandidates = filtered.filter(r => r.multiplier > 1);

    const worst = getTopN(worstCandidates, 3);
    const best = getTopN([...bestCandidates].reverse(), 3);

    return { best, worst };
}

export function getSingleTypeMultipliers(typeData) {
    return TYPES.map(type => ({
        type: type,
        multiplier: getTypeMultiplier(typeData, type)
    }));
}

function getTypeMultiplier(typeData, typeAgainst, direction) {
    if (!typeData || !typeAgainst) return 1;
    const relations = typeData.damage_relations;

    const doubleKey = direction === "from" ? "double_damage_from" : "double_damage_to";
    const halfKey   = direction === "from" ? "half_damage_from"   : "half_damage_to";
    const noneKey   = direction === "from" ? "no_damage_from"     : "no_damage_to";

    if (relations[doubleKey].some(t => getObjectName(t) === getObjectName(typeAgainst))) {
        return 2;
    }
    if (relations[halfKey].some(t => getObjectName(t) === getObjectName(typeAgainst))) {
        return 0.5;
    }
    if (relations[noneKey].some(t => getObjectName(t) === getObjectName(typeAgainst))) {
        return 0;
    }
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
    const multipliers = TYPES.map(type => {
        const offense = getCombinedTypeMultiplier(combinedTypesTo, type);
        const defense = getCombinedTypeMultiplier(combinedTypesFrom, type);

        const score = offense / defense; 

        return { type, offense, defense, score };
    });

    return getBestAndWorstCandidates(multipliers);
}

export function getMultiTypeMultipliers(combinedTypes) {
    return TYPES.map(type => ({
        type: type,
        multiplier: getCombinedTypeMultiplier(combinedTypes, type)
    }));
}

export function getBestAndWorstCandidates(arr) {
    const sorted = [...arr].sort((a, b) => b.score - a.score);

    const best = getTopN(sorted, 3);
    const worst = getTopN([...sorted].reverse(), 3);

    return { best, worst };
}

function getCombinedTypeMultiplier(combinedTypes, typeAgainst) {
    for (const key of Object.keys(combinedTypes)) {
        if (combinedTypes[key].some(t => getObjectName(t) === getObjectName(typeAgainst))) {
            return parseFloat(key);
        }
    }
    return 1;
}

export function getSingleTypeResultArray(typeData, scores) {
    return [
        typeData.damage_relations.double_damage_from,
        typeData.damage_relations.half_damage_to,
        typeData.damage_relations.half_damage_from,
        typeData.damage_relations.double_damage_to,
        typeData.damage_relations.no_damage_to,
        typeData.damage_relations.no_damage_from,
        scores.best.map(s => s.type),
        scores.worst.map(s => s.type)
    ]
}

export function getMultiTypeResultArray(combinedTypesFrom, combinedTypesTo, scores) {
    return [
        scores.best.map(s => s.type),
        scores.worst.map(s => s.type),
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

export async function getOffensiveType(move) {
    const moveData = await getPokemonMoveData(move);
    return moveData.power ? moveData.type : null;
}

export function getMultiplier(multipliers, type) {
    const score = multipliers.find(s => getObjectName(s.type) === getObjectName(type));
    return score ? score.multiplier : 1;
}