'use client';

import { useState, useActionState } from 'react';
import { Modal } from './Modal';
import { formatCurrency, formatUnits } from '../../utils/format';
import './ModalStyles.css';

interface TradeModalProps {
    type: 'buy' | 'sell';
    symbol: string;
    price: number;
    onClose: () => void;
    onConfirm: (amount: number) => Promise<void>;
}

export function TradeModal({ type, symbol, price, onClose, onConfirm }: TradeModalProps) {
    const [amount, setAmount] = useState(1);

    // React 19: useActionState for managing form submission & errors
    const [error, formAction, isPending] = useActionState(
        async (_prev: string | null, formData: FormData) => {
            const val = Number(formData.get('amount'));
            if (type === 'buy' && (isNaN(val) || val <= 0)) return 'Cantidad inválida';
            try {
                await onConfirm(val);
                return null; // Success
            } catch (e) {
                return e instanceof Error ? e.message : 'Error desconocido';
            }
        },
        null
    );

    const handleIncrement = () => setAmount(prev => prev + 1);
    const handleDecrement = () => setAmount(prev => Math.max(0, prev - 1));

    return (
        <Modal
            onClose={onClose}
            title={type === 'buy' ? `Comprar ${symbol}` : `Vender ${symbol}`}
            error={error}
        >
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-dim)' }}>
                Precio actual: {price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>

            <form action={formAction}>
                <div className="amount-control-wrapper">
                    <div className="amount-control">
                        <button type="button" className="btn-circle" onClick={handleDecrement}>-</button>
                        <input
                            name="amount"
                            type="number"
                            className="amount-input"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        />
                        <button type="button" className="btn-circle" onClick={handleIncrement}>+</button>
                    </div>

                    <div className="total-price-preview">
                        <div className="total-price-preview__breakdown">
                            {formatUnits(amount)} {type === 'buy' ? 'unidades' : 'unidades'} × {formatCurrency(price)}
                        </div>
                        <div className="total-price-preview__total">
                            Total: {formatCurrency(amount * price)}
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-btn modal-btn--secondary"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="modal-btn modal-btn--primary"
                        disabled={isPending}
                    >
                        {isPending ? 'Procesando...' : 'Confirmar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
