import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Star } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import ProductCard from '../../components/customer/ProductCard';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axiosInstance.get('/products?isFeatured=true&pageSize=4'),
          axiosInstance.get('/categories')
        ]);
        setFeaturedProducts(prodRes.data.products || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to fetch home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Yousaf Kana Store — Premium Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Redefining Modern <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200">
                Luxury Shopping
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore handpicked tech, luxury apparel, lifestyle decor, and handcrafted timepieces delivered straight to your doorstep with guaranteed fast shipping.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/products?sort=newest"
                className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold rounded-2xl border border-slate-700/70 flex items-center justify-center transition"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Hero Showcase Graphic */}
          <div className="flex-1 w-full max-w-lg relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-md">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="YKStore Featured Hero Product"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-400">Spotlight Product</span>
                  <h4 className="text-sm font-extrabold text-white">Aura Sound Pro Wireless</h4>
                  <p className="text-xs text-slate-400">$249.00 • Studio Audio</p>
                </div>
                <Link
                  to="/products"
                  className="px-3.5 py-2 bg-brand-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-brand-400 transition"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Browse Categories</h2>
            <p className="text-sm text-slate-400">Curated collections tailored to your lifestyle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="group relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-lg hover:border-brand-500/50 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">{cat.description}</p>
                <div className="mt-3 flex items-center text-xs font-bold text-brand-400 group-hover:translate-x-1 transition">
                  <span>Explore Items</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Handpicked Highlights</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center"
          >
            View All ({featuredProducts.length}+) <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading featured items..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onQuickAdd={(name) => setToastMessage(`Added "${name}" to your cart!`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};

export default Home;
