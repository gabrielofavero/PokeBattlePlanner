import { setTypeBannersWithoutLogo } from "../../../../support/banners.js";
import { getObjectName, setSearchResult } from "../../../../support/data/data.js";
import { findPokemonByTitle, getPokemonData, getPokemonPartyScores, getPokemonResultArray, isPartyEmpty, setPokemonImgContainers } from "../../../../support/data/pokemon.js";
import { getCombinedTypes, getMultiTypeMultipliers, getSingleTypeMultipliers, getTypeData, getTypeMultiScores, getTypeSingleScores } from "../../../../support/data/type.js";
import { addPokemonToSearchBox, getPokemonOption, getPokemonOptions } from "../../support/search-bar.js";

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
    const results = content.querySelector('.search-result');

    if (!pokemon || Object.keys(pokemon).length === 0) {
        results.classList.add('hidden');
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

    results.classList.remove('hidden');
}

async function loadPokemonResult(types) {
    const isSingleType = types.length === 1;
    const isPartyPresent = !isPartyEmpty();

    const combinedTypes = isSingleType ? await getTypeData(types[0]) : await getCombinedTypes(types[0], types[1]);
    const multipliers = isSingleType ? getSingleTypeMultipliers(combinedTypes) : getMultiTypeMultipliers(combinedTypes);
    const scores = isPartyPresent ? await getPokemonPartyScores(multipliers) : isSingleType ? getTypeSingleScores(combinedTypes, multipliers) : getTypeMultiScores(combinedTypes, multipliers);
    const data = getPokemonResultArray(combinedTypes, scores, isSingleType);
    const action = pokemonResultAction;

    setSearchResult(data, 'pokemon-result', action);
}

function pokemonResultAction(target, arr) {
    if (arr[0]?.pokemon) {
        setPokemonImgContainers(target, arr);
    } else {
        setTypeBannersWithoutLogo(target, arr);
    }
}

