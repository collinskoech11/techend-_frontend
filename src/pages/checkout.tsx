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
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCheckoutCartMutation, useGetCartQuery } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Define validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postal_code: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  payment_method: z.string().min(2, "Payment method is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function Checkout() {
  const [checkoutFx, { isLoading }] = useCheckoutCartMutation();
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const router = useRouter();
  const { data: cart_data } = useGetCartQuery({
    token: Cookies.get("access"),
    company_name: shopname,
  });

  const onSubmit = async (formData: CheckoutFormData) => {
    try {
      const response = await checkoutFx({
        body: formData,
        token: Cookies.get("access"),
        company_name: shopname,
      });
      if (response.data) {
        toast.success(<Typography>Order Placed Successfully</Typography>);
        router.push(`/shop/${shopname}`);
      } else if (response.error) {
        toast.error(response.error.data?.non_field_errors?.[0] || "An error occurred");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <Toaster />
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <BreadCrumbContainer sx={{ background: "#fff", border: "none", mb: 4 }}>
          <Breadcrumbs>
            <Link underline="hover" color="inherit" href="/">TechEnd</Link>
            <Link underline="hover" color="inherit" href={`/shop/${shopname}`}>Shop</Link>
            <Link underline="hover" color="inherit" href="/cart">Cart</Link>
            <Typography color={theme.palette.primary.main}>Checkout</Typography>
          </Breadcrumbs>
        </BreadCrumbContainer>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* Billing Form */}
            <Grid item xs={12} md={7}>
              <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: theme.palette.primary.main }}>
                Billing Address
              </Typography>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Grid container spacing={2}>
                  {[
                    { label: "First Name", name: "firstName" },
                    { label: "Last Name", name: "lastName" },
                    { label: "Phone Number", name: "phoneNumber" },
                    { label: "Address", name: "address" },
                    { label: "City", name: "city" },
                    { label: "State", name: "state" },
                    { label: "Postal Code", name: "postal_code" },
                    { label: "Country", name: "country" },
                    { label: "Payment Method", name: "payment_method" },
                  ].map((field, index) => (
                    <Grid item xs={12} md={field.name === "payment_method" ? 12 : 6} key={index}>
                      <TextField
                        fullWidth
                        label={field.label}
                        {...register(field.name as keyof CheckoutFormData)}
                        error={!!errors[field.name as keyof CheckoutFormData]}
                        helperText={errors[field.name as keyof CheckoutFormData]?.message}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={5}>
              <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: theme.palette.primary.main }}>
                Order Summary
              </Typography>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Subtotal: <b>Kes {cart_data?.total || 0}</b>
                  </Typography>
                  <Typography variant="body1">Shipping: <b>Kes 150</b></Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: theme.palette.primary.main }}>
                    Total: kes {cart_data?.total ? cart_data.total + 150 : 150}
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>Payment Method</Typography>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <RadioGroup row name="paymentRadio" onChange={(e) => setValue("payment_method", e.target.value)}>
                    <FormControlLabel value="card" control={<Radio />} label="Card" />
                    <FormControlLabel value="mpesa" control={<Radio />} label="M-Pesa" />
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                  </RadioGroup>
                </FormControl>

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                    mt: 2,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
}

export default Checkout;
