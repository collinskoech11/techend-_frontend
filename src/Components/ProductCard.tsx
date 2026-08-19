import React, { memo, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { Box, Typography, CircularProgress, IconButton, Button, Tooltip, useTheme, alpha } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  ProductItemStyled,
  ProductImage,
  ProductImageWrapper,
  ProductInfoContainer,
  RatingContainer,
  IconActionsContainer,
} from "@/StyledComponents/Products";
import { ProductPrice, ProductTitle, ProductDescription, BoutiqueLabel } from "@/StyledComponents/Typos";
import {
  useAddToCartMutation,
  useAddToCartGuestMutation,
  useAddProductQtyToCartMutation,
  useRemoveProductFromCartMutation,
} from "@/Api/services";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/Types";

interface ProductCardProps {
  product: Product;
  triggerCartRefetch?: () => void;
}

const getOptimizedCloudinaryUrl = (url: string, width: number, height: number) => {
  if (!url) return "";
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;

  const cloudNameMatch = parts[0].match(/res\.cloudinary\.com\/(.*?)\//);
  const cloudName = cloudNameMatch ? cloudNameMatch[1] : "dqokryv6u";

  const publicIdWithExtension = parts[1];

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,f_auto,q_auto/${publicIdWithExtension}`;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, triggerCartRefetch }) => {
  const router = useRouter();
  const theme = useTheme();
  const { data: cartData, sessionId, refetch: cart_refetch } = useCart();
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const [addToCart, { isLoading: isAddingAuth }] = useAddToCartMutation();
  const [addToCartGuest, { isLoading: isAddingGuest }] = useAddToCartGuestMutation();
  const [updateQty, { isLoading: isUpdatingQty }] = useAddProductQtyToCartMutation();
  const [deleteItem, { isLoading: isDeletingItem }] = useRemoveProductFromCartMutation();

  const isBusy = isAddingAuth || isAddingGuest || isUpdatingQty || isDeletingItem || isLocalLoading;

  // Find if this product is in the cart and its quantity
  const cartItem = useMemo(() => {
    if (!cartData?.items || !product) return null;
    return cartData.items.find((item: any) => {
      const itemId = item?.product?.id ?? item?.product;
      const itemSlug = item?.product?.slug;
      return (itemId && itemId === product.id) || (itemSlug && itemSlug === product.slug);
    });
  }, [cartData?.items, product]);

  const cartQuantity = cartItem?.quantity || 0;

  // Add to cart handler
  const handleAddToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = Cookies.get("access");
    const shopname = Cookies.get("shopname") || "techend";

    const mutation = access ? addToCart : addToCartGuest;
    const args = access
      ? { product: product.id, token: access, shopname }
      : { productId: product.id.toString(), quantity: 1, sessionId, companyName: shopname };

    try {
      setIsLocalLoading(true);
      await mutation(args).unwrap();
      cart_refetch?.();
      toast.success("Product added to cart!");
      triggerCartRefetch?.();
    } catch (err: any) {
      const msg = err.data?.error || "An error occurred";
      toast.error(msg);
    } finally {
      setIsLocalLoading(false);
    }
  };

  // Increment quantity handler
  const handleIncrement = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (product.stock !== undefined && cartQuantity >= product.stock) {
      toast.error("Maximum available stock reached.");
      return;
    }
    const access = Cookies.get("access");
    const shopname = Cookies.get("shopname") || "techend";

    try {
      setIsLocalLoading(true);
      if (access) {
        const res = await updateQty({
          product: product.id,
          product_action_symbol: "incr",
          token: access,
          shopname,
        });
        if ("error" in res) {
          toast.error((res.error as any)?.data?.error || "Failed to update quantity");
        } else {
          cart_refetch?.();
          triggerCartRefetch?.();
        }
      } else if (sessionId) {
        await addToCartGuest({
          productId: product.id.toString(),
          quantity: 1,
          sessionId,
          companyName: shopname,
        }).unwrap();
        cart_refetch?.();
        triggerCartRefetch?.();
      }
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to update quantity");
    } finally {
      setIsLocalLoading(false);
    }
  };

  // Decrement quantity handler
  const handleDecrement = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const access = Cookies.get("access");
    const shopname = Cookies.get("shopname") || "techend";

    try {
      setIsLocalLoading(true);
      if (access) {
        if (cartQuantity <= 1) {
          const res = await deleteItem({
            product: product.id,
            token: access,
            shopname,
          });
          if ("error" in res) {
            toast.error((res.error as any)?.data?.error || "Failed to remove item");
          } else {
            toast.success("Item removed from cart");
            cart_refetch?.();
            triggerCartRefetch?.();
          }
        } else {
          const res = await updateQty({
            product: product.id,
            product_action_symbol: "decr",
            token: access,
            shopname,
          });
          if ("error" in res) {
            toast.error((res.error as any)?.data?.error || "Failed to update quantity");
          } else {
            cart_refetch?.();
            triggerCartRefetch?.();
          }
        }
      } else if (sessionId) {
        await addToCartGuest({
          productId: product.id.toString(),
          quantity: -1,
          sessionId,
          companyName: shopname,
        }).unwrap();
        cart_refetch?.();
        triggerCartRefetch?.();
      }
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to update quantity");
    } finally {
      setIsLocalLoading(false);
    }
  };

  // WhatsApp handler
  const handleWhatsApp = (event: React.MouseEvent) => {
    event.stopPropagation();
    const shopDetails = Cookies.get("shopDetails");
    if (!shopDetails) return toast.error("Shop details not found.");

    try {
      const company = JSON.parse(shopDetails);
      const raw = (company.contact_phone || "").replace(/\D/g, "");
      const phone = raw.startsWith("0") ? `254${raw.slice(1)}` : raw;
      if (!phone) return toast.error("Shop owner's phone not available.");

      const price = product.on_sale ? product.discounted_price : product.price;
      const msg = `Hello, I'm interested in ${product.title} for Kes ${price?.toLocaleString?.() || price}.`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    } catch {
      toast.error("Could not retrieve shop details.");
    }
  };

  // Render stars
  const renderStars = (rating: any) => {
    const num = typeof rating === "number" ? rating : Number(rating) || 0;
    const valid = isNaN(num) ? 0 : Math.max(0, Math.min(5, num));
    const full = Math.floor(valid);
    const half = valid - full >= 0.5 ? 1 : 0;
    const empty = Math.max(0, 5 - full - half);

    return (
      <>
        {Array.from({ length: full }).map((_, i) => <StarIcon key={`full-${i}`} sx={{ fontSize: "0.95rem" }} />)}
        {half === 1 && <StarHalfIcon sx={{ fontSize: "0.95rem" }} />}
        {Array.from({ length: empty }).map((_, i) => <StarBorderIcon key={`empty-${i}`} sx={{ fontSize: "0.95rem" }} />)}
      </>
    );
  };

  const currentPrice = product.on_sale ? product.discounted_price : product.price;
  const originalPrice = product.price;

  return (
    <ProductItemStyled
      onClick={() => router.push(`/product/${product.slug}`)}
      sx={{
        pointerEvents: isBusy ? "none" : "auto",
        opacity: isBusy ? 0.8 : 1,
        position: "relative",
      }}
    >
      <ProductImageWrapper>
        {product.on_sale && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              px: 1.2,
              py: 0.4,
              borderRadius: "20px",
              zIndex: 2,
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Sale
          </Box>
        )}
        {product.stock === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(24, 24, 27, 0.75)",
              color: "#fff",
              backdropFilter: "blur(6px)",
              px: 1.2,
              py: 0.4,
              borderRadius: "20px",
              zIndex: 2,
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Sold Out
          </Box>
        )}
        {product.main_image ? (
          <ProductImage
            src={getOptimizedCloudinaryUrl(product.main_image, 600, 600)}
            alt={product.title || "Product Image"}
            width={600}
            height={600}
            quality={85}
            sizes="(max-width: 700px) 50vw, 400px"
            loading="lazy"
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f4f4f5",
              color: "#a1a1aa",
              fontSize: "0.85rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
            }}
          >
            No Image Available
          </Box>
        )}
      </ProductImageWrapper>

      <ProductInfoContainer>
        <Box>
          {product.category && (
            <BoutiqueLabel sx={{ mb: 0.5, opacity: 0.85 }}>
              {product.category}
            </BoutiqueLabel>
          )}

          <ProductTitle
            sx={{
              fontSize: { xs: "0.98rem", sm: "1.08rem" },
              mb: product.description ? 0.5 : 0,
              lineHeight: 1.3,
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {product.title}
          </ProductTitle>

          {product.description && (
            <ProductDescription
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.825rem" },
                display: { xs: "none", sm: "-webkit-box" },
                mb: 0.5,
              }}
            >
              {product.description}
            </ProductDescription>
          )}
        </Box>

        <Box sx={{ mt: { xs: 0.5, sm: 1 } }}>
          <Box display="flex" alignItems="baseline" gap={1} mb={0.5}>
            <ProductPrice sx={{ fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" }, color: product.on_sale ? theme.palette.primary.main : "#18181b" }}>
              Kes {currentPrice?.toLocaleString ? currentPrice.toLocaleString() : currentPrice}
            </ProductPrice>
            {product.on_sale && originalPrice && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "#a1a1aa",
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  fontWeight: 400,
                }}
              >
                Kes {originalPrice?.toLocaleString ? originalPrice.toLocaleString() : originalPrice}
              </Typography>
            )}
          </Box>

          {(product.rating !== undefined || (product.reviews_count || 0) > 0) && (
            <RatingContainer>
              {renderStars(product.rating || 0)}
              <Typography variant="caption" sx={{ color: "#71717a", ml: 0.5, fontWeight: 500, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}>
                ({product.reviews_count || 0})
              </Typography>
            </RatingContainer>
          )}
        </Box>
      </ProductInfoContainer>

      <IconActionsContainer sx={{ gap: { xs: 0.8, sm: 1 }, p: { xs: 1.2, sm: 2 }, pt: 0 }}>
        {cartQuantity > 0 ? (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: { xs: 34, sm: 38 },
              borderRadius: "10px",
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
              px: { xs: 0.4, sm: 0.8 },
              boxSizing: "border-box",
            }}
          >
            <IconButton
              size="small"
              onClick={handleDecrement}
              disabled={isBusy}
              aria-label="Decrease quantity"
              sx={{
                width: { xs: 26, sm: 28 },
                height: { xs: 26, sm: 28 },
                borderRadius: "7px",
                color: theme.palette.primary.main,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  transform: "scale(1.08)",
                },
                "&.Mui-disabled": {
                  color: "rgba(0,0,0,0.26)",
                },
              }}
            >
              <RemoveIcon sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem" } }} />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 24 }}>
              {isBusy ? (
                <CircularProgress size={14} sx={{ color: theme.palette.primary.main }} />
              ) : (
                <Typography
                  sx={{
                    fontSize: { xs: "0.82rem", sm: "0.9rem" },
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    userSelect: "none",
                  }}
                >
                  {cartQuantity}
                </Typography>
              )}
            </Box>

            <IconButton
              size="small"
              onClick={handleIncrement}
              disabled={isBusy || (product.stock !== undefined && cartQuantity >= product.stock)}
              aria-label="Increase quantity"
              sx={{
                width: { xs: 26, sm: 28 },
                height: { xs: 26, sm: 28 },
                borderRadius: "7px",
                color: theme.palette.primary.main,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  transform: "scale(1.08)",
                },
                "&.Mui-disabled": {
                  color: "rgba(0,0,0,0.26)",
                },
              }}
            >
              <AddIcon sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem" } }} />
            </IconButton>
          </Box>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isBusy}
            variant="contained"
            size="small"
            startIcon={
              isBusy ? (
                <CircularProgress size={14} sx={{ color: "inherit" }} />
              ) : (
                <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem" } }} />
              )
            }
            sx={{
              flex: 1,
              py: { xs: 0.6, sm: 0.8 },
              px: { xs: 0.8, sm: 1.5 },
              borderRadius: "10px",
              fontSize: { xs: "0.72rem", sm: "0.78rem" },
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              boxShadow: "none",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-disabled": {
                backgroundColor: "#f4f4f5",
                color: "#a1a1aa",
                borderColor: "transparent",
              },
            }}
          >
            {product.stock === 0 ? "Out of Stock" : isBusy ? "Adding..." : "Add to Cart"}
          </Button>
        )}

        <Tooltip title="Order via WhatsApp" arrow>
          <IconButton
            onClick={handleWhatsApp}
            disabled={product.stock === 0}
            aria-label="Order via WhatsApp"
            size="small"
            sx={{
              p: { xs: 0.6, sm: 0.9 },
              borderRadius: "10px",
              backgroundColor: "rgba(37, 211, 102, 0.08)",
              border: "1px solid rgba(37, 211, 102, 0.2)",
              color: "#25D366",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#25D366",
                color: "#fff",
                transform: "scale(1.06)",
                boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
              },
            }}
          >
            <WhatsAppIcon sx={{ fontSize: { xs: "1.05rem", sm: "1.2rem" } }} />
          </IconButton>
        </Tooltip>
      </IconActionsContainer>
    </ProductItemStyled>
  );
};

export default memo(ProductCard);