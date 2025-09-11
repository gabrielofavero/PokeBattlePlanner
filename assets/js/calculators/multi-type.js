import { MULTI_TYPES, TYPES } from "../app.js";
import { loadTypeContentBanners } from "../ui/banners.js";
import { addTypeToSearchBox } from "../ui/search-bar.js";

const SEARCH_TYPES = ['', '']

export function loadMultiTypeSearch(j) {
    const content = document.getElementById('multi-type-search-content');
    const searchBox = content.getElementsByClassName("search-box")[j-1];
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