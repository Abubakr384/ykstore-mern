import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from './AuthContext';
import { ToastContext } from './ToastContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/auth/wishlist');
      setWishlist(res.data || []);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      addToast('Please login to save items to your wishlist', 'info');
      return false;
    }

    try {
      const prodId = typeof product === 'object' ? product._id : product;
      const res = await axiosInstance.post(`/auth/wishlist/${prodId}`);
      
      setWishlist(res.data.wishlist || []);
      
      if (res.data.isAdded) {
        addToast(`❤️ Added ${product.name || 'item'} to your wishlist!`);
      } else {
        addToast(`Removed ${product.name || 'item'} from wishlist`, 'info');
      }
      return res.data.isAdded;
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating wishlist', 'error');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
