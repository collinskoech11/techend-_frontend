import React, { useEffect, useState } from "react";
import Head from "next/head";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useGetCompanyBySlugQuery } from "@/Api/services";
import { useIsCustomDomain, getCustomDomainShop } from "@/utils/domain";

const DEFAULT_BRAND_URLS = [
  "/shops",
  "/payment",
  "/",
  "/about",
  "/contact",
  "/company-onboarding",
  "/profile",
  "/login",
];

const DynamicTitle = () => {
  const router = useRouter();
  const isCustom = useIsCustomDomain();
  const [shopname, setShopname] = useState<string>("SokoJunction");

  useEffect(() => {
    const syncShop = () => {
      if (typeof window !== "undefined") {
        const customShop = getCustomDomainShop(window.location.hostname);
        if (customShop) {
          setShopname(customShop);
          return;
        }
      }

      const activeShop =
        (typeof router.query.shop === "string" ? router.query.shop : null) ||
        (router.asPath.startsWith("/shop/") ? router.asPath.split("/shop/")[1]?.split("?")[0] : null) ||
        Cookies.get("shopname") ||
        "SokoJunction";
      setShopname(activeShop);
    };

    syncShop();
    router.events.on("routeChangeComplete", syncShop);
    return () => {
      router.events.off("routeChangeComplete", syncShop);
    };
  }, [router.events, router.query, router.asPath]);

  const isDefaultBrandPage = !isCustom && DEFAULT_BRAND_URLS.includes(router.pathname);
  const displayShopName = isDefaultBrandPage ? "SokoJunction" : shopname;
  const skipQuery =
    isDefaultBrandPage ||
    !displayShopName ||
    displayShopName.toLowerCase() === "sokojunction" ||
    /^\d+$/.test(displayShopName);

  const { data: companyData } = useGetCompanyBySlugQuery(displayShopName, {
    skip: skipQuery,
  });

  const getMediaUrl = (path?: string, isBanner = false) => {
    if (!path) return isBanner ? "/assets/techendbanner.png" : "/logo_square.png";
    let url = path;
    if (!path.startsWith("http://") && !path.startsWith("https://")) {
      url = `https://res.cloudinary.com/dqokryv6u/${path}`;
    }
    if (url.includes("cloudinary.com")) {
      return isBanner
        ? url.replace("/upload/", "/upload/f_auto,q_auto,w_1200,h_630,c_fill/")
        : url.replace("/upload/", "/upload/f_auto,q_auto,w_240,h_240,c_fill/");
    }
    return url;
  };

  const isShopActive = !skipQuery && Boolean(companyData?.name);
  const pageTitle = isShopActive
    ? `${companyData.name} — Storefront`
    : "SokoJunction — Unified Commerce Platform";

  const pageDescription =
    (isShopActive && companyData?.description) ||
    "Discover authentic brands, curated collections, and enjoy seamless shopping with instant Kenya-wide delivery on SokoJunction.";

  const iconUrl = isShopActive && companyData?.logo_image
    ? getMediaUrl(companyData.logo_image, false)
    : "/logo_square.png";

  const bannerUrl = isShopActive && companyData?.banner_image
    ? getMediaUrl(companyData.banner_image, true)
    : iconUrl;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      {/* Dynamic Favicons & Icons */}
      <link rel="icon" href={iconUrl} />
      <link rel="shortcut icon" href={iconUrl} />
      <link rel="apple-touch-icon" href={iconUrl} />

      {/* Dynamic OpenGraph / Social Previews */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={isShopActive ? companyData?.name : "SokoJunction"} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={bannerUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Dynamic Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={bannerUrl} />
    </Head>
  );
};

export default DynamicTitle;

