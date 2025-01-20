import Navbar from "@/Components/Navbar";
import { CouponButton } from "@/StyledComponents/Buttons";
import {
  CartBanner,
  CartSummary,
  CartSummaryContainer,
  CartSummaryContent,
  CartSummarySub,
  CartSummaryTitle,
  CartTable,
  CartTableBody,
  CartTableCell,
  CartTableContainer,
  CartTableHead,
  CartTableRow,
  CouponContainer,
  CouponInput,
} from "@/StyledComponents/CartComponents";
import { Box,  Button,  Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, {useEffect} from "react";
import { CloseOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useGetCartQuery, useAddProductQtyToCartMutation, useRemoveProductFromCartMutation } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";


function cart() {
  const { data: cart_data, error: cart_error, isLoading: cart_loading, refetch: cart_refetch } = useGetCartQuery({token: Cookies.get("access")});
  let subTotal = 0;
  const router = useRouter();

  const [updateItemQty, { isLoading:isLoadingUpdate, error:errorUpdate }] = useAddProductQtyToCartMutation();
  const [deleteItemQty, { isLoading:isLoadingDelete, error:errorDelete }] = useRemoveProductFromCartMutation();
  const updateItemCart = async(prod_id, direction) => {
    const response = await updateItemQty({  product: prod_id,product_action_symbol: direction, token: Cookies.get("access")});
    try {
      if (response.error) {
        const error_message: any = response.error.data.error;
        toast.error(
          <>
            <Typography>{error_message}</Typography>
          </>
        );
      }
      else if (response) {
        toast.success("product quantity  updated to cart");
        router.reload();
      } 
    } catch (error) {
      toast.error("an Unexpected error occured");
    }
  };
  const deleteItemCart = async(prod_id) => {
    const response = await deleteItemQty({  product: prod_id, token: Cookies.get("access")});
    try {
      if (response.error) {
        const error_message: any = response.error.data.error;
        toast.error(
          <>
            <Typography>{error_message}</Typography>
          </>
        );
      }
      else if (response) {
        toast.success("product  deleted from cart");
        router.reload();
      } 
    } catch (error) {
      toast.error("an Unexpected error occured");
    }
  };


  useEffect(() => {
    cart_refetch();
  }, [router]);

  
  const CartItems = cart_data?.items;
  const renderCartTableRows = () => {
    if(cart_loading){
      return(
        <>
        <Box sx={{width:"100vw", maxWidth:"500px",m:"auto",height:"200px", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <CircularProgress/>
        </Box>
        </>
      )
    }
    if(CartItems?.length === 0){
      return(
        <Box sx={{width:"100vw", maxWidth:"500px",m:"auto",height:"200px", display:"flex", alignItems:"center", justifyContent:"center"}}>
          <Typography variant="h4">No items in cart</Typography>
        </Box>
      )
    }
    return CartItems.map((_, index) => {
      const prod_total =  parseFloat(_.product.price) * parseInt(_.quantity);
      subTotal += prod_total
      return(
      <CartTableRow key={index}>
        <CartTableCell>{_.product.title}</CartTableCell>
        <CartTableCell sx={{display:{md:"block", xs:"none"} }}>${_.product.price}</CartTableCell>
        <CartTableCell>
          {/* number with a - and + by its side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "auto",
              width: "30%",
              textAlign: "center",
              background: "#EDF1FF",
            }}
            
          >
            <Button onClick={() => updateItemCart(_.product.id, "decr")}  sx={{ width: "30%", textAlign: "center", cursor:"pointer" }}>
              -
            </Button>
            <Typography sx={{ width: "30%", textAlign: "center" }}>
            {isLoadingUpdate ? (
                <CircularProgress style={{ color: "#000" }} size={24} />
              ) : (
                _.quantity
              )}
            </Typography>
            <Button onClick={() => updateItemCart(_.product.id, "incr")} sx={{ width: "30%", textAlign: "center", cursor:"pointer" }}>
              +
            </Button>
          </Box>
        </CartTableCell>
        <CartTableCell> ${ prod_total } </CartTableCell>
        <CartTableCell>
            {isLoadingDelete ? (
                <CircularProgress style={{ color: "#000" }} size={24} />
              ) : (
          <CloseOutlined onClick={() => deleteItemCart(_.product.id)}  />
              )}
        </CartTableCell>
      </CartTableRow>
    )});
  };
  return (
    <>
    <Toaster/>
      <Navbar textColor={'#000'} bgColor={'#fff'}/>
      <CartBanner>
        <Box>
          <Typography variant="h3">Shoppping Cart</Typography>
          <br />
          <Typography>
            <span style={{ color: "#E6C0A4" }}>Home</span> - Shopping cart
          </Typography>
        </Box>
      </CartBanner>
      <CartSummaryContainer>
        <CartTableContainer>
          <CartTable>
            <CartTableHead>
              <CartTableRow>
                <CartTableCell>
                  <Typography sx={{ fontWeight: 800 }}>Products</Typography>
                </CartTableCell>
                <CartTableCell sx={{display:{md:"block", xs:"none"} }}>
                  <Typography sx={{ fontWeight: 800}}>Price</Typography>
                </CartTableCell>
                <CartTableCell>
                  <Typography sx={{ fontWeight: 800 }}>Quantity</Typography>
                </CartTableCell>
                <CartTableCell>
                  <Typography sx={{ fontWeight: 800 }}>Total</Typography>
                </CartTableCell>
                <CartTableCell>
                  <Typography sx={{ fontWeight: 800 }}>Remove</Typography>
                </CartTableCell>
              </CartTableRow>
            </CartTableHead>
            <CartTableBody>{renderCartTableRows()}</CartTableBody>
          </CartTable>
        </CartTableContainer>
        <CartSummary>
          <br/>
          <CouponContainer>
            <CouponInput />
            <CouponButton>Apply Coupon</CouponButton>
          </CouponContainer>
          <CartSummarySub>
            <CartSummaryTitle>Cart Summary</CartSummaryTitle>
            <CartSummaryContent sx={{ borderBottom: "none" }}>
              <span>subtotal</span>
              <span>${subTotal}</span>
            </CartSummaryContent>
            <CartSummaryContent>
              <span>shipping</span>
              <span>$150</span>
            </CartSummaryContent>
            <CartSummaryContent>
              <span style={{ fontWeight: "800" }}>Total</span>
              <span style={{ fontWeight: "800" }}>${subTotal + 150}</span>
            </CartSummaryContent>
            <CartSummaryTitle
              sx={{ textAlign: "center", fontSize: "14px", cursor:"pointer", background:"#BE1E2D", color:"#fff", fontWeight:"bolder" }}
              onClick={() => router.push(`/checkout`)}
            >
              Proceed to Checkout
            </CartSummaryTitle>
          </CartSummarySub>
        </CartSummary>
      </CartSummaryContainer>
    </>
  );
}

export default cart;
