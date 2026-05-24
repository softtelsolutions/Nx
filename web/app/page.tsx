'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCart';
import { productApi } from '../lib/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll();
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filter === 'All' || p.category === filter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to <span className="text-blue-600">RETAIL.</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Shop the latest trends.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2">
          {['All', 'Electronics', 'Clothes', 'Others'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                filter === cat 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500">Try your filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}