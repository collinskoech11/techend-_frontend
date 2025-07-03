"use client";
import Navbar from "@/Components/Navbar";
import { CouponButton } from "@/StyledComponents/Buttons";
import Footer from "@/Components/Footer";
import {
  CartBanner,
  CartSummary,
  CartSummaryContainer,
  CartSummaryContent,
  CartSummarySub,
  CartSummaryTitle,
  CouponContainer,
  CouponInput,
} from "@/StyledComponents/CartComponents";
import { Skeleton } from "@mui/material";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useGetCartQuery,
  useAddProductQtyToCartMutation,
  useRemoveProductFromCartMutation,
} from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

function Cart() {
  const { data: cart_data, isLoading: cart_loading, refetch: cart_refetch } =
    useGetCartQuery({ token: Cookies.get("access"), company_name: Cookies.get('shopname') });
  const router = useRouter();

  const [updateItemQty, { isLoading: isLoadingUpdate }] =
    useAddProductQtyToCartMutation();
  const [deleteItemQty, { isLoading: isLoadingDelete }] =
    useRemoveProductFromCartMutation();

  const updateItemCart = async (prod_id, direction) => {
    const response = await updateItemQty({
      product: prod_id,
      product_action_symbol: direction,
      token: Cookies.get("access"),
    });
    try {
      if (response.error) {
        const error_message = response.error.data.error;
        toast.error(<Typography>{error_message}</Typography>);
      } else {
        toast.success("Product quantity updated");
        router.reload();
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const deleteItemCart = async (prod_id) => {
    const response = await deleteItemQty({
      product: prod_id,
      token: Cookies.get("access"),
    });
    try {
      if (response.error) {
        const error_message = response.error.data.error;
        toast.error(<Typography>{error_message}</Typography>);
      } else {
        toast.success("Product removed from cart");
        router.reload();
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    cart_refetch();
  }, [router]);

  const CartItems = cart_data?.items;
  let subTotal = 0;

  return (
    <>
      <Toaster />
      {/* <Navbar textColor="#000" bgColor="#fff" /> */}
      <CartBanner>
        <Box>
          <Typography variant="h3" color={'#be1f2f'}>Shopping Cart</Typography>
          <br />
          <Typography>
            <span style={{ color: "#be1f2f" }}>Home</span> - Shopping cart
          </Typography>
        </Box>
      </CartBanner>

      <CartSummaryContainer>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#BE1E2D" }}>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Product
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Quantity
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Total
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Remove
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart_loading ? (
                    <>
                      {[...Array(3)].map((_, idx) => (
                        <TableRow>
                          <TableCell>
                            <Skeleton variant="rectangular" width={100} height={20} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant="rectangular" width={60} height={20} sx={{ display: { xs: "none", md: "block" } }} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant="rectangular" width={100} height={20} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant="rectangular" width={80} height={20} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant="circular" width={24} height={24} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : CartItems?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="h6">No items in cart</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    CartItems.map((item, index) => {
                      const prod_total =
                        parseFloat(item.product.price) * parseInt(item.quantity);
                      subTotal += prod_total;

                      return (
                        <TableRow key={index}>
                          <TableCell>{item.product.title}</TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", md: "table-cell" } }}
                          >
                            Kes {item.product.price}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "120px",
                                background: "#fbeaea",
                                borderRadius: "4px",
                              }}
                            >
                              <Button
                                onClick={() => updateItemCart(item.product.id, "decr")}
                                sx={{ minWidth: "30px", color: "#BE1E2D" }}
                              >
                                -
                              </Button>
                              <Typography sx={{ mx: 1 }}>
                                {isLoadingUpdate ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  item.quantity
                                )}
                              </Typography>
                              <Button
                                onClick={() => updateItemCart(item.product.id, "incr")}
                                sx={{ minWidth: "30px", color: "#BE1E2D" }}
                              >
                                +
                              </Button>
                            </Box>
                          </TableCell>
                          <TableCell>Kes {prod_total.toFixed(2)}</TableCell>
                          <TableCell>
                            {isLoadingDelete ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CloseOutlined
                                sx={{ color: "#BE1E2D", cursor: "pointer" }}
                                onClick={() => deleteItemCart(item.product.id)}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <CartSummary>
              {/* <CouponContainer>
                <CouponInput />
                <CouponButton>Apply Coupon</CouponButton>
              </CouponContainer> */}
              <CartSummarySub>
                <CartSummaryTitle style={{color:'#be1f2f'}}>Cart Summary</CartSummaryTitle>
                <CartSummaryContent>
                  <span>Subtotal</span>
                  <span>Kes {subTotal.toFixed(2)}</span>
                </CartSummaryContent>
                <CartSummaryContent>
                  <span>Shipping</span>
                  <span>Kes 150.00</span>
                </CartSummaryContent>
                <CartSummaryContent>
                  <span style={{ fontWeight: "bold" }}>Total</span>
                  <span style={{ fontWeight: "bold" }}>
                    Kes {(subTotal + 150).toFixed(2)}
                  </span>
                </CartSummaryContent>
                <CartSummaryTitle
                  sx={{
                    textAlign: "center",
                    fontSize: "14px",
                    cursor: "pointer",
                    background: "#BE1E2D",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                  onClick={() => router.push(`/checkout`)}
                >
                  Proceed to Checkout
                </CartSummaryTitle>
              </CartSummarySub>
            </CartSummary>
          </Grid>
        </Grid>
      </CartSummaryContainer>
            {/* <Footer /> */}
    </>
  );
}

export default Cart;
