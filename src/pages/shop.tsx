import Navbar from "@/Components/Navbar";
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import { BreadCrumbContainer } from "@/StyledComponents/BreadCrumb";
import {
  FiltersContainer,
  MainProductsContainer,
  ProductItem,
  ProductsContainer,
} from "@/StyledComponents/Products";
import { GreenButton } from "@/StyledComponents/Buttons";
import ProductCard from "@/Components/ProductCard";
import Filters from "@/Components/Filters";
import { useRouter } from "next/router";
import { useGetProductsQuery } from "@/Api/services";
import { Box, Grid } from "@mui/material";
import Footer from "@/Components/Footer";

const Shop = forwardRef((props:any, ref:any) => {
  const router = useRouter();
    const cartRef = useRef<any>(null);
  const [category, setCategory] = useState<any>("");
  const {
    data: products_data,
    error: products_error,
    isLoading: products_loading,
  } = useGetProductsQuery({ company: "techend", category: category });
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
  useEffect(() => {
    if (router.isReady) {
      const { category } = router.query;
      if (category) {
        setCategory(category || "");
      }
    }
  }, [router.isReady, router.query]);

  return (
    <>
    {/* <Box sx={{paddingBottom:{md:"120px", xs:"50px"}}}>
      <Navbar ref={cartRef}/>
    </Box> */}
      <BreadCrumbContainer >
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            TechEnd
          </Link>
          <Link underline="hover" color="inherit" href="/shop">
            Shop
          </Link>
        </Breadcrumbs>
      </BreadCrumbContainer>
      <MainProductsContainer sx={{ mt: 4 }}>
        <FiltersContainer sx={{ display: { xs: "none", md: "flex" } }}>
          <GreenButton>FILTER BY</GreenButton>
          <GreenButton>SORT BY</GreenButton>
        </FiltersContainer>
        <Filters />
        {products_loading}
        <ProductsContainer container>
          {products_loading ? (
            <Grid container spacing={2}>
              {[...Array(8)].map((_, index) => (
                <Grid item md={3} xs={12}  key={index}>
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <Skeleton width="60%" height={30} sx={{ mt: 1 }} />
                  <Skeleton width="40%" height={30} />
                </Grid>
              ))}
            </Grid>
          ) : products_error ? (
            <div>Error loading products</div>
          ) : (
            <>
              {products_data.map((product, index) => (
              <ProductItem  item md={3} xs={12} key={index}>
                <ProductCard product={product} isLoading={products_loading}   triggerCartRefetch={triggerCartRefetch}/>
              </ProductItem>
              ))}
            </>
          )}
          </ProductsContainer>
      </MainProductsContainer>
      {/* <Footer /> */}
    </>
  );
})

export default Shop;
