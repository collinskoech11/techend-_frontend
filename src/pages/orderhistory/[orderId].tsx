import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useGetCheckoutHistoryQuery, useUpdatePaymentStatusMutation, useGetCompanyBySlugQuery, useLipaNaMpesaMutation, useGetOrderByIdQuery } from "@/Api/services";
import { CheckoutResponse, PickupLocation } from "@/Types";
import toast, { Toaster } from "react-hot-toast";
import OrderDetailsCard from "@/Components/OrderDetailsCard";

function OrderDetailsPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const theme = useTheme();
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");

  const { data: checkoutHistory, isLoading: historyLoading, refetch } = useGetCheckoutHistoryQuery({
    token: Cookies.get("access"),
  });

  const [order, setOrder] = useState<CheckoutResponse | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<PickupLocation | null>(null);

  const [updatePaymentStatus, { isLoading: isUpdating }] = useUpdatePaymentStatusMutation();
  const { data: companyData, isLoading: companyDataLoading } = useGetCompanyBySlugQuery(shopname);

  // M-Pesa specific states
  const [isMpesaPaymentInitiated, setIsMpesaPaymentInitiated] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [lipaNaMpesaFx] = useLipaNaMpesaMutation();
  const { data: mpesaOrderDetails, refetch: refetchMpesaOrder } = useGetOrderByIdQuery(
    { order_id: orderId as string, token: Cookies.get("access") || "" },
    { skip: !isMpesaPaymentInitiated || !orderId }
  );

  useEffect(() => {
    if (checkoutHistory && orderId) {
      const foundOrder = checkoutHistory.find((item: CheckoutResponse) => item.id === Number(orderId));
      setOrder(foundOrder || null);
    }
  }, [checkoutHistory, orderId]);

  useEffect(() => {
    if (mpesaOrderDetails?.payment_status === "Paid") {
      toast.success("M-Pesa Payment Confirmed!");
      setIsMpesaPaymentInitiated(false);
      setShowMpesaModal(false);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      refetch(); // Refetch the main order history to update the order status on the page
    }
  }, [mpesaOrderDetails, refetch]);

  useEffect(() => {
    if (isMpesaPaymentInitiated && orderId) {
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
            setIsMpesaPaymentInitiated(false);
            setShowMpesaModal(false);
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
  }, [isMpesaPaymentInitiated, orderId, refetchMpesaOrder, router, shopname]);

  const handleViewMap = (location: PickupLocation) => {
    setSelectedLocationForMap(location);
    setMapOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!order) return;

    try {
      await updatePaymentStatus({ token: Cookies.get("access"), pk: order.id }).unwrap();
      toast.success("Payment confirmed successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to confirm payment. Please try again.");
    }
  };

  const handlePayWithMpesa = async () => {
    if (!order || !Cookies.get("access")) return;

    try {
      setIsMpesaPaymentInitiated(true);
      setShowMpesaModal(true);
      await lipaNaMpesaFx({ order_id: order.id.toString(), token: Cookies.get("access") || "" }).unwrap();
      toast.success("STK Push sent to your phone. Please complete the payment.");
    } catch (error: any) {
      toast.error(error.data?.detail || "Failed to initiate M-Pesa payment.");
      setIsMpesaPaymentInitiated(false);
      setShowMpesaModal(false);
    }
  };

  if (historyLoading) {
    return <Typography>Loading order details...</Typography>;
  }

  if (!order) {
    return <Typography>Order not found or invalid ID.</Typography>;
  }

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Confirm Payment for Order #{order.id}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <OrderDetailsCard
              item={{
                ...order,
                cart: {
                  ...order.cart,
                  items: order.cart.items.map((item: any) => ({
                    ...item,
                    product: {
                      title: item.product.title ?? "",
                      price: item.product.price ?? 0,
                      main_image: item.product.main_image ?? "",
                      ...item.product,
                    },
                  })),
                },
              }}
              onViewMap={handleViewMap}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: theme.palette.primary.main }}>
              Payment Confirmation
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>Your Total: Kes {order.total_amount}</Typography>
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

              <Box sx={{ mt: 3 }}>
                {order.payment_status === "Paid" ? (
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled
                  >
                    Payment Confirmed
                  </Button>
                ) : order.payment_method === "mpesa" && order.payment_status === "Pending" ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": { backgroundColor: theme.palette.primary.dark },
                    }}
                    onClick={handlePayWithMpesa}
                    disabled={isMpesaPaymentInitiated}
                    fullWidth
                  >
                    {isMpesaPaymentInitiated ? "Waiting for Payment..." : "Pay with M-Pesa"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": { backgroundColor: theme.palette.primary.dark },
                    }}
                    onClick={handleConfirmPayment} // Keep existing for other pending methods
                    disabled={isUpdating}
                    fullWidth
                  >
                    {isUpdating ? "Confirming..." : "Confirm Payment"}
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Map Preview Dialog */}
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
              title="Pickup Location Map"
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
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              router.push(`/shop/${shopname}`); // Redirect if user cancels
            }}
            sx={{ mt: 3 }}
          >
            Cancel Payment
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OrderDetailsPage;