import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'emerald' }) => {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-lg">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-white">{value}</h3>
        {trend && <p className="text-xs text-emerald-400 font-medium">{trend}</p>}
      </div>

      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${colorMap[color] || colorMap.emerald}`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
};

export default StatsCard;
