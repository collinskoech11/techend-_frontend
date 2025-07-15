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
import React, { useState } from "react";
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

interface ProductCardProps {
  product: any;
  // isLoading is for the page, not individual card. If passed, it means the whole product list is loading
  // Remove if not used for individual card loading states
  triggerCartRefetch: () => void;
  isLoading?: boolean; // Optional prop to indicate loading state
}

const ProductCard: React.FC<ProductCardProps> = ({ product, triggerCartRefetch, isLoading }) => {
  console.log("ProductCard rendered with product:", isLoading);
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false); // State for hover effect

  const [addToCart, { isLoading: AddToCartLoading }] = useAddToCartMutation();

  const AddItemToCart = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click from firing when clicking add to cart
    const access = Cookies.get("access");
    const refresh = Cookies.get("refresh");
    const username = Cookies.get("username");

    if (access && refresh && username) {
      const response = await addToCart({ product: product.product?.id || product.id, token: access, shopname: Cookies.get("shopname") });
      if (response.error) {
        const error_message = response.error.data?.error || "An error occurred";
        toast.error(<Typography>{error_message}</Typography>);
      } else {
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
        {halfStar === 1 && (
          <StarHalfIcon />
        )}
        {Array.from({ length: emptyStars }).map((_, idx) => (
          <StarBorderIcon key={`empty-${idx}`} />
        ))}
      </>
    );
  };

  // Centralized product data access
  const currentProduct = product?.product || product;

  return (
    <>
      <Toaster />
      <ProductItemStyled
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/product/${currentProduct?.id}`)} // Make the whole card clickable
      >
        <ProductImageWrapper>
          <ProductImage src={`https://res.cloudinary.com/dqokryv6u/${currentProduct?.main_image}`} alt={currentProduct?.title} />
          {isHovered && (
            <ProductOverlay>
              <GreenButton
                onClick={AddItemToCart} // Use the new GreenButton for primary action
                sx={{ mr: 1 }}
                endIcon={!AddToCartLoading && <ShoppingBasketIcon />}
              >
                {AddToCartLoading ? <CircularProgress size={20} color="inherit" /> : "Add to Cart"}
              </GreenButton>
              <BorderedButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from firing
                  router.push(`/product/${currentProduct?.id}`);
                }}
                sx={{ ml: 1, color: '#fff', borderColor: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: '#fff' } }}
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
          {/* Optional: Add a short product description if available */}
          {/* <ProductDescription>{currentProduct?.short_description}</ProductDescription> */}
          <RatingContainer>
            {renderStars(currentProduct?.rating || 0)}
            <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
              ({currentProduct?.reviews_count || 0})
            </Typography>
          </RatingContainer>
        </ProductInfoContainer>

        {/* Removed individual buttons here as they are now part of the hover overlay */}
      </ProductItemStyled>
    </>
  );
};

export default ProductCard;