import { MULTI_TYPES, TYPES } from "../app.js";
import { loadTypeContentBanners } from "../ui/banners.js";
import { addTypeToSearchBox, getFilteredTypeOptions, getTypeOption, storeTypeSearchResult } from "../ui/search-bar.js";

const SEARCH_TYPES = ['', '']

export const SEARCH_MULTI_TYPE_1 = {
    content: document.getElementById('multi-type-search-content'),
    options: getType1Options,
    option: getTypeOption,
    action: () => loadMultiTypeSearch(1),
    storeAction: storeTypeSearchResult
}

export const SEARCH_MULTI_TYPE_2 = {
    content: document.getElementById('multi-type-search-content'),
    options: getType2Options,
    option: getTypeOption,
    action: () => loadMultiTypeSearch(2),
    storeAction: storeTypeSearchResult
}

export function loadMultiTypeSearch(j) {
    const content = document.getElementById('multi-type-search-content');
    const searchBox = content.getElementsByClassName("button-box")[j-1];
    const input = searchBox.querySelector('input');
    const results = content.querySelector('.search-result');
    const type = input.value.toLowerCase();

    if (!TYPES.includes(type)) {
        SEARCH_TYPES[j - 1] = '';
        input.value = '';
        results.classList.add('hidden');
        return;
    }
    SEARCH_TYPES[j - 1] = type;
    addTypeToSearchBox(searchBox, type);

    if (SEARCH_TYPES[0] && SEARCH_TYPES[1]) {
        loadMultiTypeResults();
        results.classList.remove('hidden');
    }
}

export function loadMultiTypeResults(searchTypes = SEARCH_TYPES, idPrefix = 'multi-type-result') {
    const multiType = searchTypes.join('_');
    const rawData = MULTI_TYPES?.[multiType];

    if (!rawData) {
        console.log(`Data could not be found for types "${searchTypes.join(' and ')}"`)
    }

    const data = getMultiData(rawData);

    for (let i = 0; i < data.length; i++) {
        const target = document.getElementById(`${idPrefix}-${i + 1}`);
        loadTypeContentBanners(target, data[i])
    }
}

function getMultiData(rawData) {
    const multiDataMap = getMultiDataMap(rawData);
    return [
        multiDataMap['2'] || [],
        multiDataMap['4'] || [],
        multiDataMap['½'] || [],
        multiDataMap['¼'] || [],
        multiDataMap['0'] || [],
    ]
}

function getMultiDataMap(rawData) {
    return rawData.reduce((accumulator, value, i) => {
        const key = String(value);
        if (!accumulator[key]) accumulator[key] = [];
        accumulator[key].push(TYPES[i]);
        return accumulator;
    }, {});
}

function getType1Options(value) {
    return getFilteredTypeOptions(value, SEARCH_MULTI_TYPE_2.content.querySelectorAll('input')[1].value)
}

function getType2Options(value) {
    return getFilteredTypeOptions(value, SEARCH_MULTI_TYPE_1.content.querySelectorAll('input')[0].value)
}