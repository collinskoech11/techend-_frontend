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
    isUninitialized: isAuthCartUninitialized,
  } = useGetCartQuery(
    { token, company_name },
    { skip: !token || !company_name }
  );

  const {
    data: guestCartData,
    isLoading: isGuestCartLoading,
    refetch: refetchGuestCart,
    error: guestCartError,
    isUninitialized: isGuestCartUninitialized,
  } = useGetCartGuestQuery({ session_id: sessionId!, company_name: company_name || "techend" }, { skip:  !sessionId || !!token  });

  const triggerCartRefetch = useCallback(() => {
    if (token) {
      if (!isAuthCartUninitialized) {
        try {
          refetchAuthCart?.();
        } catch (e) {
          console.warn("Cart refetch skipped: query not initialized", e);
        }
      }
    } else {
      if (!isGuestCartUninitialized) {
        try {
          refetchGuestCart?.();
        } catch (e) {
          console.warn("Guest cart refetch skipped: query not initialized", e);
        }
      }
    }
  }, [token, isAuthCartUninitialized, refetchAuthCart, isGuestCartUninitialized, refetchGuestCart]);
  const data = token ? authCartData : guestCartData;
  const isLoading = token ? isAuthCartLoading : isGuestCartLoading;
  const error = token ? authCartError : guestCartError;

  const value = React.useMemo(() => ({
  data,
  isLoading,
  error,
  refetch: triggerCartRefetch,
  sessionId,
}), [data, isLoading, error, triggerCartRefetch, sessionId]);

return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);