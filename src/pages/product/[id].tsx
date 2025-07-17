import React, { useState, useImperativeHandle, useEffect } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import { useRouter } from "next/router";
import { useGetProductQuery, useAddToCartMutation } from "@/Api/services";
// Removed: import Navbar from "@/Components/Navbar";
// Removed: import Footer from "@/Components/Footer";
// Removed: import { PageContainer } from "../path/to/wherever/PageContainer/is/defined"; // Assuming PageContainer is now a global styled component or part of layout

import { Box, Typography, Button, Grid, Chip, IconButton, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import { Autoplay, Pagination, Thumbs, Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import Cookies from "js-cookie";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "@/contexts/CartContext";

// --- Color Palette (Consistent with previous suggestions) ---
const primaryColor = "#be1f2f";
const primaryDark = "#a01624";
// Removed lightGray here as PageContainer will provide background
const mediumGray = "#e0e0e0";
const darkText = "#212121";
const lightText = "#555555";
const successColor = "#4CAF50";

// --- Styled Components ---
// Removed PageContainer styled component definition

const ProductDetailSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(3),
  gap: theme.spacing(4),
  margin: "20px auto",
  maxWidth: "1200px",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    padding: theme.spacing(5),
  },
}));

const ProductImageGallery = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    flex: 0.6,
  },
}));

const StyledMainSwiperSlide = styled(SwiperSlide)({
  height: "clamp(300px, 50vh, 500px)",
  borderRadius: "12px",
  overflow: "hidden",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: "#f0f0f0",
});

const MainCarouselImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "12px",
});

const ThumbnailImage = styled("img")<{ active?: boolean }>(({ theme, active }) => ({
  width: "100%",
  height: "80px",
  objectFit: "cover",
  borderRadius: "8px",
  cursor: "pointer",
  opacity: active ? 1 : 0.7,
  border: active ? `2px solid ${primaryColor}` : `2px solid transparent`,
  transition: "all 0.3s ease",
  "&:hover": {
    opacity: 1,
    borderColor: primaryColor,
  },
}));

const ProductInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    flex: 0.4,
  },
}));

const ProductTitle = styled(Typography)({
  fontSize: "clamp(28px, 4vw, 36px)",
  fontWeight: 800,
  color: darkText,
  lineHeight: 1.2,
});

const ProductPrice = styled(Typography)({
  fontSize: "clamp(24px, 3.5vw, 32px)",
  color: primaryColor,
  fontWeight: 700,
  marginTop: '8px',
});

const ProductDescription = styled(Typography)({
  fontSize: "1rem",
  color: lightText,
  lineHeight: 1.6,
  marginTop: '16px',
});

const AttributeChip = styled(Chip)({
  backgroundColor: "#e0e0e0",
  color: darkText,
  fontWeight: 600,
  marginRight: '8px',
  marginBottom: '8px',
});

const QuantitySelector = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "& .MuiIconButton-root": {
    border: `1px solid ${mediumGray}`, // Changed from lightGray to mediumGray for more visibility
    borderRadius: "8px",
    backgroundColor: '#f0f0f0',
    "&:hover": {
      backgroundColor: mediumGray,
    },
  },
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  color: "#fff",
  textTransform: "uppercase",
  padding: "12px 25px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "1.1rem",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  "&:hover": {
    backgroundColor: primaryDark,
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },
  "&:disabled": {
    backgroundColor: '#cccccc',
    color: '#888888',
    cursor: 'not-allowed',
  }
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "2px",
  marginBottom: theme.spacing(1),
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
    color: "#FFD700",
  },
}));

const SkeletonProductImage = styled(Skeleton)({
  width: "100%",
  height: "clamp(300px, 50vh, 500px)",
  borderRadius: "12px",
});

const SkeletonThumbnail = styled(Skeleton)({
  width: "100%",
  height: "80px",
  borderRadius: "8px",
});

