'use client'

import { PortfolioSummary } from './_components/PortfolioSummary'
import { PerformanceView } from './_components/PerformanceView'
import './Portfolio.styles.css'
import type { IPortfolio, IHistoryPoint } from '../../models/IInvest'

interface HomeViewProps {
    portfolioPromise: Promise<IPortfolio>
    quotesPromise: Promise<Record<string, { price: number; change?: number }>>
    historyPromises: Record<string, Promise<IHistoryPoint[]>>
}

/**
 * Public component that handles loading state and rendering the specific content.
 */
export function HomeView(props: HomeViewProps) {
    return (
        <div className="glass-panel" style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
            <PortfolioSummary
                portfolioPromise={props.portfolioPromise}
                quotesPromise={props.quotesPromise}
            />

            <PerformanceView
                portfolioPromise={props.portfolioPromise}
                quotesPromise={props.quotesPromise}
                historyPromises={props.historyPromises}
            />
        </div>
    )
}
