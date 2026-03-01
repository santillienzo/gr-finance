import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Transaction } from '../types';
import TransactionsTable from './TransactionsTable';

interface EntityTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityName: string;
  entityType: 'CLIENT' | 'PROVIDER';
}

const EntityTransactionsModal: React.FC<EntityTransactionsModalProps> = ({
  isOpen,
  onClose,
  entityId,
  entityName,
  entityType,
}) => {
  const { getEntityTransactions } = useData();
  const [entityTransactions, setEntityTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !entityId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await getEntityTransactions(entityId);
        setEntityTransactions(data);
      } catch (error) {
        console.error('Error fetching entity transactions:', error);
        setEntityTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isOpen, entityId, getEntityTransactions]);

  const handleTransactionUpdated = async () => {
    // Reload transactions after update/delete
    setLoading(true);
    try {
      const data = await getEntityTransactions(entityId);
      setEntityTransactions(data);
    } catch (error) {
      console.error('Error reloading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Movimientos de {entityType === 'CLIENT' ? 'Cliente' : 'Proveedor'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{entityName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-slate-600">Cargando movimientos...</span>
            </div>
          ) : (
            <TransactionsTable 
              transactions={entityTransactions} 
              showEntityColumn={false}
              onTransactionUpdated={handleTransactionUpdated}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntityTransactionsModal;
