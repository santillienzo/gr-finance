export type TransactionType = 
  | 'SALE' // Venta (Aumenta deuda cliente)
  | 'COLLECTION' // Cobro (Disminuye deuda cliente, Aumenta Caja)
  | 'PURCHASE' // Compra (Aumenta deuda a proveedor)
  | 'PAYMENT' // Pago (Disminuye deuda proveedor, Disminuye Caja)
  | 'TRANSFER' // Transferencia entre cajas
  | 'INCOME' // Ingreso rápido (Aumenta Caja)
  | 'EXPENSE' // Egreso rápido (Disminuye Caja)
  | 'INITIAL_BALANCE'; // Saldo inicial

export enum BoxType {
  EFECTIVO = 'EFECTIVO',
  CHEQUES = 'CHEQUES',
  TRANSFERENCIAS = 'TRANSFERENCIAS'
}

export interface Box {
  id: string;
  name: string;
  type: BoxType;
  balance: number;
}

export interface Entity {
  id: string;
  name: string;
  type: 'CLIENT' | 'PROVIDER';
  balance: number; // For Client: Positive means they owe us. For Provider: Positive means we owe them.
  contact?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  type: TransactionType;
  amount: number;
  description: string;
  boxId?: string; // The box involved (for collection, payment, income, expense)
  targetBoxId?: string; // For transfers
  entityId?: string; // Client or Provider ID
}

export interface DashboardStats {
  totalCash: number;
  totalReceivable: number;
  totalPayable: number;
  netWorth: number; // own money + receivable - payable
}
