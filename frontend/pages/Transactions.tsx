import React from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils';

const Transactions: React.FC = () => {
  const { transactions, boxes, clients, providers } = useData();

  const getEntityName = (id?: string) => {
    if (!id) return '-';
    const c = clients.find(x => x.id === id);
    if (c) return c.name;
    const p = providers.find(x => x.id === id);
    if (p) return p.name;
    return 'Entidad desconocida';
  };

  const getBoxName = (id?: string) => {
    if (!id) return '-';
    const b = boxes.find(x => x.id === id);
    return b ? b.name : 'Caja eliminada';
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SALE': return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">VENTA</span>;
      case 'COLLECTION': return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">COBRO</span>;
      case 'PURCHASE': return <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-bold">COMPRA</span>;
      case 'PAYMENT': return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold">PAGO</span>;
      case 'TRANSFER': return <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs font-bold">TRANSF.</span>;
      case 'INCOME': return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">INGRESO</span>;
      case 'EXPENSE': return <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-xs font-bold">EGRESO</span>;
      case 'INITIAL_BALANCE': return <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold">INICIAL</span>;
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Historial de Movimientos</h2>
        <p className="text-slate-500">Registro completo de operaciones</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4">Fecha</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Descripción</th>
                <th className="p-4">Entidad</th>
                <th className="p-4">Caja / Origen</th>
                <th className="p-4">Destino</th>
                <th className="p-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 text-sm">
                  <td className="p-4 whitespace-nowrap text-slate-600">{formatDate(t.date)}</td>
                  <td className="p-4">{getTypeLabel(t.type)}</td>
                  <td className="p-4 text-slate-700">{t.description}</td>
                  <td className="p-4 text-slate-600">{getEntityName(t.entityId)}</td>
                  <td className="p-4 text-slate-600">{getBoxName(t.boxId)}</td>
                  <td className="p-4 text-slate-600">{getBoxName(t.targetBoxId)}</td>
                  <td className="p-4 text-right font-bold text-slate-800">{formatCurrency(t.amount)}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No hay movimientos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;