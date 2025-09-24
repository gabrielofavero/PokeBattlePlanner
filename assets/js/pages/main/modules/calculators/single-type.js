import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { fetchFullPath, firstCharToUppercase, findTypeByName, getTypeData, TYPES } from "../../../../support/data.js";
import { addTypeToSearchBox, getTypeOption, getTypeOptions } from "../../support/search-bar.js";

export const SINGLE_TYPE_RESULT = {}

export function getSingleTypeSearchBar() {
    return {
        content: document.getElementById('single-type-search-content'),
        options: getTypeOptions,
        option: getTypeOption,
        action: searchBarAction
    }
}

async function searchBarAction(input, type) {
    const content = document.getElementById('single-type-search-content');
    const searchBox = content.querySelector(".button-box");
    const results = content.querySelector('.search-result');
    const suggestions = content.querySelector(".search-suggestions");

    if (!type || !findTypeByName(type.name)) {
        input.value = '';
        results.classList.add('hidden');
        return;
    }

    input.value = firstCharToUppercase(type.name);
    suggestions.style.display = 'none';

    addTypeToSearchBox(searchBox, type);
    await loadSingleTypeResults(type)

    results.classList.remove('hidden');
}

async function loadSingleTypeResults(type) {
    const typeData = await getTypeData(type);
    const scores = getSingleTypeScores(typeData);

    const data = [
        typeData.damage_relations.double_damage_from,
        typeData.damage_relations.half_damage_to,
        typeData.damage_relations.half_damage_from,
        typeData.damage_relations.double_damage_to,
        typeData.damage_relations.no_damage_to,
        typeData.damage_relations.no_damage_from,
        scores.best.map(s => s.type),
        scores.worst.map(s => s.type)
    ]

    for (let i = 0; i < data.length; i++) {
        const target = document.getElementById(`single-type-result-${i + 1}`);
        setTypeBannersWithoutLogo(target, data[i])
    }
}

export function getSingleTypeScores(typeData) {
    const relations = typeData.damage_relations;

    function getTypeScore(typeName) {
        let attackMultiplier = 1;
        if (relations.double_damage_from.some(t => t.name === typeName)) attackMultiplier = 2;
        else if (relations.half_damage_from.some(t => t.name === typeName)) attackMultiplier = 0.5;
        else if (relations.no_damage_from.some(t => t.name === typeName)) attackMultiplier = 0;

        let defenseMultiplier = 1;
        if (relations.double_damage_to.some(t => t.name === typeName)) defenseMultiplier = 2;
        else if (relations.half_damage_to.some(t => t.name === typeName)) defenseMultiplier = 0.5;
        else if (relations.no_damage_to.some(t => t.name === typeName)) defenseMultiplier = 0;

        return attackMultiplier * (defenseMultiplier === 0 ? Infinity : 1 / defenseMultiplier);
    }

    function getTopN(arr, n) {
        const unique = [];
        for (const item of arr) {
            if (!unique.some(u => u.score === item.score)) {
                unique.push(item);
            }
            if (unique.length >= n) break;
        }
        return unique;
    }

    const result = TYPES.map(type => ({
        type: type,
        score: getTypeScore(type.name)
    }));

    result.sort((a, b) => a.score - b.score);

    const filtered = result.filter(r => r.score !== 1);

    const worstCandidates = filtered.filter(r => r.score < 1);
    const bestCandidates = filtered.filter(r => r.score > 1);

    const worst = getTopN(worstCandidates, 3);
    const best = getTopN([...bestCandidates].reverse(), 3);

    return { best, worst };
}