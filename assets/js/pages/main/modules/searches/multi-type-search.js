import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { openFirstAccordion } from "../../../../support/components/accordion.js";
import { getObjectName } from "../../../../support/data/data.js";
import { getGridProperties, getIndicatorProperties, GRID_TYPES, INDICATORS, LABELS, setSearchResult } from "../../../../support/data/search-result.js";
import { findTypeByName, getCombinedTypes, getMultiTypeResultArray, getTypeMultiScores } from "../../../../support/data/type.js";
import { addTypeToSearchBox, getFilteredTypeOptions, getTypeOption } from "../../support/search-bar.js";

export const SEARCH_BAR_MULTI_TYPE_1 = {
    content: document.getElementById('multi-type-search-content'),
    options: getType1Options,
    option: getTypeOption,
    action: searchBarAction
}

export const SEARCH_BAR_MULTI_TYPE_2 = {
    content: document.getElementById('multi-type-search-content'),
    options: getType2Options,
    option: getTypeOption,
    action: searchBarAction
}

export const MULTI_TYPE_RESULT_PROPERTIES = {
    id: 'multi-type-result',
    accordionSections: [
        {
            label: LABELS.recommendations,
            start: 1,
            end: 2,
            hideLabel: false
        }, {
            label: LABELS.from,
            start: 3,
            end: 7
        },
        {
            label: LABELS.to,
            start: 8,
            end: 12
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
        indicator: getIndicatorProperties(INDICATORS['4'], true),
        label: LABELS.from
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
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['0.25'], false),
        label: LABELS.from
    },
    {
        grid: getGridProperties(GRID_TYPES.HIGHLIGHT, true),
        label: LABELS.immuneTo
    },
    {
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['0.25'], true),
        label: LABELS.to
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
        grid: getGridProperties(),
        indicator: getIndicatorProperties(INDICATORS['4'], false),
        label: LABELS.to
    },
    {
        grid: getGridProperties(GRID_TYPES.HIGHLIGHT, true),
        label: LABELS.cantDamage
    },
    ]
}

function searchBarAction(input, type) {
    const content = document.getElementById('multi-type-search-content');
    const result = content.querySelector('.search-result');

    const idSplit = input.id.split("-");
    const j = parseInt(idSplit[idSplit.length - 1]);
    const i = j - 1;

    if (!type.name || !findTypeByName(type.name)) {
        input.value = '';
        result.classList.add('hidden');
        return;
    }

    input.value = getObjectName(type);
    const searchBox = content.getElementsByClassName("button-box")[i];
    const suggestions = content.querySelector(`.search-suggestions.type-${j}`);

    suggestions.style.display = 'none';

    addTypeToSearchBox(searchBox, type);

    const types = getSearchTypes();
    if (types[0] && types[1]) {
        loadMultiTypeResult(types);
        result.classList.remove('hidden');
        openFirstAccordion(result);
    }
}

function getSearchTypes() {
    const type1 = findTypeByName(document.getElementById('search-multi-type-1').value);
    const type2 = findTypeByName(document.getElementById('search-multi-type-2').value);
    return [type1, type2];
}

function getType1Options(value) {
    return getFilteredTypeOptions(value, SEARCH_BAR_MULTI_TYPE_2.content.querySelectorAll('input')[1].value)
}

function getType2Options(value) {
    return getFilteredTypeOptions(value, SEARCH_BAR_MULTI_TYPE_1.content.querySelectorAll('input')[0].value)
}

async function loadMultiTypeResult(types) {
    const combinedTypesFrom = await getCombinedTypes(types[0], types[1]);
    const combinedTypesTo = await getCombinedTypes(types[0], types[1], "to");
    const scores = getTypeMultiScores(combinedTypesFrom, combinedTypesTo);
    const data = getMultiTypeResultArray(combinedTypesFrom, combinedTypesTo, scores);
    setSearchResult(data, MULTI_TYPE_RESULT_PROPERTIES, setTypeBannersWithoutLogo);
}