import React from 'react';
import { Box } from '../types';

export const getBoxName = (boxes: Box[], id?: string): string => {
  if (!id) return '-';
  const b = boxes.find(x => x.id === id);
  return b ? b.name : 'Caja eliminada';
};

export const TypeLabel = ({ type }: { type: string }): React.ReactElement => {
  switch (type) {
    case 'SALE': return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">VENTA</span>;
    case 'COLLECTION': return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">COBRO</span>;
    case 'PURCHASE': return <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-bold">COMPRA</span>;
    case 'PAYMENT': return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold">PAGO</span>;
    case 'TRANSFER': return <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs font-bold">TRANSF.</span>;
    case 'INCOME': return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">INGRESO</span>;
    case 'EXPENSE': return <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-xs font-bold">EGRESO</span>;
    case 'INITIAL_BALANCE': return <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold">INICIAL</span>;
    default: return <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold">{type}</span>;
  }
};
