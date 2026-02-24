import React, { useEffect, useState } from "react";
import Head from "next/head";
import Cookies from "js-cookie";
import { useGetCompanyBySlugQuery } from "@/Api/services";

const DynamicTitle = () => {
  const [shopname, setShopname] = useState<string | undefined>(undefined);

  useEffect(() => {
    setShopname(Cookies.get("shopname"));
  }, []);

  const { data: companyData } = useGetCompanyBySlugQuery(shopname as string, { skip: !shopname });

  const pageTitle = companyData?.name ? `${companyData.name}` : "SokoJunction";
  const pageDescription = companyData?.description || "Welcome to SokoJunction, your one-stop shop for all your needs! Explore our wide range of products and enjoy a seamless shopping experience.";

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
    </Head>
  );
};

export default DynamicTitle;
