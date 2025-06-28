"use client";
import { Menu, MenuItem, IconButton, Typography, Badge, Box, Divider } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useState, useImperativeHandle, forwardRef } from "react";
import { useGetCartQuery } from "@/Api/services";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const CartMenu = forwardRef((props: any, ref) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const { data: cart_data, isLoading, refetch: cart_refetch } = useGetCartQuery({
    token: Cookies.get("access"),
    company_name: "techend",
  });

  const CartItems = cart_data?.items || [];
  const itemCount = CartItems.reduce((total: any, item: any) => total + parseInt(item.quantity), 0);

  useImperativeHandle(ref, () => ({
    cart_refetch() {
      cart_refetch();
    },
  }));

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget as HTMLElement)}>
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

        {CartItems.length > 0 && (
          <>
            <Divider />
            <MenuItem
              sx={{ justifyContent: "center", fontWeight: "bold", color: "#BE1E2D" }}
              onClick={() => {
                router.push("/cart");
                setAnchorEl(null);
              }}
            >
              View Full Cart
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
});

export default CartMenu;
