'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { cart } = useCart();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user && user.role === 'admin');
        setUserName(user && user.name ? user.name : '');
      } catch (e) {
        console.error('Failed to parse user role', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserName('');
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-blue-600">RETAIL.</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text"
                placeholder="Search products..."
                className="w-full bg-gray-100 border-transparent rounded-xl py-2 px-4 pl-10 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/orders" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">
                  My Orders
                </Link>
                
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                    Admin Panel
                  </Link>
                )}

                <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm" title={userName}>
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-semibold text-gray-400 hover:text-red-500 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link href="/auth/signup" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition shadow-md shadow-blue-100">
                  Sign Up
                </Link>
              </div>
            )}

            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cart.reduce((acc, item) => acc + (item.quantity || 0), 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}