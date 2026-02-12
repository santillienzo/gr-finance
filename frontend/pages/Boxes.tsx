import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils';

const Boxes: React.FC = () => {
  const { boxes, addTransaction } = useData();
  const [transferData, setTransferData] = useState({
    fromBox: '',
    toBox: '',
    amount: '',
    description: ''
  });
  const [msg, setMsg] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferData.amount);
    
    if (!transferData.fromBox || !transferData.toBox || !amount) {
      setMsg('Complete todos los campos');
      return;
    }
    if (transferData.fromBox === transferData.toBox) {
      setMsg('Las cajas deben ser diferentes');
      return;
    }
    
    const sourceBox = boxes.find(b => b.id === transferData.fromBox);
    if (sourceBox && sourceBox.balance < amount) {
      setMsg('Saldo insuficiente en caja origen');
      return;
    }

    try {
      await addTransaction({
        type: 'TRANSFER',
        amount: amount,
        description: transferData.description || 'Transferencia interna',
        boxId: transferData.fromBox,
        targetBoxId: transferData.toBox
      });
      setTransferData({ fromBox: '', toBox: '', amount: '', description: '' });
      setMsg('Transferencia realizada con éxito');
      setTimeout(() => setMsg(''), 3000);
    } catch (error) {
      // Toast is shown by the axios interceptor
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Control de Cajas</h2>
        <p className="text-slate-500">Visualice saldos y realice transferencias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boxes.map(box => (
          <div key={box.id} className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Wallet size={24} />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                {box.type}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{box.name}</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">{formatCurrency(box.balance)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 max-w-2xl mx-auto border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ArrowRight className="text-blue-500" />
          Nueva Transferencia Interna
        </h3>
        
        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Origen</label>
              <select 
                className="w-full bg-white text-black border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                value={transferData.fromBox}
                onChange={e => setTransferData({...transferData, fromBox: e.target.value})}
              >
                <option value="">Seleccionar caja</option>
                {boxes.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({formatCurrency(b.balance)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
              <select 
                className="w-full bg-white text-black border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                value={transferData.toBox}
                onChange={e => setTransferData({...transferData, toBox: e.target.value})}
              >
                <option value="">Seleccionar caja</option>
                {boxes.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto (ARS)</label>
            <input 
              type="number" 
              min="0"
              step="0.01"
              className="w-full bg-white text-black placeholder-gray-500 border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              placeholder="0.00"
              value={transferData.amount}
              onChange={e => setTransferData({...transferData, amount: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Concepto (Opcional)</label>
             <input 
               type="text" 
               className="w-full bg-white text-black placeholder-gray-500 border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
               placeholder="Motivo de la transferencia"
               value={transferData.description}
               onChange={e => setTransferData({...transferData, description: e.target.value})}
             />
          </div>

          {msg && (
            <div className={`text-sm text-center p-2 rounded ${msg.includes('éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {msg}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Transferir
          </button>
        </form>
      </div>
    </div>
  );
};

export default Boxes;