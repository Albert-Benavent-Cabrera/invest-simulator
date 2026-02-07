import { getPortfolio, getQuotes, getBatchHistory } from '../server-actions/server'
import { MARKET_SYMBOLS } from '../data/assets'
import type { IHistoryPoint } from '../models/IInvest'
import { NavTabs } from './Header/components/NavTabs'
import { HomeView } from '../pages/home/HomeView'
import { MarketView } from '../pages/market/MarketView'
import { HistoryView } from '../pages/history/HistoryView'
import { Header } from './Header/Header'
import type { PageKey } from '../models/navigation'

interface DashboardControllerProps {
    page: PageKey
}

/**
 * Main Controller (Server Component)
 * Orchestrates data promises and renders the persistent shell.
 */
export async function DashboardController({ page }: DashboardControllerProps) {
    const portfolioPromise = getPortfolio()
    const quotesPromise = getQuotes(MARKET_SYMBOLS)
    const historyBatchPromise = getBatchHistory(MARKET_SYMBOLS, '1mo')

    const historyPromises: Record<string, Promise<IHistoryPoint[]>> = {}
    MARKET_SYMBOLS.forEach(symbol => {
        historyPromises[symbol] = historyBatchPromise.then(batch => batch[symbol] || [])
    })

    const commonProps = {
        portfolioPromise,
        quotesPromise,
        historyPromises,
    }

    const content = page === 'home' ? (
        <HomeView {...commonProps} />
    ) : page === 'market' ? (
        <MarketView {...commonProps} />
    ) : (
        <HistoryView {...commonProps} />
    )

    return (
        <div className="app-shell">
            <header className="glass-panel dashboard-header">
                <Header
                    portfolioPromise={portfolioPromise}
                    activeTab={page}
                />
            </header>

            <main className="dashboard-main">
                <section className="glass-panel market-scroll-area">
                    <div className="content-wrapper">
                        {content}
                    </div>
                </section>
            </main>

            <div className="mobile-only-nav">
                <NavTabs activeTab={page} />
            </div>
        </div>
    )
}
