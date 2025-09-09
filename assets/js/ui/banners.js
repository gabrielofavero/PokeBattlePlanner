export function loadTypeContentBanners(id, types) {
    const target = document.getElementById(id);
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

function getTitleBanner(type) {
    const div = document.createElement('div');
    div.classList.add('type-banner', 'title', type);

    const img = document.createElement('img');
    img.classList.add('icon');
    img.src = `./assets/img/types/${type}.svg`

    const span = document.createElement('span');
    span.textContent = type;

    div.append(img);
    div.append(span);

    return div
}
