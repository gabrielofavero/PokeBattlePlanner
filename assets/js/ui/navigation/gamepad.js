import { loadMainGamepadAction } from "../../pages/main/support/navigation.js";
import { loadSummaryGamepadAction } from "../../pages/summary/support/navigation.js";
import { ACTIVE_PAGE } from "./pages.js";

var GAMEPAD_MAP = ['A', 'B', 'X', 'Y'];
const DPAD_MAP = {
    12: "UP",
    13: "DOWN",
    14: "LEFT",
    15: "RIGHT"
};

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
    let prevButtons = [];
    let prevAxes = [0, 0];

    function update() {
        const gamepad = navigator.getGamepads()[index];
        if (gamepad) {
            // Handle buttons
            gamepad.buttons.forEach((btn, i) => {
                const prev = prevButtons[i]?.pressed || false;
                const curr = btn.pressed;

                if (curr && !prev) {
                    let buttonName;

                    if (i < GAMEPAD_MAP.length) {
                        buttonName = GAMEPAD_MAP[i];
                    } else if (DPAD_MAP[i]) {
                        buttonName = DPAD_MAP[i];
                    }

                    if (buttonName) {
                        console.debug("Button pressed:", buttonName);
                        loadGamepadType(gamepad.id);
                        loadGamepadButtonPressing(buttonName);
                    }
                }
            });

            // Handle left analog stick (axes[0], axes[1])
            const DEADZONE = 0.3;
            const [x, y] = gamepad.axes;

            const dirX = Math.abs(x) > DEADZONE ? (x < 0 ? "LEFT" : "RIGHT") : null;
            const dirY = Math.abs(y) > DEADZONE ? (y < 0 ? "UP" : "DOWN") : null;

            // Trigger only on change (avoid constant spam)
            if (dirX && dirX !== prevAxes[0]) {
                console.debug("Analog moved:", dirX);
                loadGamepadButtonPressing(dirX);
            }
            if (dirY && dirY !== prevAxes[1]) {
                console.debug("Analog moved:", dirY);
                loadGamepadButtonPressing(dirY);
            }

            prevAxes = [dirX, dirY];
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
    switch (ACTIVE_PAGE) {
        case 'main':
            loadMainGamepadAction(button);
            break;
        case 'summary':
            loadSummaryGamepadAction(button);
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

