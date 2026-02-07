'use client'

import { useState, useEffect, use } from 'react';
import { ASSET_DEFS } from '../../../../data/assets';
import { getHistory } from '../../../../server-actions/server';
import { IHistoryPoint } from '../../../../models/IInvest';
import { Sparkline } from '../../../../components/charts/Sparkline';
import { formatCurrency, formatUnits } from '../../../../utils/format';
import './AssetPerformanceCard.css';

interface AssetPerformanceCardProps {
    asset: {
        symbol: string;
        amount: number;
        price: number;
        invested: number;
        currentValue: number;
        profit: number;
        profitPercent: number;
    };
    historyPromise?: Promise<IHistoryPoint[]>;
    onClick?: () => void;
}
const EMPTY_ARRAY: { date: string; price: number }[] = [];

export function AssetPerformanceCard({ asset, historyPromise, onClick }: AssetPerformanceCardProps) {
    const [history, setHistory] = useState<{ date: string; price: number }[]>([]);
    const assetDef = ASSET_DEFS.find(a => a.symbol === asset.symbol);

    // Resolve initial history from SSR promise if available
    const initialHistory = historyPromise ? use(historyPromise) : EMPTY_ARRAY;

    useEffect(() => {
        // Skip if we already have initial history
        if (initialHistory.length > 0) return;

        // For banks, generate a constant history if not using real history
        if (assetDef?.type === 'bank') {
            const dummyHistory = Array.from({ length: 10 }).map((_, i) => ({
                date: `dummy-${i}`,
                price: asset.price
            }));
            setHistory(dummyHistory);
            return;
        }

        getHistory(asset.symbol, '1A').then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                const validData = data.filter(d => d.price !== null) as { date: string; price: number }[];
                setHistory(validData);
            }
        });
    }, [asset.symbol, asset.price, assetDef?.type, initialHistory]);

    const isProfit = asset.profit >= 0;
    const color = isProfit ? '#2ea043' : '#f85149';

    const currentHist = history.length > 0 ? history : initialHistory;

    return (
        <div
            className={`asset-performance-card ${assetDef?.type !== 'bank' ? 'clickable' : ''}`}
            onClick={() => assetDef?.type !== 'bank' && onClick?.()}
        >
            <div className="asset-performance-card__header">
                <div className="asset-performance-card__info">
                    <span className="asset-performance-card__name">{assetDef?.name || asset.symbol}</span>
                    <span className="asset-performance-card__symbol">{asset.symbol}</span>
                </div>
                <div className="asset-performance-card__price-summary">
                    <span className="asset-performance-card__current-price">
                        {formatCurrency(asset.price)}
                    </span>
                    <div className={`asset-performance-card__profit-badge ${isProfit ? 'profit' : 'loss'}`}>
                        {asset.profitPercent >= 0 ? '↑' : '↓'} {Math.abs(asset.profitPercent).toFixed(2)}%
                    </div>
                </div>
            </div>

            <div className="asset-performance-card__chart">
                <Sparkline data={currentHist} color={color} height="60px" />
            </div>

            <div className="asset-performance-card__metrics">
                <div className="asset-performance-card__metric">
                    <span className="asset-performance-card__metric-label">Cantidad</span>
                    <span className="asset-performance-card__metric-value">
                        {formatUnits(asset.amount)}
                    </span>
                </div>
                <div className="asset-performance-card__metric">
                    <span className="asset-performance-card__metric-label">Ganancia Total</span>
                    <span className={`asset-performance-card__metric-value ${isProfit ? 'asset-performance-card__metric-value--profit' : 'asset-performance-card__metric-value--loss'}`}>
                        {asset.profit >= 0 ? '+' : ''}{formatCurrency(asset.profit)}
                    </span>
                </div>
                <div className="asset-performance-card__metric full-width">
                    <span className="asset-performance-card__metric-label">Valor Total</span>
                    <span className="asset-performance-card__metric-value asset-performance-card__metric-value--large">
                        {formatCurrency(asset.currentValue)}
                    </span>
                </div>
            </div>
        </div>
    );
}
