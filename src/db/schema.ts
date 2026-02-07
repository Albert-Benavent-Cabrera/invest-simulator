import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const portfolio = sqliteTable('portfolio', {
    id: integer('id').primaryKey(),
    balance: real('balance').notNull().default(100000),
});

export const assets = sqliteTable('assets', {
    symbol: text('symbol').primaryKey(),
    amount: real('amount').notNull(),
    avgPrice: real('avgPrice').notNull(),
    totalInvested: real('totalInvested').notNull(),
});

export const transactions = sqliteTable('transactions', {
    id: text('id').primaryKey(),
    type: text('type', { enum: ['buy', 'sell', 'deposit', 'withdraw'] }).notNull(),
    symbol: text('symbol').notNull(),
    name: text('name').notNull(),
    amount: real('amount').notNull(),
    price: real('price').notNull(),
    total: real('total').notNull(),
    date: text('date').notNull(),
    timestamp: integer('timestamp').notNull(),
});
