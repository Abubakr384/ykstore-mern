import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="w-24 h-24 bg-brand-500/10 text-brand-400 rounded-full flex items-center justify-center mx-auto border border-brand-500/20 shadow-xl shadow-brand-500/10 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">Order Successfully Confirmed</span>
          <h1 className="text-3xl font-black text-white">Thank You For Your Order!</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Your purchase order has been placed into our system. We are preparing your package for shipment.
          </p>
        </div>

        {order && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left space-y-4 max-w-lg mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">Order ID: #{order._id}</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 font-bold uppercase">
                {order.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <strong className="text-white">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Shipping Address:</span>
                <strong className="text-white max-w-[200px] truncate text-right">
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                </strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                <span className="text-slate-200">Total Paid:</span>
                <span className="text-brand-400">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/my-orders"
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black rounded-2xl transition shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Track My Orders</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
