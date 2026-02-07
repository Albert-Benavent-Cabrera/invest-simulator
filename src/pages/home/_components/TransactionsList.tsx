import { ITransaction } from '../../../models/IInvest';
import { formatCurrency, formatUnits } from '../../../utils/format';

interface TransactionsListProps {
    transactions: ITransaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
    const getTypeLabel = (type: ITransaction['type']) => {
        switch (type) {
            case 'buy': return 'Compra';
            case 'sell': return 'Venta';
            case 'deposit': return 'Depósito';
            case 'withdraw': return 'Retirada';
        }
    };

    const getTypeClass = (type: ITransaction['type']) => {
        switch (type) {
            case 'buy':
            case 'deposit':
                return 'transaction--buy';
            case 'sell':
            case 'withdraw':
                return 'transaction--sell';
        }
    };

    return (
        <div className="transactions-list">
            {transactions.length === 0 ? (
                <div className="transactions-empty">
                    No hay transacciones aún. ¡Empieza a invertir!
                </div>
            ) : (
                transactions.map(t => (
                    <div key={t.id} className={`transaction-row ${getTypeClass(t.type)}`}>
                        <div className="transaction-row__info">
                            <span className="transaction-row__type">{getTypeLabel(t.type)}</span>
                            <span className="transaction-row__name">{t.name}</span>
                        </div>
                        <div className="transaction-row__details">
                            {t.type !== 'deposit' && t.type !== 'withdraw' && (
                                <span className="transaction-row__units">
                                    {formatUnits(t.amount)} × {formatCurrency(t.price)}
                                </span>
                            )}
                            <span className="transaction-row__total">
                                {t.type === 'sell' || t.type === 'withdraw' ? '-' : '+'}
                                {formatCurrency(t.total)}
                            </span>
                        </div>
                        <div className="transaction-row__date" suppressHydrationWarning>
                            {new Date(t.date).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
