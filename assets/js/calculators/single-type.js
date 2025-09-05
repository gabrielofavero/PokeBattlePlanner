import { TYPES, SINGLE_TYPES } from "../app.js";
import { getTypeBannerElement } from "../ui/banners.js";

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
        loadSingleTypeResult(i+1, data[i])
    }
    results.classList.remove('hidden');
}

function loadSingleTypeResult(j, types) {
    const target = document.getElementById(`single-type-result-${j}`);
    target.innerHTML = '';

    if (types.length == 0 ) {
        const div = getTypeBannerElement('N/A');
        target.append(div);
    }

    for (const type of types) {
        const div = getTypeBannerElement(type);
        target.append(div);
    }
}

