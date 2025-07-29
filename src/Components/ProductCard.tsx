import {
  ProductItemStyled,
  ProductImage,
  ProductImageWrapper,
  ProductInfoContainer,
  RatingContainer,
  ProductOverlay,
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
  const [isHovered, setIsHovered] = useState(false);
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
      // useImperativeHandle(ref, () => ({
      //   cart_refetch() {
      //     cart_refetch();
      //   },
      // }));
    }
  };

  // useEffect(() => {
  //   if (!isLoading && cart_data) {
  //     console.log(cart_data, "****** from context");
  //   }
  // }, [cart_data, isLoading]);

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

  return (
    <>
      <Toaster />
      <ProductItemStyled
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !AddToCartLoading && router.push(`/product/${currentProduct?.id}`)} // disable click while loading
        sx={{
          pointerEvents: AddToCartLoading ? 'none' : 'auto',
          opacity: AddToCartLoading ? 0.6 : 1,
          position: 'relative',
        }}
      >
        <ProductImageWrapper>
          <ProductImage
            src={`https://res.cloudinary.com/dqokryv6u/${currentProduct?.main_image}`}
            alt={currentProduct?.title}
          />
          {isHovered && !AddToCartLoading && (
            <ProductOverlay>
              <GreenButton
                onClick={AddItemToCart}
                sx={{ mr: 1 }}
                endIcon={!AddToCartLoading && <ShoppingBasketIcon />}
              >
                {AddToCartLoading ? <CircularProgress size={20} color="inherit" /> : "Add to Cart"}
              </GreenButton>
              <BorderedButton
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/product/${currentProduct?.slug}`);
                }}
                sx={{
                  ml: 1,
                  color: '#fff',
                  borderColor: '#fff',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: '#fff' },
                }}
                endIcon={<VisibilityIcon />}
              >
                View
              </BorderedButton>
            </ProductOverlay>
          )}
        </ProductImageWrapper>

        <ProductInfoContainer>
          <ProductPrice>Ksh {currentProduct?.price}</ProductPrice>
          <ProductTitle>{currentProduct?.title}</ProductTitle>
          <RatingContainer>
            {renderStars(currentProduct?.rating || 0)}
            <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
              ({currentProduct?.reviews_count || 0})
            </Typography>
          </RatingContainer>
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