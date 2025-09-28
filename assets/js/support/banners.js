export function setTypeBannersWithoutLogo(target, types) {
    target.innerHTML = '';

    if (types.length == 0) {
        const div = getTypeBannerWithoutLogo('N/A');
        target.append(div);
    }

    for (const type of types) {
        const name = type?.type?.name || type?.name || 'N/A';
        const div = getTypeBannerWithoutLogo(name.toLowerCase());
        target.append(div);
    }
}

export function setTypeBannersMini(target, types) {
    target.innerHTML = '';

    for (const type of types) {
        const name = type?.name || type;
        const div = document.createElement('div');
        div.classList.add('type-banner', 'mini', name);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('summary-type-icon');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#type-${name}-icon`);

        svg.appendChild(use);
        div.appendChild(svg);
        target.appendChild(div);
    }
}

function getTypeBannerWithoutLogo(typeName) {
    const classType = typeName == 'N/A' ? 'none' : typeName;
    const div = document.createElement('div');
    div.classList.add('type-banner', classType);
    div.textContent = typeName;
    return div;
}
