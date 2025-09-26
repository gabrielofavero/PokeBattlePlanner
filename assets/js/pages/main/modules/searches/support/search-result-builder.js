const INDICATORS = {
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

const GRID_TYPES = {
    FLEX: 'flex',
    HIGHLIGHT: 'highlight',
    RESULT: 'result'
}

const LABELS = {
    to: 'Damage to:',
    from: 'Damage from:',
    cantDamage: "Can't damage:",
    immune: 'Immune from:',
    bestTypes: 'Best types:',
    worstTypes: 'Worst types:',
    bestPokemons: 'Best pokémons:',
    worstPokemons: 'Worst pokémons:'
}


export function buildSingleSearch(target, prefix) {
    target.innerHTML = '';
    let j = 1;
    const items = [];

    items.push(buildItem(GRID_TYPES.FLEX, false, INDICATORS['2'], true, LABELS.from, `${prefix}-${j++}`));
    items.push(buildItem(GRID_TYPES.FLEX, false, INDICATORS['0.5'], true, LABELS.to, `${prefix}-${j++}`));
    items.push(buildItem(GRID_TYPES.FLEX, false, INDICATORS['0.5'], false, LABELS.from, `${prefix}-${j++}`));
    items.push(buildItem(GRID_TYPES.FLEX, false, INDICATORS['2'], false, LABELS.to, `${prefix}-${j++}`));
    items.push(buildItem(GRID_TYPES.HIGHLIGHT, false, null, null, LABELS.cantDamage, `${prefix}-${j++}`));
    items.push(buildItem(GRID_TYPES.HIGHLIGHT, false, null, null, LABELS.immune, `${prefix}-${j++}`));
    items.push(buildItem(GRID_TYPES.RESULT, false, null, null, LABELS.bestTypes, `${prefix}-${j++}`));
    items.push(buildItem(GRID_TYPES.RESULT, false, null, null, LABELS.worstTypes, `${prefix}-${j++}`));

    for (const item of items) {
        target.appendChild(item);
    }
}

function buildItem(gridType, isFull, indicator, isPositive, title, id) {
    const gridItem = buildGridItem(gridType, isFull);
    
    if (indicator != null) {
        const indicatorDiv = buildIndicator(indicator, isPositive);
        gridItem.appendChild(indicatorDiv);
    }

    const typesContainer = buildTypesContainer(title, id);
    gridItem.appendChild(typesContainer);
    return gridItem;
}

function buildGridItem(gridType, isfull) {
    const full = isfull ? ' full' : '';
    const div = document.createElement('div');
    div.className = `grid-item ${gridType}${full}`;
}

function buildIndicator(indicator, isPositive) {
    const polarity = isPositive == null ? '' : isPositive ? 'positive' : 'negative';
    const fractionClass = indicator.isFraction ? ' fraction' : '';
    const div = document.createElement('div');
    div.className = `${polarity}${fractionClass}`;
    div.textContent = indicator.value;
}

function buildTypesContainer(title, id) {
    const typesDiv = document.createElement('div');
    typesDiv.className = 'types';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'result-title';
    titleDiv.textContent = title;
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-types';
    resultDiv.id = id;
    
    typesDiv.appendChild(titleDiv);
    typesDiv.appendChild(resultDiv);
    
    return typesDiv;
}

<div class="grid-item flex">
<div class="positive fraction">½</div>
<div class="types">
  <div class="result-title">Damage to:</div>
  <div class="result-types" id="single-type-result-2"></div>
</div>
</div>