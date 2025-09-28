import { loadPokemons } from "./pokemon.js";
import { loadTypes } from "./type.js";

const DB_NAME = "PokeCache";
const STORE_NAME = "cache";
const DB_VERSION = 1;

// Data
export async function loadExternalData() {
    openDB();
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

// Database
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getDB(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);

        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => reject(req.error);
    });
}

export async function setDB(key, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);

        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}

// Objects
export async function getObjectData(prefix, obj) {
    const start = new Date().getTime();
    const key = `${prefix}-${obj.name}`;
    const cachedData = await getDB(key);

    if (cachedData) {
        return cachedData;
    }

    const data = await fetchFullPath(obj.url);

    const end = new Date().getTime();
    console.log(`Loaded data for ${getObjectName(obj)} in ${(end - start) / 1000} seconds.`);

    await setDB(key, data);
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