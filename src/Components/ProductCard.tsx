
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
import React from "react";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icon for quick view/details
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Import WhatsApp icon
import { IconActionsContainer } from "@/StyledComponents/Products";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { useAddToCartMutation, useAddToCartGuestMutation } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/Types";

interface ProductCardProps {
  product: Product;
  triggerCartRefetch: () => void;
  isLoading?: boolean; 
  ref?: React.Ref<any>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, triggerCartRefetch, isLoading, ref }) => {
  const router = useRouter();
  const [addToCart, { isLoading: isAddingToCartAuth }] = useAddToCartMutation();
  const [addToCartGuest, { isLoading: isAddingToCartGuest }] = useAddToCartGuestMutation();
  const { sessionId, refetch: cart_refetch } = useCart();

  const AddItemToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = Cookies.get("access");

    const handleMutation = async (mutation: any, args: any) => {
      try {
        await mutation(args).unwrap();
        cart_refetch();
        toast.success("Product added to cart!");
        triggerCartRefetch();
      } catch (error: any) {
        const error_message = error.data?.error || "An error occurred";
        toast.error(<Typography>{error_message}</Typography>);
      }
    };

    if (access) {
      handleMutation(addToCart, { product: product.id, token: access, shopname: Cookies.get("shopname") });
    } else if (sessionId) {
      const shopname = Cookies.get("shopname") || "techend";
      handleMutation(addToCartGuest, { productId: product.id.toString(), quantity: 1, sessionId, companyName: shopname });
    } else {
      toast.error("Could not add item to cart. Please refresh the page.");
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

  const currentProduct = product;
  const AddToCartLoading = isAddingToCartAuth || isAddingToCartGuest;

  const handleWhatsAppClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const shopDetailsCookie = Cookies.get("shopDetails");
    if (shopDetailsCookie) {
      try {
        const companyData = JSON.parse(shopDetailsCookie);
        const phoneNumber = companyData.contact_phone;

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
        onClick={() => router.push(`/product/${currentProduct?.slug}`)}
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
          {currentProduct?.stock === 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'gray',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                zIndex: 1,
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              Out of Stock
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
          {currentProduct?.description && (
            <Box
              sx={{
                height: '40px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                '&:hover': {
                  overflow: 'visible',
                  display: 'block',
                  height: 'auto',
                }
              }}
            >
              <ProductDescription>
                {currentProduct.description}
              </ProductDescription>
            </Box>
          )}
          <RatingContainer>
            {renderStars(currentProduct?.rating || 0)}
            <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
              ({currentProduct?.reviews_count || 0})
            </Typography>
          </RatingContainer>
          <IconActionsContainer>
            <IconButton onClick={AddItemToCart} disabled={currentProduct.stock === 0 || AddToCartLoading}>
              {AddToCartLoading ? <CircularProgress size={24} /> : <ShoppingBasketIcon />}
            </IconButton>
            <IconButton onClick={() => router.push(`/product/${currentProduct?.slug}`)}>
              <VisibilityIcon />
            </IconButton>
            <IconButton onClick={handleWhatsAppClick} disabled={currentProduct.stock === 0}>
              <WhatsAppIcon />
            </IconButton>
          </IconActionsContainer>
        </ProductInfoContainer>

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
