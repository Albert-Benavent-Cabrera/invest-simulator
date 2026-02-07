'use server'

import { eq, sql } from 'drizzle-orm'
import { getDb } from '../db'
import { IPortfolio, ITransaction } from '../../models/IInvest'

export async function getPortfolio(): Promise<IPortfolio> {
    try {
        const db = await getDb();
        const schema = await import('../../db/schema');

        const p = await db.select().from(schema.portfolio).where(eq(schema.portfolio.id, 1)).get();
        const a = await db.select().from(schema.assets).all();
        const t = await db.select().from(schema.transactions).orderBy(sql`${schema.transactions.timestamp} DESC`).all();

        const assets = a.map((asset: { symbol: string; amount: number; avgPrice: number; totalInvested: number }) => ({
            symbol: asset.symbol,
            amount: Number(asset.amount),
            avgPrice: Number(asset.avgPrice),
            totalInvested: Number(asset.totalInvested)
        }));

        const transactions: ITransaction[] = t.map((trans: { type: string }) => ({
            ...trans,
            type: trans.type as ITransaction['type']
        }));

        return {
            balance: p?.balance ?? 100000,
            assets,
            transactions
        }
    } catch (e) {
        console.error('[getPortfolio] Database access failed:', e);
        return { balance: 100000, assets: [], transactions: [] };
    }
}

export async function updateBalance(amount: number, type: 'add' | 'remove') {
    try {
        const db = await getDb();
        const schema = await import('../../db/schema');

        const portfolio = await getPortfolio();
        const newBalance = type === 'add' ? portfolio.balance + amount : portfolio.balance - amount;

        if (newBalance < 0) throw new Error('Saldo insuficiente');

        await db.update(schema.portfolio)
            .set({ balance: newBalance })
            .where(eq(schema.portfolio.id, 1))
            .run();

        const transId = Math.random().toString(36).substr(2, 9);
        await db.insert(schema.transactions).values({
            id: transId,
            type: type === 'add' ? 'deposit' : 'withdraw',
            symbol: 'EUR',
            name: 'EUR',
            amount,
            price: 1,
            total: amount,
            date: new Date().toISOString(),
            timestamp: Date.now()
        }).run();

        return getPortfolio();
    } catch (e) {
        console.error('updateBalance failed:', e);
        throw e;
    }
}
