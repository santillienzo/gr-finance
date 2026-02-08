import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils';
import { ArrowUpCircle, ArrowDownCircle, Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
  const { boxes, clients, providers, addTransaction, updateInitialBalance, updateBoxInitialBalance } = useData();
  const [quickType, setQuickType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [quickData, setQuickData] = useState({ boxId: '', amount: '', desc: '' });
  const [msg, setMsg] = useState('');
  
  // Initial Balance States
  const [initEntity, setInitEntity] = useState({ id: '', type: 'BOX', amount: '' }); // type: BOX, CLIENT, PROVIDER
  const [initMsg, setInitMsg] = useState('');

  const handleQuickAction = (e: React.FormEvent) => {
    e.preventDefault();
    if(!quickData.boxId || !quickData.amount) return;

    if (quickType === 'EXPENSE') {
        const box = boxes.find(b => b.id === quickData.boxId);
        if(box && box.balance < parseFloat(quickData.amount)) {
            setMsg('Error: Saldo insuficiente');
            setTimeout(() => setMsg(''), 2000);
            return;
        }
    }

    addTransaction({
      type: quickType,
      amount: parseFloat(quickData.amount),
      description: quickData.desc || (quickType === 'INCOME' ? 'Ingreso Rápido' : 'Salida Rápida'),
      boxId: quickData.boxId
    });
    setQuickData({ boxId: '', amount: '', desc: '' });
    setMsg('Movimiento registrado');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleInitialBalance = (e: React.FormEvent) => {
      e.preventDefault();
      if(!initEntity.id || !initEntity.amount) return;
      
      const amount = parseFloat(initEntity.amount);
      if(initEntity.type === 'BOX') {
        updateBoxInitialBalance(initEntity.id, amount);
      } else {
        updateInitialBalance(initEntity.id, amount);
      }
      setInitMsg('Saldo inicial actualizado');
      setInitEntity({ id: '', type: 'BOX', amount: '' });
      setTimeout(() => setInitMsg(''), 2000);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Acciones Rápidas</h2>
        <p className="text-slate-500">Ingresos/Egresos directos y configuración de saldos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Quick Money In/Out */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {quickType === 'INCOME' ? <ArrowUpCircle className="text-green-500" /> : <ArrowDownCircle className="text-red-500" />}
                Movimiento Directo de Caja
             </h3>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setQuickType('INCOME')}
                  className={`px-3 py-1 rounded text-xs font-bold ${quickType === 'INCOME' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}
                >Ingreso</button>
                <button 
                  onClick={() => setQuickType('EXPENSE')}
                  className={`px-3 py-1 rounded text-xs font-bold ${quickType === 'EXPENSE' ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}
                >Salida</button>
             </div>
           </div>

           <form onSubmit={handleQuickAction} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Caja Afectada</label>
               <select 
                className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg"
                value={quickData.boxId}
                onChange={e => setQuickData({...quickData, boxId: e.target.value})}
               >
                 <option value="">Seleccionar caja...</option>
                 {boxes.map(b => <option key={b.id} value={b.id}>{b.name} ({formatCurrency(b.balance)})</option>)}
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Monto</label>
               <input 
                 type="number" step="0.01" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg"
                 value={quickData.amount}
                 onChange={e => setQuickData({...quickData, amount: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
               <input 
                 type="text" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg"
                 placeholder="Ej: Compra insumos oficina"
                 value={quickData.desc}
                 onChange={e => setQuickData({...quickData, desc: e.target.value})}
               />
             </div>
             <button type="submit" className={`w-full text-white font-bold py-3 rounded-lg ${quickType === 'INCOME' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
               Registrar {quickType === 'INCOME' ? 'Ingreso' : 'Salida'}
             </button>
             {msg && <p className="text-center text-sm font-medium text-slate-600 bg-slate-100 p-2 rounded">{msg}</p>}
           </form>
        </div>

        {/* Initial Balances */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Settings className="text-slate-500" /> Configurar Saldos Iniciales
          </h3>
          <p className="text-xs text-slate-500 mb-4 bg-yellow-50 p-2 rounded border border-yellow-100">
            Úselo para iniciar el sistema o realizar ajustes manuales forzados. Esto sobrescribe el saldo actual.
          </p>

          <form onSubmit={handleInitialBalance} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Entidad</label>
               <select 
                 className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg"
                 value={initEntity.type}
                 onChange={e => {
                     setInitEntity({ type: e.target.value, id: '', amount: '' });
                 }}
               >
                 <option value="BOX">Caja de Dinero</option>
                 <option value="CLIENT">Cliente (Deuda Vieja)</option>
                 <option value="PROVIDER">Proveedor (Deuda Vieja)</option>
               </select>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar</label>
                <select 
                    className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg"
                    value={initEntity.id}
                    onChange={e => setInitEntity({...initEntity, id: e.target.value})}
                >
                    <option value="">Seleccione...</option>
                    {initEntity.type === 'BOX' && boxes.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                    {initEntity.type === 'CLIENT' && clients.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                    {initEntity.type === 'PROVIDER' && providers.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Nuevo Saldo (ARS)</label>
               <input 
                 type="number" step="0.01" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg"
                 value={initEntity.amount}
                 onChange={e => setInitEntity({...initEntity, amount: e.target.value})}
               />
             </div>
             
             <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg">
               Establecer Saldo
             </button>
             {initMsg && <p className="text-center text-sm font-medium text-green-600 bg-green-50 p-2 rounded">{initMsg}</p>}
          </form>
        </div>

      </div>
    </div>
  );
};

export default QuickActions;