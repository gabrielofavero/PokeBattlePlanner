export function loadAccordionListener(header) {
    header.addEventListener("click", () => loadAccordionListenerAction(header));
}

export function loadAccordionListenerAction(header) {
    const content = header.nextElementSibling;
    if (content.style.maxHeight) {
        closeAccordion(header, content);
    } else {
        const items = header.parentElement.querySelectorAll(".accordion-item");
        if (items.length > 1) {
            items.forEach(item => {
                const otherHeader = item.firstChild;
                const otherContent = otherHeader.nextElementSibling;
                closeAccordion(otherHeader, otherContent);
            });
        }
        openAccordion(header, content);
    }
}

export function openAccordion(header, content) {
    if (!content) {
        content = header.nextElementSibling;
    }
    content.style.maxHeight = (content.scrollHeight + 24 + 12) + "px";
    content.classList.add("open");
    header.classList.add("open");
    header.style.borderBottomLeftRadius = '0px';
    header.style.borderBottomRightRadius = '0px';
}

export function openFirstAccordion(target) {
    const firstHeader = target.querySelector(".accordion-header");
    if (firstHeader) {
        const firstContent = firstHeader.nextElementSibling;
        openAccordion(firstHeader, firstContent);
    }
}

export function closeAccordion(header, content) {
    content.style.maxHeight = null;
    content.classList.remove("open");
    header.classList.remove("open");
    header.style.borderBottomLeftRadius = '6px';
    header.style.borderBottomRightRadius = '6px';
}

export function getChevron() {
    const iconBox = document.createElement('div');
    iconBox.className = 'icon-box';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#chevron-icon');

    svg.appendChild(use);
    iconBox.appendChild(svg);

    return iconBox;
}