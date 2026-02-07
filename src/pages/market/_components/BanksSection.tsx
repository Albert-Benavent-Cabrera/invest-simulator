'use client'

import './BanksSection.css'
import { BankCard } from './cards/BankCard/BankCard'
import { ASSET_DEFS, IAssetDef } from '../../../data/assets'
import type { IPortfolio, IPortfolioAsset } from '../../../models/IInvest'

interface BanksSectionProps {
    onDeposit: (symbol: string) => void
    portfolio: IPortfolio
}

export function BanksSection({ onDeposit, portfolio }: BanksSectionProps) {
    const bankAssets = ASSET_DEFS.filter(a => a.type === 'bank').sort((a: IAssetDef, b: IAssetDef) => (b.tae || 0) - (a.tae || 0))

    return (
        <section className="banks-section">
            <h2 className="section-title">🏦 Mejores Cuentas Remuneradas España 2026</h2>
            <p className="section-subtitle">Ordenadas por TAE. Datos actualizados 30 enero 2026.</p>
            <div className="banks-grid">
                {bankAssets.map((bank: IAssetDef) => (
                    <BankCard
                        key={bank.id}
                        asset={bank}
                        onDeposit={onDeposit}
                        deposited={portfolio.assets.find((pa: IPortfolioAsset) => pa.symbol === bank.symbol)?.amount || 0}
                    />
                ))}
            </div>
        </section>
    )
}
