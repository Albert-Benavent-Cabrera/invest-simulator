'use client'

import { use, Suspense } from 'react'
import type { IPortfolio, IHistoryPoint } from '../../models/IInvest'
import { PortfolioSummary } from '../home/_components/PortfolioSummary'
import { TransactionsList } from '../home/_components/TransactionsList'
import '../home/Portfolio.styles.css'
import { HistorySkeleton } from './_components/HistorySkeleton'
import { usePortfolio } from '../../hooks/usePortfolio'

interface HistoryViewProps {
    portfolioPromise: Promise<IPortfolio>
    quotesPromise?: Promise<Record<string, { price: number; change?: number }>>
    historyPromises?: Record<string, Promise<IHistoryPoint[]>>
}

export function HistoryView(props: HistoryViewProps) {
    return (
        <Suspense fallback={<HistorySkeleton />}>
            <HistoryContent {...props} />
        </Suspense>
    )
}

function HistoryContent({
    portfolioPromise,
    quotesPromise,
}: HistoryViewProps) {
    const portfolioData = use(portfolioPromise)
    const { portfolio: optimisticPortfolio, actions } = usePortfolio(portfolioData)

    return (
        <div className="history-container">
            <div style={{ padding: '0 20px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => {
                        if (window.confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
                            actions.clearHistory()
                        }
                    }}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(248, 81, 73, 0.1)',
                        border: '1px solid rgba(248, 81, 73, 0.2)',
                        borderRadius: '8px',
                        color: 'var(--danger)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.style.background = 'rgba(248, 81, 73, 0.2)'
                    }}
                    onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.style.background = 'rgba(248, 81, 73, 0.1)'
                    }}
                >
                    Borrar Historial
                </button>
            </div>
            <div className="glass-panel" style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
                <PortfolioSummary
                    portfolioPromise={portfolioPromise}
                    quotesPromise={quotesPromise || Promise.resolve({})}
                />
                <TransactionsList transactions={optimisticPortfolio.transactions || []} />
            </div>
        </div>
    )
}
