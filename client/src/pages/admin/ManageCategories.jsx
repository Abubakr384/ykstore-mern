import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/categories');
      setCategories(data || []);
    } catch (err) {
      console.error('Fetch categories error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description, image: cat.image });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await axiosInstance.delete(`/categories/${id}`);
        setToastMessage('Category removed');
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axiosInstance.put(`/categories/${editingCategory._id}`, formData);
        setToastMessage('Category updated successfully');
      } else {
        await axiosInstance.post('/categories', formData);
        setToastMessage('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-6 bg-slate-950">
        <AdminHeader
          title="Manage Categories"
          subtitle="Organize product catalog categories and taxonomy"
        />

        <div className="flex justify-end">
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg flex items-center space-x-2 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <img src={cat.image} alt={cat.name} className="w-full h-36 object-cover rounded-xl bg-slate-950" />
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base">{cat.name}</h4>
                <div className="flex items-center space-x-1">
                  <button onClick={() => handleOpenEditModal(cat)} className="p-1.5 text-slate-400 hover:text-brand-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat._id)} className="p-1.5 text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm rounded-xl transition"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </form>
        </Modal>

        {toastMessage && (
          <Toast type="success" message={toastMessage} onClose={() => setToastMessage('')} />
        )}
      </main>
    </div>
  );
};

export default ManageCategories;
