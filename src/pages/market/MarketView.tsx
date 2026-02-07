'use client'

import { use, Suspense, useState } from 'react'
import { MarketSection } from './_components/MarketSection'
import { BanksSection } from './_components/BanksSection'
import type { IPortfolio, IHistoryPoint } from '../../models/IInvest'
import { MarketSkeleton } from './_components/MarketSkeleton'
import { usePortfolio } from '../../hooks/usePortfolio'
import { TradeModal } from '../../components/modals/TradeModal'

interface MarketViewProps {
    portfolioPromise: Promise<IPortfolio>
    quotesPromise: Promise<Record<string, { price: number; change?: number }>>
    historyPromises: Record<string, Promise<IHistoryPoint[]>>
}

export function MarketView(props: MarketViewProps) {
    return (
        <Suspense fallback={<MarketSkeleton />}>
            <MarketContent {...props} />
        </Suspense>
    )
}

function MarketContent({
    portfolioPromise,
    quotesPromise,
    historyPromises,
}: MarketViewProps) {
    const portfolioData = use(portfolioPromise)
    const activeQuotes = use(quotesPromise)

    const { portfolio: optimisticPortfolio, actions } = usePortfolio(portfolioData)

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
        <section>
            <MarketSection
                quotes={activeQuotes || {}}
                historyPromises={historyPromises}
                portfolio={optimisticPortfolio}
                onBuy={(symbol, price) => handleOpenTradeModal('buy', symbol, price)}
                onSell={(symbol, price) => handleOpenTradeModal('sell', symbol, price)}
            />
            <BanksSection onDeposit={() => { }} portfolio={optimisticPortfolio} />

            {tradeModal.open && (
                <TradeModal
                    type={tradeModal.type}
                    symbol={tradeModal.symbol}
                    price={tradeModal.price}
                    onClose={handleCloseTradeModal}
                    onConfirm={handleConfirmTrade}
                />
            )}
        </section>
    )
}
