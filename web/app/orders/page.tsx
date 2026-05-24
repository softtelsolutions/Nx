'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { orderApi, getImageUrl } from '../../lib/api';

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setAuthorized(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getUserOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-600 border-green-100';
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Failed': return 'bg-red-50 text-red-600 border-red-100';
      case 'Refunded': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Order History</h1>
          <p className="text-gray-500 mt-1">Track and manage your recently placed retail orders.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders placed yet</h2>
            <p className="text-gray-500 mb-8">You haven't bought any premium goods from our store yet.</p>
            <Link href="/" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Order Summary Bar */}
                <div className="bg-gray-50/70 border-b border-gray-100 px-6 py-5 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Order Placed</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Total Amount</span>
                      <span className="text-sm font-bold text-blue-600">Rs. {order.totalAmount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Order ID</span>
                      <span className="text-sm font-mono text-gray-500">{order._id.substring(0, 8)}...</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPaymentStatusColor(order.paymentStatus)}`}>
                      Pay: {order.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 divide-y divide-gray-50">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name} 
                            className="object-contain w-full h-full p-2 mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{item.name}</span>
                          <span className="text-xs text-gray-400">Qty: {item.quantity} × Rs. {item.priceInr}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-gray-900">Rs. {item.quantity * item.priceInr}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
