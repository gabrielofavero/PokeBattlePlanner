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
    COMMON: 'flex',
    HIGHLIGHT: 'flex highlight',
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
    worstPokemons: 'Worst pokémons:'
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

    for (let j = 1; j <= properties.data.length; j++) {
        const innerID = `${properties.id}-${j}`;
        const item = buildItem(properties.data[j - 1], innerID);
        target.appendChild(item);
    }
}

export function getGridProperties(type = GRID_TYPES.COMMON, isFull = false) {
    return { type, isFull }
}

export function getIndicatorProperties(type, isPositive) {
    return { type, isPositive }
}

function buildItem({ grid, indicator, label }, innerID) {
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
        const typesContainer = getTypesContainer(label, innerID);
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

function getTypesContainer(label, innerID) {
    const typesDiv = document.createElement('div');
    typesDiv.className = 'types';

    const titleDiv = getTitleDiv(label);
    const resultDiv = getResultDiv(innerID);

    typesDiv.appendChild(titleDiv);
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