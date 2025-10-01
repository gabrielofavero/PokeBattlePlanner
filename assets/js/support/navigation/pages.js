export var ACTIVE_PAGE = 'main';
export const PAGES = {
    MAIN: 'main',
    SUMMARY: 'summary'
}

export var IS_LOADING = true;

export function setActivePage(value) {
    const acceptedValues = Object.values(PAGES);
    if (acceptedValues.includes(value)) {
        ACTIVE_PAGE = value;
    } else {
        console.warn(`Invalid page value: ${value}. Accepted values are: ${acceptedValues.join(", ")}`);
    }
}

export function startLoading() {
    load(true);
}

export function stopLoading() {
    load(false);
}

export function updateLoadingMessage(status) {
    const loading = document.getElementById('loading');
    loading.querySelector('.message').textContent = status || 'Loading';
}

function load(isLoading = true) {
    IS_LOADING = isLoading;
    for (const page of document.querySelectorAll('.page')) {
        switch (page.id) {
            case 'loading':
                page.style.display = isLoading ? '' : 'none';
                break;
            case ACTIVE_PAGE:
                page.style.display = isLoading ? 'none' : '';
                break;
            default:
                page.style.display = 'none';
        }
    }
}