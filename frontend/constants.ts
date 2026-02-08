import { Box, BoxType, Entity } from './types';

export const APP_NAME = "Sistema GR";

export const USERS = [
  { username: 'admin', password: '123', name: 'Administrador' },
  { username: 'gerencia', password: '123', name: 'Gerencia' }
];

export const INITIAL_BOXES: Box[] = [
  { id: 'box_1', name: 'Caja Efectivo', type: BoxType.EFECTIVO, balance: 0 },
  { id: 'box_2', name: 'Caja Cheques', type: BoxType.CHEQUES, balance: 0 },
  { id: 'box_3', name: 'Caja Transferencias', type: BoxType.TRANSFERENCIAS, balance: 0 },
];

export const INITIAL_CLIENTS: Entity[] = [
  { id: 'cli_1', name: 'Cliente Generico', type: 'CLIENT', balance: 0, contact: '' },
];

export const INITIAL_PROVIDERS: Entity[] = [
  { id: 'prov_1', name: 'Proveedor Generico', type: 'PROVIDER', balance: 0, contact: '' },
];
