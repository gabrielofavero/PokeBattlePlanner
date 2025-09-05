export function getTypeBannerElement(type) {
    const classType = type == 'N/A' ? 'none' : type;
    const div = document.createElement('div');
    div.classList.add('type-banner', classType);
    div.textContent = type;
    return div;
  }