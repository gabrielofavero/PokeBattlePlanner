export function loadSummaryInfo() {
    loadTopMenuItem(0);
}

export function loadMovesInfo() {
    loadTopMenuItem(1);
    loadMovesRadar();
}

function loadTopMenuItem(index) {
    for (let i = 0; i < TOP_MENU_ICONS.length; i++) {
        const icon = TOP_MENU_ICONS[i];
        if (i === index) {
            icon.content.style.display = ''
            icon.icon.classList.add('selected');
        } else {
            icon.content.style.display = 'none'
            icon.icon.classList.remove('selected');
        }
    }
}