import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../Api/store";
import { Provider } from "react-redux";
import NoSSR from "react-no-ssr";
// import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSSR>
      <Provider store={store}>
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

        <Component {...pageProps} />
      </Provider>
    </NoSSR>
  );
}
