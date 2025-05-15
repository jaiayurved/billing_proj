import { useState, useEffect } from "react";

export default function useCartStorage(key = "newOrderCart") {
  const [cart, setCartState] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setCartState(JSON.parse(stored));
  }, [key]);

  const setCart = (newCart) => {
    setCartState(newCart);
    localStorage.setItem(key, JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCartState([]);
    localStorage.removeItem(key);
  };

  return { cart, setCart, clearCart };
}