function ProductDetailView(ref:any) {
  const { data: cart_data, isLoading:cart_loading, refetch: cart_refetch } = useCart();
  const router = useRouter();
  const id = router.query.id;
  const [shopname] = useState(Cookies.get("shopname") || "techend");
  const { data: product, isLoading, error } = useGetProductQuery(id);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const handleQuantityChange = (type: 'add' | 'remove') => {
    if (type === 'add') {
      setQuantity((prev) => prev + 1);
    } else if (type === 'remove' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    const access = Cookies.get("access");
    const refresh = Cookies.get("refresh");
    const username = Cookies.get("username");

    if (access && refresh && username) {
      const response = await addToCart({ product: product?.id, quantity, token: access, shopname: Cookies.get("shopname") });
      if ('error' in response) {
        const errorMessage = (response.error as any).data?.error || "Failed to add product to cart.";
        toast.error(errorMessage);
      } else {
        toast.success(`${quantity} x ${product?.title} added to cart!`);
        cart_refetch(); // <--- Add this line to update the cart context
      }
    } else {
      useImperativeHandle(ref, () => ({
        cart_refetch() {
          cart_refetch();
        },
      }));
      toast.error("Please log in to add items to your cart.");
    }
  };
  

  // useEffect(() => {
  //     if (!isLoading && cart_data) {
  //       console.log(cart_data, "****** from context");
  //     }
  //   }, [cart_data, isLoading]); 

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

  if (error) {
    return (
      // Only render the error message, assuming PageContainer and Navbar/Footer handle the overall layout
      <Box sx={{ p: 4, textAlign: 'center', color: darkText }}>
        <Typography variant="h5" color="error">Error loading product details.</Typography>
        <Typography variant="body1">Please try again later or contact support.</Typography>
      </Box>
    );
  }

  const imagesToDisplay = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.main_image ? [product.main_image] : []);

  return (
    // Removed PageContainer wrapper here
    <>
      <Toaster position="top-right" />
      {/* Removed Navbar */}
      <Box sx={{ pt: 3, pb: 2, px: 3, maxWidth: "1200px", mx: "auto" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink underline="hover" color="inherit" href="/">
            Home
          </MuiLink>
          <MuiLink underline="hover" color="inherit" href={`/shop/${shopname}`}>
            Shop
          </MuiLink>
          <Typography color="text.primary">
            {isLoading ? <Skeleton width={150} /> : product?.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      <ProductDetailSection>
        <ProductImageGallery>
          {isLoading ? (
            <>
              <SkeletonProductImage variant="rectangular" />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {[...Array(Math.min(imagesToDisplay.length > 0 ? imagesToDisplay.length : 3, 4))].map((_, index) => (
                  <SkeletonThumbnail key={index} variant="rectangular" />
                ))}
              </Box>
            </>
          ) : (
            <>
              <Swiper
              style={{ width:"400px", maxWidth:"90vw" }}
                spaceBetween={10}
                navigation={imagesToDisplay.length > 1}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Pagination, Autoplay]}
                className="mySwiper2"
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
              >
                {imagesToDisplay.map((image, index) => (
                  <StyledMainSwiperSlide key={index} style={{ width:"400px", maxWidth:"90vw" }}>
                    <MainCarouselImage
                      src={`https://res.cloudinary.com/dqokryv6u/${image}`}
                      alt={`${product?.title} - Image ${index + 1}`}
                    /> 
                  </StyledMainSwiperSlide>
                ))}
                {imagesToDisplay.length === 0 && (
                    <StyledMainSwiperSlide style={{ width:"85vw", maxWidth:"auto"}}>
                      <MainCarouselImage src="https://via.placeholder.com/500?text=No+Image+Available" alt="No Image" />
                    </StyledMainSwiperSlide>
                )}
              </Swiper>

              {imagesToDisplay.length > 1 && (
                <Box sx={{ mt: 2 }}>
                  <Swiper
                  style={{ width:"400px", maxWidth:"90vw" }}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={Math.min(imagesToDisplay.length, 4)}
                    freeMode={true}
                    watchSlidesProgress
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper"
                  >
                    {imagesToDisplay.map((image, index) => (
                      <SwiperSlide key={index}>
                        <ThumbnailImage
                          src={`https://res.cloudinary.com/dqokryv6u/${image}`}
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              )}
            </>
          )}
        </ProductImageGallery>

        <ProductInfo>
          {isLoading ? (
            <>
              <Skeleton width="90%" height={50} />
              <Skeleton width="50%" height={40} />
              <Skeleton width="30%" height={30} />
              <Skeleton width="40%" height={30} />
              <Skeleton width="20%" height={30} />
              <Skeleton width="80%" height={20} sx={{ mt: 2 }} />
              <Skeleton width="70%" height={20} />
              <Skeleton width="90%" height={20} />
              <Skeleton width="100%" height={50} sx={{ mt: 4 }} />
            </>
          ) : (
            <>
              <ProductTitle>{product?.title}</ProductTitle>
              <ProductPrice>Kes {product?.price?.toLocaleString()}</ProductPrice>

              <RatingContainer>
                {renderStars(product?.rating || 0)}
                <Typography variant="body2" color={lightText} sx={{ ml: 0.5 }}>
                  ({product?.reviews_count || 0} reviews)
                </Typography>
              </RatingContainer>

              <Box>
                {product?.color && <AttributeChip label={`Color: ${product.color}`} />}
                {product?.size && <AttributeChip label={`Size: ${product.size}`} />}
              </Box>

              <ProductDescription>{product?.description || "No detailed description available."}</ProductDescription>

              <QuantitySelector>
                <Typography variant="h6" color={darkText}>Quantity:</Typography>
                <IconButton onClick={() => handleQuantityChange('remove')} disabled={quantity <= 1 || isAddingToCart}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6" sx={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange('add')} disabled={isAddingToCart}>
                  <AddIcon />
                </IconButton>
              </QuantitySelector>

              <AddToCartButton onClick={handleAddToCart} disabled={isAddingToCart}>
                {isAddingToCart ? <CircularProgress size={24} color="inherit" /> : (
                  <>
                    <ShoppingCartIcon sx={{ mr: 1 }} /> Add to Cart
                  </>
                )}
              </AddToCartButton>
            </>
          )}
        </ProductInfo>
      </ProductDetailSection>

      {/* Removed Footer */}
    </>
  );
}

export default ProductDetailView;