import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import ProductCard from '../../components/customer/ProductCard';
import CategoryFilter from '../../components/customer/CategoryFilter';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  // Search & Filter state
  const keyword = searchParams.get('keyword') || '';
  const selectedCategory = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const pageNumber = Number(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput] = useState(keyword);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/categories');
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryStr = new URLSearchParams({
        keyword,
        category: selectedCategory,
        sort,
        pageNumber,
        pageSize: 8
      }).toString();

      const { data } = await axiosInstance.get(`/products?${queryStr}`);
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1'); // Reset to first page on filter change
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ keyword: searchInput.trim() });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Shop Catalog</h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover {products.length} premium products in our store catalog
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search product title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-brand-500"
            />
            <button type="submit" className="absolute right-3 top-3 text-slate-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            className="px-4 py-3 bg-brand-500 text-slate-950 font-bold text-sm rounded-xl hover:bg-brand-400 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Controls Bar: Mobile filter button & Sort selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-slate-200"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>

        {/* Applied Filters Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {keyword && (
            <span className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold rounded-full flex items-center space-x-1">
              <span>Query: "{keyword}"</span>
              <button onClick={() => updateFilters({ keyword: '' })} className="ml-1 text-slate-400 hover:text-white">×</button>
            </span>
          )}
          {selectedCategory && (
            <span className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold rounded-full flex items-center space-x-1">
              <span>Category Filter</span>
              <button onClick={() => updateFilters({ category: '' })} className="ml-1 text-slate-400 hover:text-white">×</button>
            </span>
          )}
          {(keyword || selectedCategory) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-400 hover:underline flex items-center ml-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Reset All
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sort By:</span>
          <select
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter Component */}
        <div className={`w-full lg:w-64 shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => updateFilters({ category: catId })}
          />
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 space-y-8">
          {loading ? (
            <Loader text="Fetching catalog items..." />
          ) : products.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <p className="text-lg font-bold text-slate-300">No products found matching your filter criteria.</p>
              <p className="text-sm text-slate-400">Try clearing search terms or selected category filter.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-brand-500 text-slate-950 font-bold text-sm rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onQuickAdd={(name) => setToastMessage(`Added "${name}" to your cart!`)}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', Math.max(1, pageNumber - 1).toString());
                  setSearchParams(params);
                }}
                disabled={pageNumber <= 1}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm font-semibold text-slate-300 px-4">
                Page <strong className="text-brand-400">{pageNumber}</strong> of {totalPages}
              </span>

              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', Math.min(totalPages, pageNumber + 1).toString());
                  setSearchParams(params);
                }}
                disabled={pageNumber >= totalPages}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

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

export default Products;
