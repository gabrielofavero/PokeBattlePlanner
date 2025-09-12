import { TYPES, SINGLE_TYPES } from "../app.js";
import { firstCharToUppercase } from "../support/data.js";
import { loadTypeContentBanners } from "../ui/banners.js";
import { addTypeToSearchBox, getTypeOption, getTypeOptions } from "../ui/search-bar.js";

export const SEARCH_SINGLE_TYPE = {
    content: document.getElementById('single-type-search-content'),
    options: getTypeOptions,
    option: getTypeOption,
    action: loadSingleTypeSearch
}

function loadSingleTypeSearch(type, input) {
    input.value = firstCharToUppercase(type);
    const content = document.getElementById('single-type-search-content');
    const searchBox = content.querySelector(".button-box");
    const results = content.querySelector('.search-result');

    if (!TYPES.includes(type)) {
        input.value = '';
        results.classList.add('hidden');
        return;
    }

    addTypeToSearchBox(searchBox, type);
    loadSingleTypeResults(type)

    results.classList.remove('hidden');
}

function loadSingleTypeResults(type) {
    const data = [
        SINGLE_TYPES?.[type]?.to?.['2'],
        SINGLE_TYPES?.[type]?.from?.['0.5'],
        SINGLE_TYPES?.[type]?.to?.['0.5'],
        SINGLE_TYPES?.[type]?.from?.['2'],
        SINGLE_TYPES?.[type]?.cant_damage,
        SINGLE_TYPES?.[type]?.immune_to,
        SINGLE_TYPES?.[type]?.best_against,
        SINGLE_TYPES?.[type]?.worst_against
    ]

    for (let i = 0; i < data.length; i++) {
        const target = document.getElementById(`single-type-result-${i + 1}`);
        loadTypeContentBanners(target, data[i])
    }
}
