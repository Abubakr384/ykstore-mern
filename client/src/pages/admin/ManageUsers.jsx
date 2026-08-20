import React, { useEffect, useState } from 'react';
import { Users, Shield, User, Trash2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/admin/users');
      setUsers(data || []);
    } catch (err) {
      console.error('Fetch users error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await axiosInstance.put(`/admin/users/${userId}/role`, { role: newRole });
      setToastMessage(`User role changed to ${newRole}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/admin/users/${userId}`);
        setToastMessage('User deleted successfully');
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-6 bg-slate-950">
        <AdminHeader
          title="Manage Users & Access"
          subtitle="Customer directory, role privileges, and account management"
        />

        {loading ? (
          <Loader text="Fetching registered user directory..." />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-semibold text-slate-100 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-brand-400 font-bold flex items-center justify-center text-xs border border-slate-700">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>

                      <td className="px-6 py-4 text-slate-300">{u.email}</td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleRole(u._id, u.role)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition"
                        >
                          Toggle {u.role === 'admin' ? 'Customer' : 'Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

export default ManageUsers;
