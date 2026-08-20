import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Check, X } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    description: '',
    image: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosInstance.get('/products?pageSize=100'),
        axiosInstance.get('/categories')
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: categories[0]?._id || '',
      stock: 10,
      description: '',
      image: '',
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      category: typeof prod.category === 'object' ? prod.category._id : prod.category,
      stock: prod.stock,
      description: prod.description,
      image: prod.images ? prod.images[0] : '',
      isFeatured: prod.isFeatured || false
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        setToastMessage('Product deleted successfully');
        fetchData();
      } catch (err) {
        console.error('Delete product error:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        description: formData.description,
        images: formData.image ? [formData.image] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
        isFeatured: formData.isFeatured
      };

      if (editingProduct) {
        await axiosInstance.put(`/products/${editingProduct._id}`, payload);
        setToastMessage('Product updated successfully');
      } else {
        await axiosInstance.post('/products', payload);
        setToastMessage('New product created successfully');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-6 bg-slate-950">
        <AdminHeader
          title="Manage Inventory Products"
          subtitle="Add new products, edit pricing, adjust stock, or update product catalog"
        />

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search product inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-950"
                        />
                        <div>
                          <p className="font-semibold text-slate-100 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-slate-400">ID: #{p._id.substring(p._id.length - 6)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-300">
                      {typeof p.category === 'object' ? p.category?.name : 'Category'}
                    </td>

                    <td className="px-6 py-4 font-bold text-white">${p.price}</td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {p.isFeatured ? (
                        <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold">Yes</span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-xl transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
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

        {/* Add/Edit Product Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? 'Edit Product Details' : 'Create New Product'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Selling Price ($) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Original Price ($)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Product Image (Upload File or Enter URL)</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        const base64Img = reader.result;
                        try {
                          const res = await axiosInstance.post('/upload', { image: base64Img });
                          setFormData({ ...formData, image: res.data.url });
                        } catch (uploadErr) {
                          setFormData({ ...formData, image: base64Img });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-500/20 file:text-brand-300 hover:file:bg-brand-500/30 cursor-pointer"
                />
                
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or paste Image URL: https://..."
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
                />

                {formData.image && (
                  <div className="flex items-center space-x-3 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                    <img src={formData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                    <span className="text-xs text-emerald-400 font-semibold">Image Loaded & Ready ✓</span>
                  </div>
                )}
              </div>
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

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-brand-500 w-4 h-4"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-200">
                Mark as Featured Product on Homepage
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm rounded-xl transition"
            >
              {editingProduct ? 'Save Product Changes' : 'Create Product'}
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

export default ManageProducts;
