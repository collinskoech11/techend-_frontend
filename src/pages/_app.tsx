import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../Api/store";
import { Provider } from "react-redux";
import NoSSR from "react-no-ssr";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Box } from "@mui/material";
import { CartProvider } from "@/contexts/CartContext"; // ✅ adjust this path if different
import { GoogleOAuthProvider } from '@react-oauth/google';
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
        <GoogleOAuthProvider clientId={'233747387248-23lb8510miqkj|2nd0ajc3885ap0023c.apps.googleusercontent.com'}>
        <CartProvider>
        {router.pathname !== "/" && (
        <Box sx={{ paddingBottom: { md: "50px", xs: "50px" } }}>
          <Navbar ref={cartRef}/>
        </Box>
        )}
        {router.pathname === "/" && (
          <Navbar ref={cartRef}/>
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
        <Footer />
        </CartProvider>
        </GoogleOAuthProvider>
      </Provider>
    </NoSSR>
  );
}
)
export default App