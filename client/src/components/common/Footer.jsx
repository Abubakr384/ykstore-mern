import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, Headphones, RefreshCw, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800/60">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Express Delivery</h4>
              <p className="text-xs text-slate-400">Fast nationwide shipping & COD</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Secure Checkout</h4>
              <p className="text-xs text-slate-400">Encrypted payment & Stripe test mode</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Hassle-free Returns</h4>
              <p className="text-xs text-slate-400">30-day money-back guarantee</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Support standard & instant help</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                YK<span className="text-brand-400">Store</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Yousaf Kana Store (YKStore) is a premium MERN stack e-commerce experience designed for sleek shopping, instant search, authenticated carts, and seamless checkout.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-brand-500 hover:text-slate-950 flex items-center justify-center transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-brand-500 hover:text-slate-950 flex items-center justify-center transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-brand-500 hover:text-slate-950 flex items-center justify-center transition">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Shop Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products?category=electronics-tech" className="hover:text-brand-400 transition">Electronics & Tech</Link></li>
              <li><Link to="/products?category=luxury-apparel" className="hover:text-brand-400 transition">Luxury Apparel</Link></li>
              <li><Link to="/products?category=home-living" className="hover:text-brand-400 transition">Home & Living</Link></li>
              <li><Link to="/products?category=watches-jewelry" className="hover:text-brand-400 transition">Watches & Jewelry</Link></li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/my-orders" className="hover:text-brand-400 transition">Track My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-brand-400 transition">Shopping Bag</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition">Customer Sign In</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition">Join YKStore</Link></li>
            </ul>
          </div>

          {/* Admin & System */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Store Admin</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/admin" className="hover:text-brand-400 transition">Admin Dashboard</Link></li>
              <li><Link to="/admin/products" className="hover:text-brand-400 transition">Manage Inventory</Link></li>
              <li><Link to="/admin/orders" className="hover:text-brand-400 transition">Manage Orders</Link></li>
              <li><Link to="/admin/categories" className="hover:text-brand-400 transition">Manage Categories</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} YKStore (Yousaf Kana Store). All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-slate-400">
            Powered by MERN Stack (Node, Express, MongoDB, React, Tailwind)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
