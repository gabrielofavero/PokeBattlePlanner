import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { getObjectName, setSearchResult } from "../../../../support/data/data.js";
import { findTypeByName, getTypeSingleScores, getTypeData, getSingleTypeResultArray } from "../../../../support/data/type.js";
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
    const scores = getTypeSingleScores(typeData);
    const data = getSingleTypeResultArray(typeData, scores);
    setSearchResult(data, 'single-type-result', setTypeBannersWithoutLogo);
}