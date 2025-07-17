// contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useGetCartQuery } from "@/Api/services";
import Cookies from "js-cookie";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabled] = useState(false);

  const token = Cookies.get("access");
  const company_name = Cookies.get("shopname");

  // Avoid running this query during SSR
  useEffect(() => {
    if (token && company_name) setEnabled(true);
  }, [token, company_name]);

  const {
    data,
    isLoading,
    refetch,
    error,
  } = useGetCartQuery({ token, company_name }, { skip: !enabled });

  const triggerCartRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <CartContext.Provider value={{ data, isLoading, error, refetch: triggerCartRefetch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
