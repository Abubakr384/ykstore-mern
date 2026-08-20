import React from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, CreditCard } from 'lucide-react';

const OrderCard = ({ order }) => {
  const statusColors = {
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Processing: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    Shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const statusIcons = {
    Pending: <Clock className="w-4 h-4 mr-1.5" />,
    Processing: <Package className="w-4 h-4 mr-1.5" />,
    Shipped: <Truck className="w-4 h-4 mr-1.5" />,
    Delivered: <CheckCircle2 className="w-4 h-4 mr-1.5" />,
    Cancelled: <XCircle className="w-4 h-4 mr-1.5" />
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Order #{order._id.substring(order._id.length - 8)}</span>
          <p className="text-xs text-slate-400 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || statusColors.Pending}`}>
            {statusIcons[order.status]}
            {order.status}
          </span>
        </div>
      </div>

      {/* Item thumbnails */}
      <div className="space-y-3">
        {order.orderItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-950"
              />
              <div>
                <p className="font-semibold text-slate-200 line-clamp-1">{item.name}</p>
                <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.price}</p>
              </div>
            </div>
            <span className="font-bold text-slate-100">${(item.quantity * item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center text-xs text-slate-400 space-x-2">
          <CreditCard className="w-4 h-4 text-brand-400" />
          <span>Payment: <strong className="text-slate-200">{order.paymentMethod}</strong> ({order.isPaid ? 'Paid' : 'Unpaid / COD'})</span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 mr-2">Total Amount:</span>
          <span className="text-lg font-extrabold text-brand-400">${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
