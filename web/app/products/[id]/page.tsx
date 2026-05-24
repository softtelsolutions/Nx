'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { productApi } from '../../../lib/api';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.getById(String(id));
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('/cart');
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <button onClick={() => router.push('/')} className="mt-4 text-blue-600 underline">
        Back to shopping
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center text-gray-600 hover:text-black transition"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="aspect-square bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 shadow-inner overflow-hidden">
            <img 
              src={product.image || 'https://via.placeholder.com/600'} 
              alt={product.name}
              className="object-contain w-full h-full p-10 mix-blend-multiply"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-gray-900">Rs. {product.priceInr}</span>
              <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded">In Stock</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {product.desc || "Experience premium quality with this top-rated item. Perfect for daily use, designed with durability and style in mind."}
            </p>

            <div className="mt-auto border-t pt-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 hover:bg-gray-100 transition text-xl font-bold"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-bold text-lg border-x-2 border-gray-200">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-3 hover:bg-gray-100 transition text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-3"
              >
                <span>Add to Cart</span>
                <span className="bg-blue-500 px-3 py-1 rounded-lg text-sm">Rs. {(product.priceInr * quantity).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}