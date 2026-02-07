'use client'

import { use, Suspense, useState } from 'react'
import { PortfolioDistributionChart } from '../../../components/charts/PortfolioDistributionChart'
import { PLChart } from '../../../components/charts/PLChart'
import { AssetPerformanceCard } from './cards/AssetPerformanceCard'
import { IHistoryPoint, IPortfolio } from '../../../models/IInvest'
import { usePortfolio } from '../../../hooks/usePortfolio'
import { usePortfolioCalculations } from '../_hooks/usePortfolioCalculations'
import { TradeModal } from '../../../components/modals/TradeModal'

interface PerformanceViewProps {
    portfolioPromise: Promise<IPortfolio>
    quotesPromise: Promise<Record<string, { price: number; change?: number }>>
    historyPromises: Record<string, Promise<IHistoryPoint[]>>
}

export function PerformanceView(props: PerformanceViewProps) {
    return (
        <Suspense fallback={<PerformanceViewSkeleton />}>
            <PerformanceContent {...props} />
        </Suspense>
    )
}

function PerformanceContent({
    portfolioPromise,
    quotesPromise,
    historyPromises
}: PerformanceViewProps) {
    const portfolioData = use(portfolioPromise)
    const activeQuotes = use(quotesPromise)

    const { portfolio: optimisticPortfolio, actions } = usePortfolio(portfolioData)
    const { assetPerformance, plData } = usePortfolioCalculations({
        assets: optimisticPortfolio.assets,
        transactions: optimisticPortfolio.transactions,
        quotes: activeQuotes,
    })

    const [tradeModal, setTradeModal] = useState<{
        open: boolean;
        type: 'buy' | 'sell';
        symbol: string;
        price: number;
    }>({
        open: false,
        type: 'buy',
        symbol: '',
        price: 0,
    })

    const handleOpenTradeModal = (type: 'buy' | 'sell', symbol: string, price: number) => {
        setTradeModal({ open: true, type, symbol, price })
    }

    const handleCloseTradeModal = () => {
        setTradeModal(prev => ({ ...prev, open: false }))
    }

    const handleConfirmTrade = async (amount: number) => {
        if (tradeModal.type === 'buy') {
            await actions.buyAsset({
                symbol: tradeModal.symbol,
                amount,
                price: tradeModal.price,
                type: 'buy'
            })
        } else {
            await actions.sellAsset({
                symbol: tradeModal.symbol,
                amount,
                price: tradeModal.price,
                type: 'sell'
            })
        }
        handleCloseTradeModal()
    }

    return (
        <div className="performance-view">
            <div className="charts-row" style={{ display: 'flex', gap: '16px', flexWrap: 'nowrap', marginBottom: '1rem', height: '220px' }}>
                {/* Asset Allocation Pie Chart */}
                <div className="chart-container" style={{ flex: 1, minWidth: '0', marginBottom: 0, padding: '12px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Distribución</h3>
                    <PortfolioDistributionChart data={assetPerformance} height="100%" />
                </div>

                {/* Gráfico P&L */}
                <div className="chart-container" style={{ flex: 1, minWidth: '0', marginBottom: 0, padding: '12px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Histórico P&L</h3>
                    <PLChart data={plData} height="100%" />
                </div>
            </div>

            {/* Rendimiento por activo */}
            <div className="assets-performance">
                <h3 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Rendimiento por Activo</h3>
                {assetPerformance.length === 0 ? (
                    <div className="chart-empty">No tienes activos</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
                        {assetPerformance.map((asset) => (
                            <AssetPerformanceCard
                                key={asset.symbol}
                                asset={asset}
                                historyPromise={historyPromises?.[asset.symbol]}
                                onClick={() => handleOpenTradeModal('sell', asset.symbol, asset.price)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {tradeModal.open && (
                <TradeModal
                    type={tradeModal.type}
                    symbol={tradeModal.symbol}
                    price={tradeModal.price}
                    onClose={handleCloseTradeModal}
                    onConfirm={handleConfirmTrade}
                />
            )}
        </div>
    )
}

function PerformanceViewSkeleton() {
    return (
        <div className="performance-view" style={{ animation: 'pulse-glow 1.5s infinite ease-in-out' }}>
            <div className="charts-row" style={{ display: 'flex', gap: '16px', marginBottom: '1rem', height: '220px' }}>
                <div className="chart-container" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                <div className="chart-container" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
            </div>
            <div className="assets-performance">
                <div style={{ height: '30px', width: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '16px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                    ))}
                </div>
            </div>
        </div>
    )
}
