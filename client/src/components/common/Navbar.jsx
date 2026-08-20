import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, LayoutDashboard, PackageCheck, Menu, X, Sparkles, Heart } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-300 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition duration-200">
                <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  YK<span className="text-brand-400">Store</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Yousaf Kana Store
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search products, brands & gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/70 text-slate-100 placeholder-slate-400 text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-full flex items-center justify-center transition shadow"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation Items - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-slate-300 hover:text-brand-400 transition"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium text-slate-300 hover:text-brand-400 transition"
            >
              Shop Catalog
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-slate-300 hover:text-rose-400 hover:bg-slate-800/60 rounded-full transition"
              title="My Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-300 hover:text-brand-400 hover:bg-slate-800/60 rounded-full transition"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-slate-950 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account / Admin Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-full transition"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-200 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {user.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-brand-400 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2.5" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-brand-400 transition"
                    >
                      <PackageCheck className="w-4 h-4 mr-2.5" />
                      My Orders
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-slate-950 px-4 py-2 rounded-xl shadow-lg shadow-brand-500/20 transition transform hover:-translate-y-0.5"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-brand-400"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-slate-950 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search & Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-4 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-xl pl-4 pr-10 py-2.5"
            />
            <button type="submit" className="absolute right-3 top-3 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-3 pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-brand-400 py-1"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-brand-400 py-1"
            >
              All Products
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-brand-400 font-semibold py-1 flex items-center"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Panel
                  </Link>
                )}
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-brand-400 py-1 flex items-center"
                >
                  <PackageCheck className="w-4 h-4 mr-2" /> My Orders
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="text-rose-400 py-1 text-left flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout ({user.name})
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-slate-200 bg-slate-800 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-slate-950 font-bold bg-brand-500 rounded-xl"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
