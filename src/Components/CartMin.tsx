"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Badge,
  Divider,
  Box,
  Button,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";

const CartMenuComponent = forwardRef((_props: any, ref: any) => {
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: cart_data, isLoading, refetch: cart_refetch } = useCart();

  const CartItems = cart_data?.items || [];
  const itemCount = CartItems.reduce((total: number, item: any) => total + Number(item.quantity || 0), 0);
  
  const subtotal = CartItems.reduce((total: number, item: any) => {
    const price = item.product?.on_sale ? item.product.discounted_price : item.product?.price;
    return total + (Number(price) || 0) * (Number(item.quantity) || 1);
  }, 0);

  // Expose refetch via ref
  useImperativeHandle(ref, () => ({
    cart_refetch: () => {
      cart_refetch?.();
    },
  }));

  return (
    <>
      <IconButton
        aria-label="Shopping Bag"
        aria-controls={open ? "cart-preview-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          color: "#18181b",
          backgroundColor: open ? alpha(theme.palette.primary.main, 0.1) : "transparent",
          transition: "all 0.25s ease",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
            transform: "translateY(-1px)",
          },
        }}
      >
        <Badge
          badgeContent={itemCount}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: theme.palette.primary.main,
              color: "#ffffff",
              fontSize: "0.72rem",
              fontWeight: 700,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              px: 0.5,
            },
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: "1.35rem" }} />
        </Badge>
      </IconButton>

      <Menu
        id="cart-preview-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 320,
            maxWidth: "92vw",
            mt: 1.5,
            borderRadius: "16px",
            boxShadow: "0 16px 36px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.08)",
            p: 1.5,
            overflow: "hidden",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1, py: 0.5, mb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#18181b", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Shopping Bag
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: theme.palette.primary.main }}>
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </Typography>
        </Box>
        <Divider sx={{ mb: 1, borderColor: "rgba(0,0,0,0.06)" }} />

        {/* Item List */}
        <Box sx={{ maxHeight: 260, overflowY: "auto", pr: 0.5 }}>
          {isLoading ? (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
            </Box>
          ) : CartItems.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center", px: 2 }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: "2rem", color: "#d4d4d8", mb: 1 }} />
              <Typography sx={{ fontSize: "0.85rem", color: "#71717a", fontWeight: 500 }}>
                Your shopping bag is empty
              </Typography>
            </Box>
          ) : (
            CartItems.map((item: any, index: number) => {
              const itemPrice = item.product?.on_sale ? item.product.discounted_price : item.product?.price;
              return (
                <MenuItem
                  key={index}
                  onClick={() => {
                    if (item.product?.slug) {
                      router.push(`/product/${item.product.slug}`);
                      setAnchorEl(null);
                    }
                  }}
                  sx={{
                    borderRadius: "10px",
                    px: 1,
                    py: 1,
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1, pr: 1.5 }}>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "#18181b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.product?.title || "Product"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#71717a" }}>
                      Qty: {item.quantity} × Kes {Number(itemPrice)?.toLocaleString() || itemPrice}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: theme.palette.primary.main, flexShrink: 0 }}>
                    Kes {((Number(itemPrice) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                  </Typography>
                </MenuItem>
              );
            })
          )}
        </Box>

        {/* Footer Actions */}
        {CartItems.length > 0 && (
          <Box sx={{ mt: 1, pt: 1.5, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, mb: 1.5 }}>
              <Typography sx={{ fontSize: "0.82rem", color: "#71717a", fontWeight: 500 }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#18181b" }}>
                Kes {subtotal.toLocaleString()}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
              onClick={() => {
                router.push("/cart");
                setAnchorEl(null);
              }}
              sx={{
                borderRadius: "12px",
                py: 1,
                fontSize: "0.82rem",
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: theme.palette.primary.main,
                color: "#ffffff",
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  transform: "translateY(-1px)",
                  boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              View Bag & Checkout
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
});

CartMenuComponent.displayName = "CartMenu";

export const CartMenu = React.memo(CartMenuComponent);