export enum BoxType {
  EFECTIVO = 'EFECTIVO',
  CHEQUES = 'CHEQUES',
  TRANSFERENCIAS = 'TRANSFERENCIAS',
}

export enum EntityType {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
}

export enum TransactionType {
  SALE = 'SALE',
  COLLECTION = 'COLLECTION',
  PURCHASE = 'PURCHASE',
  PAYMENT = 'PAYMENT',
  TRANSFER = 'TRANSFER',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  INITIAL_BALANCE = 'INITIAL_BALANCE',
}

export interface JwtPayload {
  userId: string;
  username: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: JwtPayload;
}
