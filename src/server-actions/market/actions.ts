import { eq } from 'drizzle-orm'
import { getDb } from '../db'
import { fetchBatchSpark } from '../functions/finance'
import { ITrade } from '../../models/IInvest'
import { ASSET_DEFS } from '../../data/assets'
import { getPortfolio } from '../home/actions'

const CACHE_TTL = 60 * 1000;
const quotesCache: Record<string, { promise: Promise<{ price: number; change: number }>; timestamp: number }> = {};

async function getBatchFinanceData(symbols: string[]) {
    const now = Date.now();
    const symbolsToFetch = symbols.filter(s => {
        const entry = quotesCache[s];
        return !entry || (now - entry.timestamp > CACHE_TTL);
    });

    if (symbolsToFetch.length > 0) {
        const batchPromise = (async () => {
            const batchData = await fetchBatchSpark(symbolsToFetch, '1y');
            Object.entries(batchData).forEach(([symbol, data]) => {
                quotesCache[symbol] = {
                    promise: Promise.resolve({ price: data.price, change: data.change }),
                    timestamp: Date.now()
                };
            });
            return batchData;
        })();

        symbolsToFetch.forEach(s => {
            quotesCache[s] = {
                promise: batchPromise.then((res) => ({ price: res[s].price, change: res[s].change })),
                timestamp: now
            };
        });
        await batchPromise;
    }
}

export async function getQuotes(symbols: string[]): Promise<Record<string, { price: number; change?: number }>> {
    try {
        await getBatchFinanceData(symbols);
        const result: Record<string, { price: number; change: number }> = {};
        for (const s of symbols) {
            result[s] = await quotesCache[s].promise;
        }
        return result;
    } catch (e) {
        console.error('[Quotes] Error:', e);
        return symbols.reduce((acc, s) => ({ ...acc, [s]: { price: 0, change: 0 } }), {});
    }
}

export async function buyAsset(trade: ITrade) {
    try {
        const db = await getDb();
        const schema = await import('../../db/schema');
        const { symbol, price, amount: quantity } = trade;
        const totalCost = quantity * price;
        const portfolio = await getPortfolio();

        if (totalCost > portfolio.balance) throw new Error('Saldo insuficiente');

        const existing = await db.select().from(schema.assets).where(eq(schema.assets.symbol, symbol)).get();

        if (existing) {
            const newTotalInvested = existing.totalInvested + totalCost;
            const newAmount = existing.amount + quantity;
            await db.update(schema.assets)
                .set({
                    amount: newAmount,
                    avgPrice: newTotalInvested / newAmount,
                    totalInvested: newTotalInvested
                })
                .where(eq(schema.assets.symbol, symbol))
                .run();
        } else {
            await db.insert(schema.assets).values({
                symbol,
                amount: quantity,
                avgPrice: price,
                totalInvested: totalCost
            }).run();
        }

        await db.update(schema.portfolio)
            .set({ balance: portfolio.balance - totalCost })
            .where(eq(schema.portfolio.id, 1))
            .run();

        const assetDef = ASSET_DEFS.find(a => a.symbol === symbol);
        await db.insert(schema.transactions).values({
            id: Math.random().toString(36).substr(2, 9),
            type: 'buy',
            symbol,
            name: assetDef?.name || symbol,
            amount: quantity,
            price,
            total: totalCost,
            date: new Date().toISOString(),
            timestamp: Date.now()
        }).run();

        return getPortfolio();
    } catch (e) {
        console.error('buyAsset failed:', e);
        throw e;
    }
}

export async function sellAsset(trade: ITrade) {
    try {
        const db = await getDb();
        const schema = await import('../../db/schema');
        const { symbol, price, amount: quantity } = trade;
        const existing = await db.select().from(schema.assets).where(eq(schema.assets.symbol, symbol)).get();

        if (!existing || existing.amount <= 0) return getPortfolio();

        const sellQuantity = quantity !== undefined ? Math.min(quantity, existing.amount) : existing.amount;
        const amountEuro = sellQuantity * price;
        const portfolio = await getPortfolio();

        if (sellQuantity >= existing.amount) {
            await db.delete(schema.assets).where(eq(schema.assets.symbol, symbol)).run();
        } else {
            const remainingAmount = existing.amount - sellQuantity;
            await db.update(schema.assets)
                .set({
                    amount: remainingAmount,
                    totalInvested: existing.totalInvested * (remainingAmount / existing.amount)
                })
                .where(eq(schema.assets.symbol, symbol))
                .run();
        }

        await db.update(schema.portfolio)
            .set({ balance: portfolio.balance + amountEuro })
            .where(eq(schema.portfolio.id, 1))
            .run();

        const assetDef = ASSET_DEFS.find(a => a.symbol === symbol);
        await db.insert(schema.transactions).values({
            id: Math.random().toString(36).substr(2, 9),
            type: 'sell',
            symbol,
            name: assetDef?.name || symbol,
            amount: sellQuantity,
            price,
            total: amountEuro,
            date: new Date().toISOString(),
            timestamp: Date.now()
        }).run();

        return getPortfolio();
    } catch (e) {
        console.error('sellAsset failed:', e);
        throw e;
    }
}
