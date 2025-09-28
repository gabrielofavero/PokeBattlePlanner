import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { openFirstAccordion } from "../../../../support/components/accordion.js";
import { getObjectName } from "../../../../support/data/data.js";
import { GRID_TYPES, INDICATORS, LABELS, getGridProperties, getIndicatorProperties, setSearchResult } from "../../../../support/data/search-result.js";
import { findTypeByName, getSingleTypeResultArray, getTypeData, getTypeSingleScores } from "../../../../support/data/type.js";
import { addTypeToSearchBox, getTypeOption, getTypeOptions } from "../../support/search-bar.js";

export const SINGLE_TYPE_RESULT_PROPERTIES = {
    id: 'single-type-result',
    accordionSections: [{
        label: LABELS.recommendations,
        start: 1,
        end: 2,
        hideLabel: false
    },
    {
        label: LABELS.from,
        start: 3,
        end: 5
    },
    {
        label: LABELS.to,
        start: 6,
        end: 8
    }],
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
        indicator: getIndicatorProperties(INDICATORS['0.5'], false),
        label: LABELS.from
    },
    {
        grid: getGridProperties(GRID_TYPES.HIGHLIGHT, true),
        label: LABELS.immuneTo
    },
    {
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['0.5'], true),
        label: LABELS.to
    },
    {
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['2'], false),
        label: LABELS.to
    },
    {
        grid: getGridProperties(GRID_TYPES.HIGHLIGHT, true),
        label: LABELS.cantDamage
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
    openFirstAccordion(result);
}

async function loadSingleTypeResult(type) {
    const typeData = await getTypeData(type);
    const scores = getTypeSingleScores(typeData);
    const data = getSingleTypeResultArray(typeData, scores);
    setSearchResult(data, SINGLE_TYPE_RESULT_PROPERTIES, setTypeBannersWithoutLogo);
}