import React, { useContext } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.product, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item._id, item.product, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl gap-4 hover:border-slate-700 transition">
      {/* Product info */}
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl bg-slate-950 shrink-0"
        />
        <div className="flex-1">
          <h4 className="text-base font-semibold text-slate-100 line-clamp-1">{item.name}</h4>
          <p className="text-sm font-bold text-brand-400 mt-1">${item.price}</p>
        </div>
      </div>

      {/* Quantity Control & Total */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-slate-100">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="text-right">
          <span className="text-base font-extrabold text-white">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleRemove}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          title="Remove Item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
