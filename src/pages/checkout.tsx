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
  RadioGroup,
  Radio,
  FormControl,
  Paper,
  Box,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Import the location icon
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCheckoutCartMutation, useGetCartQuery, useGetPickupLocationsQuery } from "@/Api/services";
import { PickupLocation, CheckoutResponse } from "@/Types";
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
  pickup_location: z.number().optional().nullable(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function Checkout() {
  const [checkoutFx, { isLoading }] = useCheckoutCartMutation();
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const theme = useTheme();
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<PickupLocation | null>(null);

  const { data: pickupLocationsData, isLoading: pickupLocationsLoading } = useGetPickupLocationsQuery({
    company_slug: shopname,
    token: Cookies.get("access"),
  });

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

  useEffect(() => {
    if (cart_data) {
      let calculatedShippingCost:number = 0;
      if (selectedPickupLocation && pickupLocationsData) {
        const selectedLocation = pickupLocationsData.find(
          (location) => location.id === selectedPickupLocation
        );
        if (selectedLocation) {
          calculatedShippingCost = Number(selectedLocation.delivery_fee);
        }
      }
      setShippingCost(calculatedShippingCost);
      setTotalAmount(parseFloat(cart_data.total) + calculatedShippingCost);
    }
  }, [cart_data, selectedPickupLocation, pickupLocationsData]);

  const onSubmit = async (formData: CheckoutFormData) => {
    try {
      const response = await checkoutFx({
        body: { ...formData, pickup_location: selectedPickupLocation },
        token: Cookies.get("access"),
        company_name: shopname,
      });
      if (response.data) {
        toast.success(<Typography>Order Placed Successfully</Typography>);
        setShippingCost(parseFloat(response.data.shipping_cost));
        setTotalAmount(parseFloat(response.data.total_amount));
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
            {/* Pickup Location Selection */}
            <Grid item xs={12} md={7}>
              <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: theme.palette.primary.main }}>
                Billing Address
              <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f", marginTop: "20px" }}>
                Pickup Location
              </Typography>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                {pickupLocationsLoading ? (
                  <Typography>Loading pickup locations...</Typography>
                ) : pickupLocationsData && pickupLocationsData.length > 0 ? (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      name="pickupLocation"
                      value={selectedPickupLocation}
                      onChange={(e) => {
                        setSelectedPickupLocation(Number(e.target.value));
                        setValue("pickup_location", Number(e.target.value));
                      }}
                    >
                      {pickupLocationsData.map((location) => (
                        <Box key={location.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1, border: '1px solid #eee', borderRadius: '8px', p: 1 }}>
                          <FormControlLabel
                            value={location.id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="bold">{location.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {location.address}, {location.city}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Delivery Fee: Kes {location.delivery_fee}
                                </Typography>
                              </Box>
                            }
                            sx={{ flexGrow: 1, mr: 1 }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<LocationOnIcon />}
                            onClick={() => {
                              setSelectedLocationForMap(location);
                              setMapOpen(true);
                            }}
                          >
                            Preview on Map
                          </Button>
                        </Box>
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Typography>No pickup locations available for this shop.</Typography>
                )}
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
                  <Typography variant="body1">Shipping: <b>Kes {shippingCost}</b></Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: "#BE1E2D" }}>
                    Total: kes {totalAmount}
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

            {/* Billing Form */}
            <Grid item xs={12}>
              <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
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
          </Grid>
        </form>
      </Box>

      {/* Map Preview Dialog */}
      <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Map Preview: {selectedLocationForMap?.name}
          <IconButton
            aria-label="close"
            onClick={() => setMapOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLocationForMap?.gmaps_link ? (
            <iframe
              src={selectedLocationForMap.gmaps_link}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <Box sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>
              <Typography variant="h6" color="textSecondary">
                No map link available for this location.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Checkout;
