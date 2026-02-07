'use client'

import { Wallet } from 'lucide-react'
import { Suspense, use, useState } from 'react'
import './Header.css'
import { IPortfolio } from '../../models/IInvest'
import { NavTabs } from './components/NavTabs'
import { BalanceModalWrapper } from '../modals/BalanceModalWrapper'

import { formatCurrency } from '../../utils/format'
import type { PageKey } from '../../models/navigation'

interface HeaderProps {
    portfolio?: IPortfolio
    portfolioPromise?: Promise<IPortfolio>
    activeTab: PageKey
}

export function Header(props: HeaderProps) {
    return (
        <div className="header" data-testid="header-shell">
            <div className="desktop-tabs">
                <NavTabs activeTab={props.activeTab} />
            </div>

            <HeaderBalanceSection {...props} />
        </div>
    )
}

function HeaderBalanceSection(props: HeaderProps) {
    if (props.portfolio) {
        return <HeaderContent {...props} portfolio={props.portfolio} />
    }

    if (props.portfolioPromise) {
        return (
            <Suspense fallback={<HeaderLoadingState {...props} />}>
                <HeaderSuspendedContent {...props} portfolioPromise={props.portfolioPromise} />
            </Suspense>
        )
    }

    return <HeaderLoadingState {...props} />
}

function HeaderSuspendedContent({ portfolioPromise, ...props }: HeaderProps & { portfolioPromise: Promise<IPortfolio> }) {
    const portfolio = use(portfolioPromise)
    return <HeaderContent {...props} portfolio={portfolio} portfolioPromise={portfolioPromise} />
}

function HeaderContent({ portfolio, portfolioPromise, activeTab: _activeTab }: HeaderProps & { portfolio: IPortfolio }) {
    const [modal, setModal] = useState<{ open: boolean; type: 'add' | 'remove' }>({
        open: false,
        type: 'add',
    })

    const handleOpenModal = (type: 'add' | 'remove') => {
        setModal({ open: true, type })
    }

    const handleCloseModal = () => {
        setModal(prev => ({ ...prev, open: false }))
    }

    return (
        <div className="header-actions" data-testid="header-ready">
            <div className="button-group">
                <button
                    className="btn-header btn-header-add"
                    onClick={() => handleOpenModal('add')}
                    title="Añadir fondos"
                >
                    <Wallet size={18} />
                    <span>Añadir</span>
                </button>
                <button
                    className="btn-header btn-header-remove"
                    onClick={() => handleOpenModal('remove')}
                    title="Retirar fondos"
                >
                    <Wallet size={18} />
                    <span>Retirar</span>
                </button>
            </div>
            <div className="balance-panel">
                <span className="balance-label">Saldo total</span>
                <span className="balance-value">
                    {formatCurrency(portfolio.balance)}
                </span>
            </div>

            {modal.open && (
                <BalanceModalWrapper
                    portfolioPromise={portfolioPromise!}
                    type={modal.type}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
}

function HeaderLoadingState(_props: HeaderProps) {
    return (
        <div className="header-actions is-loading" data-testid="header-skeleton">
            <div className="button-group">
                <button className="btn-header" disabled title="Cargando...">
                    <Wallet size={18} />
                    <span>Añadir</span>
                </button>
                <button className="btn-header" disabled title="Cargando...">
                    <Wallet size={18} />
                    <span>Retirar</span>
                </button>
            </div>
            <div className="balance-panel">
                <span className="balance-label">Saldo total</span>
                <span className="balance-value" style={{ opacity: 0.3 }}>...</span>
            </div>
        </div>
    )
}
