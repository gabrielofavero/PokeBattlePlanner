import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { openFirstAccordion } from "../../../../support/components/accordion.js";
import { cloneObject, getObjectName } from "../../../../support/data/data.js";
import { findPokemonByTitle, getMultiTypePartyScores, getPokemonData, getPokemonResultArray, getSingleTypePartyScores, isPartyEmpty, setPokemonImgContainers } from "../../../../support/data/pokemon.js";
import { LABELS, setSearchResult } from "../../../../support/data/search-result.js";
import { getCombinedTypes, getTypeData } from "../../../../support/data/type.js";
import { IS_MOBILE } from "../../support/devices.js";
import { addPokemonToSearchBox, getPokemonOption, getPokemonOptions } from "../../support/search-bar.js";
import { MULTI_TYPE_RESULT_PROPERTIES } from "./multi-type-search.js";
import { SINGLE_TYPE_RESULT_PROPERTIES } from "./single-type-search.js";

export function getPokemonSearchBar() {
    return {
        content: document.getElementById('pokemon-search-content'),
        options: getPokemonOptions,
        option: getPokemonOption,
        action: searchBarAction
    }
}

async function searchBarAction(input, pokemon) {
    if (!pokemon || Object.keys(pokemon).length === 0) {
        pokemon = findPokemonByTitle(input.value);
    }

    const content = document.getElementById('pokemon-search-content');
    const result = content.querySelector('.search-result');

    if (!pokemon || Object.keys(pokemon).length === 0) {
        result.classList.add('hidden');
        input.value = '';
        return;
    }

    input.value = getObjectName(pokemon);

    const searchBox = content.querySelector(".button-box");
    const suggestions = content.querySelector(".search-suggestions");

    suggestions.style.display = 'none';

    const pokemonData = await getPokemonData(pokemon);
    const types = pokemonData.types.map(t => t.type);

    addPokemonToSearchBox(searchBox, pokemonData)
    await loadPokemonResult(types);

    result.classList.remove('hidden');
    if (!IS_MOBILE) {
        openFirstAccordion(result);
    }
}

async function loadPokemonResult(types) {
    const isSingleType = types.length === 1;
    const isPartyPresent = !isPartyEmpty();

    const combinedTypes = await getCombinedPokemonTypes(types, isSingleType);
    const scores = await getPartyScores(combinedTypes, isSingleType, isPartyPresent);

    const data = getPokemonResultArray(combinedTypes, scores, isSingleType);
    const properties = getPokemonResultProperties(isSingleType, isPartyPresent);
    const action = pokemonResultAction;

    setSearchResult(data, properties, action);
}

async function getCombinedPokemonTypes(types, isSingleType) {
    if (isSingleType) {
        return await getTypeData(types[0]);
    } else {
        const from = await getCombinedTypes(types[0], types[1]);
        const to = await getCombinedTypes(types[0], types[1], "to");
        return { from, to }
    }
}

async function getPartyScores(combinedTypes, isSingleType, isPartyPresent) {
    if (isSingleType) {
        return await getSingleTypePartyScores(combinedTypes, isPartyPresent);
    } else {
        return await getMultiTypePartyScores(combinedTypes.from, combinedTypes.to, isPartyPresent);
    }
}

function getPokemonResultProperties(isSingleType, isPartyPresent) {
    const properties = isSingleType ? cloneObject(SINGLE_TYPE_RESULT_PROPERTIES) : cloneObject(MULTI_TYPE_RESULT_PROPERTIES);
    properties.id = 'pokemon-result';

    if (isPartyPresent) {
        properties.data[0].label = LABELS.bestPokemons;
        properties.data[1].label = LABELS.worstPokemons;
    }

    return properties;
}

function pokemonResultAction(target, arr) {
    if (arr[0]?.pokemon) {
        setPokemonImgContainers(target, arr);
    } else {
        setTypeBannersWithoutLogo(target, arr);
    }
}

