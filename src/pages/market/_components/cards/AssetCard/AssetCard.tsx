'use client'

import { useState, useEffect, use } from 'react';
import './AssetCard.css';
import { IAsset } from '../../../../../models/IInvest';
import { getHistory } from '../../../../../server-actions/server';
import { Sparkline } from '../../../../../components/charts/Sparkline';
import { formatCurrency, formatUnits } from '../../../../../utils/format';

type TimeRange = '6M' | '1A' | '5A';

interface IAssetCardProps {
  asset: IAsset;
  historyPromise?: Promise<IHistoryPoint[]>;
  onBuy: (symbol: string, price: number) => void;
  onSell: (symbol: string, price: number) => void;
  owned: number;
}

interface IHistoryPoint {
  date: string;
  price: number;
}

const rangeToParam: Record<TimeRange, string> = {
  '6M': '6mo',
  '1A': '1y',
  '5A': '5y'
};

const EMPTY_ARRAY: IHistoryPoint[] = [];

export const AssetCard = ({ asset, historyPromise, onBuy, onSell, owned }: IAssetCardProps) => {
  const [range, setRange] = useState<TimeRange>('1A');
  const [historyData, setHistoryData] = useState<IHistoryPoint[]>([]);

  // Resolve initial history from SSR promise if available
  const initialHistory = historyPromise ? use(historyPromise) : EMPTY_ARRAY;

  // No CSR-only transition needed anymore, we use historyData.length to decide

  // No need to sync initialHistory to state, we'll use effectiveHistory directly

  // Fetch data on range changes

  useEffect(() => {
    if (range === '1A' && initialHistory.length > 0) {
      setHistoryData([]); // Reset to use initialHistory
      return;
    }

    const fetchHistory = async () => {
      if (asset.type === 'bank') {
        const val = asset.currentPrice;
        setHistoryData([{ date: '0', price: val }, { date: '1', price: val }]);
        return;
      }

      try {
        const data = await getHistory(asset.symbol, rangeToParam[range]);
        setHistoryData(data as IHistoryPoint[]);
      } catch (e) {
        console.error('Failed to fetch history:', e);
      }
    };

    fetchHistory();
  }, [asset.symbol, asset.type, asset.currentPrice, range, initialHistory]);

  const lastPrice = asset.currentPrice;
  const dailyPct = asset.change || 0;
  const dailyIsUp = dailyPct >= 0;

  // Prioritize initialHistory for 1A if present, otherwise use state
  const effectiveHistory = (range === '1A' && initialHistory.length > 0) ? initialHistory : historyData;
  const hasHistory = effectiveHistory.length > 0;
  const rangeFirstPrice = hasHistory ? effectiveHistory[0].price : lastPrice;
  const rangeIsUp = lastPrice >= rangeFirstPrice;


  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: rangeIsUp
          ? 'radial-gradient(circle at 80% 20%, rgba(35, 134, 54, 0.1), transparent 50%)'
          : 'radial-gradient(circle at 80% 20%, rgba(248, 81, 73, 0.1), transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{asset.name}</h3>
          </div>
          <span className="text-mono" style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '2px', display: 'block' }}>
            {asset.symbol}
          </span>
          {owned > 0 && (
            <>
              <div className="asset-card__metric">
                <span className="asset-card__metric-label">En Cartera</span>
                <span className="asset-card__metric-value" suppressHydrationWarning>
                  {formatUnits(owned)}
                </span>
              </div>
              <div className="asset-card__metric">
                <span className="asset-card__metric-label">Valor Mi Inversión</span>
                <span className="asset-card__metric-value" suppressHydrationWarning>
                  {formatCurrency(owned * asset.currentPrice)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="asset-card__price-summary">
          <span className="asset-card__current-price" data-testid="asset-price" suppressHydrationWarning>
            {formatCurrency(asset.currentPrice)}
          </span>
          <div className={`asset-card__change-badge ${dailyIsUp ? 'positive' : 'negative'}`} suppressHydrationWarning>
            {dailyIsUp ? '▲' : '▼'} {Math.abs(dailyPct).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="asset-card__chart" style={{ height: '80px', width: '100%', margin: '4px -8px' }}>
        <Sparkline
          data={effectiveHistory}
          color={rangeIsUp ? 'var(--primary)' : 'var(--danger)'}
          height="80px"
          strokeWidth={2}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', zIndex: 1 }}>
        <button
          className="glass-panel"
          style={{
            padding: '10px',
            color: 'var(--primary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            background: 'rgba(35, 134, 54, 0.1)',
            border: '1px solid rgba(35, 134, 54, 0.2)'
          }}
          data-testid="btn-buy"
          onClick={() => onBuy(asset.symbol, asset.currentPrice)}
        >
          COMPRAR
        </button>
        <button
          className="glass-panel"
          style={{
            padding: '10px',
            color: 'var(--danger)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: owned <= 0 ? 'not-allowed' : 'pointer',
            opacity: owned <= 0 ? 0.5 : 1,
            background: 'rgba(248, 81, 73, 0.1)',
            border: '1px solid rgba(248, 81, 73, 0.2)'
          }}
          data-testid="btn-sell"
          disabled={owned <= 0}
          onClick={() => onSell(asset.symbol, asset.currentPrice)}
        >
          VENDER
        </button>
      </div>

      {/* Range Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', opacity: 0.6 }}>
        {(['6M', '1A', '5A'] as TimeRange[]).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              background: 'transparent',
              border: 'none',
              color: range === r ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: range === r ? 700 : 400,
              cursor: 'pointer',
              padding: '2px 4px'
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div >
  );
};
