import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../Api/store";
import { Provider } from "react-redux";
import NoSSR from "react-no-ssr";
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import { CartProvider } from "@/contexts/CartContext";
import Script from "next/script";
import { ThemeProvider } from "../contexts/ThemeContext";
import DynamicTitle from "@/Components/DynamicTitle";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

const Navbar = lazy(() => import("@/Components/Navbar"));
const Footer = lazy(() => import("@/Components/Footer"));

const GA_IDS: Record<string, string> = {
  "sokojunction.com": "G-F23L8C9HPP",
  "cupcoutureshop.com": "G-F2CT49B70X",
};

const App = forwardRef(({ Component, pageProps }: AppProps, ref: any) => {
  const router = useRouter();
  const cartRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    triggerCartRefetch: () => cartRef.current?.triggerCartRefetch?.(),
  }));

  const [hostname, setHostname] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
      setIsClient(true);
    }
  }, []);

  const GA_ID = GA_IDS[hostname] || "G-F23L8C9HPP";

  const triggerCartRefetch = () => {
    cartRef.current?.triggerCartRefetch?.();
  };

  const LoadingEllipsis = React.useMemo(() => (
    <Box sx={{ height: "75px", display: "flex", alignItems: "center", gap: 1, fontSize: 14, opacity: 0.7 }}>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "currentColor",
              animation: "bounce 1.2s infinite",
              animationDelay: `${i * 0.2}s`,
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "scale(0)" },
                "40%": { transform: "scale(1)" },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  ), []);

  return (
    <NoSSR>
      <Provider store={store}>
        <ThemeProvider>
          <CartProvider>
            <DynamicTitle />
            {isClient && GA_ID && (
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
              <Suspense fallback={LoadingEllipsis}>
                <Navbar ref={cartRef} />
              </Suspense>
            </Box>

            <Toaster position="bottom-right" reverseOrder={false} />

            <Component {...pageProps} triggerCartRefetch={triggerCartRefetch} />

            <Suspense fallback={<div>Loading Footer...</div>}>
              <Footer />
            </Suspense>
          </CartProvider>
        </ThemeProvider>
      </Provider>
    </NoSSR>
  );
});

App.displayName = "App";

export default React.memo(App);