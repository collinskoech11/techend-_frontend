import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../Api/store";
import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { CartProvider } from "@/contexts/CartContext";
import Script from "next/script";
import { ThemeProvider } from "../contexts/ThemeContext";
import DynamicTitle from "@/Components/DynamicTitle";
import { Toaster } from "react-hot-toast";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const GA_IDS: Record<string, string> = {
  "sokojunction.com": "G-F23L8C9HPP",
  "cupcoutureshop.com": "G-F2CT49B70X",
};

function App({ Component, pageProps }: AppProps) {
  const cartRef = useRef<any>(null);

  const [GA_ID, setGA_ID] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setGA_ID(GA_IDS[hostname] || "G-F23L8C9HPP");
    }
  }, []);

  const triggerCartRefetch = () => {
    cartRef.current?.triggerCartRefetch?.();
  };

  return (
    <Provider store={store}>
      <ThemeProvider>
        <CartProvider>
          <DynamicTitle />

          {/* ✅ Load GA only on client and only when needed */}
          {GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="ga-script" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `}
              </Script>
            </>
          )}

          <Box sx={{ minHeight: { xs: "62px", md: "70px" } }}>
            <Navbar ref={cartRef} />
          </Box>

          <Toaster position="bottom-right" reverseOrder={false} />

          <Component {...pageProps} triggerCartRefetch={triggerCartRefetch} />

          <Footer />
        </CartProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;