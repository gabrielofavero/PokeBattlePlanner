import { loadNextTopBarItem } from "./top-bar.js";

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
    }
}