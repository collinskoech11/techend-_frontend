import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCheckoutCartMutation, useGetCartQuery, useGetPickupLocationsQuery, useGetDeliveryLocationsQuery, useGetCompanyBySlugQuery, usePlaceOrderGuestMutation } from "@/Api/services";
import { PickupLocation, CheckoutResponse, DeliveryLocation, GuestOrderResponse } from "@/Types";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/contexts/CartContext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { BreadCrumbContainer } from "@/StyledComponents/BreadCrumb";

// --- Authenticated Checkout --- //

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
  delivery_location: z.number().optional().nullable(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const AuthenticatedCheckout = () => {
  const [checkoutFx, { isLoading }] = useCheckoutCartMutation();
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const theme = useTheme();
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<number | null>(null);
  const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<PickupLocation | null>(null);
  const [deliveryOrPickup, setDeliveryOrPickup] = useState<"pickup" | "delivery">("pickup");

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Select Location', 'Billing Address', 'Review Order'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const { data: pickupLocationsData, isLoading: pickupLocationsLoading } = useGetPickupLocationsQuery({
    company_slug: shopname,
    token: Cookies.get("access"),
  });

  const [deliveryPage, setDeliveryPage] = useState(1);
  const [deliverySearchQuery, setDeliverySearchQuery] = useState("");
  const itemsPerPage = 5;

  const { data: allDeliveryLocations, isLoading: deliveryLocationsLoading } = useGetDeliveryLocationsQuery({
    company_slug: shopname,
    token: Cookies.get("access"),
  });

  const { data: companyData, isLoading: companyDataLoading } = useGetCompanyBySlugQuery(shopname);

  const [filteredDeliveryLocations, setFilteredDeliveryLocations] = useState<DeliveryLocation[]>([]);

  useEffect(() => {
    if (allDeliveryLocations) {
      const filtered = allDeliveryLocations.filter(
        (location) =>
          location.route.toLowerCase().includes(deliverySearchQuery.toLowerCase()) ||
          location.location_name.toLowerCase().includes(deliverySearchQuery.toLowerCase())
      );
      const startIndex = (deliveryPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setFilteredDeliveryLocations(filtered.slice(startIndex, endIndex));
    }
  }, [allDeliveryLocations, deliverySearchQuery, deliveryPage]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) });

  const router = useRouter();
  const { data: cart_data } = useGetCartQuery({ token: Cookies.get("access"), company_name: shopname });

  useEffect(() => {
    if (cart_data) {
      let calculatedShippingCost = 0;
      if (deliveryOrPickup === "pickup" && selectedPickupLocation && pickupLocationsData) {
        const selectedLocation = pickupLocationsData.find(loc => loc.id === selectedPickupLocation);
        if (selectedLocation) calculatedShippingCost = Number(selectedLocation.delivery_fee);
      } else if (deliveryOrPickup === "delivery" && selectedDeliveryLocation && allDeliveryLocations) {
        const selectedLocation = allDeliveryLocations.find(loc => loc.id === selectedDeliveryLocation);
        if (selectedLocation) calculatedShippingCost = Number(selectedLocation.delivery_fee);
      }
      setShippingCost(calculatedShippingCost);

      let itemsSubtotal = 0;
      cart_data.items.forEach((item: any) => {
        itemsSubtotal += item.product.on_sale
          ? parseFloat(item.product.discounted_price) * parseInt(item.quantity)
          : parseFloat(item.product.price) * parseInt(item.quantity);
      });
      setTotalAmount(itemsSubtotal + calculatedShippingCost);
    }
  }, [cart_data, selectedPickupLocation, pickupLocationsData, selectedDeliveryLocation, allDeliveryLocations, deliveryOrPickup]);

  const onSubmit = async (formData: CheckoutFormData) => {
    try {
      const response = await checkoutFx({
        body: { ...formData, pickup_location: selectedPickupLocation, delivery_location: selectedDeliveryLocation },
        token: Cookies.get("access"),
        company_name: shopname,
      }).unwrap();
      toast.success("Order Placed Successfully");
      setShippingCost(parseFloat(response.delivery_fee));
      setTotalAmount(parseFloat(response.total_amount));
      handleNext();
    } catch (error: any) {
      toast.error(error.data?.non_field_errors?.[0] || "An error occurred");
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f", marginTop: "20px" }}>
              Delivery or Pickup
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup row name="deliveryOrPickup" value={deliveryOrPickup} onChange={(e) => setDeliveryOrPickup(e.target.value as "delivery" | "pickup")}>
                <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
                <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
              </RadioGroup>
            </FormControl>

            {deliveryOrPickup === "pickup" && (
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
                        setSelectedDeliveryLocation(null);
                        setValue("delivery_location", null);
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
            )}

            {deliveryOrPickup === "delivery" && (
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <TextField
                  fullWidth
                  label="Search Delivery Locations"
                  variant="outlined"
                  value={deliverySearchQuery}
                  onChange={(e) => setDeliverySearchQuery(e.target.value)}
                  sx={{ mb: 2 }}
                />
                {deliveryLocationsLoading ? (
                  <Typography>Loading delivery locations...</Typography>
                ) : filteredDeliveryLocations && filteredDeliveryLocations.length > 0 ? (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      name="deliveryLocation"
                      value={selectedDeliveryLocation}
                      onChange={(e) => {
                        setSelectedDeliveryLocation(Number(e.target.value));
                        setValue("delivery_location", Number(e.target.value));
                        setSelectedPickupLocation(null);
                        setValue("pickup_location", null);
                      }}
                    >
                      {filteredDeliveryLocations.map((location) => (
                        <Box key={location.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1, border: '1px solid #eee', borderRadius: '8px', p: 1 }}>
                          <FormControlLabel
                            value={location.id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="bold">{location.location_name.toUpperCase()}</Typography> <Typography variant="body2" fontWeight="bold" color="textSecondary">{location.route.toLocaleLowerCase()}</Typography>
                                <Typography variant="body2" >
                                  Delivery Fee: Kes {location.delivery_fee}
                                </Typography>
                              </Box>
                            }
                            sx={{ flexGrow: 1, mr: 1 }}
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Typography>No delivery locations available for this shop.</Typography>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  {/* Previous Button */}
                  <Button
                    variant="outlined"
                    disabled={deliveryPage === 1}
                    onClick={() => setDeliveryPage(prev => prev - 1)}
                    startIcon={<ArrowBackIosNewIcon />}
                    sx={{
                      borderRadius: 2,
                      minWidth: 48,
                      px: 2,
                      py: 1.2,
                    }}
                  />

                  {/* Next Button */}
                  <Button
                    variant="outlined"
                    disabled={deliveryPage * itemsPerPage >= (allDeliveryLocations?.length || 0)}
                    onClick={() => setDeliveryPage(prev => prev + 1)}
                    endIcon={<ArrowForwardIosIcon />}
                    sx={{
                      borderRadius: 2,
                      minWidth: 48,
                      px: 2,
                      py: 1.2,
                    }}
                  />
                </Box>
              </Paper>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={handleNext} disabled={!selectedPickupLocation && !selectedDeliveryLocation}>
                Next
              </Button>
            </Box>
          </>
        );
      case 1:
        return (
          <>
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
                ].map((field, index) => (
                  <Grid item xs={12} md={6} key={index}>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" type="submit">
                Next
              </Button>
            </Box>
          </>
        );
      case 2:
        const handleConfirmPayment = () => {
          toast.success(<Typography>Payment Confirmed! Redirecting to shop...</Typography>);
          router.push(`/shop/${shopname}`);
        };

        return (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
              Review Order and Pay
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>Your Total: Kes {totalAmount}</Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Company Payment Details:</Typography>
              {companyDataLoading ? (
                <Typography>Loading payment details...</Typography>
              ) : companyData ? (
                <Box>
                  {companyData.payment_method === "mpesa_till" && (
                    <Typography variant="body1">M-Pesa Till Number: <b>{companyData.mpesa_till_number}</b></Typography>
                  )}
                  {companyData.payment_method === "mpesa_paybill" && (
                    <>
                      <Typography variant="body1">M-Pesa Paybill Number: <b>{companyData.mpesa_paybill_number}</b></Typography>
                      <Typography variant="body1">M-Pesa Account Number: <b>{companyData.mpesa_account_number}</b></Typography>
                    </>
                  )}
                  {companyData.payment_method === "mpesa_send_money" && (
                    <Typography variant="body1">M-Pesa Phone Number: <b>{companyData.mpesa_phone_number}</b></Typography>
                  )}
                  {companyData.payment_method === "pochi_la_biashara" && (
                    <Typography variant="body1">Pochi la Biashara Number: <b>{companyData.mpesa_phone_number}</b></Typography>
                  )}
                  {!companyData.payment_method && (
                    <Typography>No specific payment method configured for this company.</Typography>
                  )}
                </Box>
              ) : (
                <Typography>Could not load company payment details.</Typography>
              )}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </Button>
            </Box>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit(onSubmit)}>{getStepContent(activeStep)}</form>
      </Grid>

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
        </Paper>
      </Grid>

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
    </Grid>
  );
};

// --- Guest Checkout --- //

const GuestCheckout = () => {
  const theme = useTheme();
  const router = useRouter();
  const { sessionId, refetch, data: cart_data } = useCart();
  const [placeOrderGuest, { isLoading }] = usePlaceOrderGuestMutation();
  const [orderResponse, setOrderResponse] = useState<GuestOrderResponse | null>(null);
  const [shopname] = useState(Cookies.get("shopname") || "techend");

  const [selectedPickupLocation, setSelectedPickupLocation] = useState<number | null>(null);
  const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<PickupLocation | null>(null);
  const [deliveryOrPickup, setDeliveryOrPickup] = useState<"pickup" | "delivery">("pickup");

  const [deliveryPage, setDeliveryPage] = useState(1);
  const [deliverySearchQuery, setDeliverySearchQuery] = useState("");
  const itemsPerPage = 5;

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Your Details', 'Delivery/Pickup & Payment', 'Review Order'];

  const guestCheckoutSchema = z.object({
    email: z.string().email("Invalid email address"),
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
    delivery_location: z.number().optional().nullable(),
  }).superRefine((data, ctx) => {
    if (activeStep === 1) {
      if (!data.pickup_location && !data.delivery_location) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select either a pickup or delivery location.",
          path: ["deliveryOrPickup"], // A more general path for the error
        });
      }
    }
  });
  type GuestCheckoutFormData = z.infer<typeof guestCheckoutSchema>;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const { data: pickupLocationsData, isLoading: pickupLocationsLoading } = useGetPickupLocationsQuery({
    company_slug: shopname,
    token: "", // Guest users don't have a token
  });

  const { data: allDeliveryLocations, isLoading: deliveryLocationsLoading } = useGetDeliveryLocationsQuery({
    company_slug: shopname,
    token: "", // Guest users don't have a token
  });

  const { data: companyData, isLoading: companyDataLoading } = useGetCompanyBySlugQuery(shopname);

  const [filteredDeliveryLocations, setFilteredDeliveryLocations] = useState<DeliveryLocation[]>([]);



  const { register, handleSubmit, formState: { errors }, setValue, trigger, getValues, watch } = useForm<GuestCheckoutFormData>({
    resolver: zodResolver(guestCheckoutSchema),
    defaultValues: { payment_method: "card" },
  });

  const yourDetailsFields = watch(["email", "firstName", "lastName", "phoneNumber", "address", "city", "state", "postal_code", "country"]);

  useEffect(() => {
    if (allDeliveryLocations) {
      const filtered = allDeliveryLocations.filter(
        (location) =>
          location.route.toLowerCase().includes(deliverySearchQuery.toLowerCase()) ||
          location.location_name.toLowerCase().includes(deliverySearchQuery.toLowerCase())
      );
      const startIndex = (deliveryPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setFilteredDeliveryLocations(filtered.slice(startIndex, endIndex));
    }
  }, [allDeliveryLocations, deliverySearchQuery, deliveryPage]);

  useEffect(() => {
    if (cart_data) {
      let calculatedShippingCost = 0;
      if (deliveryOrPickup === "pickup" && selectedPickupLocation && pickupLocationsData) {
        const selectedLocation = pickupLocationsData.find(loc => loc.id === selectedPickupLocation);
        if (selectedLocation) calculatedShippingCost = Number(selectedLocation.delivery_fee);
      } else if (deliveryOrPickup === "delivery" && selectedDeliveryLocation && allDeliveryLocations) {
        const selectedLocation = allDeliveryLocations.find(loc => loc.id === selectedDeliveryLocation);
        if (selectedLocation) calculatedShippingCost = Number(selectedLocation.delivery_fee);
      }
      setShippingCost(calculatedShippingCost);

      let itemsSubtotal = 0;
      cart_data.items.forEach((item: any) => {
        itemsSubtotal += item.product.on_sale
          ? parseFloat(item.product.discounted_price) * parseInt(item.quantity)
          : parseFloat(item.product.price) * parseInt(item.quantity);
      });
      setTotalAmount(itemsSubtotal + calculatedShippingCost);
    }
  }, [cart_data, selectedPickupLocation, pickupLocationsData, selectedDeliveryLocation, allDeliveryLocations, deliveryOrPickup]);

  const onSubmit = async (formData: GuestCheckoutFormData) => {
    if (!sessionId) {
      toast.error("Your session has expired. Please refresh the page.");
      return;
    }

    try {
      const response = await placeOrderGuest({ ...formData, sessionId, company_name: shopname }).unwrap();
      setOrderResponse(response);
      toast.success("Your order has been placed successfully!");
      localStorage.removeItem("session_id");
      refetch(); // To clear the cart data
    } catch (error: any) {
      if (error.data?.error === "Email already exists") {
        toast.error("An account with this email already exists. Please log in to complete your order.");
        router.push("/login");
      } else {
        toast.error(error.data?.error || "An unexpected error occurred.");
      }
    }
  };

  if (orderResponse) {
    const handleConfirmPayment = () => {
      toast.success(<Typography>Payment Confirmed! Redirecting to shop...</Typography>);
      router.push(`/shop/${shopname}`);
    };

    return (
      <Paper sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>Order Successful!</Typography>
        <Typography variant="h6">Your account has been created. Please check your email for your credentials.</Typography>

        <Box sx={{ my: 2, p: 2, border: '1px solid #eee', borderRadius: '8px' }}>
          <Typography><strong>Order ID:</strong> {orderResponse.order_id}</Typography>
          <Typography><strong>Email:</strong> {orderResponse.user_email}</Typography>
          <Typography><strong>Temporary Password:</strong> {orderResponse.generated_password}</Typography>
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f", marginTop: "20px" }}>
          Review Order and Pay
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Your Total: Kes {totalAmount}</Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Company Payment Details:</Typography>
          {companyDataLoading ? (
            <Typography>Loading payment details...</Typography>
          ) : companyData ? (
            <Box>
              {companyData.payment_method === "mpesa_till" && (
                <Typography variant="body1">M-Pesa Till Number: <b>{companyData.mpesa_till_number}</b></Typography>
              )}
              {companyData.payment_method === "mpesa_paybill" && (
                <>
                  <Typography variant="body1">M-Pesa Paybill Number: <b>{companyData.mpesa_paybill_number}</b></Typography>
                  <Typography variant="body1">M-Pesa Account Number: <b>{companyData.mpesa_account_number}</b></Typography>
                </>
              )}
              {companyData.payment_method === "mpesa_send_money" && (
                <Typography variant="body1">M-Pesa Phone Number: <b>{companyData.mpesa_phone_number}</b></Typography>
              )}
              {companyData.payment_method === "pochi_la_biashara" && (
                <Typography variant="body1">Pochi la Biashara Number: <b>{companyData.mpesa_phone_number}</b></Typography>
              )}
              {!companyData.payment_method && (
                <Typography>No specific payment method configured for this company.</Typography>
              )}
            </Box>
          ) : (
            <Typography>Could not load company payment details.</Typography>
          )}
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
            onClick={handleConfirmPayment}
          >
            Confirm Payment & Continue Shopping
          </Button>
        </Box>
      </Paper>
    );
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
              Your Details
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    {...register("phoneNumber")}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    variant="outlined"
                    {...register("city")}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    variant="outlined"
                    {...register("state")}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    variant="outlined"
                    {...register("postal_code")}
                    error={!!errors.postal_code}
                    helperText={errors.postal_code?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    variant="outlined"
                    {...register("country")}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                </Grid>
              </Grid>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={async () => {
                const isValid = await trigger(["email", "firstName", "lastName", "phoneNumber", "address", "city", "state", "postal_code", "country"]);
                if (isValid) handleNext();
              }} disabled={yourDetailsFields.some(field => !field) || !!errors.email || !!errors.firstName || !!errors.lastName || !!errors.phoneNumber || !!errors.address || !!errors.city || !!errors.state || !!errors.postal_code || !!errors.country}>
                Next
              </Button>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f", marginTop: "20px" }}>
              Delivery or Pickup
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup row name="deliveryOrPickup" value={deliveryOrPickup} onChange={(e) => setDeliveryOrPickup(e.target.value as "delivery" | "pickup")}>
                <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
                <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
              </RadioGroup>
            </FormControl>

            {deliveryOrPickup === "pickup" && (
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
                        setSelectedDeliveryLocation(null);
                        setValue("delivery_location", null);
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
            )}

            {deliveryOrPickup === "delivery" && (
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <TextField
                  fullWidth
                  label="Search Delivery Locations"
                  variant="outlined"
                  value={deliverySearchQuery}
                  onChange={(e) => setDeliverySearchQuery(e.target.value)}
                  sx={{ mb: 2 }}
                />
                {deliveryLocationsLoading ? (
                  <Typography>Loading delivery locations...</Typography>
                ) : filteredDeliveryLocations && filteredDeliveryLocations.length > 0 ? (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      name="deliveryLocation"
                      value={selectedDeliveryLocation}
                      onChange={(e) => {
                        setSelectedDeliveryLocation(Number(e.target.value));
                        setValue("delivery_location", Number(e.target.value));
                        setSelectedPickupLocation(null);
                        setValue("pickup_location", null);
                      }}
                    >
                      {filteredDeliveryLocations.map((location) => (
                        <Box key={location.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1, border: '1px solid #eee', borderRadius: '8px', p: 1 }}>
                          <FormControlLabel
                            value={location.id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="bold">{location.location_name.toUpperCase()}</Typography> <Typography variant="body2" fontWeight="bold" color="textSecondary">{location.route.toLocaleLowerCase()}</Typography>
                                <Typography variant="body2" >
                                  Delivery Fee: Kes {location.delivery_fee}
                                </Typography>
                              </Box>
                            }
                            sx={{ flexGrow: 1, mr: 1 }}
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Typography>No delivery locations available for this shop.</Typography>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  {/* Previous Page Button */}
                  <Button
                    variant="outlined"
                    disabled={deliveryPage === 1}
                    onClick={() => setDeliveryPage(prev => prev - 1)}
                    startIcon={<ArrowBackIosNewIcon />}
                    sx={{
                      borderRadius: 2,
                      minWidth: 48,
                      px: 2,
                      py: 1.1,
                      fontSize: 0, // hides text safely if present
                    }}
                  />

                  {/* Next Page Button */}
                  <Button
                    variant="outlined"
                    disabled={deliveryPage * itemsPerPage >= (allDeliveryLocations?.length || 0)}
                    onClick={() => setDeliveryPage(prev => prev + 1)}
                    endIcon={<ArrowForwardIosIcon />}
                    sx={{
                      borderRadius: 2,
                      minWidth: 48,
                      px: 2,
                      py: 1.1,
                      fontSize: 0,
                    }}
                  />
                </Box>
              </Paper>
            )}
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Payment Method</Typography>
              <RadioGroup row onChange={(e) => setValue("payment_method", e.target.value)}>
                <FormControlLabel value="card" control={<Radio />} label="Card" />
                <FormControlLabel value="mpesa" control={<Radio />} label="M-Pesa" />
                <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
              </RadioGroup>
              {errors.payment_method && (
                <Typography color="error" variant="caption">{errors.payment_method.message}</Typography>
              )}
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={async () => {
                const isValid = await trigger();
                if (isValid) handleNext();
              }} disabled={!watch('payment_method') || (!selectedPickupLocation && !selectedDeliveryLocation)}>
                Next
              </Button>
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
              Review Order and Pay
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>Your Total: Kes {totalAmount}</Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Company Payment Details:</Typography>
              {companyDataLoading ? (
                <Typography>Loading payment details...</Typography>
              ) : companyData ? (
                <Box>
                  {companyData.payment_method === "mpesa_till" && (
                    <Typography variant="body1">M-Pesa Till Number: <b>{companyData.mpesa_till_number}</b></Typography>
                  )}
                  {companyData.payment_method === "mpesa_paybill" && (
                    <>
                      <Typography variant="body1">M-Pesa Paybill Number: <b>{companyData.mpesa_paybill_number}</b></Typography>
                      <Typography variant="body1">M-Pesa Account Number: <b>{companyData.mpesa_account_number}</b></Typography>
                    </>
                  )}
                  {companyData.payment_method === "mpesa_send_money" && (
                    <Typography variant="body1">M-Pesa Phone Number: <b>{companyData.mpesa_phone_number}</b></Typography>
                  )}
                  {companyData.payment_method === "pochi_la_biashara" && (
                    <Typography variant="body1">Pochi la Biashara Number: <b>{companyData.mpesa_phone_number}</b></Typography>
                  )}
                  {!companyData.payment_method && (
                    <Typography>No specific payment method configured for this company.</Typography>
                  )}
                </Box>
              ) : (
                <Typography>Could not load company payment details.</Typography>
              )}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading || (!selectedPickupLocation && !selectedDeliveryLocation)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Place Order & Create Account"}
              </Button>
            </Box>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper sx={{ p: 4, my: 4 }}>


      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={handleSubmit(onSubmit)}>
            {getStepContent(activeStep)}
          </form>
        </Grid>

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
          </Paper>
        </Grid>
      </Grid>

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
    </Paper>
  );
};


/**
 * Render the checkout page with breadcrumb navigation and either the authenticated or guest checkout flow.
 *
 * Reads the "access" cookie to determine authentication state and the "shopname" cookie for shop links,
 * then conditionally renders AuthenticatedCheckout (when authenticated) or GuestCheckout (when not).
 *
 * @returns The checkout page JSX element
 */

function Checkout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useTheme();
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");

  useEffect(() => {
    const token = Cookies.get("access");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <Box sx={{ m: { xs: 2, md: 4 } }}>
        <BreadCrumbContainer sx={{ background: "#fff", border: "none", mb: 4, maxWidth: '90vw' }}>
          <Breadcrumbs sx={{ maxWidth: '90vw' }}>
            <Link underline="hover" color="inherit" href="/">TechEnd</Link>
            <Link underline="hover" color="inherit" href={`/shop/${shopname}`}>Shop</Link>
            <Link underline="hover" color="inherit" href="/cart">Cart</Link>
            <Typography color={theme.palette.primary.main}>Checkout</Typography>
          </Breadcrumbs>
        </BreadCrumbContainer>

        {isAuthenticated ? <AuthenticatedCheckout /> : <GuestCheckout />}

      </Box>
    </>
  );
}

export default Checkout;