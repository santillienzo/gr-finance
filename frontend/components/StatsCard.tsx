import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '../utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  subValue?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, subValue }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(value)}</h3>
        {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatsCard;
