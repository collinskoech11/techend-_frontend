"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Menu, MenuItem, IconButton, Typography, Badge, Divider } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";
import { alpha, useTheme } from "@mui/material";

const CartMenuComponent = forwardRef((props: any, ref) => {
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: cart_data, isLoading, refetch: cart_refetch } = useCart();

  const CartItems = cart_data?.items || [];
  const itemCount = CartItems.reduce((total, item) => total + Number(item.quantity), 0);

  // Expose refetch via ref
  useImperativeHandle(ref, () => ({
    cart_refetch: () => {
      cart_refetch?.();
    },
  }));

  return (
    <>
      <IconButton
        sx={{
          p: 0,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Badge badgeContent={itemCount} color="success">
          <ShoppingCartOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            minWidth: 250,
            p: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: 2,
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ px: 1, mb: 1, fontWeight: "bold" }}>
          Cart
        </Typography>
        <Divider />

        {isLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : CartItems.length === 0 ? (
          <MenuItem disabled>No items in cart</MenuItem>
        ) : (
          CartItems.map((item, index) => (
            <MenuItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{item.product.title}</Typography>
              <Typography>x{item.quantity}</Typography>
            </MenuItem>
          ))
        )}

        {CartItems.length > 0 && [
          <Divider key="divider" />,
          <MenuItem
            key="view-cart"
            sx={{ justifyContent: "center", fontWeight: "bold", color: "#BE1E2D" }}
            onClick={() => {
              router.push("/cart");
              setAnchorEl(null);
            }}
          >
            View Full Cart
          </MenuItem>,
        ]}
      </Menu>
    </>
  );
});

CartMenuComponent.displayName = "CartMenu";

export const CartMenu = React.memo(CartMenuComponent);