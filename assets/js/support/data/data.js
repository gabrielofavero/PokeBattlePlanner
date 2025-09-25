import { loadPokemons } from "./pokemon.js";
import { loadTypes } from "./type.js";

// Data
export async function loadExternalData() {
    loadPokemons();
    loadTypes();
}

export async function fetchFullPath(fullPath) {
    try {
        const res = await fetch(fullPath);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json;
    } catch (err) {
        console.error('Request failed:', err);
    }
}

// Objects
export async function getObjectData(prefix, obj) {
    const start = new Date().getTime();
    const key = `${prefix}-${getObjectName(obj)}`;
    const cachedData = localStorage.getItem(key);
    
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await fetchFullPath(obj.url);
    
    const end = new Date().getTime();
    console.log(`Loaded data for ${getObjectName(obj)} in ${(end - start) / 1000} seconds.`);
    
    localStorage.setItem(key, JSON.stringify(data));
    return data;
}

export function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function getObjectName(objData) {
    return decodeTitle(objData?.name ?? "");
}

// Arrays
export function getTopN(arr, n) {
    const unique = [];
    for (const item of arr) {
        if (!unique.some(u => u.score === item.score)) {
            unique.push(item);
        }
        if (unique.length >= n) break;
    }
    return unique;
}

// Strings
export function firstCharToUppercase(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function decodeTitle(title) {
    return title.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

// Search Result
export function setSearchResult(data, targetPrefix, action) {
    for (let i = 0; i < data.length; i++) {
        const target = document.getElementById(`${targetPrefix}-${i + 1}`);
        action(target, data[i]);
    }
}