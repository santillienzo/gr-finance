import React, { useState } from 'react';
import { Edit, Save, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils';
import { getBoxName, TypeLabel } from '../utils/EntityHelpers';
import { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  showEntityColumn?: boolean;
  onTransactionUpdated?: () => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  showEntityColumn = true,
  onTransactionUpdated,
}) => {
  const { boxes, clients, providers, updateTransaction, deleteTransaction } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const getEntityName = (id?: string) => {
    if (!id) return '-';
    const c = clients.find(x => x.id === id);
    if (c) return c.name;
    const p = providers.find(x => x.id === id);
    if (p) return p.name;
    return 'Entidad desconocida';
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditAmount(transaction.amount.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
  };

  const handleSave = async (transaction: Transaction) => {
    if (!editAmount || parseFloat(editAmount) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    setSaving(true);
    try {
      await updateTransaction(transaction.id, {
        type: transaction.type,
        amount: parseFloat(editAmount),
        description: transaction.description,
        boxId: transaction.boxId || undefined,
        targetBoxId: transaction.targetBoxId || undefined,
        entityId: transaction.entityId || undefined,
      });
      
      setEditingId(null);
      setEditAmount('');
      
      if (onTransactionUpdated) {
        onTransactionUpdated();
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.')) {
      return;
    }

    setSaving(true);
    try {
      await deleteTransaction(transaction.id);
      setEditingId(null);
      
      if (onTransactionUpdated) {
        onTransactionUpdated();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setSaving(false);
    }
  };

  const columnCount = showEntityColumn ? 8 : 7;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4">Fecha</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Descripción</th>
              {showEntityColumn && <th className="p-4">Entidad</th>}
              <th className="p-4">Caja / Origen</th>
              <th className="p-4">Destino</th>
              <th className="p-4 text-right">Monto</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map(t => {
              const isEditing = editingId === t.id;
              return (
                <tr key={t.id} className={`text-sm ${isEditing ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                  <td className="p-4 whitespace-nowrap text-slate-600">{formatDate(t.date)}</td>
                  <td className="p-4"><TypeLabel type={t.type} /></td>
                  <td className="p-4 text-slate-700">{t.description}</td>
                  {showEntityColumn && (
                    <td className="p-4 text-slate-600">{getEntityName(t.entityId)}</td>
                  )}
                  <td className="p-4 text-slate-600">{getBoxName(boxes, t.boxId)}</td>
                  <td className="p-4 text-slate-600">{getBoxName(boxes, t.targetBoxId)}</td>
                  <td className="p-4 text-right font-bold text-slate-800">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-32 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        disabled={saving}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(t);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                    ) : (
                      formatCurrency(t.amount)
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {isEditing ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleSave(t)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Guardar cambios"
                          disabled={saving}
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(t)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar movimiento"
                          disabled={saving}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar movimiento"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={columnCount} className="p-8 text-center text-slate-400">
                  No hay movimientos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
