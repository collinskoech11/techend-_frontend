"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import {
  useCheckoutCartMutation,
  useGetCartQuery,
  useGetCompanyBySlugQuery,
  usePlaceOrderGuestMutation,
  useLipaNaMpesaMutation,
  useGetOrderByIdQuery,
} from "@/Api/services";
import { GuestOrderResponse } from "@/Types";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/contexts/CartContext";
import {
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button,
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
  Divider,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.startsWith("254")) {
    return digitsOnly;
  }
  if (digitsOnly.startsWith("0")) {
    return "254" + digitsOnly.substring(1);
  }
  return "254" + digitsOnly;
};

// --- Map Pinning Widget --- //
const MapPinWidget = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pinning, setPinning] = useState(false);

  useEffect(() => {
    if (value) {
      const match = value.match(/Lat:\s*([-\d.]+),\s*Lng:\s*([-\d.]+)/);
      if (match) {
        setCoords({ lat: parseFloat(match[1]), lng: parseFloat(match[2]) });
      }
    }
  }, [value]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simulate Kenya/Nairobi coordinates based on click
    const lat = -1.2921 - ((y - rect.height / 2) * 0.0002);
    const lng = 36.8219 + ((x - rect.width / 2) * 0.0002);
    
    setCoords({ lat, lng });
    onChange(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setPinning(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          onChange(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
          setPinning(false);
          toast.success("Location pinned from GPS!");
        },
        () => {
          setPinning(false);
          toast.error("Could not obtain location. Pin manually on the map.");
        }
      );
    } else {
      toast.error("GPS location is not supported by your browser.");
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>
        Pin Location on Map
      </Typography>
      
      <Box 
        onClick={handleMapClick}
        sx={{
          height: 180,
          borderRadius: "16px",
          position: "relative",
          cursor: "crosshair",
          overflow: "hidden",
          border: "2px solid rgba(0,0,0,0.06)",
          backgroundImage: "linear-gradient(rgba(135, 206, 235, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(135, 206, 235, 0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundColor: "#f4fbf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color 0.2s",
          "&:hover": {
            borderColor: "primary.main"
          }
        }}
      >
        <Box sx={{ position: "absolute", width: "100%", height: "100%", opacity: 0.6, pointerEvents: "none" }}>
          <Box sx={{ position: "absolute", top: "25%", left: "15%", width: "25%", height: "35%", borderRadius: "50%", backgroundColor: "#e2f0d9" }} />
          <Box sx={{ position: "absolute", top: "60%", left: "65%", width: "20%", height: "25%", borderRadius: "40%", backgroundColor: "#e2f0d9" }} />
          <Box sx={{ position: "absolute", top: "45%", left: 0, width: "100%", height: "6px", backgroundColor: "#b4c6e7", transform: "skewY(-8deg)" }} />
        </Box>

        {coords ? (
          <Box 
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              transform: "translateY(-16px)",
              pointerEvents: "none"
            }}
          >
            <LocationOnIcon color="primary" sx={{ fontSize: 36, filter: "drop-shadow(0px 3px 6px rgba(0,0,0,0.2))" }} />
            <Box sx={{ backgroundColor: "rgba(24, 24, 27, 0.9)", color: "#fff", px: 1, py: 0.5, borderRadius: "6px", fontSize: "9px", mt: 0.5, whiteSpace: "nowrap" }}>
              Pinned: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </Box>
          </Box>
        ) : (
          <Stack spacing={1} alignItems="center" sx={{ zIndex: 1, px: 2, textAlign: "center" }}>
            <MapIcon sx={{ color: "text.secondary", fontSize: 28 }} />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Click anywhere on map grid to drop a pin marker
            </Typography>
          </Stack>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={pinning ? <CircularProgress size={14} /> : <MyLocationIcon />}
          onClick={handleGetLocation}
          sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
        >
          Use Current GPS
        </Button>
        {coords && (
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// --- Order Successful Component --- //
const OrderSuccessScreen = ({ 
  orderId, 
  guestEmail, 
  guestPassword, 
  cartData, 
  formData, 
  shopname,
  paymentStatus
}: { 
  orderId: string; 
  guestEmail?: string; 
  guestPassword?: string; 
  cartData: any; 
  formData: any; 
  shopname: string; 
  paymentStatus?: string;
}) => {
  const router = useRouter();

  const orderTotal = useMemo(() => {
    if (!cartData) return 0;
    if (typeof cartData.total === "number") return cartData.total;
    const parsed = parseFloat(cartData.total);
    return isNaN(parsed) ? 0 : parsed;
  }, [cartData]);

  const isPaid = useMemo(() => {
    return paymentStatus === "Paid" || formData?.payment_method !== "mpesa";
  }, [paymentStatus, formData]);

  const amountPaid = isPaid ? orderTotal : 0;
  const balance = orderTotal - amountPaid;

  const downloadReceipt = () => {
    const formattedDate = new Date().toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    
    const receiptText = `
==================================================
                 SOKOJUNCTION RECEIPT             
==================================================
Order Reference : #${orderId}
Shop            : ${shopname.toUpperCase()}
Date            : ${formattedDate}
Payment Method  : ${formData?.payment_method?.toUpperCase()}
Payment Status  : ${isPaid ? "PAID" : "PENDING"}
--------------------------------------------------
CUSTOMER DETAILS:
Name            : ${formData?.firstName} ${formData?.lastName}
Phone           : ${formData?.phoneNumber}
Address         : ${formData?.address}, ${formData?.city}
${formData?.pinnedLocation ? `Coordinates     : ${formData.pinnedLocation}` : ""}
--------------------------------------------------
ITEMS PURCHASED:
${cartData?.items?.map((item: any) => {
  const price = item.product.on_sale ? parseFloat(item.product.discounted_price) : parseFloat(item.product.price);
  const nameLine = item.product.title;
  const qtyLine = `Qty: ${item.quantity}`.padEnd(10);
  const priceLine = `Kes ${(price * item.quantity).toLocaleString()}`;
  return `${nameLine.padEnd(30)} ${qtyLine} ${priceLine}`;
}).join("\n")}
--------------------------------------------------
Order Total     : Kes ${orderTotal.toLocaleString()}
Amount Paid     : Kes ${amountPaid.toLocaleString()}
Remaining Bal.  : Kes ${balance.toLocaleString()}
==================================================
    Thank you for shopping with Sokojunction!     
==================================================
`;
    const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_Order_${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", py: 4 }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "28px", boxShadow: "0 15px 40px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)", width: "100%", maxWidth: "800px" }}>
        {/* Success Icon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <CheckCircleIcon sx={{ fontSize: 50 }} />
          </Box>
        </Box>

        <Typography variant="h3" align="center" sx={{ fontWeight: 900, color: "#18181b", fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 1 }}>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: "#71717a", maxW: 500, mx: "auto", mb: 4 }}>
          Thank you for your purchase. Your order has been received and is being processed.
        </Typography>

        {/* Guest credentials card */}
        {guestEmail && guestPassword && (
          <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: "16px", borderColor: "rgba(16, 185, 129, 0.3)", backgroundColor: "#f8fdf8" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#2e7d32", mb: 1.5, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
              Account Created Successfully
            </Typography>
            <Typography variant="body2" sx={{ color: "#2e7d32", mb: 2 }}>
              A customer account has been set up for you. Use the credentials below to log in next time and track your order:
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Username/Email</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{guestEmail}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Temporary Password</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.05em" }}>{guestPassword}</Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Order Details Accordion/Summary */}
        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: "16px", borderColor: "rgba(0,0,0,0.06)", backgroundColor: "#fafafa" }}>
          <Stack spacing={2.5} divider={<Divider />}>
            {/* Financial Details */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2, textAlign: "center", py: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Order Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>Kes {orderTotal.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Amount Paid</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: "#10b981" }}>Kes {amountPaid.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Remaining Balance</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: balance > 0 ? "#ef4444" : "text.primary" }}>Kes {balance.toLocaleString()}</Typography>
              </Box>
            </Box>

            {/* Reference info */}
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Order Reference</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800 }}>#{orderId}</Typography>
            </Box>

            {/* Delivery address */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#71717a", mb: 0.5, textTransform: "uppercase", fontSize: "0.75rem" }}>
                Delivery Address
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formData?.firstName} {formData?.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {formData?.address}, {formData?.city}
              </Typography>
              {formData?.pinnedLocation && (
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                  Coordinates: {formData.pinnedLocation}
                </Typography>
              )}
            </Box>

            {/* Items list */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#71717a", mb: 1.5, textTransform: "uppercase", fontSize: "0.75rem" }}>
                Purchased Items
              </Typography>
              <Stack spacing={1.5}>
                {cartData?.items?.map((item: any) => {
                  const price = item.product.on_sale ? parseFloat(item.product.discounted_price) : parseFloat(item.product.price);
                  return (
                    <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.product.title}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>Qty: {item.quantity}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Kes {(price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 800, px: 4 }}
            onClick={() => router.push(`/shop/${shopname}`)}
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 4 }}
            onClick={downloadReceipt}
          >
            Download Receipt
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 4 }}
            onClick={() => router.push("/orderhistory")}
          >
            View Order History
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

// --- Authenticated Checkout --- //
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  payment_method: z.string().min(2, "Payment method is required"),
  pinnedLocation: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const AuthenticatedCheckout = () => {
  const [checkoutFx, { isLoading }] = useCheckoutCartMutation();
  const [lipaNaMpesaFx] = useLipaNaMpesaMutation();
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const theme = useTheme();
  
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Your Details', 'Delivery Address', 'Payment Method', 'Review & Pay'];

  // M-Pesa states
  const [isMpesaPaymentInitiated, setIsMpesaPaymentInitiated] = useState(false);
  const [mpesaOrderId, setMpesaOrderId] = useState<string | null>(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const pollCountRef = useRef(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);

  // Success screen states
  const [successOrder, setSuccessOrder] = useState<{ orderId: string; formData: any; cartData: any } | null>(null);
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<any>(null);
  const [lastCartData, setLastCartData] = useState<any>(null);

  useEffect(() => {
    const cookieShop = Cookies.get("shopname");
    if (cookieShop) {
      setShopName(cookieShop);
    }
  }, []);

  const handleNext = React.useCallback(() => setActiveStep((prev) => prev + 1), []);
  const handleBack = React.useCallback(() => setActiveStep((prev) => prev - 1), []);

  const { data: companyData, isLoading: companyDataLoading } = useGetCompanyBySlugQuery(shopname);

  const { register, handleSubmit, formState: { errors }, setValue, trigger, watch, control, setError, clearErrors } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: "mpesa", pinnedLocation: "" },
  });

  const router = useRouter();
  const { data: cart_data } = useGetCartQuery({ token: Cookies.get("access"), company_name: shopname });

  const { data: mpesaOrderDetails, refetch: refetchMpesaOrder } = useGetOrderByIdQuery(
    { order_id: mpesaOrderId!, token: Cookies.get("access") },
    { skip: !isMpesaPaymentInitiated || !mpesaOrderId }
  );

  useEffect(() => {
    if (mpesaOrderDetails?.payment_status === "Paid") {
      toast.success("M-Pesa Payment Confirmed!");
      setShowMpesaModal(false);
      setIsMpesaPaymentInitiated(false);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setSuccessOrder({
        orderId: mpesaOrderId!,
        formData: lastSubmittedFormData,
        cartData: lastCartData,
      });
      setMpesaOrderId(null);
    }
  }, [mpesaOrderDetails, mpesaOrderId, lastSubmittedFormData, lastCartData]);

  useEffect(() => {
    if (isMpesaPaymentInitiated && mpesaOrderId) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      pollCountRef.current = 0;
      pollIntervalRef.current = setInterval(() => {
        if (pollCountRef.current >= 5) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          toast.error("M-Pesa payment timed out. Please try again.");
          setShowMpesaModal(false);
          setIsMpesaPaymentInitiated(false);
          setMpesaOrderId(null);
          return;
        }
        refetchMpesaOrder();
        pollCountRef.current += 1;
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
      }
    };
  }, [isMpesaPaymentInitiated, mpesaOrderId, refetchMpesaOrder]);

  const totalAmount = useMemo(() => {
    if (!cart_data) return 0;
    let itemsSubtotal = 0;
    cart_data.items.forEach((item: any) => {
      itemsSubtotal += item.product.on_sale
        ? parseFloat(item.product.discounted_price) * parseInt(item.quantity)
        : parseFloat(item.product.price) * parseInt(item.quantity);
    });
    return itemsSubtotal;
  }, [cart_data]);

  const onSubmit = async (formData: CheckoutFormData) => {
    try {
      const formattedPhoneNumber = formatPhoneNumber(formData.phoneNumber);
      const combinedAddress = formData.address + (formData.pinnedLocation ? ` [Map: ${formData.pinnedLocation}]` : "");

      const response = await checkoutFx({
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formattedPhoneNumber,
          address: combinedAddress,
          city: formData.city,
          state: "Kenya",
          country: "Kenya",
          postal_code: "00100",
          payment_method: formData.payment_method,
        },
        token: Cookies.get("access"),
        company_name: shopname,
      }).unwrap();

      if (formData.payment_method === "mpesa") {
        setLastSubmittedFormData(formData);
        setLastCartData(cart_data);
        setIsProcessingMpesa(true);
        setMpesaOrderId(response.order_id);
        await lipaNaMpesaFx({ order_id: response.order_id, token: Cookies.get("access") }).unwrap();
        setIsProcessingMpesa(false);
        setIsMpesaPaymentInitiated(true);
        setShowMpesaModal(true);
        toast.success("STK Push sent to your phone. Please complete the payment.");
      } else {
        toast.success("Order Placed Successfully!");
        setSuccessOrder({
          orderId: response.order_id,
          formData,
          cartData: cart_data,
        });
      }
    } catch (error: any) {
      setIsProcessingMpesa(false);
      toast.error(error.data?.non_field_errors?.[0] || error.data?.error || "An error occurred");
    }
  };

  if (successOrder) {
    return (
      <OrderSuccessScreen 
        orderId={successOrder.orderId}
        cartData={successOrder.cartData}
        formData={successOrder.formData}
        shopname={shopname}
        paymentStatus={mpesaOrderDetails?.payment_status}
      />
    );
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Box sx={{ borderBottom: "2px solid #f4f4f5", pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b" }}>
                Your Contact Details
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
                Provide your name and contact phone number for the order.
              </Typography>
            </Box>
            
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
            </Box>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              InputProps={{ sx: { borderRadius: "12px" } }}
              placeholder="e.g. 0712345678"
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={async () => {
                  const isValid = await trigger(["firstName", "lastName", "phoneNumber"]);
                  if (isValid) handleNext();
                }}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 4 }}
              >
                Next Step
              </Button>
            </Box>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            <Box sx={{ borderBottom: "2px solid #f4f4f5", pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b" }}>
                Delivery Address
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
                Enter the physical address where you'd like your items delivered, and drop a pin on the map.
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Street / Apartment / Delivery Address"
              variant="outlined"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
              InputProps={{ sx: { borderRadius: "12px" } }}
              placeholder="e.g. Apartment 4B, Kilimani Road"
            />
            
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              {...register("city")}
              error={!!errors.city}
              helperText={errors.city?.message}
              InputProps={{ sx: { borderRadius: "12px" } }}
              placeholder="e.g. Nairobi"
            />

            <Controller
              name="pinnedLocation"
              control={control}
              render={({ field }) => (
                <MapPinWidget value={field.value || ""} onChange={field.onChange} />
              )}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button variant="outlined" onClick={handleBack} sx={{ borderRadius: "12px", textTransform: "none" }}>
                Back
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => {
                  const addressVal = watch("address");
                  const cityVal = watch("city");
                  let hasError = false;
                  
                  if (!addressVal || addressVal.trim().length < 5) {
                    setError("address", { type: "manual", message: "Delivery address must be at least 5 characters" });
                    hasError = true;
                  } else {
                    clearErrors("address");
                  }
                  
                  if (!cityVal || cityVal.trim().length < 2) {
                    setError("city", { type: "manual", message: "City is required" });
                    hasError = true;
                  } else {
                    clearErrors("city");
                  }

                  if (!hasError) handleNext();
                }}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 4 }}
              >
                Next Step
              </Button>
            </Box>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <Box sx={{ borderBottom: "2px solid #f4f4f5", pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b" }}>
                Select Payment Method
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
                Choose how you would like to settle this order securely.
              </Typography>
            </Box>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                row
                name="payment_method"
                value={watch("payment_method")}
                onChange={(e) => setValue("payment_method", e.target.value)}
              >
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2, width: "100%" }}>
                  {[
                    { value: "mpesa", label: "M-Pesa STK Push", desc: "Pay instantly via your Safaricom SIM card push notifications", icon: PhoneIphoneIcon },
                    { value: "card", label: "Debit or Credit Card", desc: "Visa, Mastercard, or American Express cards", icon: CreditCardIcon },
                    { value: "paypal", label: "PayPal Express", desc: "Pay with your secure PayPal wallet balance or bank link", icon: AccountBalanceWalletIcon },
                  ].map((pm) => {
                    const isSelected = watch("payment_method") === pm.value;
                    return (
                      <Box
                        key={pm.value}
                        onClick={() => setValue("payment_method", pm.value)}
                        sx={{
                          border: "2px solid",
                          borderColor: isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.08)",
                          borderRadius: "16px",
                          p: 2.5,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.03) : "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": { borderColor: theme.palette.primary.main },
                        }}
                      >
                        <Radio checked={isSelected} sx={{ p: 0.5 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <pm.icon sx={{ fontSize: "1.3rem", color: isSelected ? theme.palette.primary.main : "text.secondary" }} />
                            <Typography variant="body1" sx={{ fontWeight: 800, color: "#18181b" }}>{pm.label}</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>{pm.desc}</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button variant="outlined" onClick={handleBack} sx={{ borderRadius: "12px", textTransform: "none" }}>
                Back
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleNext}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 4 }}
              >
                Review & Confirm
              </Button>
            </Box>
          </Stack>
        );
      default:
        // Step 3: Review Order and Pay
        return (
          <Stack spacing={4}>
            <Box sx={{ borderBottom: "2px solid #f4f4f5", pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b" }}>
                Review Order & Place
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
                Verify your order details below and complete payment.
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: "16px", borderColor: "rgba(0,0,0,0.08)" }}>
              <Stack spacing={2.5} divider={<Divider />}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#71717a", mb: 1, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Customer Details
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {watch("firstName")} {watch("lastName")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Phone: {watch("phoneNumber")}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#71717a", mb: 1, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Delivery Location
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {watch("address")}, {watch("city")}
                  </Typography>
                  {watch("pinnedLocation") && (
                    <Chip 
                      icon={<LocationOnIcon sx={{ fontSize: "1rem !important" }} />}
                      label={`Pinned Location: ${watch("pinnedLocation")}`}
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1, borderRadius: "6px", fontWeight: 600 }}
                    />
                  )}
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#71717a", mb: 1, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Selected Payment Method
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color="success" sx={{ fontSize: "1.15rem" }} />
                    <Typography variant="body1" sx={{ fontWeight: 700, textTransform: "capitalize" }}>
                      {watch("payment_method")}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {companyDataLoading ? (
              <Typography>Loading shop parameters...</Typography>
            ) : companyData ? (
              <Box>
                {watch("payment_method") === "mpesa" && (
                  <Paper sx={{ p: 2.5, borderRadius: "12px", borderLeft: "4px solid #4caf50", backgroundColor: "#f8fdf8" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#2e7d32" }}>
                      M-Pesa payment STK push will be sent automatically to {watch("phoneNumber")} once you click below.
                    </Typography>
                  </Paper>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="error">Could not retrieve shop checkout parameters.</Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button variant="outlined" onClick={handleBack} sx={{ borderRadius: "12px", textTransform: "none" }}>
                Back to Payment
              </Button>
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={isLoading || isProcessingMpesa}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  px: 4,
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {(isLoading || isProcessingMpesa) ? <CircularProgress size={24} color="inherit" /> : "Place Order & Pay"}
              </Button>
            </Box>
          </Stack>
        );
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

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", pt: 1, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#18181b" }}>Total</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                Kes {totalAmount}
              </Typography>
            </Box>
          </Stack>
        </SummarySideCard>
      </Box>

      {/* M-Pesa Payment Modal */}
      <Dialog open={showMpesaModal} onClose={() => setShowMpesaModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Complete M-Pesa Payment
          <IconButton
            aria-label="close"
            onClick={() => setShowMpesaModal(false)}
            sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress sx={{ mb: 3 }} size={50} />
          <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
            Please check your phone for an M-Pesa STK Push notification.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ maxW: "80%", mx: "auto", mb: 3 }}>
            Complete the payment prompt by entering your M-Pesa PIN on your phone to finalize your order.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setShowMpesaModal(false);
              setIsMpesaPaymentInitiated(false);
              setMpesaOrderId(null);
              router.push(`/shop/${shopname}`);
            }}
            sx={{ borderRadius: "12px", px: 3, textTransform: "none" }}
          >
            Cancel & Return to Shop
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

// --- Guest Checkout --- //
const guestCheckoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  payment_method: z.string().min(2, "Payment method is required"),
  pinnedLocation: z.string().optional(),
});

