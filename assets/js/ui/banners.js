export function loadTypeContentBanners(target, types) {
    target.innerHTML = '';

    if (types.length == 0) {
        const div = getTypeBannerElement('N/A');
        target.append(div);
    }

    for (const type of types) {
        const div = getTypeBannerElement(type);
        target.append(div);
    }
}


function getTypeBannerElement(type) {
    const classType = type == 'N/A' ? 'none' : type;
    const div = document.createElement('div');
    div.classList.add('type-banner', classType);
    div.textContent = type;
    return div;
}
