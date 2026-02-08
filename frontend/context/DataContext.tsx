import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Box, Entity, Transaction } from '../types';
import { INITIAL_BOXES, INITIAL_CLIENTS, INITIAL_PROVIDERS } from '../constants';
import { generateId } from '../utils';
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

interface DataContextType {
  boxes: Box[];
  clients: Entity[];
  providers: Entity[];
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (t: Omit<Transaction, 'id' | 'date'>) => void;
  addEntity: (e: Omit<Entity, 'id' | 'balance'>) => void;
  deleteEntity: (id: string, type: 'CLIENT' | 'PROVIDER') => void;
  updateInitialBalance: (entityId: string, amount: number) => void;
  updateBoxInitialBalance: (boxId: string, amount: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();
  
  // Initialize empty to wait for API data. 
  // If you want offline/demo mode by default, use INITIAL_* constants here.
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [clients, setClients] = useState<Entity[]>([]);
  const [providers, setProviders] = useState<Entity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load data from API only when user is authenticated
  useEffect(() => {
    if (!user) {
      // No session, reset data and don't load
      setBoxes([]);
      setClients([]);
      setProviders([]);
      setTransactions([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Fetching data from API...');
        const [fetchedBoxes, fetchedClients, fetchedProviders, fetchedTx] = await Promise.all([
          apiService.getBoxes(),
          apiService.getClients(),
          apiService.getProviders(),
          apiService.getTransactions()
        ]);
        
        setBoxes(fetchedBoxes);
        setClients(fetchedClients);
        setProviders(fetchedProviders);
        setTransactions(fetchedTx);
        console.log('Data loaded successfully');
      } catch (error) {
        console.error("Error loading initial data from API", error);
        // Fallback for demo/development if API fails
        console.warn("Falling back to local demo data");
        setBoxes(INITIAL_BOXES);
        setClients(INITIAL_CLIENTS);
        setProviders(INITIAL_PROVIDERS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const addEntity = async (e: Omit<Entity, 'id' | 'balance'>) => {
    // 1. Optimistic Update (Update UI immediately)
    const tempId = generateId();
    const newEntity: Entity = {
      ...e,
      id: tempId,
      balance: 0
    };

    if (e.type === 'CLIENT') {
      setClients(prev => [...prev, newEntity]);
      try {
        await apiService.createClient({ name: e.name });
      } catch (error) {
        console.error("API Error creating client", error);
      }
    } else {
      setProviders(prev => [...prev, newEntity]);
      try {
        await apiService.createProvider({ name: e.name });
      } catch (error) {
        console.error("API Error creating provider", error);
      }
    }
  };

  const deleteEntity = async (id: string, type: 'CLIENT' | 'PROVIDER') => {
    if (type === 'CLIENT') {
      setClients(prev => prev.filter(c => c.id !== id));
      try {
        await apiService.deactivateClient(id);
      } catch (error) {
        console.error("API Error deactivating client", error);
      }
    } else {
      setProviders(prev => prev.filter(p => p.id !== id));
      try {
        await apiService.deactivateProvider(id);
      } catch (error) {
        console.error("API Error deactivating provider", error);
      }
    }
  };

  const updateInitialBalance = async (entityId: string, amount: number) => {
    const isClient = clients.find(c => c.id === entityId);
    const target = isClient ? 'CLIENT' : 'PROVIDER';

    const transaction: Transaction = {
      id: generateId(),
      date: new Date().toISOString(),
      type: 'INITIAL_BALANCE',
      amount: amount,
      description: `Saldo inicial establecido: ${amount}`,
      entityId: entityId
    };

    setTransactions(prev => [transaction, ...prev]);

    if (target === 'CLIENT') {
      setClients(prev => prev.map(c => c.id === entityId ? { ...c, balance: amount } : c));
    } else {
      setProviders(prev => prev.map(p => p.id === entityId ? { ...p, balance: amount } : p));
    }

    try {
      await apiService.setInitialBalance({ entityId, type: target, amount });
    } catch (error) {
      console.error("API Error setting initial balance", error);
    }
  };

  const updateBoxInitialBalance = async (boxId: string, amount: number) => {
      const transaction: Transaction = {
          id: generateId(),
          date: new Date().toISOString(),
          type: 'INITIAL_BALANCE',
          amount: amount,
          description: `Ajuste manual de caja`,
          boxId: boxId
      };
      setTransactions(prev => [transaction, ...prev]);
      setBoxes(prev => prev.map(b => b.id === boxId ? { ...b, balance: amount } : b));

      try {
        await apiService.setInitialBalance({ entityId: boxId, type: 'BOX', amount });
      } catch (error) {
        console.error("API Error setting box balance", error);
      }
  }

  const addTransaction = async (t: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...t,
      id: generateId(),
      date: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);

    switch (t.type) {
      case 'SALE':
        if (t.entityId) {
          setClients(prev => prev.map(c => c.id === t.entityId ? { ...c, balance: c.balance + t.amount } : c));
        }
        break;
      case 'COLLECTION':
        if (t.entityId && t.boxId) {
          setClients(prev => prev.map(c => c.id === t.entityId ? { ...c, balance: c.balance - t.amount } : c));
          setBoxes(prev => prev.map(b => b.id === t.boxId ? { ...b, balance: b.balance + t.amount } : b));
        }
        break;
      case 'PURCHASE':
        if (t.entityId) {
          setProviders(prev => prev.map(p => p.id === t.entityId ? { ...p, balance: p.balance + t.amount } : p));
        }
        break;
      case 'PAYMENT':
        if (t.entityId && t.boxId) {
          setProviders(prev => prev.map(p => p.id === t.entityId ? { ...p, balance: p.balance - t.amount } : p));
          setBoxes(prev => prev.map(b => b.id === t.boxId ? { ...b, balance: b.balance - t.amount } : b));
        }
        break;
      case 'TRANSFER':
        if (t.boxId && t.targetBoxId) {
          setBoxes(prev => prev.map(b => {
            if (b.id === t.boxId) return { ...b, balance: b.balance - t.amount };
            if (b.id === t.targetBoxId) return { ...b, balance: b.balance + t.amount };
            return b;
          }));
        }
        break;
      case 'INCOME':
        if (t.boxId) {
          setBoxes(prev => prev.map(b => b.id === t.boxId ? { ...b, balance: b.balance + t.amount } : b));
        }
        break;
      case 'EXPENSE':
        if (t.boxId) {
          setBoxes(prev => prev.map(b => b.id === t.boxId ? { ...b, balance: b.balance - t.amount } : b));
        }
        break;
    }

    try {
      await apiService.createTransaction(t);
    } catch (error) {
      console.error("API Error creating transaction", error);
    }
  };

  const value = useMemo(() => ({
    boxes,
    clients,
    providers,
    transactions,
    loading,
    addTransaction,
    addEntity,
    deleteEntity,
    updateInitialBalance,
    updateBoxInitialBalance
  }), [boxes, clients, providers, transactions, loading]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};