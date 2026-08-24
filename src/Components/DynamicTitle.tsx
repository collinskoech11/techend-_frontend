import React, { useEffect, useState } from "react";
import Head from "next/head";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useGetCompanyBySlugQuery } from "@/Api/services";

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
  const [shopname, setShopname] = useState<string>("SokoJunction");

  useEffect(() => {
    const syncShop = () => {
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

  const isDefaultBrandPage = DEFAULT_BRAND_URLS.includes(router.pathname);
  const displayShopName = isDefaultBrandPage ? "SokoJunction" : shopname;
  const skipQuery =
    isDefaultBrandPage ||
    !displayShopName ||
    displayShopName.toLowerCase() === "sokojunction" ||
    /^\d+$/.test(displayShopName);

  const { data: companyData } = useGetCompanyBySlugQuery(displayShopName, {
    skip: skipQuery,
  });

  const getLogoUrl = (path?: string) => {
    if (!path) return "/logo_min.jpeg";
    let url = path;
    if (!path.startsWith("http://") && !path.startsWith("https://")) {
      url = `https://res.cloudinary.com/dqokryv6u/${path}`;
    }
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_240,h_240,c_fill/");
    }
    return url;
  };

  const pageTitle = !skipQuery && companyData?.name ? `${companyData.name}` : "SokoJunction";
  const pageDescription =
    (!skipQuery && companyData?.description) ||
    "Welcome to SokoJunction, your one-stop shop for all your needs! Explore our wide range of products and enjoy a seamless shopping experience.";
  const iconUrl =
    !skipQuery && companyData?.logo_image ? getLogoUrl(companyData.logo_image) : "/logo_min.jpeg";

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="icon" href={iconUrl} />
      <link rel="shortcut icon" href={iconUrl} />
    </Head>
  );
};

export default DynamicTitle;

