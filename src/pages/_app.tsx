import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../Api/store";
import { Provider } from "react-redux";
import NoSSR from "react-no-ssr";
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import { CartProvider } from "@/contexts/CartContext"; // ✅ adjust this path if different

import { ThemeProvider } from '../contexts/ThemeContext';
const Navbar = lazy(() => import("@/Components/Navbar"));
const Footer = lazy(() => import("@/Components/Footer"));
import { useRouter } from "next/router";
// import Script from "next/script";

const App = forwardRef(({ Component, pageProps }: AppProps, ref: any) => {
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
  return (
    <NoSSR>
      <Provider store={store}>
      <ThemeProvider>
        <CartProvider>
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
        {/* <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_KEY}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_KEY}');
    `}
        </Script> */}

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