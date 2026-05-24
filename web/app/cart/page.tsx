'use client';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import CartItem from '../../components/CartItem';
import { orderApi } from '../../lib/api';

export default function CartPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart,
        totalAmount: totalPrice,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      await orderApi.create(orderData);

      clearCart();
      alert('Order placed successfully!');
      router.push('/');
    } catch (err) {
      alert('Failed to place order. Please check your connection or login again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Shopping Cart</h1>
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-sm font-semibold text-gray-400 hover:text-red-500 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-xs bg-green-50 px-2 py-1 rounded">Free</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Estimated Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-3xl font-black text-blue-600">
                    Rs. {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-xl">⏳</span>
                    Processing...
                  </>
                ) : (
                  'Checkout Now'
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}