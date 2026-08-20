import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ShieldCheck, User } from 'lucide-react';

const AdminHeader = ({ title, subtitle }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl self-start md:self-auto">
        <ShieldCheck className="w-5 h-5 text-brand-400" />
        <div className="text-left">
          <p className="text-xs font-bold text-slate-200">{user?.name || 'Admin User'}</p>
          <p className="text-[10px] text-brand-400 uppercase font-semibold">Store Administrator</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
