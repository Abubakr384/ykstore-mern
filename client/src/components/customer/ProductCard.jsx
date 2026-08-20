import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check, Heart } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';

const ProductCard = ({ product, onQuickAdd }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const isInCart = cartItems.some((item) => item.product === product._id);
  const isFavorite = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    if (onQuickAdd) onQuickAdd(product.name);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col h-full">
      {/* Product Image & Badges */}
      <Link to={`/product/${product._id}`} className="relative block aspect-square overflow-hidden bg-slate-950">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-slate-950/70 text-slate-300 hover:text-rose-400 hover:bg-slate-900'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Discount Badge */}
        {product.originalPrice > product.price && (
          <span className="absolute top-3 right-3 bg-rose-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
            Save ${(product.originalPrice - product.price).toFixed(0)}
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          {product.category && (
            <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1 block">
              {typeof product.category === 'object' ? product.category.name : 'Category'}
            </span>
          )}

          {/* Title */}
          <Link to={`/product/${product._id}`}>
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-brand-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-bold ml-1 text-slate-200">{product.rating || 4.8}</span>
            </div>
            <span className="text-xs text-slate-400">({product.numReviews || 12} reviews)</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-white">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium text-sm flex items-center space-x-1.5 transition-all shadow-md ${
              product.stock <= 0
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : isInCart
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40 hover:bg-brand-500/30'
                : 'bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold hover:shadow-brand-500/20'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-xs">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
