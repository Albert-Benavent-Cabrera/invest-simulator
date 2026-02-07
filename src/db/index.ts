import 'server-only';

/**
 * Database Configuration
 * Behavior:
 * - In local development (NODE_ENV !== 'production' or DATABASE_URL starts with 'file:'),
 *   use the native @libsql/client and the native drizzle-orm/libsql which can work
 *   with a file-based database (file:). This keeps the local behavior as before.
 * - In production (or on Vercel), use the web client `@libsql/client/web` and
 *   `drizzle-orm/libsql/web` to avoid native binaries in serverless bundles.
 */

import * as schema from './schema';
import path from 'node:path';
import fs from 'node:fs';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const isProd = process.env.NODE_ENV === 'production' || isVercel;

// Use `any` here because client/db are created via dynamic imports
// and have complex driver-specific types that are difficult to express.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

if (!isProd && (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:'))) {
  // Local file DB: use native client and native drizzle
  const { createClient } = await import('@libsql/client');
  const { drizzle } = await import('drizzle-orm/libsql');
  // Ensure `src/db` directory exists and use `src/db/database-local` as local DB file
  const dbDir = path.resolve(process.cwd(), 'src', 'db');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  const localFile = path.join(dbDir, 'database-local');
  const localUrl = process.env.DATABASE_URL || `file:${localFile}`;
  console.info('[DB] Using native libsql client for local file DB:', localUrl);

  client = createClient({ url: localUrl });
  db = drizzle(client, { schema });
} else {
  // Production / Vercel: use web client
  const DATABASE_URL = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is required in production. ' +
      'Set it to your Turso database URL (libsql://your-db.turso.io)'
    );
  }

  const { createClient } = await import('@libsql/client/web');
  const { drizzle } = await import('drizzle-orm/libsql/web');

  console.info('[DB] Using web client with Turso');
  console.info('[DB] DATABASE_URL:', DATABASE_URL.split('?')[0]);

  client = createClient({ url: DATABASE_URL, authToken });
  db = drizzle(client, { schema });
}

export { db };

let initialized = false;

// Initialization logic
export async function initDb() {
  if (initialized) return;
  await client.execute(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY,
      balance REAL NOT NULL DEFAULT 100000
    );
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS assets (
      symbol TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      avgPrice REAL NOT NULL,
      totalInvested REAL NOT NULL
    );
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      symbol TEXT NOT NULL,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      date TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );
  `);

  try {
    // Use a safe insert that ignores duplicates to avoid races when dev server
    // spawns multiple workers or restarts.
    await client.execute(`INSERT OR IGNORE INTO portfolio (id, balance) VALUES (1, 100000);`);
  } catch (e) {
    console.error('Failed to seed DB:', e);
  }
  initialized = true;
}
