const PAGES = document.querySelectorAll('.content');

export function loadTopBar() {
    // Mouse Support
    document.querySelectorAll(".top-bar-item").forEach(item => {
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

    document.querySelectorAll(".top-bar-item").forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");

    goToPage(document.getElementById(item.getAttribute("to-show")));
}


export function goToPage(page) {
    for (const content of PAGES) {
        content.style.display = "none";
    }
    page.style.display = 'flex';
}
