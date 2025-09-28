import { loadAccordionListenerAction } from "../../../support/components/accordion.JS";

// Example: listen for when viewport goes below 768px
const mediaQuery = window.matchMedia("(max-width: 575px)");
var IS_MOBILE = false;

export function loadDeviceResponsiviness() {
    mediaQuery.addEventListener("change", handleViewportChange);
    
    handleViewportChange(mediaQuery);
    loadPartyListener();
}

function handleViewportChange(e) {
  if (e.matches) {
    IS_MOBILE = true
  } else {
    IS_MOBILE = false;
  }
    loadLayout();
}

function loadLayout() {
    loadPartyLayout();

    const searchText = document.getElementById('party-pokemon-content').querySelector('.search-text');
    if (IS_MOBILE) {
        searchText.textContent = "Species";
    } else {
        searchText.textContent = "Pokémon Species";
    }
}

function loadPartyListener() {
    const header = document.getElementById('party-box-header');
    header.addEventListener('click', () => {
        if (IS_MOBILE) {
            loadAccordionListenerAction(header);
        }
    });
}

function loadPartyLayout() {
    const column = document.getElementById('party-column');
    column.className = IS_MOBILE ? 'accordion' : 'column';

    const partyBox = document.getElementById('party-box');
    partyBox.className = IS_MOBILE ? 'accordion-item' : '';

    const header = document.getElementById('party-box-header');
    header.className = IS_MOBILE ? 'accordion-header' : 'pill-container'

    const content = document.getElementById('party-box-content');
    content.className = IS_MOBILE ? 'accordion-content' : 'party-pokemons';

    document.getElementById('party-box-chevron').style.display = IS_MOBILE ? 'block' : 'none';

    if (!IS_MOBILE) {
        header.classList.remove("open");
        header.style.borderBottomLeftRadius = null;
        header.style.borderBottomRightRadius = null;
        const content = header.nextElementSibling;
        content.style.maxHeight = null;
    }
}