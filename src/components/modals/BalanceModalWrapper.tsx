'use client'

import { use, Suspense } from 'react'
import { IPortfolio } from '../../models/IInvest'
import { usePortfolio } from '../../hooks/usePortfolio'
import { BalanceModal } from './BalanceModal'

interface BalanceModalWrapperProps {
    portfolioPromise: Promise<IPortfolio>
    type: 'add' | 'remove'
    onClose: () => void
}

export function BalanceModalWrapper(props: BalanceModalWrapperProps) {
    return (
        <Suspense fallback={null}>
            <BalanceModalContent {...props} />
        </Suspense>
    )
}

function BalanceModalContent({ portfolioPromise, type, onClose }: BalanceModalWrapperProps) {
    const portfolioData = use(portfolioPromise)
    const { actions } = usePortfolio(portfolioData)

    const handleConfirmBalance = async (amount: number) => {
        await actions.updateBalance(amount, type)
        onClose()
    }

    return (
        <BalanceModal
            type={type}
            onClose={onClose}
            onConfirm={handleConfirmBalance}
        />
    )
}
