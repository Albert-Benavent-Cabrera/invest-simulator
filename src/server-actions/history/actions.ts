'use server'

import { getDb } from '../db'
import { fetchBatchSpark } from '../functions/finance'
import { IHistoryPoint } from '../../models/IInvest'
import { getPortfolio } from '../home/actions'

const HISTORY_TTL = 10 * 60 * 1000;
const historyCache: Record<string, { promise: Promise<IHistoryPoint[]>; timestamp: number }> = {};

export async function getBatchHistory(symbols: string[], range: string = '1mo'): Promise<Record<string, IHistoryPoint[]>> {
    const now = Date.now();
    const results: Record<string, IHistoryPoint[]> = {};
    const symbolsToFetch: string[] = [];

    symbols.forEach(s => {
        const cacheKey = `${s}-${range}`;
        const cached = historyCache[cacheKey];
        if (!cached || (now - cached.timestamp >= HISTORY_TTL)) {
            symbolsToFetch.push(s);
        }
    });

    try {
        if (symbolsToFetch.length > 0) {
            const batchPromise = (async () => {
                const batchData = await fetchBatchSpark(symbolsToFetch, range);
                Object.entries(batchData).forEach(([symbol, data]) => {
                    const rawHistory = data.history;
                    const decimatedHistory: IHistoryPoint[] = rawHistory
                        .filter((_, idx) => idx % 4 === 0 || idx === rawHistory.length - 1)
                        .map((h) => ({
                            date: h.date.toISOString().split('T')[0],
                            price: h.close || 0
                        }));
                    historyCache[`${symbol}-${range}`] = {
                        promise: Promise.resolve(decimatedHistory),
                        timestamp: Date.now()
                    };
                });
                return batchData;
            })();

            symbolsToFetch.forEach(s => {
                const cacheKey = `${s}-${range}`;
                historyCache[cacheKey] = {
                    promise: batchPromise.then(res => {
                        const data = res[s];
                        return data.history.map((h) => ({
                            date: h.date.toISOString().split('T')[0],
                            price: h.close || 0
                        }));
                    }).catch(() => []),
                    timestamp: now
                };
            });
            await batchPromise;
        }

        for (const s of symbols) {
            const cacheKey = `${s}-${range}`;
            results[s] = await (historyCache[cacheKey]?.promise || Promise.resolve([]));
        }
    } catch (e) {
        console.error('[getBatchHistory] Failed:', e);
        symbols.forEach(s => { results[s] = []; });
    }
    return results;
}

export async function getHistory(symbol: string, range: string = '1mo') {
    const batch = await getBatchHistory([symbol], range);
    return batch[symbol] || [];
}

export async function clearHistory() {
    const db = await getDb();
    const schema = await import('../../db/schema');
    await db.delete(schema.transactions).run();
    return getPortfolio();
}
