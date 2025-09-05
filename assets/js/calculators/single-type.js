import { TYPES, SINGLE_TYPES } from "../app.js";
import { loadTypeContentBanners, loadTypeTitleBanner } from "../ui/banners.js";

export function loadSingleTypeSearch() {
    const search = document.getElementById('search-single-type');
    const types = Object.values(TYPES); 
    const results = document.getElementById('single-type-results');
    const type = search.value.toLowerCase();

    if (!types.includes(type)) {
        search.value = '';
        results.classList.add('hidden');
        return;
    }

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
