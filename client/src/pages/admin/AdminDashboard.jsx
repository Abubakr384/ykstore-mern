import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Package, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCard from '../../components/admin/StatsCard';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 bg-slate-950">
        <AdminHeader
          title="Dashboard Overview"
          subtitle="Real-time e-commerce performance metrics and recent customer activity"
        />

        {loading ? (
          <Loader text="Gathering store performance metrics..." />
        ) : (
          <>
            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Revenue"
                value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
                icon={DollarSign}
                color="brand"
                trend="Gross revenue from paid orders"
              />

              <StatsCard
                title="Total Orders"
                value={stats?.totalOrders || 0}
                icon={ShoppingCart}
                color="indigo"
                trend={`${stats?.pendingOrders || 0} pending processing`}
              />

              <StatsCard
                title="Total Products"
                value={stats?.totalProducts || 0}
                icon={Package}
                color="emerald"
                trend="Active catalog items"
              />

              <StatsCard
                title="Registered Users"
                value={stats?.totalUsers || 0}
                icon={Users}
                color="amber"
                trend="Customers & admins"
              />
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Recent Customer Orders</h3>
                  <p className="text-xs text-slate-400">Latest 5 orders placed in store</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-bold text-brand-400 hover:underline"
                >
                  View All Orders →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {stats?.recentOrders?.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono text-xs text-slate-300">
                          #{order._id.substring(order._id.length - 8)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-200">
                          {order.user?.name || 'Customer'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-white">${order.totalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
