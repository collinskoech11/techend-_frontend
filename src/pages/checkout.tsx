"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useCheckoutCartMutation, useGetCartQuery, useGetPickupLocationsQuery, useGetDeliveryLocationsQuery, useGetCompanyBySlugQuery, usePlaceOrderGuestMutation, useLipaNaMpesaMutation, useGetOrderByIdQuery } from "@/Api/services";
import { PickupLocation, DeliveryLocation, GuestOrderResponse } from "@/Types";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
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
  Container,
  Stack,
  alpha,
  styled,
  Chip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// ForwardRef Grid wrapper honoring MUI v5 size prop
const Grid = React.forwardRef<HTMLDivElement, any>(function Grid(props, ref) {
  const { size, children, ...rest } = props;
  if (size && typeof size === "object") {
    return <Box ref={ref} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 380px" }, gap: 4 }} {...rest}>{children}</Box>;
  }
  return <Box ref={ref} {...rest}>{children}</Box>;
});

const CheckoutStepCard = styled(Paper)(({ theme }) => ({
  borderRadius: "24px",
  backgroundColor: "#ffffff",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2.5),
  },
}));

const SummarySideCard = styled(Paper)(({ theme }) => ({
  borderRadius: "24px",
  backgroundColor: "#ffffff",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
  padding: theme.spacing(3.5),
  position: "sticky",
  top: 90,
}));

const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // If it already starts with 254, return as is
  if (digitsOnly.startsWith("254")) {
    return digitsOnly;
  }
  // If it starts with 0, replace 0 with 254
  if (digitsOnly.startsWith("0")) {
    return "254" + digitsOnly.substring(1);
  }
  // Otherwise, prepend 254
  return "254" + digitsOnly;
};

