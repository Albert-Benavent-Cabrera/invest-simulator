import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssetCard } from '../pages/market/_components/cards/AssetCard/AssetCard';
import type { IAsset } from '../models/IInvest';

// Mock recharts to avoid issues with ResponsiveContainer in jsdom
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Line: () => <div>Line</div>,
}));

// Mock server actions
vi.mock('../../../server-actions/server', () => ({
    getHistory: vi.fn(() => Promise.resolve([])),
}));

const mockAsset: IAsset = {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'crypto',
    currentPrice: 50000,
    change: 2.5,
    history: [],
};

describe('AssetCard', () => {
    const mockOnBuy = vi.fn();
    const mockOnSell = vi.fn();

    it('renders asset information correctly', () => {
        render(
            <AssetCard
                asset={mockAsset}
                onBuy={mockOnBuy}
                onSell={mockOnSell}
                owned={0}
            />
        );

        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByTestId('asset-price')).toHaveTextContent(/50\.000/);
    });

    it('shows owned amount when greater than zero', () => {
        render(
            <AssetCard
                asset={mockAsset}
                onBuy={mockOnBuy}
                onSell={mockOnSell}
                owned={0.5}
            />
        );

        expect(screen.getByText(/0,5/)).toBeInTheDocument();
        expect(screen.getByText('En Cartera')).toBeInTheDocument();
    });

    it('disables sell button when not owned', () => {
        render(
            <AssetCard
                asset={mockAsset}
                onBuy={mockOnBuy}
                onSell={mockOnSell}
                owned={0}
            />
        );

        const sellButton = screen.getByTestId('btn-sell');
        expect(sellButton).toBeDisabled();
    });
});
