import {
  ProductItem,
  ProductItemStyled,
  ProductImage,
  RatingContainer,
  IconWrapper,
  IconsContainer,
} from "@/StyledComponents/Products";
import {
  ProductPrice,
  ProductTitle,
  ReviewText,
} from "@/StyledComponents/Typos";
import React, { useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { BorderedButton, GreenButton } from "@/StyledComponents/Buttons";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAddToCartMutation } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

function ProductCard({ product, isLoading }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [addToCart, { isLoading: AddToCartLoading, error: AddToCartError }] = useAddToCartMutation();
  const access = Cookies.get("access");
  const refresh = Cookies.get("refresh");
  const username = Cookies.get("username");
  const AddItemToCart = async () => {
    if (access && refresh && username) {
    const response = await addToCart({ product: product.product?.id || product.id, token: Cookies.get("access") });
    try {
      if (response.error) {
        const emailError = response.error?.data?.email?.[0];
        const usernameError = response.error?.data?.username?.[0];
        const passwordError = response.error?.data?.password?.[0];
        const error_message = emailError || usernameError || passwordError || response.error.data.error;

        toast.error(
          <>
            <Typography>{error_message}</Typography>
          </>
        );
      } else if (response) {
        toast.success("product added to cart");
      }
    } catch (error) {
      toast.error("an Unexpected error occurred");
    }
  } else {
    toast.error("Please log in to add an item to cart");
  }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = Math.ceil(rating) > fullStars ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {Array.from({ length: fullStars }, (_, index) => (
          <StarIcon key={index} sx={{ fontSize: "14px", color: "rgb(78, 116, 96)" }} />
        ))}
        {halfStar === 1 && (
          <StarHalfIcon sx={{ fontSize: "14px", color: "rgb(78, 116, 96)" }} />
        )}
        {Array.from({ length: emptyStars }, (_, index) => (
          <StarBorderIcon key={index} sx={{ fontSize: "14px", color: "rgb(78, 116, 96)" }} />
        ))}
      </>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Toaster />
      <ProductItem item md={3} xs={12}>
        <ProductItemStyled
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Box sx={{ width: "100%", height: "200px", display: "flex", alignItems: "center", overflow: "hidden" }}>
            <ProductImage src={`https://res.cloudinary.com/dqokryv6u/${product?.product?.main_image || product?.main_image}`} />
          </Box>
          {isHovered && (
            <IconsContainer>
              <IconWrapper>
                <ShoppingBasketIcon sx={{ fontSize: "25px" }} />
              </IconWrapper>
              <IconWrapper>
                <ShoppingBasketIcon sx={{ fontSize: "25px" }} />
              </IconWrapper>
              <IconWrapper>
                <StarIcon sx={{ fontSize: "25px" }} />
              </IconWrapper>
            </IconsContainer>
          )}
          <br />
          <ProductPrice>$ {product?.product?.price || product?.price}</ProductPrice>
          <ProductTitle>{product?.product?.title || product?.title}</ProductTitle>
          <RatingContainer sx={{maxWidth:"100px"}}>
            {renderStars(product?.product?.rating || product?.rating)}
            {/* <ReviewText>507 reviews</ReviewText> */}
          </RatingContainer>
          <BorderedButton sx={{ mt: 2 }} onClick={() => router.push(`/product/${product?.product?.id || product?.id}`)}>View Product</BorderedButton>
          <GreenButton sx={{ width: "100%", marginTop: "10px" }} onClick={() => AddItemToCart()}>
            {AddToCartLoading ? <CircularProgress /> : "Add to cart"}
          </GreenButton>
        </ProductItemStyled>
      </ProductItem>
    </>
  );
}

export default ProductCard;
