'use client';

import { useState, useActionState } from 'react';
import { Modal } from './Modal';
import './ModalStyles.css';

interface BalanceModalProps {
    type: 'add' | 'remove';
    onClose: () => void;
    onConfirm: (amount: number) => Promise<void>;
}

export function BalanceModal({ type, onClose, onConfirm }: BalanceModalProps) {
    const [amount, setAmount] = useState(1);

    // React 19: useActionState for managing form submission & errors
    const [error, formAction, isPending] = useActionState(
        async (_prev: string | null, formData: FormData) => {
            const val = Number(formData.get('amount'));
            if (isNaN(val) || val <= 0) return 'Cantidad inválida';
            try {
                await onConfirm(val);
                return null; // Success, error is null
            } catch (e) {
                return e instanceof Error ? e.message : 'Error desconocido';
            }
        },
        null
    );

    return (
        <Modal
            onClose={onClose}
            title={type === 'add' ? 'Añadir Dinero' : 'Quitar Dinero'}
            error={error}
        >
            <form action={formAction}>
                <div className="amount-control">
                    <button type="button" className="btn-circle" onClick={() => setAmount(Math.max(0, amount - 100))}>-</button>
                    <input
                        name="amount"
                        type="number"
                        className="amount-input"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    />
                    <button type="button" className="btn-circle" onClick={() => setAmount(amount + 100)}>+</button>
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
