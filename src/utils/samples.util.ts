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
export async function addSample(sample: any) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        store.put({
            ...sample,
            createdAt: new Date()
        });

        tx.oncomplete = () => resolve(undefined);
        tx.onerror = () => reject(tx.error);
    });
}
/**
 * Load all images from IndexedDB
 * @returns {Promise<Array>}
 */
export async function getAllSamples() {
    const db = await openDB()

    return new Promise<any[]>((resolve, reject) => {
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
export async function deleteSample(id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve(undefined);
        tx.onerror = () => reject(tx.error);
    });
}

/**
 * Check whether image store is empty
 * @returns {Promise<boolean>}
 */
async function isSampleStoreEmpty() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const countReq = store.count();

        countReq.onsuccess = () => resolve(countReq.result === 0);
        countReq.onerror = () => reject(countReq.error);
    });
}
/**
 * Load default URL of image list
 */
export function loadSamples() {
    const resolves = Object.values(import.meta.glob('@/samples/*.png', {
        eager: true,
        query: '?url',
        import: 'default'
    }) as Record<string, string>)

    return resolves
}