import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axiosInstance from '../api/axiosInstance';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('ykstore_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync cart with backend if user logs in
  useEffect(() => {
    if (user) {
      fetchBackendCart();
    }
  }, [user]);

  // Persist guest cart in localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('ykstore_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const fetchBackendCart = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/cart');
      if (data && data.items) {
        const formattedItems = data.items.map((item) => ({
          _id: item._id,
          product: item.product._id || item.product,
          name: item.product.name,
          price: item.product.price || item.price,
          image: item.product.images ? item.product.images[0] : '',
          stock: item.product.stock,
          quantity: item.quantity
        }));
        setCartItems(formattedItems);
      }
    } catch (err) {
      console.error('Error fetching backend cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity);
    if (user) {
      try {
        await axiosInstance.post('/cart', {
          productId: product._id,
          quantity: qty
        });
        await fetchBackendCart();
      } catch (err) {
        console.error('Add to backend cart failed:', err);
      }
    } else {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.product === product._id
        );
        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex].quantity += qty;
          return updated;
        } else {
          return [
            ...prevItems,
            {
              _id: 'guest_' + Date.now() + Math.random(),
              product: product._id,
              name: product.name,
              price: product.price,
              image: product.images ? product.images[0] : '',
              stock: product.stock,
              quantity: qty
            }
          ];
        }
      });
    }
  };

  const updateQuantity = async (itemId, productRefId, quantity) => {
    const qty = Number(quantity);
    if (user) {
      try {
        await axiosInstance.put(`/cart/${itemId}`, { quantity: qty });
        await fetchBackendCart();
      } catch (err) {
        console.error('Update cart quantity failed:', err);
      }
    } else {
      setCartItems((prevItems) => {
        if (qty <= 0) {
          return prevItems.filter((item) => item._id !== itemId);
        }
        return prevItems.map((item) =>
          item._id === itemId ? { ...item, quantity: qty } : item
        );
      });
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        await axiosInstance.delete(`/cart/${itemId}`);
        await fetchBackendCart();
      } catch (err) {
        console.error('Remove from cart failed:', err);
      }
    } else {
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await axiosInstance.delete('/cart');
      } catch (err) {
        console.error('Clear cart failed:', err);
      }
    }
    setCartItems([]);
    localStorage.removeItem('ykstore_cart');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchBackendCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
