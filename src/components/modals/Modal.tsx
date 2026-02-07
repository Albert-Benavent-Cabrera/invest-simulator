'use client';

import { ReactNode, useEffect } from 'react';
import './ModalStyles.css';

interface ModalProps {
    onClose: () => void;
    title: string;
    children: ReactNode;
    error?: string | null;
}

export function Modal({ onClose, title, children, error }: ModalProps) {
    // Keyboard support for Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    &times;
                </button>
                <h3 className="modal-title">{title}</h3>

                <div className="modal-body">
                    {children}
                </div>

                {error && (
                    <div className="error-msg-container animate-fade-in">
                        <p className="error-msg">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
