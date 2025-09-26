import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { getObjectName } from "../../../../support/data/data.js";
import { findTypeByName, getSingleTypeResultArray, getTypeData, getTypeSingleScores } from "../../../../support/data/type.js";
import { addTypeToSearchBox, getTypeOption, getTypeOptions } from "../../support/search-bar.js";
import { getGridProperties, getIndicatorProperties, GRID_TYPES, INDICATORS, LABELS, setSearchResult } from "../../../../support/data/search-result.js";

export const SINGLE_TYPE_RESULT_PROPERTIES = {
    id: 'single-type-result',
    data: [{
        grid: getGridProperties(GRID_TYPES.RESULT),
        label: LABELS.bestTypes
    },
    {
        grid: getGridProperties(GRID_TYPES.RESULT),
        label: LABELS.worstTypes
    },
    {
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['2'], true),
        label: LABELS.from
    },
    {
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['0.5'], true),
        label: LABELS.to
    },
    {
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['0.5'], false),
        label: LABELS.from
    },
    {
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['2'], false),
        label: LABELS.to
    },
    {
        grid: getGridProperties(GRID_TYPES.HIGHLIGHT),
        label: LABELS.cantDamage
    },
    {
        grid: getGridProperties(GRID_TYPES.HIGHLIGHT),
        label: LABELS.immuneTo
    }]
}

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
    setSearchResult(data, SINGLE_TYPE_RESULT_PROPERTIES, setTypeBannersWithoutLogo);
}