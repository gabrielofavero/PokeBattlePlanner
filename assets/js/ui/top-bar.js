const items = document.querySelectorAll(".top-bar-item");

export function loadTopBar() {
    // Add mouse click support
    items.forEach(item => {
        item.addEventListener("click", () => activateItem(item));
    });

    // Add keyboard support (press "x" or "X")
    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === "x") {
            const active = document.activeElement;
            const isTyping =
                active && (
                    active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA" ||
                    active.isContentEditable
                );
    
            if (isTyping) return; // don't trigger if user is typing
    
            const selected = document.querySelector(".top-bar-item.selected");
            let next = selected?.nextElementSibling;
            if (!next || !next.classList.contains("top-bar-item")) {
                next = items[0]; // loop back to first
            }
            activateItem(next);
        }
    });

    // Add gamepad support (polls every frame)
    requestAnimationFrame(pollGamepad);
}

function activateItem(item) {
    if (!item) return;

    // 1. Remove selected from all items
    items.forEach(i => i.classList.remove("selected"));

    // 2. Add selected to clicked one
    item.classList.add("selected");

    // 3. Hide all content sections
    items.forEach(i => {
        const sectionId = i.getAttribute("to-show");
        const section = document.getElementById(sectionId);
        if (section) section.style.display = "none";
    });

    // 4. Show the clicked one’s content
    const targetId = item.getAttribute("to-show");
    const target = document.getElementById(targetId);
    if (target) target.style.display = "flex";
}

function pollGamepad() {
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
        const gp = gamepads[0];
        // Button 2 is usually "X" on Xbox-style controllers
        if (gp.buttons[2].pressed) {
            const selected = document.querySelector(".top-bar-item.selected");
            let next = selected?.nextElementSibling;
            if (!next || !next.classList.contains("top-bar-item")) {
                next = items[0];
            }
            activateItem(next);
        }
    }
    requestAnimationFrame(pollGamepad);
}