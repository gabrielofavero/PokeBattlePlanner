import { setTypeBannersMini } from "../banners.js";
import { getChevron, loadAccordionListener } from "../components/accordion.js";

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
    buildAccordionPreviews(document.getElementById(properties.id));
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

        const headerIcons = document.createElement('div');
        headerIcons.className = 'accordion-header-icons';

        const preview = document.createElement('div');
        preview.className = 'accordion-preview';

        const headerChevron = getChevron();
        headerIcons.appendChild(preview);
        headerIcons.appendChild(headerChevron);

        header.appendChild(headerLabel);
        header.appendChild(headerIcons);

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

function buildAccordionPreviews(target) {
    const accordions = target.querySelectorAll('.accordion-item');
    for (const accordion of accordions) {
        const gridItems = accordion.querySelectorAll('.grid-item');
        for (const gridItem of gridItems) {
            if (!gridItem) {
                continue;
            }

            if (gridItem.classList.contains('result') || gridItem.querySelector('.positive')) {
                const types = Array.from(gridItem.querySelectorAll('.type-banner')).map(b => b.classList[1]).filter(c => c !== 'none');
                if (types.length === 0) {
                    continue;
                }
                const preview = accordion.querySelector('.accordion-preview');
                setTypeBannersMini(preview, types);
                break;
            }
        }
    }
}