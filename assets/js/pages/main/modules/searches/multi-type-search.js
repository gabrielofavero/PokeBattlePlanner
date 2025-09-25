import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { getObjectName, setSearchResult } from "../../../../support/data/data.js";
import { setPokemonImgContainers } from "../../../../support/data/pokemon.js";
import { findTypeByName, getCombinedTypes } from "../../../../support/data/type.js";
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
    const combinedTypes = await getCombinedTypes(types[0], types[1]);
    const scores = getMultiBestAndWorstScores(combinedTypes);

    const data = [
        combinedTypes['4'],
        combinedTypes['2'],
        combinedTypes['0.5'],
        combinedTypes['0.25'],
        scores.best.map(s => s.type),
        scores.worst.map(s => s.type)
    ];

    setSearchResult(data, 'multi-type-result', setPokemonImgContainers);
}