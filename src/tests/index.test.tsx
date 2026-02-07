import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { Suspense } from 'react';
import { DashboardController } from '../components/DashboardController';

// Mock useRouter and Link
vi.mock('waku/router/client', () => ({
    useRouter: () => ({ path: '/', prefetch: vi.fn() }),
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

// Mock NavTabs completely
vi.mock('../components/Header/components/NavTabs', () => ({
    NavTabs: () => <div data-testid="nav-tabs" />,
}));

// Mock Page Components to avoid deep rendering issues in shell test
vi.mock('../pages/home/HomeView', () => ({
    HomeView: () => <div data-testid="home-view" />,
}));
vi.mock('../pages/market/MarketView', () => ({
    MarketView: () => <div data-testid="market-view" />,
}));
vi.mock('../pages/history/HistoryView', () => ({
    HistoryView: () => <div data-testid="history-view" />,
}));


vi.mock('../server-actions/server', () => ({
    getPortfolio: vi.fn(),
    getQuotes: vi.fn(),
    getBatchHistory: vi.fn(),
}));

import { getPortfolio, getQuotes, getBatchHistory } from '../server-actions/server';

describe('Index Skeletons', () => {
    it('shows the shell immediately', () => {
        // Setup mocks to suspend (never resolve)
        (getPortfolio as MockedFunction<typeof getPortfolio>).mockReturnValue(new Promise(() => { }));
        (getQuotes as MockedFunction<typeof getQuotes>).mockReturnValue(new Promise(() => { }));
        (getBatchHistory as MockedFunction<typeof getBatchHistory>).mockReturnValue(new Promise(() => { }));

        render(
            <Suspense fallback={
                <div data-testid="shell-skeleton">
                    <div data-testid="header-skeleton" />
                    <div data-testid="nav-tabs" />
                </div>
            }>
                <DashboardController page="home" />
            </Suspense>
        );

        // Header skeleton should be visible immediately because data is suspended
        expect(screen.getByTestId('header-skeleton')).toBeInTheDocument();
    });
});
