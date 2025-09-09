import { TYPES, SINGLE_TYPES } from "../app.js";
import { loadTypeContentBanners, loadTypeTitleBanner } from "../ui/banners.js";
import { addTypeToSearchBox } from "../ui/search-bar.js";

export function loadSingleTypeSearch() {
    const searchBox = document.getElementById('search-box-single-type');
    const input = searchBox.querySelector('input');
    const results = document.getElementById('single-type-results');
    const type = input.value.toLowerCase();

    if (!TYPES.includes(type)) {
        input.value = '';
        results.classList.add('hidden');
        return;
    }

    addTypeToSearchBox(searchBox, type);
    loadTypeTitleBanner('single-type-result-title', type);
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
        loadTypeContentBanners(`single-type-result-${i + 1}`, data[i])
    }
}
