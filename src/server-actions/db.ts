'use server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dbPromise: Promise<any> | null = null;

export async function getDb() {
    if (dbPromise) return dbPromise;

    dbPromise = (async () => {
        try {
            const { db, initDb } = await import('../db');
            await initDb();
            return db;
        } catch (e) {
            console.error('[getDb] Database initialization failed:', e);
            throw e;
        }
    })();

    return dbPromise;
}
