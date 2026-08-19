import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import NextLink from "next/link";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Skeleton,
  Grid as MuiGrid,
  Divider,
  Tab,
  Tabs,
  useTheme,
  alpha,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import { Autoplay, Pagination, Thumbs, Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

// Icons
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

// Services & Contexts
import {
  useGetProductQuery,
  useGetProductsQuery,
  useAddToCartMutation,
  useAddToCartGuestMutation,
} from "@/Api/services";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/Components/ProductCard";
import { BoutiqueLabel, ShopSerifHeading } from "@/StyledComponents/Typos";
import { AccentButton } from "@/StyledComponents/Hero";
import { Product } from "@/Types";

// Grid forwardRef wrapper to honor the size={{ ... }} rule in MUI v5
const Grid = React.forwardRef<HTMLDivElement, any>(function Grid(props, ref) {
  const { size, children, ...rest } = props;
  if (size) {
    return (
      <MuiGrid ref={ref} item {...size} {...rest}>
        {children}
      </MuiGrid>
    );
  }
  return (
    <MuiGrid ref={ref} {...rest}>
      {children}
    </MuiGrid>
  );
});

function ProductDetailView() {
  const theme = useTheme();
  const router = useRouter();
  const { slug } = router.query;
  const initialShop = (typeof router.query.shop === "string" ? router.query.shop : Cookies.get("shopname")) || "techend";
  const [shopname, setShopName] = useState(initialShop);

  const { sessionId, refetch: cart_refetch } = useCart();
  const { data: product, isLoading, error } = useGetProductQuery(slug, {
    skip: !slug,
  });

  const targetShop = product?.company || shopname;

  useEffect(() => {
    if (product?.company) {
      setShopName(product.company);
      if (Cookies.get("shopname") !== product.company) {
        Cookies.set("shopname", product.company, { expires: 7, sameSite: "Lax" });
      }
    }
  }, [product?.company]);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  const [addToCartAuth, { isLoading: isAddingToCartAuth }] = useAddToCartMutation();
  const [addToCartGuest, { isLoading: isAddingToCartGuest }] = useAddToCartGuestMutation();
  const isAddingToCart = isAddingToCartAuth || isAddingToCartGuest;

  // Query related products from same shop
  const { data: relatedData } = useGetProductsQuery(
    {
      company: targetShop,
      page_size: 4,
    },
    { skip: !targetShop }
  );

  const relatedProducts: Product[] = (relatedData?.results || [])
    .filter((p: Product) => p.id !== product?.id)
    .slice(0, 4);

  const handleQuantityChange = (type: "add" | "remove") => {
    if (type === "add") {
      if (product?.stock && quantity >= product.stock) {
        toast.error(`Maximum available stock is ${product.stock}`);
        return;
      }
      setQuantity((prev) => prev + 1);
    } else if (type === "remove" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const access = Cookies.get("access");
    const activeShop = product.company || Cookies.get("shopname") || shopname || "techend";
    const activeSessionId = sessionId || localStorage.getItem("session_id");

    try {
      if (access) {
        await addToCartAuth({
          product: product.id,
          quantity,
          token: access,
          shopname: activeShop,
        }).unwrap();
      } else if (activeSessionId) {
        await addToCartGuest({
          productId: product.id.toString(),
          quantity,
          sessionId: activeSessionId,
          companyName: activeShop,
        }).unwrap();
      } else {
        toast.error("Could not initialize cart session. Please refresh the page.");
        return;
      }

      toast.success(`${quantity} × ${product.title} added to bag!`, {
        icon: "🛍️",
        style: {
          borderRadius: "12px",
          background: "#18181b",
          color: "#fff",
          fontSize: "0.88rem",
          fontWeight: 600,
        },
      });
      cart_refetch?.();
    } catch (err: any) {
      const errorMessage = err?.data?.error || "Failed to add product to cart.";
      toast.error(errorMessage);
    }
  };

  const handleWhatsAppClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const shopDetailsCookie = Cookies.get("shopDetails");
    let phoneNumber = "254700000000";

    if (shopDetailsCookie) {
      try {
        const companyData = JSON.parse(shopDetailsCookie);
        if (companyData?.contact_phone) {
          phoneNumber = companyData.contact_phone;
        }
      } catch (e) {
        console.error("Failed to parse shopDetails cookie", e);
      }
    }

    const productName = product?.title || "Product";
    const currentPrice = product?.on_sale ? product.discounted_price : product?.price;
    const message = `Hello, I'm interested in ordering "${productName}" (Kes ${Number(currentPrice)?.toLocaleString()}) from your store. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const numericRating =
    typeof product?.rating === "number"
      ? product.rating
      : Number(product?.rating) || 5.0;
  const formattedRating = (!isNaN(numericRating) ? numericRating : 5.0).toFixed(1);

  const renderStars = (rawRating: any = 5) => {
    const num = typeof rawRating === "number" ? rawRating : Number(rawRating) || 5;
    const validRating = isNaN(num) ? 5 : Math.max(0, Math.min(5, num));
    const fullStars = Math.floor(validRating);
    const halfStar = Math.ceil(validRating) > fullStars ? 1 : 0;
    const emptyStars = Math.max(0, 5 - fullStars - halfStar);

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, color: "#f59e0b" }}>
        {Array.from({ length: fullStars }).map((_, idx) => (
          <StarIcon key={`full-${idx}`} sx={{ fontSize: "1.15rem" }} />
        ))}
        {halfStar === 1 && <StarHalfIcon sx={{ fontSize: "1.15rem" }} />}
        {Array.from({ length: emptyStars }).map((_, idx) => (
          <StarBorderIcon key={`empty-${idx}`} sx={{ fontSize: "1.15rem" }} />
        ))}
      </Box>
    );
  };

  if (error) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#18181b" }}>
          Product Not Found
        </Typography>
        <Typography sx={{ color: "#71717a", mb: 3 }}>
          The product you are looking for might have been removed or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/shop/${shopname}`)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: "30px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Return to Storefront
        </Button>
      </Box>
    );
  }

  const rawImages: string[] = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.main_image ? [product.main_image] : (product?.image ? [product.image] : []));

  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600' fill='%23f4f4f5'><rect width='100%' height='100%' fill='%23f4f4f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='600' fill='%23a1a1aa'>No Image Available</text></svg>";

  const formatImageUrl = (imgStr: string) => {
    if (!imgStr) return fallbackImage;
    if (imgStr.startsWith("http://") || imgStr.startsWith("https://") || imgStr.startsWith("data:")) return imgStr;
    return `https://res.cloudinary.com/dqokryv6u/${imgStr}`;
  };

  const imagesToDisplay = rawImages.length > 0 ? rawImages.map(formatImageUrl) : [fallbackImage];

  const currentPrice = product?.on_sale ? product.discounted_price : product?.price;
  const originalPrice = product?.price;
  const savings = product?.on_sale && originalPrice && currentPrice ? originalPrice - currentPrice : 0;
  const discountPercent = product?.on_sale && originalPrice && savings > 0 ? Math.round((savings / originalPrice) * 100) : 0;
  const isOutOfStock = product?.stock === 0;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", pb: 10 }}>
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* --- TOP BREADCRUMB & NAVIGATION BAR --- */}
      <Box sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid rgba(0, 0, 0, 0.06)", py: 2 }}>
        <Box sx={{ maxWidth: "1350px", mx: "auto", px: { xs: 2.5, sm: 4, md: 6 } }}>
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: "0.9rem", color: "#a1a1aa" }} />}
            aria-label="breadcrumb"
            sx={{
              "& .MuiBreadcrumbs-li": {
                fontSize: "0.84rem",
                fontWeight: 500,
              },
            }}
          >
            <NextLink href="/" passHref legacyBehavior>
              <MuiLink underline="hover" color="inherit" sx={{ color: "#71717a", "&:hover": { color: theme.palette.primary.main } }}>
                Home
              </MuiLink>
            </NextLink>

            <NextLink href={`/shop/${targetShop}`} passHref legacyBehavior>
              <MuiLink underline="hover" color="inherit" sx={{ color: "#71717a", "&:hover": { color: theme.palette.primary.main } }}>
                Shop
              </MuiLink>
            </NextLink>

            {product?.category && (
              <Typography sx={{ color: "#71717a", fontSize: "0.84rem" }}>
                {product.category}
              </Typography>
            )}

            <Typography sx={{ color: "#18181b", fontWeight: 600, fontSize: "0.84rem" }}>
              {isLoading ? <Skeleton width={120} /> : product?.title}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* --- MAIN PRODUCT SHOWCASE CONTAINER --- */}
      <Box sx={{ maxWidth: "1350px", mx: "auto", px: { xs: 2, sm: 4, md: 6 }, pt: { xs: 3, md: 5 } }}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* ================= LEFT: LUXURY IMAGE GALLERY ================= */}
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Box
              sx={{
                position: { xs: "static", md: "sticky" },
                top: { xs: 80, md: 90 },
                borderRadius: "24px",
                backgroundColor: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.07)",
                p: { xs: 1.5, sm: 2 },
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Badges Container */}
              <Box sx={{ position: "relative", width: "100%" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {product?.on_sale && (
                    <Chip
                      label={discountPercent > 0 ? `${discountPercent}% OFF` : "SALE"}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        letterSpacing: "0.04em",
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  {isOutOfStock && (
                    <Chip
                      label="OUT OF STOCK"
                      size="small"
                      sx={{
                        backgroundColor: "#18181b",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        letterSpacing: "0.04em",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </Box>

                {/* Main Image Slider */}
                {isLoading ? (
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      width: "100%",
                      height: { xs: 340, sm: 460, md: 520 },
                      borderRadius: "18px",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      borderRadius: "18px",
                      overflow: "hidden",
                      backgroundColor: "#f4f4f5",
                      position: "relative",
                    }}
                  >
                    <Swiper
                      spaceBetween={10}
                      navigation={imagesToDisplay.length > 1}
                      thumbs={{ swiper: thumbsSwiper }}
                      modules={[FreeMode, Navigation, Thumbs, Pagination, Autoplay]}
                      pagination={{ clickable: true }}
                      autoplay={
                        imagesToDisplay.length > 1
                          ? { delay: 4500, disableOnInteraction: true }
                          : false
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {imagesToDisplay.map((imgUrl, index) => (
                        <SwiperSlide key={index}>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: { xs: 340, sm: 460, md: 520 },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f4f4f5",
                            }}
                          >
                            <Image
                              src={imgUrl}
                              alt={`${product?.title || "Product"} - View ${index + 1}`}
                              fill
                              priority={index === 0}
                              sizes="(max-width: 768px) 100vw, 600px"
                              style={{
                                objectFit: "contain",
                                padding: "8px",
                              }}
                            />
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>
                )}

                {/* Thumbnails Row */}
                {imagesToDisplay.length > 1 && (
                  <Box sx={{ mt: 2, px: 0.5 }}>
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={Math.min(imagesToDisplay.length, 5)}
                      freeMode={true}
                      watchSlidesProgress
                      modules={[FreeMode, Navigation, Thumbs]}
                    >
                      {imagesToDisplay.map((imgUrl, index) => (
                        <SwiperSlide key={index} style={{ cursor: "pointer" }}>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: 72,
                              borderRadius: "12px",
                              overflow: "hidden",
                              border: "2px solid rgba(0,0,0,0.08)",
                              backgroundColor: "#f4f4f5",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                borderColor: theme.palette.primary.main,
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            <Image
                              src={imgUrl}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              sizes="80px"
                              style={{ objectFit: "contain", padding: "4px" }}
                            />
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* ================= RIGHT: PRODUCT DETAILS & ACTIONS ================= */}
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 0, 0, 0.07)",
                p: { xs: 3, sm: 4 },
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              {isLoading ? (
                <>
                  <Skeleton width="30%" height={24} />
                  <Skeleton width="85%" height={48} />
                  <Skeleton width="40%" height={32} />
                  <Skeleton width="60%" height={40} />
                  <Skeleton width="100%" height={80} />
                  <Skeleton width="100%" height={56} sx={{ borderRadius: "30px" }} />
                </>
              ) : (
                <>
                  {/* Category & Boutique Tag */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    {product?.category && (
                      <BoutiqueLabel sx={{ mb: 0 }}>
                        {product.category}
                      </BoutiqueLabel>
                    )}

                    <Box
                      onClick={() => router.push(`/shop/${targetShop}`)}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.6,
                        cursor: "pointer",
                        color: "#71717a",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        "&:hover": { color: theme.palette.primary.main },
                      }}
                    >
                      <StorefrontOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                      <span>{product?.company || targetShop}</span>
                    </Box>
                  </Box>

                  {/* Product Title */}
                  <Typography
                    variant="h1"
                    sx={{
                      fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                      fontSize: { xs: "1.85rem", sm: "2.35rem" },
                      fontWeight: 700,
                      color: "#18181b",
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      fontVariantNumeric: "lining-nums",
                      fontFeatureSettings: '"lnum" 1',
                    }}
                  >
                    {product?.title}
                  </Typography>

                  {/* Rating & Stock Indicator */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {renderStars(product?.rating)}
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#18181b" }}>
                        {formattedRating}
                      </Typography>
                      <Typography sx={{ fontSize: "0.82rem", color: "#71717a" }}>
                        ({product?.reviews_count || 12} reviews)
                      </Typography>
                    </Box>

                    {/* Live Stock Badge */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: isOutOfStock ? "#ef4444" : "#10b981",
                          boxShadow: `0 0 8px ${isOutOfStock ? "rgba(239,68,68,0.5)" : "rgba(16,185,129,0.5)"}`,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: isOutOfStock ? "#ef4444" : "#059669",
                        }}
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : product?.stock && product.stock <= 5
                          ? `Only ${product.stock} left in stock`
                          : "In Stock • Ready to ship"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.06)" }} />

                  {/* Price Block */}
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, flexWrap: "wrap" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "1.85rem", sm: "2.2rem" },
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        letterSpacing: "-0.02em",
                        fontVariantNumeric: "lining-nums",
                        fontFeatureSettings: '"lnum" 1',
                      }}
                    >
                      Kes {Number(currentPrice)?.toLocaleString()}
                    </Typography>

                    {product?.on_sale && originalPrice && (
                      <>
                        <Typography
                          sx={{
                            fontSize: "1.15rem",
                            fontWeight: 500,
                            color: "#a1a1aa",
                            textDecoration: "line-through",
                            fontVariantNumeric: "lining-nums",
                            fontFeatureSettings: '"lnum" 1',
                          }}
                        >
                          Kes {Number(originalPrice)?.toLocaleString()}
                        </Typography>

                        <Chip
                          label={`Save Kes ${savings.toLocaleString()}`}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            borderRadius: "6px",
                          }}
                        />
                      </>
                    )}
                  </Box>

                  {/* Product Attributes (Color / Size) */}
                  {(product?.color || product?.size) && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {product?.color && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#71717a" }}>
                            Color:
                          </Typography>
                          <Chip
                            label={product.color}
                            size="small"
                            sx={{
                              backgroundColor: "#f4f4f5",
                              border: "1px solid rgba(0,0,0,0.08)",
                              fontWeight: 600,
                              fontSize: "0.82rem",
                              color: "#18181b",
                            }}
                          />
                        </Box>
                      )}

                      {product?.size && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#71717a" }}>
                            Size:
                          </Typography>
                          <Chip
                            label={product.size}
                            size="small"
                            sx={{
                              backgroundColor: "#f4f4f5",
                              border: "1px solid rgba(0,0,0,0.08)",
                              fontWeight: 600,
                              fontSize: "0.82rem",
                              color: "#18181b",
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Short Description */}
                  {product?.description && (
                    <Typography
                      sx={{
                        fontSize: "0.92rem",
                        lineHeight: 1.7,
                        color: "#52525b",
                      }}
                    >
                      {product.description}
                    </Typography>
                  )}

                  {/* Purchase Action Section */}
                  <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                      {/* Quantity Stepper */}
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "30px",
                          border: "1.5px solid rgba(0,0,0,0.12)",
                          backgroundColor: "#ffffff",
                          p: "3px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        }}
                      >
                        <IconButton
                          size="small"
                          disabled={quantity <= 1 || isAddingToCart || isOutOfStock}
                          onClick={() => handleQuantityChange("remove")}
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            color: "#18181b",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: "1.1rem" }} />
                        </IconButton>

                        <Typography
                          sx={{
                            minWidth: 36,
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "#18181b",
                            userSelect: "none",
                            fontVariantNumeric: "lining-nums",
                            fontFeatureSettings: '"lnum" 1',
                          }}
                        >
                          {quantity}
                        </Typography>

                        <IconButton
                          size="small"
                          disabled={isAddingToCart || isOutOfStock || (product?.stock ? quantity >= product.stock : false)}
                          onClick={() => handleQuantityChange("add")}
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            color: "#18181b",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
                          }}
                        >
                          <AddIcon sx={{ fontSize: "1.1rem" }} />
                        </IconButton>
                      </Box>

                      {/* Add to Cart CTA */}
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={isAddingToCart || isOutOfStock}
                        onClick={handleAddToCart}
                        startIcon={
                          isAddingToCart ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <ShoppingBagOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                          )
                        }
                        sx={{
                          flex: 1,
                          height: 48,
                          borderRadius: "30px",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          textTransform: "none",
                          letterSpacing: "0.02em",
                          backgroundColor: theme.palette.primary.main,
                          color: "#ffffff",
                          boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                          transition: "all 0.25s ease",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                            transform: "translateY(-1px)",
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.45)}`,
                          },
                          "&:disabled": {
                            backgroundColor: "#e4e4e7",
                            color: "#a1a1aa",
                            boxShadow: "none",
                          },
                        }}
                      >
                        {isOutOfStock ? "Sold Out" : isAddingToCart ? "Adding to Bag..." : `Add to Bag • Kes ${(Number(currentPrice || 0) * quantity).toLocaleString()}`}
                      </Button>
                    </Box>

                    {/* WhatsApp Quick Order Button */}
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={isOutOfStock}
                      onClick={handleWhatsAppClick}
                      startIcon={<WhatsAppIcon sx={{ color: "#25D366", fontSize: "1.3rem" }} />}
                      sx={{
                        height: 44,
                        borderRadius: "30px",
                        fontSize: "0.86rem",
                        fontWeight: 600,
                        textTransform: "none",
                        color: "#18181b",
                        borderColor: "rgba(37, 211, 102, 0.4)",
                        backgroundColor: "rgba(37, 211, 102, 0.04)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          borderColor: "#25D366",
                          backgroundColor: "rgba(37, 211, 102, 0.1)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Inquire / Order via WhatsApp
                    </Button>
                  </Box>

                  {/* Value / Trust Badges Ribbon */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: "16px",
                      backgroundColor: "#f9fafb",
                      border: "1px solid rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocalShippingOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: "1.2rem" }} />
                          <Box>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#18181b" }}>
                              Fast Delivery
                            </Typography>
                            <Typography sx={{ fontSize: "0.72rem", color: "#71717a" }}>
                              Same/Next Day in Kenya
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CreditCardOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: "1.2rem" }} />
                          <Box>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#18181b" }}>
                              Secure Checkout
                            </Typography>
                            <Typography sx={{ fontSize: "0.72rem", color: "#71717a" }}>
                              M-Pesa & Card Instant
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ShieldOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: "1.2rem" }} />
                          <Box>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#18181b" }}>
                              100% Authentic
                            </Typography>
                            <Typography sx={{ fontSize: "0.72rem", color: "#71717a" }}>
                              Genuine verified quality
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: "1.2rem" }} />
                          <Box>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#18181b" }}>
                              Direct Support
                            </Typography>
                            <Typography sx={{ fontSize: "0.72rem", color: "#71717a" }}>
                              Dedicated customer care
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* ================= PRODUCT DETAILS TABS ================= */}
        <Box
          sx={{
            mt: 6,
            borderRadius: "24px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.07)",
            p: { xs: 2.5, sm: 4 },
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_e, v) => setActiveTab(v)}
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.primary.main,
                height: 3,
                borderRadius: "3px",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "#71717a",
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                },
              },
            }}
          >
            <Tab label="Description & Overview" />
            <Tab label="Delivery & Collection Info" />
            <Tab label="Reviews & Verification" />
          </Tabs>

          <Box sx={{ py: 3 }}>
            {activeTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#3f3f46" }}>
                  {product?.description || "This curated item is sourced with the highest standards of quality, authentic design, and verified performance."}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {product?.category && <Chip label={`Category: ${product.category}`} size="small" />}
                  {product?.color && <Chip label={`Color: ${product.color}`} size="small" />}
                  {product?.size && <Chip label={`Size: ${product.size}`} size="small" />}
                  <Chip label="Authentic Verified" color="success" size="small" variant="outlined" />
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#18181b" }}>
                  Fast & Convenient Delivery Across Kenya
                </Typography>
                <Typography sx={{ fontSize: "0.92rem", color: "#52525b", lineHeight: 1.7 }}>
                  • <strong>CBD Pickup Point:</strong> Collect your order directly from our Nairobi CBD pickup counter during business hours.<br />
                  • <strong>Nairobi Express:</strong> Same-day and next-day door-to-door courier dispatch.<br />
                  • <strong>Countrywide Delivery:</strong> Fast parcel service to all major Kenyan towns within 24–48 hours.<br />
                  • <strong>Real-time Tracking:</strong> Receive live SMS & WhatsApp status updates as soon as your order is dispatched.
                </Typography>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#18181b" }}>
                    {formattedRating}
                  </Typography>
                  <Box>
                    {renderStars(product?.rating)}
                    <Typography sx={{ fontSize: "0.82rem", color: "#71717a" }}>
                      Based on {product?.reviews_count || 12} customer reviews
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: "0.9rem", color: "#52525b" }}>
                  All ratings and reviews are from verified purchasers.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* ================= RELATED PRODUCTS SECTION ================= */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3 }}>
              <Box>
                <BoutiqueLabel sx={{ mb: 0.5 }}>
                  More To Love
                </BoutiqueLabel>
                <ShopSerifHeading variant="h2" sx={{ fontSize: { xs: "1.6rem", sm: "2rem" } }}>
                  You May Also Like
                </ShopSerifHeading>
              </Box>

              <NextLink href={`/shop/${targetShop}`} passHref legacyBehavior>
                <AccentButton sx={{ fontSize: "0.85rem", textTransform: "none", fontWeight: 700 }}>
                  View All Products →
                </AccentButton>
              </NextLink>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {relatedProducts.map((relProduct) => (
                <Grid key={relProduct.id} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
                  <ProductCard product={relProduct} triggerCartRefetch={cart_refetch} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ProductDetailView;
