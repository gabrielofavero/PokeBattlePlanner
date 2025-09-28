import { POKEMONS } from "../../../support/data/pokemon.js";
import { TYPES } from "../../../support/data/type.js";
import { clearConfirmAction, mainBackAction, mainConfirmAction } from "../main.js";
import { loadNextTopBarItem, selectTopBarItem } from "./top-bar.js";

export function loadMainNavigationListeners() {
    document.getElementById('confirm-main').addEventListener('click', mainConfirmAction);
    document.getElementById('back-main').addEventListener('click', mainBackAction);
    document.getElementById('y-main').addEventListener('click', clearConfirmAction);
    document.querySelectorAll(".top-bar-item").forEach(item => {
        item.addEventListener("click", () => selectTopBarItem(item));
    });
    document.getElementById('next-top-bar-item').addEventListener("click", loadNextTopBarItem);

    const pokemonSearch = document.getElementById('search-pokemon');
    pokemonSearch.addEventListener('focus', () => onFocusAction(pokemonSearch, POKEMONS, "pokémons", "Enemy Pokémon"));

    const singleSearch = document.getElementById('search-single-type');
    singleSearch.addEventListener('focus', () => onFocusAction(singleSearch, TYPES, "types", "Enemy Type"));

    const multiSearch1 = document.getElementById('search-multi-type-1');
    multiSearch1.addEventListener('focus', () => onFocusAction(multiSearch1, TYPES, "types", "Enemy Type 1"));

    const multiSearch2 = document.getElementById('search-multi-type-2');
    multiSearch2.addEventListener('focus', () => onFocusAction(multiSearch2, TYPES, "types", "Enemy Type 2"));
}

export function loadMainKeyboardAction(e) {
    switch (e.key.toLowerCase()) {
        case "x":
            loadNextTopBarItem();
    }
}

export function loadMainGamepadAction(button) {
    switch (button) {
        case "X":
        case "SQUARE":
            loadNextTopBarItem();
            break;
        case "A":
        case "CROSS":
            mainConfirmAction();
            break;
        case "B":
        case "CIRCLE":
            mainBackAction();
            break;
        case "Y":
        case "TRIANGLE":
            clearConfirmAction();
            break;
    }
}

function onFocusAction(input, data, dataName, defaultPlaceholder) {
    if (!data) {
        input.placeholder = `Loading ${dataName}...`;
        input.blur();
        return;
    } else {
        if (input.placeholder !== defaultPlaceholder) {
            input.placeholder = defaultPlaceholder;
        }
    }
}