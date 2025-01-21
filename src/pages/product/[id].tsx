import Navbar from "@/Components/Navbar";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { useGetProductQuery } from "@/Api/services";
import Footer from "@/Components/Footer";
import { Box, Typography, Button, Grid } from "@mui/material";
import { styled } from "@mui/system";

// Styled components
const ProductContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "20px",
  gap: "20px",
  margin: "20px auto",
  maxWidth: "1200px",
});

const ProductImage = styled("img")({
  width: "100%",
  height: "auto",
  borderRadius: "10px",
});

const ProductDetails = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const ProductTitle = styled(Typography)({
  fontSize: "24px",
  fontWeight: "bold",
});

const ProductPrice = styled(Typography)({
  fontSize: "20px",
  color: "#0C0C4C",
  fontWeight: "bold",
});

const AddToCartButton = styled(Button)({
  backgroundColor: "#0C0C4C",
  color: "#fff",
  textTransform: "capitalize",
  padding: "10px 20px",
  borderRadius: "5px",
  '&:hover': {
    backgroundColor: "#333",
  },
});

function ProductDetailView() {
  const router = useRouter();
  const id  = router.query.id;
  const { data: product, error, isLoading } = useGetProductQuery(id);
  console.log(product)

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error loading product details</Typography>;
  }

  return (
    <>
      <Navbar textColor={'#000'} bgColor={'#fff'}/>
      <Breadcrumbs aria-label="breadcrumb" sx={{ padding: "20px" }}>
        <Link underline="hover" color="inherit" href="/">
          TechEnd
        </Link>
        <Link underline="hover" color="inherit" href="/shop">
          Shop
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>
      <ProductContainer>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ProductImage
              src={`https://res.cloudinary.com/dqokryv6u/${product?.main_image}`}
              alt={product.title}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProductDetails>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductPrice>${product.price}</ProductPrice>
              <Typography>Color: {product.color}</Typography>
              <Typography>Size: {product.size}</Typography>
              <Typography>Rating: {product.rating} / 5</Typography>
              <AddToCartButton>Add to Cart</AddToCartButton>
            </ProductDetails>
          </Grid>
        </Grid>
      </ProductContainer>
      <Footer />
    </>
  );
}

export default ProductDetailView;
