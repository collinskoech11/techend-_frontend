import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { BreadCrumbContainer } from "@/StyledComponents/BreadCrumb";
import {
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  Paper,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCheckoutCartMutation, useGetCartQuery } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

function Checkout() {
  const [checkoutFx, { isLoading }] = useCheckoutCartMutation();
    const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    payment_method: "",
  });
  const router = useRouter();
  const { data: cart_data } = useGetCartQuery({ token: Cookies.get("access"), company_name: Cookies.get("shopname") });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkoutFxSubmit = async () => {
    try {
      const response = await checkoutFx({ body: formData, token: Cookies.get("access") });
      if (response.data) {
        toast.success(<Typography>Order Placed Successfully</Typography>);
        router.push(`/shop/${shopname}`);
      } else if (response.error) {
        toast.error(response.error.data?.non_field_errors?.[0] || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <Toaster />
      {/* <Navbar textColor="#000" bgColor="#fff" /> */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <BreadCrumbContainer sx={{ background: "#fff", border: "none", mb: 4 }}>
          <Breadcrumbs>
            <Link underline="hover" color="inherit" href="/">TechEnd</Link>
            <Link underline="hover" color="inherit" href={`/shop/${shopname}`}>Shop</Link>
            <Link underline="hover" color="inherit" href="/cart">Cart</Link>
            <Typography color="#be1f2f">Checkout</Typography>
          </Breadcrumbs>
        </BreadCrumbContainer>

        <Grid container spacing={4}>
          {/* Billing Form */}
          <Grid item xs={12} md={7}>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{color:"#be1f2f"}}>Billing Address</Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Method"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox />} label="Create an account" />
                  <FormControlLabel control={<Checkbox />} label="Ship to different address" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={5}>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{color:"#be1f2f"}}>Order Summary</Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">Subtotal: <b>${cart_data?.total || 0}</b></Typography>
                <Typography variant="body1">Shipping: <b>$150</b></Typography>
                <Typography variant="h6" sx={{ mt: 1, color: "#BE1E2D" }}>
                  Total: ${cart_data?.total ? cart_data.total + 150 : 150}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>Payment Method</Typography>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <RadioGroup row name="paymentRadio">
                  <FormControlLabel value="card" control={<Radio />} label="Card" />
                  <FormControlLabel value="mpesa" control={<Radio />} label="M-Pesa" />
                  <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                </RadioGroup>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#BE1E2D",
                  "&:hover": { backgroundColor: "#a71824" },
                  mt: 2,
                }}
                onClick={checkoutFxSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
            {/* <Footer /> */}
    </>
  );
}

export default Checkout;
