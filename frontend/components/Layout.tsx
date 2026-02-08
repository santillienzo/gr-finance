import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Truck, 
  ArrowRightLeft, 
  LogOut, 
  Menu, 
  X,
  Zap
} from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Cajas', href: '/boxes', icon: Wallet },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Proveedores', href: '/providers', icon: Truck },
    { name: 'Movimientos', href: '/transactions', icon: ArrowRightLeft },
    { name: 'Acciones Rápidas', href: '/quick', icon: Zap },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-10 shadow-2xl border-r border-slate-800 transition-all duration-300">
        <div className="p-6 flex items-center justify-center border-b border-slate-800/60">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-wider">
            {APP_NAME}
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out
                  ${active
                    ? 'bg-slate-800/80 text-blue-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}
                `}
              >
                <item.icon
                  size={20}
                  className={`transition-transform duration-300 ${active ? 'scale-105' : 'group-hover:scale-110'}`}
                />
                <span className="font-medium tracking-wide text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer with Compact Logout */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30 border border-slate-800/50">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg ring-2 ring-slate-800">
                {user?.name.charAt(0)}
              </div>
              <div className="text-sm truncate">
                <p className="text-slate-200 font-semibold leading-none truncate">{user?.name}</p>
                <p className="text-slate-500 text-xs mt-1">Conectado</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              title="Cerrar Sesión"
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 flex-shrink-0"
            >
              <LogOut size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed w-full bg-slate-900 text-white z-20 flex justify-between items-center p-4 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {APP_NAME}
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-slate-900 pt-20 px-4 pb-4 animate-in slide-in-from-top-10 fade-in duration-200">
           <nav className="space-y-2 mt-2">
            {navigation.map((item) => {
               const active = isActive(item.href);
               return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${active
                      ? 'bg-slate-800 text-blue-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
               )
            })}
            
            <div className="mt-8 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between px-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="text-slate-300">{user?.name}</span>
                 </div>
                 <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="p-2 text-red-400 bg-red-400/10 rounded-lg"
                 >
                    <LogOut size={20} />
                 </button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;