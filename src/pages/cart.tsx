"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Typography,
  Skeleton,
  useTheme,
  IconButton,
  Container,
  Divider,
  Chip,
  Stack,
  alpha,
  styled,
  CircularProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import {
  useAddProductQtyToCartMutation,
  useRemoveProductFromCartMutation,
  useAddToCartGuestMutation,
} from "@/Api/services";
import { useCart } from "@/contexts/CartContext";

// ForwardRef Grid wrapper honoring MUI v5 size prop
const Grid = React.forwardRef<HTMLDivElement, any>(function Grid(props, ref) {
  const { size, children, ...rest } = props;
  if (size && typeof size === "object") {
    return <Box ref={ref} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 380px" }, gap: 4 }} {...rest}>{children}</Box>;
  }
  return <Box ref={ref} {...rest}>{children}</Box>;
});

const ItemCard = styled(Box)(({ theme }) => ({
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
  padding: theme.spacing(2.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2.5),
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: `0 16px 36px ${alpha(theme.palette.primary.main, 0.08)}`,
    borderColor: alpha(theme.palette.primary.main, 0.25),
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const SummaryCard = styled(Box)(({ theme }) => ({
  borderRadius: "24px",
  backgroundColor: "#ffffff",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
  padding: theme.spacing(3.5),
  position: "sticky",
  top: 90,
}));

function Cart() {
  const { data: cart_data, isLoading: cart_loading, refetch: cart_refetch, sessionId } = useCart();
  const router = useRouter();
  const theme = useTheme();

  const [updateItemQty] = useAddProductQtyToCartMutation();
  const [deleteItemQty] = useRemoveProductFromCartMutation();
  const [addToCartGuest] = useAddToCartGuestMutation();

  const activeShop = Cookies.get("shopname") || "techend";

  // Mount tracking to prevent SSR hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Individual loading states
  const [updatingProductIds, setUpdatingProductIds] = React.useState<Record<number, boolean>>({});
  const [deletingProductIds, setDeletingProductIds] = React.useState<Record<number, boolean>>({});

  // Optimistic UI Cart state
  const [optimisticCartItems, setOptimisticCartItems] = React.useState<any[]>([]);

  useEffect(() => {
    if (cart_data?.items) {
      setOptimisticCartItems(cart_data.items);
    }
  }, [cart_data?.items]);

  const getImageUrl = (item: any) => {
    const raw = item?.product?.main_image || item?.product?.image;
    if (!raw) return "/assets/techendbanner.png";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return `https://res.cloudinary.com/dqokryv6u/${raw}`;
  };

  const updateItemCart = async (item: any, direction: "incr" | "decr") => {
    const token = Cookies.get("access");
    const productId = item.product.id || item.product;

    setUpdatingProductIds(prev => ({ ...prev, [productId]: true }));

    try {
      let response: any;
      if (token) {
        response = await updateItemQty({
          product: productId,
          product_action_symbol: direction,
          token,
          shopname: activeShop,
        });
      } else if (sessionId) {
        response = await addToCartGuest({
          productId: productId.toString(),
          quantity: direction === "incr" ? 1 : -1,
          sessionId,
          companyName: activeShop,
        });
      }

      if (response && "error" in response) {
        toast.error((response.error as any)?.data?.error || "Failed to update quantity");
      } else {
        cart_refetch();
      }
    } catch {
      toast.error("Could not update item quantity");
    } finally {
      setUpdatingProductIds(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    }
  };

  const deleteItemCart = async (item: any) => {
    const token = Cookies.get("access");
    const productId = item.product.id || item.product;

    // Optimistically remove from state immediately
    const originalItems = [...optimisticCartItems];
    setOptimisticCartItems(prev => prev.filter(i => (i.product.id || i.product) !== productId));

    setDeletingProductIds(prev => ({ ...prev, [productId]: true }));

    try {
      let response: any;
      if (token) {
        response = await deleteItemQty({
          product: productId,
          token,
          shopname: activeShop,
        });
      } else if (sessionId) {
        response = await addToCartGuest({
          productId: productId.toString(),
          quantity: -item.quantity,
          sessionId,
          companyName: activeShop,
        });
      }

      if (response && "error" in response) {
        // Rollback on failure
        setOptimisticCartItems(originalItems);
        toast.error((response.error as any)?.data?.error || "Failed to remove item");
      } else {
        toast.success("Item removed from cart");
        cart_refetch();
      }
    } catch (err) {
      // Rollback on failure
      setOptimisticCartItems(originalItems);
      toast.error("Could not remove item");
    } finally {
      setDeletingProductIds(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    }
  };

  useEffect(() => {
    cart_refetch();
  }, [cart_refetch]);

  const CartItems = optimisticCartItems;
  let subTotal = 0;

  CartItems.forEach((item: any) => {
    const price = item.product?.on_sale
      ? Number(item.product.discounted_price || 0)
      : Number(item.product?.price || 0);
    subTotal += price * (item.quantity || 1);
  });

  if (!mounted) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", pb: 12 }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 380px" }, gap: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} variant="rectangular" height={130} sx={{ borderRadius: "20px" }} />
              ))}
            </Box>
            <Skeleton variant="rectangular" height={320} sx={{ borderRadius: "24px" }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", pb: 12 }}>
      {/* Header Banner */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          py: { xs: 4, md: 5 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#18181b", fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 0.5 }}>
                Your Shopping Bag
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", fontWeight: 500 }}>
                {CartItems.length} {CartItems.length === 1 ? "item" : "items"} ready for checkout
              </Typography>
            </Box>

            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push(`/shop/${activeShop}`)}
              sx={{
                borderRadius: "30px",
                px: 2.5,
                py: 0.8,
                textTransform: "none",
                fontWeight: 700,
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Cart Content */}
      <Container maxWidth="lg">
        {cart_loading ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 380px" }, gap: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} variant="rectangular" height={130} sx={{ borderRadius: "20px" }} />
              ))}
            </Box>
            <Skeleton variant="rectangular" height={320} sx={{ borderRadius: "24px" }} />
          </Box>
        ) : CartItems.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              px: 3,
              backgroundColor: "#ffffff",
              borderRadius: "32px",
              border: "1px solid rgba(0,0,0,0.06)",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: "4rem", color: alpha(theme.palette.primary.main, 0.4), mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#18181b", mb: 1 }}>
              Your Bag is Empty
            </Typography>
            <Typography variant="body1" sx={{ color: "#71717a", mb: 4, lineHeight: 1.6 }}>
              Looks like you haven't added any products to your cart yet. Explore our curated collections to start shopping.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/shops")}
              sx={{
                borderRadius: "30px",
                px: 4,
                py: 1.2,
                fontSize: "0.95rem",
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: theme.palette.primary.main,
                color: "#ffffff",
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
            >
              Explore Storefronts
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4} size={{ xs: 12, md: 8 }}>
            {/* Cart Items List */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {CartItems.map((item: any, index: number) => {
                const isSale = item.product?.on_sale;
                const unitPrice = isSale
                  ? Number(item.product?.discounted_price || 0)
                  : Number(item.product?.price || 0);
                const isItemUpdating = updatingProductIds[item.product.id || item.product];
                const isItemDeleting = deletingProductIds[item.product.id || item.product];
                const isItemLoading = isItemUpdating || isItemDeleting;
                const itemTotal = unitPrice * item.quantity;

                return (
                  <ItemCard key={item.id || index}>
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        position: "relative",
                        width: { xs: "100%", sm: 110 },
                        height: 110,
                        borderRadius: "16px",
                        overflow: "hidden",
                        backgroundColor: "#f4f4f5",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={getImageUrl(item)}
                        alt={item.product?.title || "Product Image"}
                        fill
                        sizes="110px"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>

                    {/* Info */}
                    <Box sx={{ flex: 1, width: "100%" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#18181b",
                          mb: 0.5,
                          cursor: "pointer",
                          "&:hover": { color: theme.palette.primary.main },
                        }}
                        onClick={() => router.push(`/product/${item.product?.slug}`)}
                      >
                        {item.product?.title}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1.5 }}>
                        <Typography sx={{ fontWeight: 800, color: theme.palette.primary.main, fontSize: "1rem" }}>
                          Kes {unitPrice.toLocaleString()}
                        </Typography>
                        {isSale && item.product?.price && (
                          <Typography sx={{ textDecoration: "line-through", color: "#a1a1aa", fontSize: "0.85rem" }}>
                            Kes {Number(item.product.price).toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "30px",
                            border: "1px solid rgba(0,0,0,0.1)",
                            backgroundColor: "#fafafa",
                            p: "2px",
                            filter: isItemLoading ? "blur(1.5px)" : "none",
                            opacity: isItemLoading ? 0.6 : 1,
                            pointerEvents: isItemLoading ? "none" : "auto",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => updateItemCart(item, "decr")}
                            disabled={isItemLoading || item.quantity <= 1}
                            sx={{ width: 28, height: 28, color: "#18181b" }}
                          >
                            <RemoveIcon sx={{ fontSize: "0.95rem" }} />
                          </IconButton>
                          <Box sx={{ minWidth: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {isItemUpdating ? (
                              <CircularProgress size={16} thickness={5} />
                            ) : (
                              <Typography sx={{ fontWeight: 700, fontSize: "0.88rem" }}>
                                {item.quantity}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => updateItemCart(item, "incr")}
                            disabled={isItemLoading}
                            sx={{ width: 28, height: 28, color: "#18181b" }}
                          >
                            <AddIcon sx={{ fontSize: "0.95rem" }} />
                          </IconButton>
                        </Box>
 
                        <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#18181b" }}>
                          Kes {itemTotal.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
 
                    {/* Action */}
                    <IconButton
                      onClick={() => deleteItemCart(item)}
                      disabled={isItemLoading}
                      sx={{
                        color: "#ef4444",
                        backgroundColor: "rgba(239, 68, 68, 0.08)",
                        "&:hover": {
                          backgroundColor: "#ef4444",
                          color: "#ffffff",
                        },
                        filter: isItemLoading ? "blur(1.5px)" : "none",
                        opacity: isItemLoading ? 0.6 : 1,
                        pointerEvents: isItemLoading ? "none" : "auto",
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </ItemCard>
                );
              })}
            </Box>

            {/* Order Summary Sidebar */}
            <Box>
              <SummaryCard>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b", mb: 3 }}>
                  Order Summary
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography color="text.secondary">Items Total</Typography>
                    <Typography sx={{ fontWeight: 700, color: "#18181b" }}>Kes {subTotal.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography color="text.secondary">Shipping & Delivery</Typography>
                    <Chip label="Calculated at checkout" size="small" sx={{ fontSize: "0.72rem", fontWeight: 600 }} />
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#18181b" }}>Total</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                      Kes {subTotal.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => router.push("/checkout")}
                  startIcon={<LockOutlinedIcon />}
                  sx={{
                    borderRadius: "30px",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    backgroundColor: theme.palette.primary.main,
                    color: "#ffffff",
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>

                {/* Trust Badges */}
                <Stack spacing={1.5} sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#71717a" }}>
                    <ShieldOutlinedIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.main }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Encrypted order details & M-Pesa Integration
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#71717a" }}>
                    <LocalShippingOutlinedIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.main }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Fast Delivery Across Kenya
                    </Typography>
                  </Box>
                </Stack>
              </SummaryCard>
            </Box>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Cart;