'use client';
import Link from 'next/link';
import { useCart, Product } from '../context/CartContext';
import { getImageUrl } from '../lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 p-4 hover:shadow-xl transition-all duration-300">
      <Link href={`/products/${product.slug || product._id}`}>
        <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.02] transition-opacity" />
          <img 
            src={getImageUrl(product.image)} 
            alt={product.name}
            className="object-contain w-full h-full p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{product.category}</span>
          <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition">{product.name}</h3>
          <p className="text-lg font-black text-gray-900">Rs. {product.priceInr}</p>
        </div>
      </Link>

      <button 
        onClick={() => addToCart(product)}
        className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors transform active:scale-95"
      >
        Add to Cart
      </button>
    </div>
  );
}