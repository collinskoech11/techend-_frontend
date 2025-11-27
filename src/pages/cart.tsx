"use client";

import { CouponButton } from "@/StyledComponents/Buttons";
import {
  CartBanner,
  CartSummary,
  CartSummaryContainer,
  CartSummaryContent,
  CartSummarySub,
  CartSummaryTitle,
} from "@/StyledComponents/CartComponents";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Skeleton,
  useTheme,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useAddProductQtyToCartMutation,
  useRemoveProductFromCartMutation,
} from "@/Api/services";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useCart } from "@/contexts/CartContext";

function Cart() {
  const { data: cart_data, isLoading: cart_loading, refetch: cart_refetch } = useCart();
  const router = useRouter();
  const theme = useTheme();

  const [updateItemQty, { isLoading: isLoadingUpdate }] = useAddProductQtyToCartMutation();
  const [deleteItemQty, { isLoading: isLoadingDelete }] = useRemoveProductFromCartMutation();

  const updateItemCart = async (prod_id: any, direction: "incr" | "decr") => {
    const token = Cookies.get("access");
    if (!token) return toast.error("Please log in to modify your cart.");
    try {
      const response = await updateItemQty({
        product: prod_id,
        product_action_symbol: direction,
        token,
        shopname: Cookies.get("shopname"),
      });
      if ('error' in response) {
        const errorMessage = (response.error as any)?.data?.error || "Failed to update quantity";
        toast.error(errorMessage);
      }
      else {
        toast.success("Product quantity updated");
        cart_refetch();
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const deleteItemCart = async (prod_id: any) => {
    const token = Cookies.get("access");
    if (!token) return toast.error("Please log in to modify your cart.");
    try {
      const response = await deleteItemQty({
        product: prod_id,
        token,
        shopname: Cookies.get("shopname"),
      });
      if ('error' in response) {
        const errorMessage = (response.error as any)?.data?.error || "Failed to update quantity";
        toast.error(errorMessage);
      }

      else {
        toast.success("Product removed from cart");
        cart_refetch();
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    cart_refetch();
  }, [router, cart_refetch]);

  const CartItems = cart_data?.items;
  let subTotal = 0;

  return (
    <>
      {/* Banner */}
      <CartBanner
        sx={{
          pb: 6,
          pt: 6,
          px: { xs: 3, md: 6 },
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "#fff",
          borderRadius: "0 0 30px 30px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "flex-start", md: "center" },
          textAlign: { xs: "left", md: "center" },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2rem", md: "3rem" },
            mb: 1,
            letterSpacing: "1px",
            color: "#fff",
          }}
        >
          Shopping Cart
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.85)",
            fontSize: { xs: "0.95rem", md: "1.1rem" },
          }}
        >
          <span style={{ fontWeight: 700 }}>{/* Home link */}Home</span> - Shopping cart
        </Typography>
      </CartBanner>

      {/* Cart & Summary */}
      <CartSummaryContainer>
        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {cart_loading
                ? Array.from({ length: 3 }).map((_, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Skeleton variant="rectangular" height={120} />
                  </Grid>
                ))
                : CartItems?.length === 0 || !CartItems
                  ? (
                    <Grid item xs={12}>
                      <Typography variant="h6" align="center">
                        Your cart is empty
                      </Typography>
                    </Grid>
                  )
                  : CartItems.map((item, index) => {
                    const prod_total =
                      item.product.on_sale
                        ? parseFloat(item.product.discounted_price) * item.quantity
                        : parseFloat(item.product.price) * item.quantity;
                    subTotal += prod_total;

                    return (
                      <Grid item xs={12} key={index}>
                        <Card
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            borderRadius: "12px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                            position: "relative",
                          }}
                        >
                          {/* Product Image */}
                          <CardMedia
                            component="img"
                            image={`https://res.cloudinary.com/dqokryv6u/${item.product.main_image}` || "/placeholder.png"}
                            alt={item.product.title}
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: "8px",
                              objectFit: "cover",
                              mr: 2,
                            }}
                          />


                          {/* {`https://res.cloudinary.com/dqokryv6u/${item.product.image}`} */}

                          {/* Product Details */}
                          <CardContent sx={{ flex: 1, p: 0 }}>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {item.product.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {item.product.on_sale ? (
                                <>
                                  <span style={{ color: "red", fontWeight: "bold" }}>
                                    Kes {parseFloat(item.product.discounted_price).toFixed(2)}
                                  </span>{" "}
                                  <span style={{ textDecoration: "line-through" }}>
                                    Kes {parseFloat(item.product.price).toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                `Kes ${parseFloat(item.product.price).toFixed(2)}`
                              )}
                            </Typography>

                            {/* Quantity Controls */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 1,
                                width: 130,
                                background: "#f9f9f9",
                                borderRadius: "6px",
                                border: "1px solid rgba(0,0,0,0.1)",
                              }}
                            >
                              <Button
                                onClick={() => updateItemCart(item.product.id, "decr")}
                                sx={{ minWidth: "30px", color: theme.palette.primary.main }}
                              >
                                -
                              </Button>
                              <Typography sx={{ mx: 1, minWidth: 24, textAlign: "center" }}>
                                {isLoadingUpdate ? <CircularProgress size={20} /> : item.quantity}
                              </Typography>
                              <Button
                                onClick={() => updateItemCart(item.product.id, "incr")}
                                sx={{ minWidth: "30px", color: theme.palette.primary.main }}
                              >
                                +
                              </Button>
                            </Box>
                          </CardContent>

                          {/* Total & Remove */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              ml: 2,
                            }}
                          >
                            <Typography fontWeight={700} sx={{ mb: 1 }}>
                              Kes {prod_total.toFixed(2)}
                            </Typography>
                            <IconButton onClick={() => deleteItemCart(item.product.id)}>
                              <CloseOutlined sx={{ color: theme.palette.primary.main }} />
                            </IconButton>
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })}
            </Grid>
          </Grid>

          {/* Cart Summary */}
          <Grid item xs={12} md={4}>
            <CartSummary
              sx={{
                p: 3,
                borderRadius: "12px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <CartSummarySub>
                <CartSummaryTitle sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  Cart Summary
                </CartSummaryTitle>
                <CartSummaryContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  <span>Subtotal</span>
                  <span>Kes {subTotal.toFixed(2)}</span>
                </CartSummaryContent>

                <Button
                  fullWidth
                  sx={{
                    background: theme.palette.primary.main,
                    color: "#fff",
                    py: 1.5,
                    borderRadius: "50px",
                    fontWeight: 600,
                    "&:hover": { background: theme.palette.primary.dark },
                  }}
                  onClick={() => router.push(`/checkout`)}
                >
                  Proceed to Checkout
                </Button>
              </CartSummarySub>
            </CartSummary>
          </Grid>
        </Grid>
      </CartSummaryContainer>
    </>
  );
}

export default Cart;
