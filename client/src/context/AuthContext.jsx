import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ykstore_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('ykstore_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('ykstore_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.put('/auth/profile', profileData);
      setUser(data);
      localStorage.setItem('ykstore_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed.';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ykstore_user');
    localStorage.removeItem('ykstore_cart');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
