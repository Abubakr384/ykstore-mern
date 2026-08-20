import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import OrderCard from '../../components/customer/OrderCard';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get('/orders/myorders');
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch user orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
        <div className="w-12 h-12 bg-brand-500/10 text-brand-400 rounded-2xl flex items-center justify-center border border-brand-500/20">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Order History</h1>
          <p className="text-sm text-slate-400">View and track status of all your placed orders</p>
        </div>
      </div>

      {loading ? (
        <Loader text="Fetching your orders..." />
      ) : orders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No orders found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            You haven't placed any orders yet. Start exploring our store catalog today!
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-brand-500 text-slate-950 font-bold text-sm rounded-xl"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
