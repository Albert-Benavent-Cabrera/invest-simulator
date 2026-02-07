'use client';

import React from 'react'
import { AssetCard } from './cards/AssetCard/AssetCard'
import { ASSET_DEFS, IAssetDef } from '../../../data/assets'
import type { IAsset, IPortfolio, IPortfolioAsset, IHistoryPoint } from '../../../models/IInvest'

interface MarketSectionProps {
    quotes: Record<string, { price: number; change?: number }>
    historyPromises: Record<string, Promise<IHistoryPoint[]>>
    portfolio: IPortfolio
    onBuy: (symbol: string, price: number) => void
    onSell: (symbol: string, price: number) => void
}

export function MarketSection({ quotes, historyPromises, portfolio, onBuy, onSell }: MarketSectionProps) {
    const marketAssets = ASSET_DEFS.filter(a => a.type !== 'bank')

    // Merge definitions with real quotes
    const displayedMarketAssets: IAsset[] = marketAssets.map((def: IAssetDef) => {
        const quote = quotes[def.symbol]
        return {
            ...def,
            currentPrice: quote?.price || 0,
            change: quote?.change || 0,
            history: Array.from({ length: 10 }, (_, i) => ({
                date: i.toString(),
                price: (quote?.price || 0)
            }))
        }
    })

    return (
        <section>
            <h2 className="section-title">📊 Acciones</h2>
            <div className="assets-grid">
                {displayedMarketAssets.map(a => (
                    <AssetCard
                        key={a.id}
                        asset={a}
                        historyPromise={historyPromises[a.symbol]}
                        onBuy={onBuy}
                        onSell={onSell}
                        owned={portfolio.assets.find((pa: IPortfolioAsset) => pa.symbol === a.symbol)?.amount || 0}
                    />
                ))}
            </div>
        </section>
    )
}
