import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils';
import { PlusCircle, DollarSign, UserPlus, Trash2 } from 'lucide-react';

type Tab = 'LIST' | 'SALE' | 'COLLECTION';

const Clients: React.FC = () => {
  const { clients, boxes, addTransaction, addEntity, deleteEntity } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('LIST');
  
  // Forms States
  const [newClientName, setNewClientName] = useState('');
  const [saleData, setSaleData] = useState({ clientId: '', amount: '', desc: '' });
  const [collectData, setCollectData] = useState({ clientId: '', boxId: '', amount: '', desc: '' });
  const [msg, setMsg] = useState('');

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;
    addEntity({ name: newClientName, type: 'CLIENT' });
    setNewClientName('');
    setMsg('Cliente agregado');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar al cliente "${name}"?`)) {
      deleteEntity(id, 'CLIENT');
    }
  };

  const handleSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleData.clientId || !saleData.amount) return;
    addTransaction({
      type: 'SALE',
      amount: parseFloat(saleData.amount),
      description: saleData.desc || 'Venta registrada',
      entityId: saleData.clientId
    });
    setSaleData({ clientId: '', amount: '', desc: '' });
    setMsg('Venta registrada correctamente');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectData.clientId || !collectData.boxId || !collectData.amount) return;
    addTransaction({
      type: 'COLLECTION',
      amount: parseFloat(collectData.amount),
      description: collectData.desc || 'Cobro registrado',
      entityId: collectData.clientId,
      boxId: collectData.boxId
    });
    setCollectData({ clientId: '', boxId: '', amount: '', desc: '' });
    setMsg('Cobro registrado correctamente');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
          <p className="text-slate-500">Gestión de cuentas corrientes</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('LIST')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'LIST' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Listado
          </button>
          <button 
            onClick={() => setActiveTab('SALE')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'SALE' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Nueva Venta
          </button>
          <button 
            onClick={() => setActiveTab('COLLECTION')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'COLLECTION' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Registrar Cobro
          </button>
        </div>
      </div>

      {msg && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-center">{msg}</div>}

      {activeTab === 'LIST' && (
        <div className="space-y-6">
           {/* Add Client Mini Form */}
           <form onSubmit={handleAddClient} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nuevo Cliente</label>
                <input 
                  type="text" 
                  placeholder="Nombre o Razón Social"
                  className="w-full bg-white text-black placeholder-gray-500 border-slate-300 rounded-lg border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg flex items-center gap-2 text-sm font-medium h-[38px]">
                <UserPlus size={16} /> Agregar
              </button>
           </form>

           {/* Table */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Cliente</th>
                    <th className="p-4 font-semibold text-right">Saldo (A Favor)</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-800 font-medium">{c.name}</td>
                      <td className={`p-4 text-right font-bold ${c.balance > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                        {formatCurrency(c.balance)}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteClient(c.id, c.name)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar cliente"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-slate-400">No hay clientes registrados</td></tr>
                  )}
                </tbody>
              </table>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'SALE' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PlusCircle className="text-blue-500" /> Registrar Venta (Cuenta Corriente)
          </h3>
          <form onSubmit={handleSale} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
              <select 
                className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={saleData.clientId}
                onChange={e => setSaleData({...saleData, clientId: e.target.value})}
              >
                <option value="">Seleccione cliente...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto Total</label>
              <input 
                type="number" step="0.01" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={saleData.amount}
                onChange={e => setSaleData({...saleData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <input 
                type="text" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                placeholder="Ej: Factura A-0001"
                value={saleData.desc}
                onChange={e => setSaleData({...saleData, desc: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Confirmar Venta</button>
          </form>
        </div>
      )}

      {activeTab === 'COLLECTION' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <DollarSign className="text-green-500" /> Registrar Cobro
          </h3>
          <form onSubmit={handleCollection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
              <select 
                className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={collectData.clientId}
                onChange={e => setCollectData({...collectData, clientId: e.target.value})}
              >
                <option value="">Seleccione cliente...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} (Saldo: {formatCurrency(c.balance)})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ingresa a Caja</label>
              <select 
                className="w-full bg-white text-black p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={collectData.boxId}
                onChange={e => setCollectData({...collectData, boxId: e.target.value})}
              >
                <option value="">Seleccione caja...</option>
                {boxes.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto Cobrado</label>
              <input 
                type="number" step="0.01" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={collectData.amount}
                onChange={e => setCollectData({...collectData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <input 
                type="text" className="w-full bg-white text-black placeholder-gray-500 p-2 border border-slate-300 rounded-lg focus:ring-blue-500"
                value={collectData.desc}
                onChange={e => setCollectData({...collectData, desc: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Confirmar Cobro</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Clients;