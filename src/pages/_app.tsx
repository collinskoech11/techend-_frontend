import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../Api/store";
import { Provider } from "react-redux";
import NoSSR from "react-no-ssr";
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import { CartProvider } from "@/contexts/CartContext"; // ✅ adjust this path if different
import Script from "next/script";

import { ThemeProvider } from '../contexts/ThemeContext';
const Navbar = lazy(() => import("@/Components/Navbar"));
const Footer = lazy(() => import("@/Components/Footer"));
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

const GA_IDS: Record<string, string> = {
  "sokojunction.com": "G-F23L8C9HPP",
  "cupcoutureshop.com": "G-F2CT49B70X",
};

const App = forwardRef(({ Component, pageProps }: AppProps, ref: any) => {
  App.displayName = "App";
  const router = useRouter();
  const cartRef = useRef<any>(null);
  const triggerCartRefetch = () => {
    if (cartRef.current) {
      cartRef.current.triggerCartRefetch();
    }
  };
  useImperativeHandle(ref, () => ({
    triggerCartRefetch() {
      triggerCartRefetch();
    },
  }));

  const [hostname, setHostname] = useState("");

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const GA_ID = GA_IDS[hostname] || "G-F23L8C9HPP";


  return (
    <NoSSR>
      <Provider store={store}>
      <ThemeProvider>
        <CartProvider>
        {GA_ID && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
      )}
      {GA_ID && (
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      )}
        {router.pathname !== "/" && (
        <Box sx={{ paddingBottom: { md: "50px", xs: "50px" }, mb: 3 }}>
          <Suspense fallback={<div>Loading Navbar...</div>}>
            <Navbar ref={cartRef}/>
          </Suspense>
        </Box>
        )}
        {router.pathname === "/" && (
          <Box sx={{ paddingBottom: { md: "50px", xs: "50px" }, mb: 3 }}>
            <Suspense fallback={<div>Loading Navbar...</div>}>
              <Navbar ref={cartRef}/>
            </Suspense>
          </Box>
        )}
        <Toaster position="bottom-right" reverseOrder={false} />
        <Component {...pageProps} triggerCartRefetch={triggerCartRefetch}/>
        <Suspense fallback={<div>Loading Footer...</div>}>
          <Footer />
        </Suspense>
        </CartProvider>
        </ThemeProvider>
      </Provider>
    </NoSSR>
  );
}
)
export default App