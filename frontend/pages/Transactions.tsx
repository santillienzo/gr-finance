import React from 'react';
import { useData } from '../context/DataContext';
import TransactionsTable from '../components/TransactionsTable';

const Transactions: React.FC = () => {
  const { transactions } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Historial de Movimientos</h2>
        <p className="text-slate-500">Registro completo de operaciones</p>
      </div>

      <TransactionsTable transactions={transactions} showEntityColumn={true} />
    </div>
  );
};

export default Transactions;