export var ACTIVE_PAGE = 'main';
export const PAGES = {
    MAIN: 'main',
    SUMMARY: 'summary'
}

export function setActivePage(value) {
    const acceptedValues = Object.values(PAGES);
    if (acceptedValues.includes(value)) {
        ACTIVE_PAGE = value;
    } else {
        console.warn(`Invalid page value: ${value}. Accepted values are: ${acceptedValues.join(", ")}`);
    }
}