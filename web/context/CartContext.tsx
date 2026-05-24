'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Product = {
  _id: string;
  name: string;
  slug?: string;
  priceInr: number;
  category: string;
  image?: string;
  desc?: string;
  quantity?: number;
};

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalPrice: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.priceInr * (item.quantity || 1), 
    0
  );

  const cartCount = cart.reduce(
    (acc, item) => acc + (item.quantity || 0), 
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        totalPrice, 
        cartCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};