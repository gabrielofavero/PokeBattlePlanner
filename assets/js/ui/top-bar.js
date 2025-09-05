const items = document.querySelectorAll(".top-bar-item");

export function loadTopBar() {
    // Mouse Support
    items.forEach(item => {
        item.addEventListener("click", () => selectTopBarItem(item));
    });

    // Keyboard Support
    document.addEventListener("keydown", e => {
        if (isTyping()) return;
        switch (e.key.toLowerCase()) {
            case "x":
                loadNextTopBarItem();
        }
    });
}

export function loadNextTopBarItem() {
    const selected = document.querySelector(".top-bar-item.selected");
    let next = selected?.nextElementSibling;
    if (!next || !next.classList.contains("top-bar-item")) {
        next = items[0]; // loop back to first
    }
    selectTopBarItem(next);
}

function isTyping() {
    const active = document.activeElement;
    return active && (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable
        );
}

function selectTopBarItem(item) {
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