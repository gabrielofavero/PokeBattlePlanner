
// Objects
export async function getJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

// Strings
export function firstCharToUppercase(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

// Colors
export function hexToRgb(hex) {
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}

export function rgbToHex([r, g, b]) {
    return (r << 16) + (g << 8) + b;
}

export function lerpColor(c1, c2, t) {
    return [
        Math.round(c1[0] + (c2[0] - c1[0]) * t),
        Math.round(c1[1] + (c2[1] - c1[1]) * t),
        Math.round(c1[2] + (c2[2] - c1[2]) * t),
    ];
}