'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productApi, orderApi, getImageUrl } from '../../lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  // Products states
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Orders states
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // General states
  const [authorized, setAuthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Product Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  // Product Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    priceInr: '',
    stock: '',
    desc: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [formError, setFormError] = useState('');
  
  const categories = [
    'Electronics',
    'Clothes',
    'Footwear',
    'Home',
    'Beauty',
    'Sports',
    'Books',
    'Others',
  ];

  const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];

  // Check authorization on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        alert('Access denied. Admin role required.');
        router.push('/');
        return;
      }
      setAuthorized(true);
      fetchProducts();
      fetchOrders();
    } catch (e) {
      router.push('/auth/login');
    }
  }, []);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await productApi.getAll();
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await orderApi.getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      category: 'Electronics',
      priceInr: '',
      stock: '',
      desc: '',
      image: '',
    });
    setImageFile(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      priceInr: String(product.priceInr),
      stock: String(product.stock),
      desc: product.desc || '',
      image: product.image || '',
    });
    setImageFile(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setUploadProgress(true);
    setFormError('');

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await productApi.uploadImage(uploadData);
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch (error: any) {
      setFormError(error.response?.data?.msg || 'Failed to upload image');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.category || !formData.priceInr) {
      setFormError('Name, category, and price are required.');
      return;
    }

    const price = Number(formData.priceInr);
    const stock = Number(formData.stock || 0);

    if (isNaN(price) || price <= 0) {
      setFormError('Price must be a valid positive number.');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setFormError('Stock must be a valid non-negative number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        priceInr: price,
        stock: stock,
        desc: formData.desc,
        image: formData.image,
      };

      if (editProduct) {
        await productApi.update(editProduct._id, payload);
      } else {
        await productApi.create(payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await productApi.delete(id);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product.');
    }
  };

  // Orders update handlers
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderApi.updateOrder(orderId, { status });
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      await orderApi.updateOrder(orderId, { paymentStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update payment status');
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

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage store inventory, upload images, and control client orders.</p>
          </div>
          {activeTab === 'products' && (
            <button 
              onClick={handleOpenAddModal}
              className="bg-blue-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2 transform active:scale-95 duration-200"
            >
              <span>➕</span> Add New Product
            </button>
          )}
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-gray-200 mb-8 gap-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 text-base font-bold transition-all relative ${
              activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Products Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-base font-bold transition-all relative ${
              activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Client Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'products' ? (
          <>
            {/* Inventory Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Total Products</span>
                  <span className="text-3xl font-black text-gray-900 mt-1 block">{products.length}</span>
                </div>
                <div className="text-3xl bg-blue-50 p-4 rounded-xl">📦</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Out of Stock</span>
                  <span className="text-3xl font-black text-red-600 mt-1 block">
                    {products.filter(p => p.stock === 0).length}
                  </span>
                </div>
                <div className="text-3xl bg-red-50 p-4 rounded-xl">⚠️</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Low Stock (&lt; 10)</span>
                  <span className="text-3xl font-black text-yellow-600 mt-1 block">
                    {products.filter(p => p.stock > 0 && p.stock < 10).length}
                  </span>
                </div>
                <div className="text-3xl bg-yellow-50 p-4 rounded-xl">⚡</div>
              </div>
            </div>

            {/* Product Inventory Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {productsLoading ? (
                <div className="p-20 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="p-20 text-center text-gray-500">
                  <span className="text-5xl block mb-4">🛒</span>
                  <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                  <p className="mt-1">Add a product to start building your store inventory.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                        <th className="py-5 px-6">Product</th>
                        <th className="py-5 px-6">Category</th>
                        <th className="py-5 px-6">Price</th>
                        <th className="py-5 px-6">Stock</th>
                        <th className="py-5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50/50 transition">
                          <td className="py-4 px-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              <img 
                                src={getImageUrl(product.image)} 
                                alt={product.name} 
                                className="object-contain w-full h-full p-1 mix-blend-multiply"
                              />
                            </div>
                            <div className="truncate max-w-[240px]">
                              <span className="font-bold text-gray-900 block truncate">{product.name}</span>
                              <span className="text-xs text-gray-400 block truncate">{product.desc || 'No description'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-extrabold text-gray-900 text-base">Rs. {product.priceInr}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`font-bold text-sm ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-600' : 'text-gray-600'}`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleOpenEditModal(product)}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                                title="Edit Product"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleDelete(product._id, product.name)}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                                title="Delete Product"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Client Orders List */
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {ordersLoading ? (
              <div className="p-20 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-20 text-center text-gray-500">
                <span className="text-5xl block mb-4">📦</span>
                <h3 className="text-lg font-bold text-gray-900">No client orders placed</h3>
                <p className="mt-1">Orders placed by customers will appear here dynamically.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                      <th className="py-5 px-6">Order ID / Date</th>
                      <th className="py-5 px-6">Customer Details</th>
                      <th className="py-5 px-6">Order Items</th>
                      <th className="py-5 px-6">Total Amount</th>
                      <th className="py-5 px-6">Order Status</th>
                      <th className="py-5 px-6">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition items-start">
                        <td className="py-5 px-6">
                          <span className="font-mono font-bold text-xs text-gray-800 block">
                            #{order._id.substring(0, 8)}
                          </span>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <span className="font-bold text-gray-900 block">
                            {order.user ? order.user.name : 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500 block">
                            {order.user ? order.user.email : ''}
                          </span>
                          <span className="text-xs text-gray-400 block">
                            {order.user ? order.user.mobile : ''}
                          </span>
                        </td>
                        <td className="py-5 px-6 max-w-[280px]">
                          <div className="space-y-1">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="text-xs text-gray-700 flex items-center justify-between gap-4">
                                <span className="font-medium truncate max-w-[180px]">{item.name}</span>
                                <span className="text-gray-400 font-bold">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="font-extrabold text-blue-600 text-base">Rs. {order.totalAmount}</span>
                        </td>
                        <td className="py-5 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none transition cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            {orderStatuses.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-5 px-6">
                          <select
                            value={order.paymentStatus || 'Pending'}
                            onChange={(e) => handleUpdatePaymentStatus(order._id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 outline-none transition bg-white cursor-pointer"
                          >
                            {paymentStatuses.map((ps) => (
                              <option key={ps} value={ps}>{ps}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-grow">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Premium Wireless Headphones"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={formData.category}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.priceInr}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="6999"
                      onChange={(e) => setFormData({ ...formData, priceInr: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="50"
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50/50"
                      placeholder="/uploads/headphones.svg"
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                {/* File Upload Option */}
                <div className="bg-blue-50/40 p-4 rounded-2xl border border-dashed border-blue-200 flex flex-col items-center justify-center text-center">
                  <span className="text-xl mb-1">📸</span>
                  <span className="text-xs font-bold text-blue-600 block">Direct Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
                    onChange={handleFileChange}
                  />
                  {uploadProgress && (
                    <span className="text-xs text-blue-500 animate-pulse mt-2 block">Uploading image...</span>
                  )}
                  {formData.image && !uploadProgress && (
                    <div className="mt-3 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border text-[10px]">
                      <span className="text-green-500 font-bold">✓ Uploaded:</span>
                      <span className="text-gray-500 truncate max-w-[200px]">{formData.image}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    value={formData.desc}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition h-20 resize-none"
                    placeholder="Write details about the product..."
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex gap-4 border-t pt-5 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-gray-200 py-3 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadProgress}
                    className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition flex items-center justify-center gap-2 ${(submitting || uploadProgress) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