// --- Authenticated Checkout --- //

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  payment_method: z.string().min(2, "Payment method is required"),
  pickup_location: z.number().optional().nullable(),
  delivery_location: z.number().optional().nullable(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const AuthenticatedCheckout = () => {
  const [checkoutFx, { isLoading }] = useCheckoutCartMutation();
  const [lipaNaMpesaFx] = useLipaNaMpesaMutation(); // Initialize mutation
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const theme = useTheme();
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<number | null>(null);
  const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState<number | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<PickupLocation | null>(null);
  const [deliveryOrPickup, setDeliveryOrPickup] = useState<"pickup" | "delivery">("pickup");

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Select Location', 'Billing Address', 'Review Order'];

  // M-Pesa specific states
  const [isMpesaPaymentInitiated, setIsMpesaPaymentInitiated] = useState(false);
  const [mpesaOrderId, setMpesaOrderId] = useState<string | null>(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  console.log("pollcount in Checkout:", pollCount);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);

  useEffect(() => {
    const cookieShop = Cookies.get("shopname");
    if (cookieShop) {
      setShopName(cookieShop);
    }
  }, []);

  const handleNext = React.useCallback(() => setActiveStep((prev) => prev + 1), []);
  const handleBack = React.useCallback(() => setActiveStep((prev) => prev - 1), []);

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

  const filteredDeliveryLocations = useMemo(() => {
    if (!allDeliveryLocations) return [];
    const filtered = allDeliveryLocations.filter(
      (location) =>
        location.route.toLowerCase().includes(deliverySearchQuery.toLowerCase()) ||
        location.location_name.toLowerCase().includes(deliverySearchQuery.toLowerCase())
    );
    const startIndex = (deliveryPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [allDeliveryLocations, deliverySearchQuery, deliveryPage]);

  const { register, handleSubmit, formState: { errors }, setValue, trigger, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: "mpesa" },
  });

  const router = useRouter();
  const { data: cart_data } = useGetCartQuery({ token: Cookies.get("access"), company_name: shopname });

  // Polling for M-Pesa payment status
  const { data: mpesaOrderDetails, refetch: refetchMpesaOrder } = useGetOrderByIdQuery(
    { order_id: mpesaOrderId!, token: Cookies.get("access") },
    { skip: !isMpesaPaymentInitiated || !mpesaOrderId } // Removed pollingInterval
  );

  useEffect(() => {
    if (mpesaOrderDetails?.payment_status === "Paid") {
      toast.success("M-Pesa Payment Confirmed!");
      setShowMpesaModal(false);
      setIsMpesaPaymentInitiated(false);
      setMpesaOrderId(null);
      if (pollIntervalRef.current) { // Clear interval here as well
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }
  }, [mpesaOrderDetails]);

  useEffect(() => {
    if (isMpesaPaymentInitiated && mpesaOrderId) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      setPollCount(0); // Reset poll count

      pollIntervalRef.current = setInterval(() => {
        setPollCount(prevCount => {
          if (prevCount >= 4) { // 0-indexed, so 4 means 5 runs
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            toast.error("M-Pesa payment timed out. Please try again.");
            setShowMpesaModal(false);
            setIsMpesaPaymentInitiated(false);
            setMpesaOrderId(null);
            handleNext();
            return prevCount;
          }
          refetchMpesaOrder();
          return prevCount + 1;
        });
      }, 3000);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isMpesaPaymentInitiated, mpesaOrderId, refetchMpesaOrder, handleNext]); // Added router, shopname to dependencies

  const shippingCost = useMemo(() => {
    if (!cart_data) return 0;
    let calculatedShippingCost = 0;
    if (deliveryOrPickup === "pickup" && selectedPickupLocation && pickupLocationsData) {
      const selectedLocation = pickupLocationsData.find(loc => loc.id === selectedPickupLocation);
      if (selectedLocation) calculatedShippingCost = Number(selectedLocation.delivery_fee);
    } else if (deliveryOrPickup === "delivery" && selectedDeliveryLocation && allDeliveryLocations) {
      const selectedLocation = allDeliveryLocations.find(loc => loc.id === selectedDeliveryLocation);
      if (selectedLocation) calculatedShippingCost = Number(selectedLocation.delivery_fee);
    }
    return calculatedShippingCost;
  }, [cart_data, selectedPickupLocation, pickupLocationsData, selectedDeliveryLocation, allDeliveryLocations, deliveryOrPickup]);

  const totalAmount = useMemo(() => {
    if (!cart_data) return 0;
    let itemsSubtotal = 0;
    cart_data.items.forEach((item: any) => {
      itemsSubtotal += item.product.on_sale
        ? parseFloat(item.product.discounted_price) * parseInt(item.quantity)
        : parseFloat(item.product.price) * parseInt(item.quantity);
    });
    return itemsSubtotal + shippingCost;
  }, [cart_data, shippingCost]);

  const onSubmit = async (formData: CheckoutFormData) => {
    try {
      const formattedPhoneNumber = formatPhoneNumber(formData.phoneNumber); // Format phone number

      const response = await checkoutFx({
        body: { ...formData, phoneNumber: formattedPhoneNumber, pickup_location: selectedPickupLocation, delivery_location: selectedDeliveryLocation },
        token: Cookies.get("access"),
        company_name: shopname,
      }).unwrap();

      if (formData.payment_method === "mpesa") {
        setIsProcessingMpesa(true);
        setMpesaOrderId(response.order_id);
        await lipaNaMpesaFx({ order_id: response.order_id, token: Cookies.get("access") }).unwrap();
        setIsProcessingMpesa(false);
        setIsMpesaPaymentInitiated(true);
        setShowMpesaModal(true);
        toast.success("STK Push sent to your phone. Please complete the payment.");
      } else {
        toast.success("Order Placed Successfully");
        handleNext(); // Proceed to review order step for other payment methods
      }
    } catch (error: any) {
      setIsProcessingMpesa(false);
      toast.error(error.data?.non_field_errors?.[0] || "An error occurred");
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ marginTop: "20px" }}>
              Delivery or Pickup
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup row name="deliveryOrPickup" value={deliveryOrPickup} onChange={(e) => setDeliveryOrPickup(e.target.value as "delivery" | "pickup")}>
                <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
                <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
              </RadioGroup>
            </FormControl>

            {deliveryOrPickup === "pickup" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {pickupLocationsData.map((location) => {
                          const isSelected = selectedPickupLocation === location.id;
                          const fee = parseFloat(location.delivery_fee || "0");
                          return (
                            <Box
                              key={location.id}
                              onClick={() => {
                                setSelectedPickupLocation(location.id);
                                setValue("pickup_location", location.id);
                                setSelectedDeliveryLocation(null);
                                setValue("delivery_location", null);
                              }}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                border: "2px solid",
                                borderColor: isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.06)",
                                borderRadius: "16px",
                                p: 2.5,
                                backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.03) : "#ffffff",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": { borderColor: theme.palette.primary.main },
                              }}
                            >
                              <FormControlLabel
                                value={location.id}
                                control={<Radio checked={isSelected} />}
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: "#18181b", mb: 0.5 }}>
                                      {location.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#71717a", mb: 0.5 }}>
                                      {location.address}, {location.city}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                      Delivery Fee: Kes {fee.toLocaleString()}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ flexGrow: 1, mr: 1, alignItems: "flex-start" }}
                              />
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<LocationOnIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLocationForMap(location);
                                  setMapOpen(true);
                                }}
                                sx={{
                                  borderRadius: "30px",
                                  textTransform: "none",
                                  fontWeight: 700,
                                  border: "1px solid rgba(0,0,0,0.12)",
                                  color: "#18181b",
                                  "&:hover": { borderColor: theme.palette.primary.main, backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                                }}
                              >
                                Preview on Map
                              </Button>
                            </Box>
                          );
                        })}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Typography>No pickup locations available for this shop.</Typography>
                )}
              </Box>
            )}

            {deliveryOrPickup === "delivery" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search delivery routes, locations..."
                  variant="outlined"
                  value={deliverySearchQuery}
                  onChange={(e) => setDeliverySearchQuery(e.target.value)}
                  InputProps={{
                    sx: { borderRadius: "12px", backgroundColor: "#ffffff" },
                  }}
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
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {filteredDeliveryLocations.map((location) => {
                          const isSelected = selectedDeliveryLocation === location.id;
                          const fee = parseFloat(String(location.delivery_fee || 0));
                          return (
                            <Box
                              key={location.id}
                              onClick={() => {
                                setSelectedDeliveryLocation(location.id);
                                setValue("delivery_location", location.id);
                                setSelectedPickupLocation(null);
                                setValue("pickup_location", null);
                              }}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                border: "2px solid",
                                borderColor: isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.06)",
                                borderRadius: "16px",
                                p: 2.5,
                                backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.03) : "#ffffff",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": { borderColor: theme.palette.primary.main },
                              }}
                            >
                              <FormControlLabel
                                value={location.id}
                                control={<Radio checked={isSelected} />}
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: "#18181b", mb: 0.5 }}>
                                      {location.location_name.toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#71717a", mb: 0.5 }}>
                                      Route: {location.route.toLowerCase()}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                      Delivery Fee: Kes {fee.toLocaleString()}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ flexGrow: 1, mr: 1, alignItems: "flex-start" }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
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
              </Box>
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
                  // { label: "Address", name: "address" },
                  // { label: "City", name: "city" },
                  // { label: "State", name: "state" },
                  // { label: "Postal Code", name: "postal_code" },
                  // { label: "Country", name: "country" },
                ].map((field, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <TextField
                      autoFocus={index === 0}
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
              <Button variant="contained" onClick={async () => {
                const billingFields: (keyof CheckoutFormData)[] = ["firstName", "lastName", "phoneNumber"];
                const isValid = await trigger(billingFields);
                if (isValid) {
                  handleNext();
                }
              }}>
                Next
              </Button>
            </Box>
          </>
        );
      default:
        // const handleConfirmPayment = () => {
        //   toast.success(<Typography>Payment Confirmed! Redirecting to shop...</Typography>);
        //   router.push(`/shop/${shopname}`);
        // };

        return (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
              Review Order and Pay
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>Your Total: Kes {totalAmount}</Typography>
              {/* {order} */}
              {/* <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Company Payment Details:</Typography> */}
              {companyDataLoading ? (
                <Typography>Loading payment details...</Typography>
              ) : companyData ? (
                <></>
                // <Box>
                //   {companyData.payment_method === "mpesa_till" && (
                //     <Typography variant="body1">M-Pesa Till Number: <b>{companyData.mpesa_till_number}</b></Typography>
                //   )}
                //   {companyData.payment_method === "mpesa_paybill" && (
                //     <>
                //       <Typography variant="body1">M-Pesa Paybill Number: <b>{companyData.mpesa_paybill_number}</b></Typography>
                //       <Typography variant="body1">M-Pesa Account Number: <b>{companyData.mpesa_account_number}</b></Typography>
                //     </>
                //   )}
                //   {companyData.payment_method === "mpesa_send_money" && (
                //     <Typography variant="body1">M-Pesa Phone Number: <b>{companyData.mpesa_phone_number}</b></Typography>
                //   )}
                //   {companyData.payment_method === "pochi_la_biashara" && (
                //     <Typography variant="body1">Pochi la Biashara Number: <b>{companyData.mpesa_phone_number}</b></Typography>
                //   )}
                //   {!companyData.payment_method && (
                //     <Typography>No specific payment method configured for this company.</Typography>
                //   )}
                // </Box>
              ) : (
                <Typography>Could not load company payment details.</Typography>
              )}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button
                variant="contained"
                type="submit" // This will trigger the onSubmit function
                disabled={isLoading || isProcessingMpesa || (!selectedPickupLocation && !selectedDeliveryLocation)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {(isLoading || isProcessingMpesa) ? <CircularProgress size={24} /> : "Place Order"}
              </Button>
            </Box>
          </>
        );
      // default:
      //   return (`Unknown step ${step}`);
    }
  };

  return (
    <Grid container spacing={4} size={{ xs: 12, md: 7 }}>
      <Box sx={{ width: "100%" }}>
        <CheckoutStepCard sx={{ mb: 4, py: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "&.Mui-active": { color: theme.palette.primary.main },
                      "&.Mui-completed": { color: theme.palette.primary.main },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CheckoutStepCard>

        <form onSubmit={handleSubmit(onSubmit)}>{getStepContent(activeStep)}</form>
      </Box>

      {/* Order Summary Sidebar */}
      <Box>
        <SummarySideCard>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b", mb: 3 }}>
            Order Summary
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Items Subtotal</Typography>
              <Typography sx={{ fontWeight: 700, color: "#18181b" }}>Kes {cart_data?.total || 0}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Fulfillment Fee</Typography>
              <Typography sx={{ fontWeight: 700, color: "#18181b" }}>
                {shippingCost > 0 ? `Kes ${shippingCost}` : "Select Location"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", pt: 1, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#18181b" }}>Total</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                Kes {totalAmount}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#18181b", mb: 1.5 }}>
            Payment Method
          </Typography>
          <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
            <RadioGroup
              row
              name="paymentRadio"
              value={watch("payment_method")}
              onChange={(e) => setValue("payment_method", e.target.value)}
            >
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, width: "100%" }}>
                {[
                  { value: "mpesa", label: "M-Pesa", icon: PhoneIphoneIcon },
                  { value: "card", label: "Card / Credit", icon: CreditCardIcon },
                  { value: "paypal", label: "PayPal Wallet", icon: AccountBalanceWalletIcon },
                ].map((pm) => {
                  const isSelected = watch("payment_method") === pm.value;
                  return (
                    <Box
                      key={pm.value}
                      onClick={() => setValue("payment_method", pm.value)}
                      sx={{
                        border: "2px solid",
                        borderColor: isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.08)",
                        borderRadius: "14px",
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.04) : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: theme.palette.primary.main },
                      }}
                    >
                      <FormControlLabel
                        value={pm.value}
                        control={<Radio size="small" />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <pm.icon sx={{ fontSize: "1.15rem", color: isSelected ? theme.palette.primary.main : "text.secondary" }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: isSelected ? "text.primary" : "text.secondary", whiteSpace: "nowrap" }}>{pm.label}</Typography>
                          </Box>
                        }
                        sx={{ m: 0 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </RadioGroup>
          </FormControl>
        </SummarySideCard>
      </Box>

      <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="md" fullWidth disablePortal keepMounted>
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

      {/* M-Pesa Payment Modal */}
      <Dialog open={showMpesaModal} onClose={() => setShowMpesaModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Complete M-Pesa Payment
          <IconButton
            aria-label="close"
            onClick={() => setShowMpesaModal(false)}
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
        <DialogContent dividers sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Please check your phone for an M-Pesa STK Push notification.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Complete the payment on your phone to finalize your order.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setShowMpesaModal(false);
              setIsMpesaPaymentInitiated(false);
              setMpesaOrderId(null);
              router.push(`/shop/${shopname}`); // Redirect if user cancels
            }}
            sx={{ mt: 3 }}
          >
            Cancel Payment
          </Button>
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
  const [lipaNaMpesaFx] = useLipaNaMpesaMutation(); // Initialize mutation
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

  // M-Pesa specific states for Guest Checkout
  const [isMpesaPaymentInitiated, setIsMpesaPaymentInitiated] = useState(false);
  const [mpesaOrderId, setMpesaOrderId] = useState<string | null>(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  console.log(pollCount)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);

  const guestCheckoutSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phoneNumber: z.string().min(7, "Phone number is required"),
    // address: z.string().min(5, "Address is required"),
    // city: z.string().min(2, "City is required"),
    // state: z.string().min(2, "State is required"),
    // postal_code: z.string().min(4, "Postal code is required"),
    // country: z.string().min(2, "Country is required"),
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

  const handleNext = React.useCallback(() => setActiveStep((prev) => prev + 1), []);
  const handleBack = React.useCallback(() => setActiveStep((prev) => prev - 1), []);

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

  const { register, handleSubmit, formState: { errors }, setValue, trigger, watch } = useForm<GuestCheckoutFormData>({
    resolver: zodResolver(guestCheckoutSchema),
    defaultValues: { payment_method: "mpesa" },
  });

  const yourDetailsFields = watch(["email", "firstName", "lastName", "phoneNumber"]);

  // Polling for M-Pesa payment status for Guest Checkout
  const { data: mpesaOrderDetails, refetch: refetchMpesaOrder } = useGetOrderByIdQuery(
    { order_id: mpesaOrderId!, token: "" }, // Guest users don't have a token for this endpoint either
    { skip: !isMpesaPaymentInitiated || !mpesaOrderId } // Removed pollingInterval
  );

  useEffect(() => {
    if (mpesaOrderDetails?.payment_status === "Paid") {
      toast.success("M-Pesa Payment Confirmed!");
      setShowMpesaModal(false);
      setIsMpesaPaymentInitiated(false);
      setMpesaOrderId(null);
      if (pollIntervalRef.current) { // Clear interval here as well
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      handleNext();
    }
  }, [mpesaOrderDetails, handleNext]);

  useEffect(() => {
    if (isMpesaPaymentInitiated && mpesaOrderId) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      setPollCount(0); // Reset poll count

      pollIntervalRef.current = setInterval(() => {
        setPollCount(prevCount => {
          if (prevCount >= 4) { // 0-indexed, so 4 means 5 runs
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            toast.error("M-Pesa payment timed out. Please try again.");
            setShowMpesaModal(false);
            setIsMpesaPaymentInitiated(false);
            setMpesaOrderId(null);
            handleNext();
            return prevCount;
          }
          refetchMpesaOrder();
          return prevCount + 1;
        });
      }, 3000);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isMpesaPaymentInitiated, mpesaOrderId, refetchMpesaOrder, handleNext]); // Added router, shopname to dependencies

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
      const formattedPhoneNumber = formatPhoneNumber(formData.phoneNumber); // Format phone number

      const response = await placeOrderGuest({
        ...formData,
        phoneNumber: formattedPhoneNumber, // Use formatted phone number
        sessionId,
        company_name: shopname
      }).unwrap();
      setOrderResponse(response);
      toast.success("Your order has been placed successfully!");
      localStorage.removeItem("session_id");
      refetch(); // To clear the cart data

      if (formData.payment_method === "mpesa") {
        setIsProcessingMpesa(true);
        setMpesaOrderId(response.order_id);
        // For guest users, the backend might not require a token for lipa-na-mpesa if the order_id is sufficient
        // However, if it does, we might need to handle guest authentication differently or ensure the backend allows it.
        await lipaNaMpesaFx({ order_id: response.order_id, token: "", session_id: sessionId }).unwrap(); // Pass empty token for guest, and session_id
        setIsProcessingMpesa(false);
        setIsMpesaPaymentInitiated(true);
        setShowMpesaModal(true);
        toast.success("STK Push sent to your phone. Please complete the payment.");
      } else {
        // For other payment methods, proceed to the order confirmation screen
        // The existing orderResponse rendering handles this.
      }
    } catch (error: any) {
      setIsProcessingMpesa(false);
      if (error.data?.error === "Email already exists") {
        toast.error("An account with this email already exists. Please log in to complete your order.");
        router.push("/login");
      } else {
        toast.error(error.data?.error || "An unexpected error occurred.");
      }
    }
  };

  if (orderResponse && !isMpesaPaymentInitiated) { // Only show order response if not in M-Pesa flow
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
                    autoFocus
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
              </Grid>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={async () => {
                const isValid = await trigger(["email", "firstName", "lastName", "phoneNumber"]);
                if (isValid) handleNext();
              }} disabled={yourDetailsFields.some(field => !field) || !!errors.email || !!errors.firstName || !!errors.lastName || !!errors.phoneNumber }>
                Next
              </Button>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ marginTop: "20px" }}>
              Delivery or Pickup
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup row name="deliveryOrPickup" value={deliveryOrPickup} onChange={(e) => setDeliveryOrPickup(e.target.value as "delivery" | "pickup")}>
                <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
                <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
              </RadioGroup>
            </FormControl>

            {deliveryOrPickup === "pickup" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {pickupLocationsData.map((location) => {
                          const isSelected = selectedPickupLocation === location.id;
                          const fee = parseFloat(location.delivery_fee || "0");
                          return (
                            <Box
                              key={location.id}
                              onClick={() => {
                                setSelectedPickupLocation(location.id);
                                setValue("pickup_location", location.id);
                                setSelectedDeliveryLocation(null);
                                setValue("delivery_location", null);
                              }}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                border: "2px solid",
                                borderColor: isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.06)",
                                borderRadius: "16px",
                                p: 2.5,
                                backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.03) : "#ffffff",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": { borderColor: theme.palette.primary.main },
                              }}
                            >
                              <FormControlLabel
                                value={location.id}
                                control={<Radio checked={isSelected} />}
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: "#18181b", mb: 0.5 }}>
                                      {location.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#71717a", mb: 0.5 }}>
                                      {location.address}, {location.city}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                      Delivery Fee: Kes {fee.toLocaleString()}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ flexGrow: 1, mr: 1, alignItems: "flex-start" }}
                              />
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<LocationOnIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLocationForMap(location);
                                  setMapOpen(true);
                                }}
                                sx={{
                                  borderRadius: "30px",
                                  textTransform: "none",
                                  fontWeight: 700,
                                  border: "1px solid rgba(0,0,0,0.12)",
                                  color: "#18181b",
                                  "&:hover": { borderColor: theme.palette.primary.main, backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                                }}
                              >
                                Preview on Map
                              </Button>
                            </Box>
                          );
                        })}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Typography>No pickup locations available for this shop.</Typography>
                )}
              </Box>
            )}

            {deliveryOrPickup === "delivery" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search delivery routes, locations..."
                  variant="outlined"
                  value={deliverySearchQuery}
                  onChange={(e) => setDeliverySearchQuery(e.target.value)}
                  InputProps={{
                    sx: { borderRadius: "12px", backgroundColor: "#ffffff" },
                  }}
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
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {filteredDeliveryLocations.map((location) => {
                          const isSelected = selectedDeliveryLocation === location.id;
                          const fee = parseFloat(String(location.delivery_fee || 0));
                          return (
                            <Box
                              key={location.id}
                              onClick={() => {
                                setSelectedDeliveryLocation(location.id);
                                setValue("delivery_location", location.id);
                                setSelectedPickupLocation(null);
                                setValue("pickup_location", null);
                              }}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                border: "2px solid",
                                borderColor: isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.06)",
                                borderRadius: "16px",
                                p: 2.5,
                                backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.03) : "#ffffff",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": { borderColor: theme.palette.primary.main },
                              }}
                            >
                              <FormControlLabel
                                value={location.id}
                                control={<Radio checked={isSelected} />}
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: "#18181b", mb: 0.5 }}>
                                      {location.location_name.toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#71717a", mb: 0.5 }}>
                                      Route: {location.route.toLowerCase()}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                      Delivery Fee: Kes {fee.toLocaleString()}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ flexGrow: 1, mr: 1, alignItems: "flex-start" }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
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
              </Box>
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
                disabled={isLoading || isProcessingMpesa || (!selectedPickupLocation && !selectedDeliveryLocation)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {(isLoading || isProcessingMpesa) ? <CircularProgress size={24} /> : "Place Order & Create Account"}
              </Button>
            </Box>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Grid container spacing={4} size={{ xs: 12, md: 7 }}>
      <Box sx={{ width: "100%" }}>
        <CheckoutStepCard sx={{ mb: 4, py: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "&.Mui-active": { color: theme.palette.primary.main },
                      "&.Mui-completed": { color: theme.palette.primary.main },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CheckoutStepCard>

        <form onSubmit={handleSubmit(onSubmit)}>
          {getStepContent(activeStep)}
        </form>
      </Box>

      {/* Order Summary Sidebar */}
      <Box>
        <SummarySideCard>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b", mb: 3 }}>
            Order Summary
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Items Subtotal</Typography>
              <Typography sx={{ fontWeight: 700, color: "#18181b" }}>Kes {cart_data?.total || 0}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Fulfillment Fee</Typography>
              <Typography sx={{ fontWeight: 700, color: "#18181b" }}>
                {shippingCost > 0 ? `Kes ${shippingCost}` : "Select Location"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", pt: 1, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#18181b" }}>Total</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                Kes {totalAmount}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#18181b", mb: 1.5 }}>
            Payment Method
          </Typography>
          <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
            <RadioGroup
              row
              name="guestPaymentRadio"
              value={watch("payment_method")}
              onChange={(e) => setValue("payment_method", e.target.value)}
            >
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, width: "100%" }}>
                {[
                  { value: "mpesa", label: "M-Pesa", icon: PhoneIphoneIcon },
                  { value: "card", label: "Card / Credit", icon: CreditCardIcon },
                  { value: "paypal", label: "PayPal Wallet", icon: AccountBalanceWalletIcon },
                ].map((pm) => {
                  const isSelected = watch("payment_method") === pm.value;
                  return (
                    <Box
                      key={pm.value}
                      onClick={() => setValue("payment_method", pm.value)}
                      sx={{
                        border: "2px solid",
                        borderColor: isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.08)",
                        borderRadius: "14px",
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.04) : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: theme.palette.primary.main },
                      }}
                    >
                      <FormControlLabel
                        value={pm.value}
                        control={<Radio size="small" />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <pm.icon sx={{ fontSize: "1.15rem", color: isSelected ? theme.palette.primary.main : "text.secondary" }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: isSelected ? "text.primary" : "text.secondary", whiteSpace: "nowrap" }}>{pm.label}</Typography>
                          </Box>
                        }
                        sx={{ m: 0 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </RadioGroup>
          </FormControl>
        </SummarySideCard>
      </Box>

      <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="md" fullWidth disablePortal keepMounted>
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

      {/* M-Pesa Payment Modal for Guest Checkout */}
      <Dialog open={showMpesaModal} onClose={() => setShowMpesaModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Complete M-Pesa Payment
          <IconButton
            aria-label="close"
            onClick={() => setShowMpesaModal(false)}
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
        <DialogContent dividers sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Please check your phone for an M-Pesa STK Push notification.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Complete the payment on your phone to finalize your order.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setShowMpesaModal(false);
              setIsMpesaPaymentInitiated(false);
              setMpesaOrderId(null);
              router.push(`/shop/${shopname}`); // Redirect if user cancels
            }}
            sx={{ mt: 3 }}
          >
            Cancel Payment
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
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
  const [shopname, setShopName] = useState("techend");
  useEffect(() => {
  const cookieShop = Cookies.get("shopname");
  if (cookieShop) {
    setShopName(cookieShop);
  }
}, []);
  useEffect(() => {
    const token = Cookies.get("access");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", pb: 12 }}>
      {/* Header Banner */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          py: { xs: 3, md: 4 },
          mb: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 1.5, fontSize: "0.85rem" }}>
            <Link underline="hover" color="text.secondary" href="/">Home</Link>
            <Link underline="hover" color="text.secondary" href={`/shop/${shopname}`}>Storefront</Link>
            <Link underline="hover" color="text.secondary" href="/cart">Cart</Link>
            <Typography color={theme.palette.primary.main} sx={{ fontWeight: 600 }}>Secure Checkout</Typography>
          </Breadcrumbs>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#18181b", fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 0.5 }}>
                Checkout
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", fontWeight: 500 }}>
                Complete your order safely with SSL encrypted security
              </Typography>
            </Box>

            <Chip
              icon={<LockOutlinedIcon sx={{ fontSize: "1rem !important", color: `${theme.palette.primary.main} !important` }} />}
              label="256-Bit SSL Encrypted"
              variant="outlined"
              sx={{ borderRadius: "30px", fontWeight: 600, px: 1, py: 2.2, borderColor: alpha(theme.palette.primary.main, 0.3) }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {isAuthenticated ? <AuthenticatedCheckout /> : <GuestCheckout />}
      </Container>
    </Box>
  );
}

export default Checkout;
