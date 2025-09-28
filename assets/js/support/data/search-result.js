export const INDICATORS = {
    "4": {
        value: '4×',
        isFraction: false
    },
    "2": {
        value: '2×',
        isFraction: false
    },
    "0.5": {
        value: '½',
        isFraction: true
    },
    "0.25": {
        value: '¼',
        isFraction: true
    }
}

export const GRID_TYPES = {
    COMMON: '',
    HIGHLIGHT: 'highlight',
    RESULT: 'result'
}

export const LABELS = {
    to: 'Damage to:',
    from: 'Damage from:',
    cantDamage: "Can't damage:",
    immuneTo: 'Immune to:',
    bestTypes: 'Best types:',
    worstTypes: 'Worst types:',
    bestPokemons: 'Best pokémons:',
    worstPokemons: 'Worst pokémons:',
    recommendations: 'Recommendations:'
}

export function setSearchResult(data, properties, action) {
    buildSearchResult(properties);
    for (let i = 0; i < data.length; i++) {
        const target = document.getElementById(`${properties.id}-${i + 1}`);
        action(target, data[i]);
    }
}

export function buildSearchResult(properties) {
    const target = document.getElementById(properties.id);
    target.innerHTML = '';

    if (properties.accordionSections != undefined) {
        buildSearchResultWithAccordion(target, properties);
        return;
    }

    buildSearchResultWithoutAccordion(target, properties);
}

function buildSearchResultWithAccordion(target, properties) {
    target.classList.add('accordion');
    const accordions = [];
    const accordionPositions = [];

    for (const section of properties.accordionSections) {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        const header = document.createElement('div');
        header.className = 'accordion-header';
        const headerLabel = document.createElement('span');
        headerLabel.textContent = section.label;
        const headerChevron = getChevron();
        header.appendChild(headerLabel);
        header.appendChild(headerChevron);
        loadAccordionListener(header);

        const content = document.createElement('div');
        content.className = 'accordion-content';
        const start = section.start;
        const end = section.end;
        const hideLabel = section.hideLabel === undefined ? true : section.hideLabel;
        accordionPositions.push({ start, end });
        for (let j = start; j <= end; j++) {
            buildSearchResultItem(content, properties, j, hideLabel);
        }

        item.appendChild(header);
        item.appendChild(content);
        accordions.push(item);
    }

    let p = 0;
    let isInAccordion = false;
    for (let j = 1; j <= properties.data.length; j++) {
        if (accordionPositions[p]?.start == j) {
            target.appendChild(accordions[p]);
            isInAccordion = true;
            continue;
        }

        if (isInAccordion && accordionPositions[p]?.end == j) {
            p++;
            isInAccordion = false;
            continue;
        }

        if (!isInAccordion) {
            buildSearchResultItem(target, properties, j);
        }
    }
}

function buildSearchResultWithoutAccordion(target, properties) {
    for (let j = 1; j <= properties.data.length; j++) {
        buildSearchResultItem(target, properties, j);
    }
}

function buildSearchResultItem(target, properties, j, hideLabel = false) {
    const innerID = `${properties.id}-${j}`;
    const item = buildItem(properties.data[j - 1], innerID, hideLabel);
    target.appendChild(item);

}

export function getGridProperties(type = GRID_TYPES.COMMON, isFull = false) {
    return { type, isFull }
}

export function getIndicatorProperties(type, isPositive) {
    return { type, isPositive }
}

function buildItem({ grid, indicator, label }, innerID, hideLabel = false) {
    const gridItem = getGridItem(grid.type, grid.isFull);

    if (indicator != undefined) {
        const indicatorDiv = getIndicator(indicator.type, indicator.isPositive);
        gridItem.appendChild(indicatorDiv);
    }

    if (grid.type === GRID_TYPES.HIGHLIGHT) {
        const titleDiv = getTitleDiv(label);
        gridItem.appendChild(titleDiv);

        const resultDiv = getResultDiv(innerID);
        gridItem.appendChild(resultDiv);
    } else {
        const typesContainer = getTypesContainer(label, innerID, hideLabel);
        gridItem.appendChild(typesContainer);
    }

    return gridItem;
}

function getGridItem(gridType, isfull) {
    const full = isfull ? ' full' : '';
    const div = document.createElement('div');
    div.className = `grid-item ${gridType}${full}`;
    return div;
}

function getIndicator(type, isPositive) {
    const polarity = isPositive == null ? '' : isPositive ? 'positive' : 'negative';
    const fractionClass = type.isFraction ? ' fraction' : '';
    const div = document.createElement('div');
    div.className = `${polarity}${fractionClass}`;
    div.textContent = type.value;
    return div;
}

function getTypesContainer(label, innerID, hideLabel = false) {
    const typesDiv = document.createElement('div');
    typesDiv.className = 'types';

    if (!hideLabel) {
        const titleDiv = getTitleDiv(label);
        typesDiv.appendChild(titleDiv);
    } else {
        typesDiv.classList.add('no-label');
    }

    const resultDiv = getResultDiv(innerID);
    typesDiv.appendChild(resultDiv);

    return typesDiv;
}

function getTitleDiv(label) {
    const div = document.createElement('div');
    div.className = 'result-title';
    div.textContent = label;
    return div;
}

function getResultDiv(innerID) {
    const div = document.createElement('div');
    div.className = 'result-types';
    div.id = innerID;
    return div;
}

function loadAccordionListener(header) {
    header.addEventListener("click", () => {
        const content = header.nextElementSibling;

        if (content.style.maxHeight) {
            closeAccordion(header, content);
        } else {
            document.querySelectorAll(".accordion-item").forEach(item => {
                const otherHeader = item.firstChild;
                const otherContent = otherHeader.nextElementSibling;
                closeAccordion(otherHeader, otherContent);
            });
            openAccordion(header, content);
        }
    });
}

function openAccordion(header, content) {
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

function closeAccordion(header, content) {
    content.style.maxHeight = null;
    content.classList.remove("open");
    header.classList.remove("open");
    header.style.borderBottomLeftRadius = '6px';
    header.style.borderBottomRightRadius = '6px';
}

function getChevron() {
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