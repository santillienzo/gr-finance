import React from 'react';
import { useData } from '../context/DataContext';
import StatsCard from '../components/StatsCard';
import { Wallet, TrendingUp, TrendingDown, Landmark, PieChart } from 'lucide-react';
import { formatCurrency } from '../utils';

const Dashboard: React.FC = () => {
  const { boxes, clients, providers } = useData();

  const totalCash = boxes.reduce((acc, box) => acc + box.balance, 0);
  const totalReceivable = clients.reduce((acc, client) => acc + client.balance, 0);
  const totalPayable = providers.reduce((acc, provider) => acc + provider.balance, 0);
  const netWorth = totalCash + totalReceivable - totalPayable;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard General</h2>
        <p className="text-slate-500">Resumen financiero en tiempo real</p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Dinero Propio Total"
          value={totalCash}
          icon={Wallet}
          color="bg-blue-500"
          subValue="Suma de todas las cajas"
        />
        <StatsCard
          title="A Cobrar (Clientes)"
          value={totalReceivable}
          icon={TrendingUp}
          color="bg-emerald-500"
          subValue="Deuda de clientes"
        />
        <StatsCard
          title="Deuda (Proveedores)"
          value={totalPayable}
          icon={TrendingDown}
          color="bg-rose-500"
          subValue="Facturas por pagar"
        />
        <StatsCard
          title="Balance General"
          value={netWorth}
          icon={PieChart}
          color="bg-indigo-500"
          subValue="Efectivo + Cobrar - Pagar"
        />
      </div>

      {/* Detailed Box Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <Landmark size={20} className="text-blue-500" />
            Estado de Cajas
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boxes.map((box) => (
              <div key={box.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">{box.name}</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(box.balance)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
