import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../components/Header/Header';
import type { IPortfolio } from '../models/IInvest';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Wallet: () => <div data-testid="wallet-icon" />,
}));

// Mock NavTabs completely to avoid Router issues
vi.mock('../components/Header/components/NavTabs', () => ({
    NavTabs: () => <div data-testid="nav-tabs" />,
}));

// Mock BalanceModalWrapper to avoid internal logic
vi.mock('../components/modals/BalanceModalWrapper', () => ({
    BalanceModalWrapper: ({ type, onClose }: { type: string; onClose: () => void }) => (
        <div data-testid="balance-modal-mock">
            <span>Modal Type: {type}</span>
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

const mockPortfolio: IPortfolio = {
    balance: 1234.56,
    assets: [],
    transactions: [],
};

describe('Header', () => {
    it('renders balance correctly', () => {
        render(
            <Header
                portfolio={mockPortfolio}
                activeTab="home"
            />
        );

        // Format: 1234,56 € (JSDOM might not add thousand separator in some locales)
        expect(screen.getByText(/1234,56/)).toBeInTheDocument();
    });

    it('opens balance modal with "add" when clicking Añadir', () => {
        render(
            <Header
                portfolio={mockPortfolio}
                activeTab="home"
            />
        );

        const addButton = screen.getByText('Añadir').closest('button');
        fireEvent.click(addButton!);

        expect(screen.getByTestId('balance-modal-mock')).toBeInTheDocument();
        expect(screen.getByText('Modal Type: add')).toBeInTheDocument();
    });

    it('opens balance modal with "remove" when clicking Retirar', () => {
        render(
            <Header
                portfolio={mockPortfolio}
                activeTab="home"
            />
        );

        const removeButton = screen.getByText('Retirar').closest('button');
        fireEvent.click(removeButton!);

        expect(screen.getByTestId('balance-modal-mock')).toBeInTheDocument();
        expect(screen.getByText('Modal Type: remove')).toBeInTheDocument();
    });

    it('closes balance modal when onClose is called', () => {
        render(
            <Header
                portfolio={mockPortfolio}
                activeTab="home"
            />
        );

        fireEvent.click(screen.getByText('Añadir').closest('button')!);
        expect(screen.getByTestId('balance-modal-mock')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Close'));
        expect(screen.queryByTestId('balance-modal-mock')).not.toBeInTheDocument();
    });
});
