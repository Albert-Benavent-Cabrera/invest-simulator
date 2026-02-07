'use client'

import { use, Suspense } from 'react'
import { formatCurrency } from '../../../utils/format'
import { usePortfolio } from '../../../hooks/usePortfolio'
import { usePortfolioCalculations } from '../_hooks/usePortfolioCalculations'
import type { IPortfolio } from '../../../models/IInvest'

interface PortfolioSummaryProps {
    portfolioPromise: Promise<IPortfolio>
    quotesPromise: Promise<Record<string, { price: number; change?: number }>>
}

export function PortfolioSummary(props: PortfolioSummaryProps) {
    return (
        <Suspense fallback={<PortfolioSummarySkeleton />}>
            <SummaryContent {...props} />
        </Suspense>
    )
}

function SummaryContent({ portfolioPromise, quotesPromise }: PortfolioSummaryProps) {
    const portfolioData = use(portfolioPromise)
    const activeQuotes = use(quotesPromise)

    const { portfolio: optimisticPortfolio } = usePortfolio(portfolioData)
    const { totals } = usePortfolioCalculations({
        assets: optimisticPortfolio.assets,
        transactions: optimisticPortfolio.transactions,
        quotes: activeQuotes,
    })

    const { totalInvested, totalValue, totalProfit, totalProfitPercent } = totals

    return (
        <div className="user-panel__summary" style={{ marginBottom: '1rem', padding: '1rem 0' }}>
            <div className="summary-card" style={{ padding: '12px' }}>
                <span className="summary-card__label" style={{ fontSize: '0.8rem' }}>Total Invertido</span>
                <span className="summary-card__value" style={{ fontSize: '1.2rem' }} suppressHydrationWarning>
                    {formatCurrency(totalInvested)}
                </span>
            </div>
            <div className="summary-card" style={{ padding: '12px' }}>
                <span className="summary-card__label" style={{ fontSize: '0.8rem' }}>Valor Actual</span>
                <span className="summary-card__value" style={{ fontSize: '1.2rem' }} suppressHydrationWarning>
                    {formatCurrency(totalValue)}
                </span>
            </div>
            <div className={`summary-card summary-card--highlight ${totalProfit >= 0 ? 'summary-card--profit' : 'summary-card--loss'}`} style={{ padding: '12px' }}>
                <span className="summary-card__label" style={{ fontSize: '0.8rem' }}>Ganancia/Pérdida</span>
                <span className="summary-card__value" style={{ fontSize: '1.2rem' }} suppressHydrationWarning>
                    {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                    <small style={{ fontSize: '0.8em' }}> ({totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%)</small>
                </span>
            </div>
        </div>
    )
}

function PortfolioSummarySkeleton() {
    return (
        <div className="user-panel__summary" style={{ marginBottom: '1rem', padding: '1rem 0', animation: 'pulse-glow 1.5s infinite ease-in-out' }}>
            <div className="summary-card" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', height: '80px' }} />
            <div className="summary-card" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', height: '80px' }} />
            <div className="summary-card" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', height: '80px' }} />
        </div>
    )
}
