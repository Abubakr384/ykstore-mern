import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const shippingPrice = cartItems.length > 0 ? 15.0 : 0.0;
  const totalPrice = subtotal + shippingPrice;

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'Pakistan'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Mock Stripe Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 4242 4242 4242',
    expDate: '12/28',
    cvv: '123'
  });

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city) {
      setError('Please fill in all mandatory shipping address fields');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your shopping cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress,
        paymentMethod: paymentMethod === 'Stripe' ? 'MockOnline' : paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        totalPrice
      };

      const { data } = await axiosInstance.post('/orders', orderPayload);
      
      clearCart();
      navigate('/order-success', { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-200">No items to checkout</h2>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-brand-500 text-slate-950 font-bold rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/cart" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shopping Bag
      </Link>

      <h1 className="text-3xl font-extrabold text-white tracking-tight">Checkout Order</h1>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <Truck className="w-6 h-6 text-brand-400" />
              <h3 className="text-xl font-bold text-white">Shipping Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Yousaf Kana"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. +92 300 1234567"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  required
                  placeholder="House/Apartment #, Street, Area"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Karachi, Lahore, etc."
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  placeholder="75500"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <CreditCard className="w-6 h-6 text-brand-400" />
              <h3 className="text-xl font-bold text-white">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-brand-500 bg-brand-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-brand-500"
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-100">Cash on Delivery (COD)</p>
                    <p className="text-xs text-slate-400">Pay cash upon package arrival</p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-brand-400" />
              </label>

              <label
                className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition ${
                  paymentMethod === 'Stripe'
                    ? 'border-brand-500 bg-brand-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={() => setPaymentMethod('Stripe')}
                    className="accent-brand-500"
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-100">Stripe Card (Test Mode)</p>
                    <p className="text-xs text-slate-400">Instant test card payment</p>
                  </div>
                </div>
                <Lock className="w-5 h-5 text-brand-400" />
              </label>
            </div>

            {/* Mock Stripe Card Inputs when Stripe is selected */}
            {paymentMethod === 'Stripe' && (
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Stripe Sandbox Test Card</span>
                  <span className="text-[10px] text-slate-400">Use default mock card</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono rounded-xl px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardDetails.expDate}
                      onChange={(e) => setCardDetails({ ...cardDetails, expDate: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-white pb-4 border-b border-slate-800">Order Summary</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-950" />
                  <div>
                    <p className="font-semibold text-slate-200 line-clamp-1 max-w-[140px]">{item.name}</p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Items Total</span>
              <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping Fee</span>
              <span className="font-bold text-white">${shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-slate-800">
              <span className="text-base font-bold text-white">Final Total</span>
              <span className="text-2xl font-black text-brand-400">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition"
          >
            {loading ? (
              <span className="animate-pulse">Processing Order...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Place Order (${totalPrice.toFixed(2)})</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 text-center">
            <Lock className="w-3.5 h-3.5 text-brand-400" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
