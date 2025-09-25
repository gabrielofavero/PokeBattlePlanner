export function setTypeBannersWithoutLogo(target, types) {
    target.innerHTML = '';

    if (types.length == 0) {
        const div = getTypeBannerWithoutLogo('N/A');
        target.append(div);
    }

    for (const type of types) {
        const div = getTypeBannerWithoutLogo(type.name.toLowerCase());
        target.append(div);
    }
}

export function setTypeBannersMini(target, types) {
    target.innerHTML = '';
    let innerHTML = '';
    for (const type of types) {
        innerHTML += `
        <div class="type-banner mini ${type.name.toLowerCase()}">
            <svg class="summary-type-icon">
                <use href="#type-${type.name.toLowerCase()}-icon" />
            </svg>
        </div>`
    }
    target.innerHTML = innerHTML;
}

function getTypeBannerWithoutLogo(typeName) {
    const classType = typeName == 'N/A' ? 'none' : typeName;
    const div = document.createElement('div');
    div.classList.add('type-banner', classType);
    div.textContent = typeName;
    return div;
}
