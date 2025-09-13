export function openContextMenu(contextMenu, toOpen) {
    toOpen.classList.add('selected');
    contextMenu.style.display = '';
}

export function closeContextMenu(contextMenu, toClose) {
    if (!toClose) {
        return;
    }
    toClose.classList.remove('selected');
    contextMenu.style.display = 'none';
}