type GuestCheckoutFormData = z.infer<typeof guestCheckoutSchema>;

const GuestCheckout = () => {
  const theme = useTheme();
  const router = useRouter();
  const { sessionId, refetch, data: cart_data } = useCart();
  const [placeOrderGuest, { isLoading }] = usePlaceOrderGuestMutation();
  const [lipaNaMpesaFx] = useLipaNaMpesaMutation();
  const [orderResponse, setOrderResponse] = useState<GuestOrderResponse | null>(null);
  const [shopname] = useState(Cookies.get("shopname") || "techend");

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Your Details', 'Delivery Address', 'Payment Method', 'Review & Pay'];

  // M-Pesa states
  const [isMpesaPaymentInitiated, setIsMpesaPaymentInitiated] = useState(false);
  const [mpesaOrderId, setMpesaOrderId] = useState<string | null>(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const pollCountRef = useRef(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);

  // Success screen states
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<any>(null);
  const [lastCartData, setLastCartData] = useState<any>(null);

  const handleNext = React.useCallback(() => setActiveStep((prev) => prev + 1), []);
  const handleBack = React.useCallback(() => setActiveStep((prev) => prev - 1), []);

  const { data: companyData, isLoading: companyDataLoading } = useGetCompanyBySlugQuery(shopname);

  const { register, handleSubmit, formState: { errors }, setValue, trigger, watch, control, setError, clearErrors } = useForm<GuestCheckoutFormData>({
    resolver: zodResolver(guestCheckoutSchema),
    defaultValues: { payment_method: "mpesa", pinnedLocation: "" },
  });

  const { data: mpesaOrderDetails, refetch: refetchMpesaOrder } = useGetOrderByIdQuery(
    { order_id: mpesaOrderId!, token: "" },
    { skip: !isMpesaPaymentInitiated || !mpesaOrderId }
  );

  useEffect(() => {
    if (mpesaOrderDetails?.payment_status === "Paid") {
      toast.success("M-Pesa Payment Confirmed!");
      setShowMpesaModal(false);
      setIsMpesaPaymentInitiated(false);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setMpesaOrderId(null);
    }
  }, [mpesaOrderDetails]);

  useEffect(() => {
    if (isMpesaPaymentInitiated && mpesaOrderId) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      pollCountRef.current = 0;
      pollIntervalRef.current = setInterval(() => {
        if (pollCountRef.current >= 5) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          toast.error("M-Pesa payment timed out. Please try again.");
          setShowMpesaModal(false);
          setIsMpesaPaymentInitiated(false);
          setMpesaOrderId(null);
          return;
        }
        refetchMpesaOrder();
        pollCountRef.current += 1;
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
      }
    };
  }, [isMpesaPaymentInitiated, mpesaOrderId, refetchMpesaOrder]);

  const totalAmount = useMemo(() => {
    if (!cart_data) return 0;
    let itemsSubtotal = 0;
    cart_data.items.forEach((item: any) => {
      itemsSubtotal += item.product.on_sale
        ? parseFloat(item.product.discounted_price) * parseInt(item.quantity)
        : parseFloat(item.product.price) * parseInt(item.quantity);
    });
    return itemsSubtotal;
  }, [cart_data]);

  const onSubmit = async (formData: GuestCheckoutFormData) => {
    if (!sessionId) {
      toast.error("Your session has expired. Please refresh the page.");
      return;
    }

    try {
      const formattedPhoneNumber = formatPhoneNumber(formData.phoneNumber);
      const combinedAddress = formData.address + (formData.pinnedLocation ? ` [Map: ${formData.pinnedLocation}]` : "");
      
      setLastSubmittedFormData(formData);
      setLastCartData(cart_data);

      const response = await placeOrderGuest({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formattedPhoneNumber,
        address: combinedAddress,
        city: formData.city,
        state: "Kenya",
        country: "Kenya",
        postal_code: "00100",
        payment_method: formData.payment_method,
        sessionId,
        company_name: shopname,
      }).unwrap();

      setOrderResponse(response);
      toast.success("Guest order placed successfully!");
      localStorage.removeItem("session_id");
      refetch();

      if (formData.payment_method === "mpesa") {
        setIsProcessingMpesa(true);
        setMpesaOrderId(response.order_id);
        await lipaNaMpesaFx({ order_id: response.order_id, token: "", session_id: sessionId }).unwrap();
        setIsProcessingMpesa(false);
        setIsMpesaPaymentInitiated(true);
        setShowMpesaModal(true);
        toast.success("STK Push sent to your phone. Please complete the payment.");
      }
    } catch (error: any) {
      setIsProcessingMpesa(false);
      if (error.data?.error === "Email already exists") {
        toast.error("An account with this email already exists. Please log in.");
        router.push("/login");
      } else {
        toast.error(error.data?.error || "An unexpected error occurred.");
      }
    }
  };

  if (orderResponse && !isMpesaPaymentInitiated) {
    return (
      <OrderSuccessScreen 
        orderId={orderResponse.order_id}
        guestEmail={orderResponse.user_email || lastSubmittedFormData?.email}
        guestPassword={orderResponse.generated_password}
        cartData={lastCartData}
        formData={lastSubmittedFormData}
        shopname={shopname}
        paymentStatus={mpesaOrderDetails?.payment_status}
      />
    );
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Box sx={{ borderBottom: "2px solid #f4f4f5", pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b" }}>
                Your Contact Details
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
                Enter your details to create a guest order and automatic account.
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              type="email"
              InputProps={{ sx: { borderRadius: "12px" } }}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                InputProps={{ sx: { borderRadius: "12px" } }}
              />
            </Box>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              InputProps={{ sx: { borderRadius: "12px" } }}
              placeholder="e.g. 0712345678"
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={async () => {
                  const isValid = await trigger(["email", "firstName", "lastName", "phoneNumber"]);
                  if (isValid) handleNext();
                }}
              >
                Next Step
              </Button>
            </Box>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            <Box sx={{ borderBottom: "2px solid #f4f4f5", pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b" }}>
                Delivery Address
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
                Enter the physical address where you'd like your items delivered, and drop a pin on the map.
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Street / Apartment / Delivery Address"
              variant="outlined"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
              InputProps={{ sx: { borderRadius: "12px" } }}
              placeholder="e.g. Apartment 4B, Kilimani Road"
            />

            <TextField
              fullWidth
              label="City"
              variant="outlined"
              {...register("city")}
              error={!!errors.city}
              helperText={errors.city?.message}
              InputProps={{ sx: { borderRadius: "12px" } }}
              placeholder="e.g. Nairobi"
            />

            <Controller
              name="pinnedLocation"
              control={control}
              render={({ field }) => (
                <MapPinWidget value={field.value || ""} onChange={field.onChange} />
              )}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button variant="outlined" onClick={handleBack} sx={{ borderRadius: "12px", textTransform: "none" }}>
                Back
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => {
                  const addressVal = watch("address");
                  const cityVal = watch("city");
                  let hasError = false;
                  
                  if (!addressVal || addressVal.trim().length < 5) {
                    setError("address", { type: "manual", message: "Delivery address must be at least 5 characters" });
                    hasError = true;
                  } else {
                    clearErrors("address");
                  }
                  
                  if (!cityVal || cityVal.trim().length < 2) {
                    setError("city", { type: "manual", message: "City is required" });
                    hasError = true;
                  } else {
                    clearErrors("city");
                  }

                  if (!hasError) handleNext();
                }}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 4 }}
              >
                Next Step
              </Button>
            </Box>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <Box sx={{ borderBottom: "2px solid #f4f4f5", pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b" }}>
                Select Payment Method
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
                Choose how you would like to settle this order securely.
              </Typography>
            </Box>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                row
                name="guest_payment_method"
                value={watch("payment_method")}
                onChange={(e) => setValue("payment_method", e.target.value)}
              >
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2, width: "100%" }}>
                  {[
                    { value: "mpesa", label: "M-Pesa STK Push", desc: "Pay instantly via your Safaricom SIM card push notifications", icon: PhoneIphoneIcon },
                    { value: "card", label: "Debit or Credit Card", desc: "Visa, Mastercard, or American Express cards", icon: CreditCardIcon },
                    { value: "paypal", label: "PayPal Express", desc: "Pay with your secure PayPal wallet balance or bank link", icon: AccountBalanceWalletIcon },
                  ].map((pm) => {
                    const isSelected = watch("payment_method") === pm.value;
                    return (
                      <Box
                        key={pm.value}
                        onClick={() => setValue("payment_method", pm.value)}
                        sx={{
                          border: "2px solid",
                          borderColor: isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.08)",
                          borderRadius: "16px",
                          p: 2.5,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.03) : "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": { borderColor: theme.palette.primary.main },
                        }}
                      >
                        <Radio checked={isSelected} sx={{ p: 0.5 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <pm.icon sx={{ fontSize: "1.3rem", color: isSelected ? theme.palette.primary.main : "text.secondary" }} />
                            <Typography variant="body1" sx={{ fontWeight: 800, color: "#18181b" }}>{pm.label}</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>{pm.desc}</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button variant="outlined" onClick={handleBack} sx={{ borderRadius: "12px", textTransform: "none" }}>
                Back
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleNext}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 4 }}
              >
                Review & Confirm
              </Button>
            </Box>
          </Stack>
        );
      default:
        // Step 3: Review Order and Pay (Guest)
        return (
          <Stack spacing={4}>
            <Box sx={{ borderBottom: "2px solid #f4f4f5", pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#18181b" }}>
                Review Order & Place
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.5 }}>
                Verify your order details below and complete payment.
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: "16px", borderColor: "rgba(0,0,0,0.08)" }}>
              <Stack spacing={2.5} divider={<Divider />}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#71717a", mb: 1, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Customer Details
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {watch("firstName")} {watch("lastName")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Email: {watch("email")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Phone: {watch("phoneNumber")}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#71717a", mb: 1, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Delivery Location
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {watch("address")}, {watch("city")}
                  </Typography>
                  {watch("pinnedLocation") && (
                    <Chip 
                      icon={<LocationOnIcon sx={{ fontSize: "1rem !important" }} />}
                      label={`Pinned Location: ${watch("pinnedLocation")}`}
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1, borderRadius: "6px", fontWeight: 600 }}
                    />
                  )}
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#71717a", mb: 1, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Selected Payment Method
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color="success" sx={{ fontSize: "1.15rem" }} />
                    <Typography variant="body1" sx={{ fontWeight: 700, textTransform: "capitalize" }}>
                      {watch("payment_method")}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {companyDataLoading ? (
              <Typography>Loading shop parameters...</Typography>
            ) : companyData ? (
              <Box>
                {watch("payment_method") === "mpesa" && (
                  <Paper sx={{ p: 2.5, borderRadius: "12px", borderLeft: "4px solid #4caf50", backgroundColor: "#f8fdf8" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#2e7d32" }}>
                      M-Pesa payment STK push will be sent automatically to {watch("phoneNumber")} once you click below.
                    </Typography>
                  </Paper>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="error">Could not retrieve shop checkout parameters.</Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button variant="outlined" onClick={handleBack} sx={{ borderRadius: "12px", textTransform: "none" }}>
                Back to Payment
              </Button>
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={isLoading || isProcessingMpesa}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  px: 4,
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {(isLoading || isProcessingMpesa) ? <CircularProgress size={24} color="inherit" /> : "Place Order & Pay"}
              </Button>
            </Box>
          </Stack>
        );
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


            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", pt: 1, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#18181b" }}>Total</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                Kes {totalAmount}
              </Typography>
            </Box>
          </Stack>
        </SummarySideCard>
      </Box>

      {/* M-Pesa Payment Modal */}
      <Dialog open={showMpesaModal} onClose={() => setShowMpesaModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Complete M-Pesa Payment
          <IconButton
            aria-label="close"
            onClick={() => setShowMpesaModal(false)}
            sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress sx={{ mb: 3 }} size={50} />
          <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
            Please check your phone for an M-Pesa STK Push notification.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ maxW: "80%", mx: "auto", mb: 3 }}>
            Complete the payment prompt by entering your M-Pesa PIN on your phone to finalize your order.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setShowMpesaModal(false);
              setIsMpesaPaymentInitiated(false);
              setMpesaOrderId(null);
              router.push(`/shop/${shopname}`);
            }}
            sx={{ borderRadius: "12px", px: 3, textTransform: "none" }}
          >
            Cancel & Return to Shop
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

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
