'use client'

import type { IAssetDef } from '../../../../../data/assets';
import { formatCurrency } from '../../../../../utils/format';


interface IBankCardProps {
  asset: IAssetDef;
  onDeposit: (symbol: string) => void;
  deposited: number;
}

export const BankCard = ({ asset, onDeposit, deposited }: IBankCardProps) => {
  // Determine if "profitable" (TAE > 2% is good, used for green gradient)
  const isGood = (asset.tae || 0) >= 2.0;

  return (
    <div className="glass-panel animate-enter" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Gradient based on TAE */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: isGood
          ? 'radial-gradient(circle at 80% 20%, rgba(35, 134, 54, 0.1), transparent 50%)'
          : 'radial-gradient(circle at 80% 20%, rgba(47, 129, 247, 0.1), transparent 50%)', // Blue for lower TAE
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
            {asset.subtype === 'deposit' ? 'Depósito' : 'Cuenta'} {asset.term ? `• ${asset.term}` : ''}
          </span>
          <div className="bank-card__details" style={{ marginTop: '8px' }}>
            <div className="bank-card__metric">
              <span className="bank-card__label">Dinero disponible</span>
              <span className="bank-card__value" suppressHydrationWarning>
                {formatCurrency(deposited)}
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="text-mono" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {asset.tae?.toFixed(2)}%
          </div>
          <div
            className="text-mono"
            style={{ fontSize: '0.6rem', fontWeight: '600', marginTop: '4px', color: 'var(--text-dim)', textTransform: 'uppercase' }}
          >
            TAE ANUAL
          </div>
        </div>
      </div>

      {/* Details / Conditions */}
      <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {asset.conditions && (
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            background: 'rgba(255,255,255,0.03)',
            padding: '8px',
            borderRadius: '6px',
            fontStyle: 'italic',
            borderLeft: `2px solid ${isGood ? 'var(--primary)' : 'var(--accent)'}`
          }}>
            "{asset.conditions}"
          </div>
        )}

        {asset.maxAmount && (
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Máx. remunerado: {asset.maxAmount.toLocaleString('es-ES')} €
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: asset.url ? '1fr 1fr' : '1fr', gap: '12px', zIndex: 1, marginTop: 'auto' }}>
        <button
          className="glass-panel"
          style={{
            padding: '10px',
            color: 'var(--primary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            background: 'rgba(35, 134, 54, 0.1)',
            border: '1px solid rgba(35, 134, 54, 0.2)',
            textAlign: 'center'
          }}
          onClick={() => onDeposit(asset.symbol)}
        >
          CONTRATAR
        </button>
        {asset.url && (
          <a
            href={asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel"
            style={{
              padding: '10px',
              color: 'var(--text-dim)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            INFO
          </a>
        )}
      </div>
    </div >
  );
};
