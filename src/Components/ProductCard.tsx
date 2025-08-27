import {
  ProductItemStyled,
  ProductImage,
  ProductImageWrapper,
  ProductInfoContainer,
  RatingContainer,
} from "@/StyledComponents/Products"; // Updated imports
import {
  ProductPrice,
  ProductTitle,
  ProductDescription, // Added for potential description
} from "@/StyledComponents/Typos"; // Updated imports
import React, { useState, useImperativeHandle, useEffect } from "react";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icon for quick view/details
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Import WhatsApp icon
import { GreenButton, BorderedButton } from "@/StyledComponents/Buttons"; // Updated imports
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAddToCartMutation } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: any;
  // isLoading is for the page, not individual card. If passed, it means the whole product list is loading
  // Remove if not used for individual card loading states
  triggerCartRefetch: () => void;
  isLoading?: boolean; // Optional prop to indicate loading state
  ref?: React.Ref<any>; // Forward ref for imperative handle
}

const ProductCard: React.FC<ProductCardProps> = ({ product, triggerCartRefetch, isLoading, ref }) => {
  const router = useRouter();
  const [addToCart, { isLoading: AddToCartLoading }] = useAddToCartMutation();
  const { data: cart_data, isLoading: cart_loading, refetch: cart_refetch } = useCart();

  const AddItemToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = Cookies.get("access");
    const refresh = Cookies.get("refresh");
    const username = Cookies.get("username");

    if (access && refresh && username) {
      const response = await addToCart({
        product: product.product?.id || product.id,
        token: access,
        shopname: Cookies.get("shopname"),
      });
      if (response.error) {
        const error_message = response.error.data?.error || "An error occurred";
        toast.error(<Typography>{error_message}</Typography>);
      } else {
        cart_refetch();
        toast.success("Product added to cart!");
        triggerCartRefetch();
      }
    } else {
      toast.error("Please log in to add an item to cart.");
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = Math.ceil(rating) > fullStars ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {Array.from({ length: fullStars }).map((_, idx) => (
          <StarIcon key={`full-${idx}`} />
        ))}
        {halfStar === 1 && <StarHalfIcon />}
        {Array.from({ length: emptyStars }).map((_, idx) => (
          <StarBorderIcon key={`empty-${idx}`} />
        ))}
      </>
    );
  };

  const currentProduct = product?.product || product;

  const handleWhatsAppClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const shopDetailsCookie = Cookies.get("shopDetails");
    if (shopDetailsCookie) {
      try {
        const companyData = JSON.parse(shopDetailsCookie);
        const phoneNumber = companyData.contact_phone; // Assuming contact_phone is available here

        if (phoneNumber) {
          const productName = currentProduct?.title || "Product";
          const productPrice = currentProduct?.on_sale
            ? currentProduct?.discounted_price
            : currentProduct?.price;
          const message = `Hello, I'm interested in ordering the product: ${productName} for Ksh ${productPrice}. Could you please provide more details?`;
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        } else {
          toast.error("Shop owner's phone number not available.");
        }
      } catch (error) {
        console.error("Failed to parse shopDetails cookie:", error);
        toast.error("Could not retrieve shop details.");
      }
    } else {
      toast.error("Shop details not found.");
    }
  };

  return (
    <>
      <Toaster />
      <ProductItemStyled
        onClick={() => router.push(`/product/${currentProduct?.slug}`)} // Always navigate on click
        sx={{
          pointerEvents: AddToCartLoading ? 'none' : 'auto',
          opacity: AddToCartLoading ? 0.6 : 1,
          position: 'relative',
        }}
      >
        <ProductImageWrapper>
          {currentProduct?.on_sale && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: 'red',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                zIndex: 1,
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              Sale
            </Box>
          )}
          {currentProduct?.main_image && (
            <ProductImage
              src={`https://res.cloudinary.com/dqokryv6u/${currentProduct.main_image}`}
              alt={currentProduct.title || 'Product Image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </ProductImageWrapper>

        <ProductInfoContainer>
          {currentProduct?.on_sale ? (
            <Box>
              <ProductPrice sx={{ color: 'red', fontWeight: 'bold' }}>
                Ksh {currentProduct?.discounted_price}
              </ProductPrice>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  ml: 1,
                }}
              >
                Ksh {currentProduct?.price}
              </Typography>
            </Box>
          ) : (
            <ProductPrice>Ksh {currentProduct?.price}</ProductPrice>
          )}
          <ProductTitle>{currentProduct?.title}</ProductTitle>
          <RatingContainer>
            {renderStars(currentProduct?.rating || 0)}
            <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
              ({currentProduct?.reviews_count || 0})
            </Typography>
          </RatingContainer>

          {/* Buttons Section */}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, width:'100%' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <GreenButton
                onClick={AddItemToCart}
                sx={{ flex: 1 }}
                endIcon={!AddToCartLoading && <ShoppingBasketIcon />}
              >
                {AddToCartLoading ? <CircularProgress size={20} color="inherit" /> : "Add to Cart"}
              </GreenButton>
              <BorderedButton
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/product/${currentProduct?.slug}`);
                }}
                sx={{ flex: 1 }}
                endIcon={<VisibilityIcon />}
              >
                View
              </BorderedButton>
            </Box>
            <BorderedButton
              onClick={handleWhatsAppClick}
              sx={{
                width: '100%',
                backgroundColor: '#25D366',
                color: 'white',
                borderColor: '#25D366',
                '&:hover': { backgroundColor: '#1DA851', borderColor: '#1DA851' },
              }}
              endIcon={<WhatsAppIcon />}
            >
              order via whatsapp
            </BorderedButton>
          </Box>
        </ProductInfoContainer>

        {/* 🟡 Show loading message when adding */}
        {AddToCartLoading && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            Adding to cart...
          </Typography>
        )}
      </ProductItemStyled>
    </>
  );
};

export default ProductCard;