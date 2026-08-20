import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Layers, ArrowLeft, Sparkles } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Products', path: '/admin/products', icon: Package },
    { name: 'Manage Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Manage Categories', path: '/admin/categories', icon: Layers },
    { name: 'Manage Users', path: '/admin/users', icon: Users }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between min-h-[calc(100vh-80px)]">
      <div className="p-4 space-y-6">
        <div className="px-3 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">YKStore Admin Suite</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition ${
                  isActive
                    ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center justify-center px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Public Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
