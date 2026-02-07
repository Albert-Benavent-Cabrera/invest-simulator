import { IPortfolioAsset, ITransaction } from '../../../models/IInvest';
import { ASSET_DEFS } from '../../../data/assets';

interface UsePortfolioCalculationsProps {
    assets: IPortfolioAsset[];
    transactions: ITransaction[];
    quotes: Record<string, { price: number; change?: number }>;
}

export function usePortfolioCalculations({
    assets,
    transactions,
    quotes,
}: UsePortfolioCalculationsProps) {
    const safePrices = quotes || {};

    // eslint-disable-next-line no-console
    console.log('🔍 [usePortfolioCalculations] Safe Prices:', safePrices);

    const assetPerformance = assets.map(asset => {
        const currentPrice = safePrices[asset.symbol]?.price || asset.avgPrice;
        const currentValue = asset.amount * currentPrice;
        const invested = asset.totalInvested || asset.amount * asset.avgPrice;
        const profit = currentValue - invested;
        const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;

        const def = ASSET_DEFS.find(d => d.symbol === asset.symbol);

        return {
            symbol: asset.symbol,
            name: def?.name || asset.symbol,
            amount: asset.amount,
            invested,
            currentValue,
            price: currentPrice,
            profit,
            profitPercent
        };
    });

    const totalInvested = assetPerformance.reduce((sum, a) => sum + a.invested, 0);
    const totalValue = assetPerformance.reduce((sum, a) => sum + a.currentValue, 0);
    const totalProfit = totalValue - totalInvested;
    const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    const totals = {
        totalInvested,
        totalValue,
        totalProfit,
        totalProfitPercent
    };

    const sortedTransactions = [...transactions]
        .filter(t => t.type === 'buy' || t.type === 'sell')
        .sort((a, b) => a.timestamp - b.timestamp);

    const data: { date: string; pl: number; fullDate: string }[] = [];
    let cumulativePL = 0;

    for (const t of sortedTransactions) {
        if (t.type === 'sell') {
            const avgBuyPrice = assets.find(a => a.symbol === t.symbol)?.avgPrice || t.price;
            const costBasis = t.amount * avgBuyPrice;
            cumulativePL += t.total - costBasis;
        }

        let dateStr = '??';
        try {
            const d = new Date(t.date);
            if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
            }
        } catch {
            console.warn('Invalid transaction date:', t.date);
        }

        data.push({
            date: dateStr,
            pl: cumulativePL,
            fullDate: t.date
        });
    }

    // Add current point
    if (data.length > 0 || totals.totalProfit !== 0) {
        data.push({
            date: 'Hoy',
            pl: cumulativePL + totals.totalProfit,
            fullDate: new Date().toISOString()
        });
    }

    const plData = data;

    return {
        assetPerformance,
        totals,
        plData
    };
}
