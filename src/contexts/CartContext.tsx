// contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useGetCartQuery, useGetCartGuestQuery } from "@/Api/services";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const token = Cookies.get("access");
  const company_name = Cookies.get("shopname");
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem("session_id");
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem("session_id", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const {
    data: authCartData,
    isLoading: isAuthCartLoading,
    refetch: refetchAuthCart,
    error: authCartError,
  } = useGetCartQuery(
    { token, company_name },
    { skip: !token || !company_name }
  );

  const {
    data: guestCartData,
    isLoading: isGuestCartLoading,
    refetch: refetchGuestCart,
    error: guestCartError,
  } = useGetCartGuestQuery({session_id: sessionId!, company_name: company_name || "techend"}, { skip: !!token || !sessionId });

  const triggerCartRefetch = useCallback(() => {
    if (token) {
      refetchAuthCart();
    } else {
      if (refetchGuestCart) {
        refetchGuestCart();
      }
    }
  }, [token, refetchAuthCart, refetchGuestCart]);

  const data = token ? authCartData : guestCartData;
  const isLoading = token ? isAuthCartLoading : isGuestCartLoading;
  const error = token ? authCartError : guestCartError;

  return (
    <CartContext.Provider value={{ data, isLoading, error, refetch: triggerCartRefetch, sessionId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);