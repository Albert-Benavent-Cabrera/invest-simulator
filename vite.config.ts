import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Plugin to replace all @libsql/client imports with @libsql/client/web
 * This ensures drizzle-orm and dependencies ONLY use the web client
 */
function libsqlWebPlugin() {
    return {
        name: 'libsql-web-plugin',
        resolveId(id: string) {
            // Redirect @libsql/client to @libsql/client/web
            if (id === '@libsql/client') {
                return '@libsql/client/web';
            }
        },
        transform(code: string, id: string) {
            // Also handle cases where code contains require('@libsql/client')
            if (code.includes('@libsql/client') && !code.includes('@libsql/client/web')) {
                return {
                    code: code.replace(/@libsql\/client(?!\/web)/g, '@libsql/client/web'),
                };
            }
        },
    };
}

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    ["babel-plugin-react-compiler", { target: "19" }],
                ],
            },
        }),
        libsqlWebPlugin()
    ],
    resolve: {
        alias: (() => {
            const base = {
                '@': path.resolve(process.cwd(), './src')
            } as Record<string, string>;

            // In production (or on Vercel) force the web client to avoid native binaries
            const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
            const isProd = process.env.NODE_ENV === 'production' || isVercel;
            if (isProd) {
                base['@libsql/client'] = '@libsql/client/web';
            }

            return base;
        })(),
    },
    // Load all environment variables, not just VITE_ prefixed ones
    envPrefix: process.env.VITEST ? 'VITE_' : '',
    ssr: {
        // Bundle the web client - it's pure JS and required for database access
        noExternal: ['@libsql/client/web'],
        // Never try to bundle the native client package
        external: [
            '@libsql/client',
            '@libsql/client-linux-x64-gnu',
            '@libsql/client-darwin-arm64',
            '@libsql/client-win32-x64-msvc',
        ],
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
            // Tell rollup that @libsql/client should be dynamically required, not bundled
            ignoreDynamicRequires: false,
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate the web client into its own chunk
                    libsql: ['@libsql/client/web'],
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/vitest.setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
});