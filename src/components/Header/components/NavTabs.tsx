'use client'

import { LayoutDashboard, ShoppingCart, History } from 'lucide-react'
import { Link, useRouter } from 'waku/router/client'
import { useEffect } from 'react'
import './NavTabs.css'
import type { PageKey } from '../../../models/navigation'

interface NavTabsProps {
    activeTab: PageKey
}

export function NavTabs({ activeTab }: NavTabsProps) {
    const router = useRouter()

    useEffect(() => {
        // Instant speculative pre-fetch for other tabs
        if (activeTab !== 'home') router.prefetch('/')
        if (activeTab !== 'market') router.prefetch('/market')
        if (activeTab !== 'history') router.prefetch('/history')
    }, [activeTab, router])

    return (
        <nav className="nav-tabs-container">
            <Link to="/" className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Home</span>
            </Link>
            <Link to="/market" className={`nav-tab ${activeTab === 'market' ? 'active' : ''}`}>
                <ShoppingCart size={18} />
                <span>Market</span>
            </Link>
            <Link to="/history" className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}>
                <History size={18} />
                <span>History</span>
            </Link>
        </nav>
    )
}
