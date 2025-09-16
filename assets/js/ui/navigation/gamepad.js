import { loadNextTopBarItem } from "./keyboard-mouse.js";

var GAMEPAD_MAP = ['A', 'B', 'X', 'Y'];

export function loadGamepadListeners() {
    window.addEventListener("gamepadconnected", (e) => {
        console.debug("Gamepad connected:", e.gamepad);
        loadGamepadType(e.gamepad.id);
        listenToGamepad(e.gamepad.index);
    });

    window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Gamepad disconnected:", e.gamepad);
    });
}

function listenToGamepad(index) {
    // Store the last state of buttons
    let prevButtons = [];

    function update() {
        const gamepad = navigator.getGamepads()[index];
        if (gamepad) {
            gamepad.buttons.forEach((btn, i) => {
                const prev = prevButtons[i]?.pressed || false;
                const curr = btn.pressed;

                if (curr && !prev) {
                    console.debug("Button pressed:", GAMEPAD_MAP[i]);
                    loadGamepadType(gamepad.id);
                    loadGamepadButtonPressing(GAMEPAD_MAP[i]);
                }
            });

            prevButtons = gamepad.buttons.map(b => ({ pressed: b.pressed }));
        }

        requestAnimationFrame(update);
    }
    update();
}

function detectController(id) {
    id = id.toLowerCase();
    if (id.includes("xbox")) return "Xbox";
    if (id.includes("playstation") || id.includes("dualshock") || id.includes("dualsense")) return "PlayStation";
    if (id.includes("switch") || id.includes("joy-con") || id.includes("pro controller")) return "Nintendo";
    if (id.includes("generic")) return "Generic Gamepad";
    return "Unknown Controller";
}

function loadGamepadButtonPressing(button) {
    switch (button) {
        case "X":
        case "SQUARE":
            loadNextTopBarItem();
    }

}

function loadGamepadType(id) {
    const type = detectController(id);
    loadGamepadMapping(type);
    loadGamepadIcons(type);
}

function loadGamepadMapping(type) {
    switch (type) {            
        case "Nintendo":
            GAMEPAD_MAP = ['B', 'A', 'Y', 'X'];
            break;
        case "Playstation":
            GAMEPAD_MAP = ['CROSS', 'CIRCLE', 'SQUARE', 'TRIANGLE'];
            break;
        default:
            GAMEPAD_MAP = ['A', 'B', 'X', 'Y'];
    }
}

function loadGamepadIcons(type) {
    switch (type) {            
        case "Playstation":
            replaceButtonIcon('a', 'cross');
            replaceButtonIcon('b', 'circle');
            replaceButtonIcon('x', 'square');
            replaceButtonIcon('y', 'triangle');
            break;
        default:
            replaceButtonIcon('a', 'a');
            replaceButtonIcon('b', 'b');
            replaceButtonIcon('x', 'x');
            replaceButtonIcon('y', 'y');
    }

    function replaceButtonIcon(id, icon) {
        document.querySelectorAll(`svg.${id}-button use`).forEach(useEl => {
          useEl.setAttribute("href", `#${icon}-button-icon`);
        });
      }
}

