import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { getObjectName, setSearchResult } from "../../../../support/data/data.js";
import { findTypeByName, getSingleBestAndWorstScores, getTypeData } from "../../../../support/data/type.js";
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
    const result = content.querySelector('.search-result');
    const suggestions = content.querySelector(".search-suggestions");

    if (!type.name || !findTypeByName(type.name)) {
        input.value = '';
        result.classList.add('hidden');
        return;
    }

    input.value = getObjectName(type);
    suggestions.style.display = 'none';

    addTypeToSearchBox(searchBox, type);
    await loadSingleTypeResult(type)

    result.classList.remove('hidden');
}

async function loadSingleTypeResult(type) {
    const typeData = await getTypeData(type);
    const scores = getSingleBestAndWorstScores(typeData);

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

    setSearchResult(data, 'single-type-result', setTypeBannersWithoutLogo);
}