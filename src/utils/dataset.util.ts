import type { Dataset } from "@/types";
import { SEVEN_SEGMENT_DIGIT_MAPS } from "./seven-segment.util";

const DB_NAME = "seven-segment-db";
const DB_VERSION = 1;
const STORE_NAME = "images";

/**
 * Open (or create) database
 */
function openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                window['_flag_db_is_just_created'] = true
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                })
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
/**
 * Save image to IndexedDB
 * @param {number} digit
 * @param {Blob} blob
 * @param {"default" | "user"} source
 */
export async function addSample(sample: Omit<Dataset, 'id'>, useDb?: IDBDatabase) {
    const db = useDb ?? await openDB();

    return new Promise<Dataset>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.add(sample)
        tx.oncomplete = (ev) => resolve(
            Object.assign(sample, { id: ev.target['result'] })
        )
        tx.onerror = () => reject(tx.error);
    });
}
/**
 * Load all images from IndexedDB
 * @returns {Promise<Array>}
 */
export async function getAllSamples(useDb?: IDBDatabase) {
    const db = useDb ?? await openDB();

    return new Promise<Dataset[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Remove image for a digit
 * @param {number} digit
 */
export async function deleteSample(id: number) {
    const db = await openDB();

    await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve(undefined);
        tx.onerror = () => reject(tx.error);
    });
    const samples = await getAllSamples(db)
    db.close()
    return samples
}

export async function clearSamples(): Promise<void> {
    const db = await openDB()

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite")
        const store = tx.objectStore(STORE_NAME)

        const req = store.clear()

        req.onsuccess = () => { resolve(); db.close() }
        req.onerror = () => { reject(req.error); db.close() }
    })
}

export async function importPredefined() {
    const records = SEVEN_SEGMENT_DIGIT_MAPS.map((segments, digit) => ({
        digit,
        segments,
        createdAt: new Date()
    }))
    const db = await openDB()
    for (const record of records) {
        await addSample(record, db)
    }
    const samples = await getAllSamples(db)
    db.close()
    return samples
}