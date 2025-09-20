import { MULTI_TYPES, TYPES } from "../../../app.js";
import { firstCharToUppercase } from "../../../support/data.js";
import { setTypeBannersWithoutLogo } from "../../../ui/banners.js";
import { addTypeToSearchBox, getFilteredTypeOptions, getTypeOption } from "../support/search-bar.js";
import { setPokemonImgContainers } from "./pokemon.js";

const SEARCH_TYPES = ['', '']

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

function searchBarAction(input, option) {
    input.value = firstCharToUppercase(option);
    const idSplit = input.id.split("-");
    const j = parseInt(idSplit[idSplit.length - 1]);

    const type = input.value.toLowerCase();
    const content = document.getElementById('multi-type-search-content');
    const searchBox = content.getElementsByClassName("button-box")[j - 1];
    const results = content.querySelector('.search-result');
    const suggestions = content.querySelector(`.search-suggestions.type-${j}`);

    suggestions.style.display = 'none';

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

function getType1Options(value) {
    return getFilteredTypeOptions(value, SEARCH_BAR_MULTI_TYPE_2.content.querySelectorAll('input')[1].value)
}

function getType2Options(value) {
    return getFilteredTypeOptions(value, SEARCH_BAR_MULTI_TYPE_1.content.querySelectorAll('input')[0].value)
}

export function loadMultiTypeResults(searchTypes = SEARCH_TYPES, idPrefix = 'multi-type-result', pokemons = []) {
    const result = getMultiTypeResult(searchTypes, pokemons);
    const data = [
        result.from?.['4'],
        result.from?.['2'],
        result.from?.['0.5'],
        result.from?.['0.25'],
        result.immune_to,
        result.battle_with,
        result.dont_battle_with
    ];

    for (let i = 0; i < data.length; i++) {
        const target = document.getElementById(`${idPrefix}-${i + 1}`);
        if (data[i]?.isPokemon) {
            setPokemonImgContainers(target, data[i].result);
        } else {
            setTypeBannersWithoutLogo(target, data[i]?.result || data[i]);
        }
    }
}

function getMultiTypeResult(types, pokemons) {
    const key = types.join('_');
    const rawData = MULTI_TYPES?.[key];

    if (!rawData) {
        console.warn(`Data could not be found for types "${types.join(', ')}".`);
        return null;
    }

    return buildTypeEffectiveness(rawData, pokemons);
}

function buildTypeEffectiveness(rawData, pokemons) {
    const map = rawData.reduce((acc, value, i) => {
        const multiplier = String(value);
        if (!acc[multiplier]) acc[multiplier] = [];
        acc[multiplier].push(TYPES[i]);
        return acc;
    }, {});

    const from = {
        "4": map["4"] || [],
        "2": map["2"] || [],
        "0.5": map["0.5"] || [],
        "0.25": map["0.25"] || [],
    };

    const immune_to = map["0"] || [];
    const remainingPokemons = [...pokemons];
    const battleRec = recommendBattleWith(from["4"], from["2"], remainingPokemons);

    const usedIds = new Set(battleRec.result.map((p) => p.pokemon?.id));
    const filteredPokemons = remainingPokemons.filter(
        (p) => !usedIds.has(p.pokemon?.id)
    );

    const dontBattleRec = recommendDontBattleWith(
        immune_to,
        from["0.25"],
        from["0.5"],
        filteredPokemons
    );

    return {
        from,
        immune_to,
        battle_with: battleRec,
        dont_battle_with: dontBattleRec,
    };
}

function recommendBattleWith(bestTypes, goodTypes, pokemons) {
    const priorityTypes = bestTypes.length > 0 ? bestTypes : goodTypes;
    if (pokemons.length === 0) return getBattleRecommendationObject(false, priorityTypes);
    if (priorityTypes.length === 0) return getBattleRecommendationObject(true, []);

    const matched = matchPokemonsByTypesOrMoves(pokemons, priorityTypes);
    return getBattleRecommendationObject(true, matched);
}

function recommendDontBattleWith(immuneTypes, resistTypes, weakTypes, pokemons) {
    const priorityTypes = [
        ...immuneTypes,
        ...(resistTypes.length > 0 ? resistTypes : weakTypes),
    ];
    if (pokemons.length === 0) return getBattleRecommendationObject(false, priorityTypes);
    if (priorityTypes.length === 0) return getBattleRecommendationObject(true, []);

    const matched = matchPokemonsByTypesOrMoves(pokemons, priorityTypes);
    return getBattleRecommendationObject(true, matched);
}

function matchPokemonsByTypesOrMoves(pokemons, targetTypes) {
    return pokemons.filter((p) => {
        // Safeguard: invalid structure
        if (!p || !p.pokemon || !Array.isArray(p.moves)) return false;

        const types = Array.isArray(p.pokemon.types) ? p.pokemon.types : [];
        const moveTypes = p.moves.map((m) => m.type).filter(Boolean);

        // If no moves are registered, fallback to Pokémon base types
        const effectiveTypes = moveTypes.length > 0 ? moveTypes : types;

        return effectiveTypes.some((t) => targetTypes.includes(t));
    });
}

function getBattleRecommendationObject(isPokemon, result) {
    return { isPokemon, result };
}