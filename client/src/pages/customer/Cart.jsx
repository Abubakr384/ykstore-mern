import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import CartItem from '../../components/customer/CartItem';

const Cart = () => {
  const { cartItems, totalItems, subtotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const shippingEstimate = cartItems.length > 0 ? 15.0 : 0.0;
  const grandTotal = subtotal + shippingEstimate;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-brand-500/10 text-brand-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Your Shopping Bag is Empty</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Looks like you haven't added anything to your cart yet. Explore our high quality catalog and discover great deals!
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-sm rounded-2xl transition shadow-lg shadow-brand-500/20"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Shopping Bag</h1>
          <p className="text-sm text-slate-400 mt-1">You have {totalItems} items in your bag</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl transition"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="pt-4">
            <Link
              to="/products"
              className="inline-flex items-center text-sm font-semibold text-brand-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-white pb-4 border-b border-slate-800">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping Fee</span>
              <span className="font-bold text-white">${shippingEstimate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Tax</span>
              <span className="font-bold text-emerald-400">Included</span>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-base font-bold text-white">Grand Total</span>
              <span className="text-2xl font-black text-brand-400">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Encrypted 256-bit SSL Checkout with COD or Online Card Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
