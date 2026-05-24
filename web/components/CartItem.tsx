'use client';
import { useCart, Product } from '../context/CartContext';

interface CartItemProps {
  item: Product;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
      <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center">
        <span className="text-[10px] text-gray-400">Image</span>
      </div>

      <div className="flex-grow text-center sm:text-left">
        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
        <p className="text-blue-600 font-bold">Rs. {item.priceInr}</p>
        <button 
          onClick={() => removeFromCart(item._id)}
          className="mt-2 text-xs font-semibold text-red-500 hover:underline"
        >
          Remove item
        </button>
      </div>

      <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
        <button 
          onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
          className="px-4 py-2 hover:bg-gray-200 transition font-bold"
        >
          −
        </button>
        <span className="px-4 font-bold text-gray-900 min-w-[40px] text-center">
          {item.quantity}
        </span>
        <button 
          onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
          className="px-4 py-2 hover:bg-gray-200 transition font-bold"
        >
          +
        </button>
      </div>

      <div className="text-right min-w-[100px]">
        <p className="text-xl font-black text-gray-900">
          Rs. {((item.quantity || 1) * item.priceInr).toFixed(2)}
        </p>
      </div>
    </div>
  );
}