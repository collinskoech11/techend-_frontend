import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../Api/store";
import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Box } from "@mui/material";
import { CartProvider } from "@/contexts/CartContext";
import Script from "next/script";
import { ThemeProvider } from "../contexts/ThemeContext";
import DynamicTitle from "@/Components/DynamicTitle";
import { Toaster } from "react-hot-toast";

/* ✅ Proper Next.js code splitting (better than React.lazy) */
const Navbar = dynamic(() => import("@/Components/Navbar"), {
  ssr: false,
  loading: () => <div style={{ height: 75 }} />,
});

const Footer = dynamic(() => import("@/Components/Footer"), {
  ssr: false,
  loading: () => <div style={{ height: 60 }} />,
});

const GA_IDS: Record<string, string> = {
  "sokojunction.com": "G-F23L8C9HPP",
  "cupcoutureshop.com": "G-F2CT49B70X",
};

const App = forwardRef(({ Component, pageProps }: AppProps, ref: any) => {
  const cartRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    triggerCartRefetch: () => cartRef.current?.triggerCartRefetch?.(),
  }));

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

          <Box sx={{ paddingBottom: { md: "50px", xs: "50px" }, mb: 3 }}>
            <Navbar ref={cartRef} />
          </Box>

          <Toaster position="bottom-right" reverseOrder={false} />

          <Component {...pageProps} triggerCartRefetch={triggerCartRefetch} />

          <Footer />
        </CartProvider>
      </ThemeProvider>
    </Provider>
  );
});

App.displayName = "App";

export default App;