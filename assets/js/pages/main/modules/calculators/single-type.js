import { SINGLE_TYPES, TYPES } from "../../../../app.js";
import { firstCharToUppercase } from "../../../../support/data.js";
import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
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

function searchBarAction(input, option) {
    const type = option.toLowerCase();
    const content = document.getElementById('single-type-search-content');
    const searchBox = content.querySelector(".button-box");
    const results = content.querySelector('.search-result');
    const suggestions = content.querySelector(".search-suggestions");

    input.value = firstCharToUppercase(option);
    suggestions.style.display = 'none';

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
    const result = getSingleTypeResult(type);
    const data = [
        result.from?.['2'],
        result.to?.['0.5'],
        result.from?.['0.5'],
        result.to?.['2'],
        result.cant_damage,
        result.immune_to,
        result.battle_with,
        result.dont_battle_with
    ]

    for (let i = 0; i < data.length; i++) {
        const target = document.getElementById(`single-type-result-${i + 1}`);
        setTypeBannersWithoutLogo(target, data[i])
    }
}

export function getSingleTypeResult(type) {
    const result = SINGLE_TYPES?.[type];
    return {
        from: {
            "2": result?.to?.['2'],
            "0.5": result?.from?.['0.5']
        },
        to: {
            "0.5": result?.to?.['0.5'],
            "2": result?.from?.['2'],
        },
        cant_damage: result?.cant_damage,
        immune_to: result?.immune_to,
        battle_with: result?.worst_against,
        dont_battle_with: result?.best_against
    }
}
