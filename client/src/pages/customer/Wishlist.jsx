import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../context/WishlistContext';
import { CartContext } from '../../context/CartContext';
import { ToastContext } from '../../context/ToastContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist, loading } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    addToast(`🛒 ${product.name} added to shopping cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-brand-400 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            <span>My Favorite Wishlist</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Items you saved to buy later ({wishlist.length} items)
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold">Loading your favorites...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-white">Your wishlist is empty</h3>
          <p className="text-xs text-slate-400">
            Explore our collection and click the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-slate-950">
                <img
                  src={product.images ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2.5 bg-slate-950/80 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl backdrop-blur-md transition shadow-lg"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="capitalize">{product.category?.name || 'General'}</span>
                    <div className="flex items-center text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                    </div>
                  </div>
                  <Link
                    to={`/product/${product._id}`}
                    className="font-bold text-white text-sm hover:text-brand-400 transition line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-2 text-lg font-black text-white">
                    ${product.price}
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-500 line-through ml-2 font-semibold">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 transition shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move To Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
