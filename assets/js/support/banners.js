export function setTypeBannersWithoutLogo(target, types) {
    target.innerHTML = '';

    if (types.length == 0) {
        const div = getTypeBannerWithoutLogo('N/A');
        target.append(div);
    }

    for (const type of types) {
        const div = getTypeBannerWithoutLogo(type);
        target.append(div);
    }
}

function getTypeBannerWithoutLogo(type) {
    const classType = type == 'N/A' ? 'none' : type;
    const div = document.createElement('div');
    div.classList.add('type-banner', classType);
    div.textContent = type;
    return div;
}
