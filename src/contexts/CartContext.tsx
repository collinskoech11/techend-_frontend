// contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useGetCartQuery } from "@/Api/services";
import Cookies from "js-cookie";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const token = Cookies.get("access");
  const company_name = Cookies.get("shopname");

  // The query is skipped if the user is not logged in.
  // This is re-evaluated on every render, avoiding stale state.
  const {
    data,
    isLoading,
    refetch,
    error,
  } = useGetCartQuery(
    { token, company_name },
    { skip: !token || !company_name }
  );

  const triggerCartRefetch = useCallback(() => {
    // Guard against calling refetch if the user is not logged in,
    // which could happen if this function is called from a stale closure.
    if (Cookies.get("access")) {
      refetch();
    }
  }, [refetch]);

  return (
    <CartContext.Provider value={{ data, isLoading, error, refetch: triggerCartRefetch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
