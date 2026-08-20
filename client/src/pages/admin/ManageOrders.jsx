import React, { useEffect, useState } from 'react';
import { ShoppingCart, Clock, CheckCircle2, Truck, XCircle, Package } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/admin/orders');
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setToastMessage(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-6 bg-slate-950">
        <AdminHeader
          title="Manage Customer Orders"
          subtitle="Inspect customer order payloads, update delivery status, and review payment status"
        />

        {loading ? (
          <Loader text="Loading store orders..." />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Order Ref</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items Count</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-300">
                        #{ord._id.substring(ord._id.length - 8)}
                        <span className="block text-[10px] text-slate-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-100">{ord.user?.name || 'Customer'}</p>
                        <p className="text-xs text-slate-400">{ord.shippingAddress?.city}, {ord.shippingAddress?.country}</p>
                      </td>

                      <td className="px-6 py-4 text-xs font-bold text-slate-200">
                        {ord.orderItems?.length} items
                      </td>

                      <td className="px-6 py-4 font-bold text-white">${ord.totalPrice.toFixed(2)}</td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          ord.isPaid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {ord.paymentMethod} ({ord.isPaid ? 'Paid' : 'Unpaid'})
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {toastMessage && (
          <Toast type="success" message={toastMessage} onClose={() => setToastMessage('')} />
        )}
      </main>
    </div>
  );
};

export default ManageOrders;
