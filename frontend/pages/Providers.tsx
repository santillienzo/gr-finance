import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils';
import { FileText, CreditCard, Truck, Trash2 } from 'lucide-react';

type Tab = 'LIST' | 'PURCHASE' | 'PAYMENT';

const Providers: React.FC = () => {
  const { providers, boxes, addTransaction, addEntity, deleteEntity } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('LIST');
  
  // Forms States
  const [newProvName, setNewProvName] = useState('');
  const [purchaseData, setPurchaseData] = useState({ provId: '', amount: '', desc: '' });
  const [payData, setPayData] = useState({ provId: '', boxId: '', amount: '', desc: '' });
  const [msg, setMsg] = useState('');

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName) return;
    addEntity({ name: newProvName, type: 'PROVIDER' });
    setNewProvName('');
    setMsg('Proveedor agregado');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleDeleteProvider = (id: string, name: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar al proveedor "${name}"?`)) {
      deleteEntity(id, 'PROVIDER');
    }
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseData.provId || !purchaseData.amount) return;
    addTransaction({
      type: 'PURCHASE',
      amount: parseFloat(purchaseData.amount),
      description: purchaseData.desc || 'Compra registrada',
      entityId: purchaseData.provId
    });
    setPurchaseData({ provId: '', amount: '', desc: '' });
    setMsg('Compra registrada (Deuda generada)');
    setTimeout(() => setMsg(''), 2000);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payData.provId || !payData.boxId || !payData.amount) return;
    
    const box = boxes.find(b => b.id === payData.boxId);
    if(box && box.balance < parseFloat(payData.amount)) {
        setMsg('Error: Saldo insuficiente en la caja seleccionada');
        setTimeout(() => setMsg(''), 3000);
        return;
    }

    addTransaction({
      type: 'PAYMENT',
      amount: parseFloat(payData.amount),
      description: payData.desc || 'Pago a proveedor',
      entityId: payData.provId,
      boxId: payData.boxId
    });
    setPayData({ provId: '', boxId: '', amount: '', desc: '' });
    setMsg('Pago registrado correctamente');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Proveedores</h2>
          <p className="text-slate-500">Gestión de deudas y pagos</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('LIST')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'LIST' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Listado
          </button>
          <button 
            onClick={() => setActiveTab('PURCHASE')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'PURCHASE' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Ingresar Factura
          </button>
          <button 
            onClick={() => setActiveTab('PAYMENT')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'PAYMENT' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Pagar Deuda
          </button>
        </div>
      </div>

      {msg && <div className={`p-3 rounded-lg text-center ${msg.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg}</div>}

      {activeTab === 'LIST' && (
        <div className="space-y-6">
           {/* Add Provider Mini Form */}
           <form onSubmit={handleAddProvider} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nuevo Proveedor</label>
                <input 
                  type="text" 
                  placeholder="Nombre o Razón Social"
                  className="w-full bg-white text-black placeholder-gray-500 border-slate-300 rounded-lg border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={newProvName}
                  onChange={e => setNewProvName(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg flex items-center gap-2 text-sm font-medium h-[38px]">
                <Truck size={16} /> Agregar
              </button>
           </form>

           {/* Table */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Proveedor</th>
                    <th className="p-4 font-semibold text-right">Saldo (Deuda)</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {providers.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-800 font-medium">{p.name}</td>
                      <td className={`p-4 text-right font-bold ${p.balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {formatCurrency(p.balance)}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteProvider(p.id, p.name)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar proveedor"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {providers.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-slate-400">No hay proveedores registrados</td></tr>
                  )}
                </tbody>
              </table>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'PURCHASE' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="text-blue-500" /> Registrar Factura de Compra
          </h3>
          <form onSubmit={handlePurchase} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor</label>
              <select 
                className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={purchaseData.provId}
                onChange={e => setPurchaseData({...purchaseData, provId: e.target.value})}
              >
                <option value="">Seleccione proveedor...</option>
                {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto de la Factura</label>
              <input 
                type="number" step="0.01" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={purchaseData.amount}
                onChange={e => setPurchaseData({...purchaseData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <input 
                type="text" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                placeholder="Ej: Compra mercadería"
                value={purchaseData.desc}
                onChange={e => setPurchaseData({...purchaseData, desc: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Registrar Deuda</button>
          </form>
        </div>
      )}

      {activeTab === 'PAYMENT' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CreditCard className="text-rose-500" /> Registrar Pago a Proveedor
          </h3>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor</label>
              <select 
                className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={payData.provId}
                onChange={e => setPayData({...payData, provId: e.target.value})}
              >
                <option value="">Seleccione proveedor...</option>
                {providers.map(p => <option key={p.id} value={p.id}>{p.name} (Deuda: {formatCurrency(p.balance)})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sale de Caja</label>
              <select 
                className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={payData.boxId}
                onChange={e => setPayData({...payData, boxId: e.target.value})}
              >
                <option value="">Seleccione caja...</option>
                {boxes.map(b => <option key={b.id} value={b.id}>{b.name} ({formatCurrency(b.balance)})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto a Pagar</label>
              <input 
                type="number" step="0.01" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={payData.amount}
                onChange={e => setPayData({...payData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <input 
                type="text" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={payData.desc}
                onChange={e => setPayData({...payData, desc: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700">Confirmar Pago</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Providers;