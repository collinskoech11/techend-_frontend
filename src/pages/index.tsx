import { Inter } from "next/font/google";
import Head from "next/head";
import * as React from "react";
import Navbar from "@/Components/Navbar";
import RevealBanner from "@/Components/RevealBanner";
import ProductCard from "@/Components/ProductCard";
import {
  IconWrapper,
  IconsContainer,
  ProductImage,
  ProductItem,
  ProductItemStyled,
  ProductsContainer,
  RatingContainer,
} from "@/StyledComponents/Products";
import {
  ProductPrice,
  ProductTitle,
  ReviewText,
} from "@/StyledComponents/Typos";
import StarIcon from "@mui/icons-material/Star";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import LandingProductCard from "@/Components/LandingProductCard";
import ProductNav from "@/Components/ProductNav";
import MidHeader from "@/Components/MidHeader";
import Reasons from "@/Components/Reasons";
import Blog from "@/Components/Blog";
import WeekDeal from "@/Components/WeekDeal";
import Discover from "@/Components/Discover";
import Footer from "@/Components/Footer";
import Special from "@/Components/Special";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

const imageLinks = [
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721127657/kgwi9belcz1wm5wc1nwi.jpg",
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721127991/sppcfeganm7shs0lhucl.jpg",
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721147741/hdhf8hfcdljbejqsobxs.jpg",
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721148897/kqpdppliygyw8wvpwlmf.jpg",
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721150378/sfr2cxgftpwblfkjdcxx.jpg",
];

const imageLinksv = [
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721152227/dap2dqll2u5i64qee7z3.jpg",
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721152454/sdehypvn6txhn4ijjv4m.jpg",
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721223007/bhzrzeztzj940vi0kcls.jpg",
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721223471/lkcpkteazqyzfknil33z.jpg",
  "https://res.cloudinary.com/dqokryv6u/image/upload/v1721422692/ge0lnkyjez93mbcjtrss.jpg",
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Techend</title>
      </Head>
      <Navbar textColor={'#000'} bgColor={'rgb(2, 110, 129, 0.3)'}/>
      {/* <RevealBanner />
      <ProductNav text="Our Bestseller" link="#" />
      <ProductsContainer container sx={{ margin: "auto", mt: 5 }}>
        {imageLinks.map((imageLink, index) => (
          <LandingProductCard key={index} image={imageLink} />
        ))}
      </ProductsContainer>
      <WeekDeal />
      <ProductNav text="Under $255" link="#" />
      <ProductsContainer container sx={{ margin: "auto", mt: 5 }}>
        {imageLinksv.map((imageLink, index) => (
          <LandingProductCard key={index} image={imageLink} />
        ))}
      </ProductsContainer>
      <Discover />
      <MidHeader />
      <Reasons />
      <MidHeader />
      <Special />
      <Blog /> */}
      <Box
        sx={{
          backgroundImage: {
            xs: 'url("/assets/mobile.svg")', // For extra-small screens (mobile)
            sm: 'url("/assets/bg.svg")',     // For small screens and up
          },        
          width: "100vw",
          height: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></Box>
      <Footer />
    </>
  );
}
