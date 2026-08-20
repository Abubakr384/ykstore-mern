import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Minus, Plus, Heart, MessageSquare, UserCheck } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import Loader from '../../components/common/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/products/${id}`);
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to write a product review', 'info');
      return;
    }
    if (!comment.trim()) {
      addToast('Please enter a comment for your review', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      await axiosInstance.post(`/products/${id}/reviews`, {
        rating,
        comment
      });
      addToast('🌟 Thank you! Your review was published.');
      setComment('');
      fetchProduct();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-400">Product Not Found</h2>
        <p className="text-slate-400">{error || 'The product you requested does not exist.'}</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-brand-500 text-slate-950 font-bold rounded-xl">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isInCart = cartItems.some((item) => item.product === product._id);
  const isFavorite = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`🛒 Added ${quantity} × "${product.name}" to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </button>

      {/* Product Detail Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 shadow-2xl">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-brand-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img ? 'border-brand-500 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Purchasing */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category tag */}
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                {typeof product.category === 'object' ? product.category.name : 'Category'}
              </span>
            )}

            <h1 className="text-3xl font-extrabold text-white leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-bold text-slate-200 ml-1.5">
                  {product.rating ? product.rating.toFixed(1) : '5.0'}
                </span>
              </div>
              <span className="text-xs text-slate-400">• ({product.numReviews || 0} Verified Reviews)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-3xl font-black text-white">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-slate-400 line-through">${product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed border-t border-b border-slate-800/80 py-4">
              {product.description}
            </p>

            {/* Quantity Selector & Add to Cart / Wishlist */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-slate-300">Quantity:</span>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-2 transition shadow-xl ${
                    product.stock <= 0
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-brand-500 hover:bg-brand-400 text-slate-950 shadow-brand-500/20'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{isInCart ? 'Add More To Bag' : 'Add To Shopping Bag'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-2xl border font-bold flex items-center justify-center space-x-2 transition ${
                    isFavorite
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Toggle Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-brand-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">Free Express Delivery</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">2 Year Warranty Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-brand-400" />
              <span>Customer Reviews & Feedback</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Read real verified customer reviews or share your experience
            </p>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Write A Product Review</h3>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-300 font-semibold">Rating:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 focus:outline-none transition hover:scale-110"
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
            <span className="text-xs text-amber-400 font-extrabold">{rating} Stars</span>
          </div>

          <div>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about product quality, performance, and experience..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm rounded-xl p-3 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition"
          >
            {submittingReview ? 'Submitting Review...' : 'Submit Review'}
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4 pt-2">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev._id || rev.createdAt} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center">
                      {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-bold text-white">{rev.name}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold flex items-center">
                      <UserCheck className="w-3 h-3 mr-1" /> Verified Buyer
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{rev.comment}</p>
                <span className="text-[10px] text-slate-500 block text-right">
                  {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 font-medium border border-dashed border-slate-800 rounded-2xl">
              No customer reviews yet. Be the first to leave a review!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

