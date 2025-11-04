import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useGetCheckoutHistoryQuery, useUpdatePaymentStatusMutation, useGetCompanyBySlugQuery } from "@/Api/services";
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

  useEffect(() => {
    if (checkoutHistory && orderId) {
      const foundOrder = checkoutHistory.find((item: CheckoutResponse) => item.id === Number(orderId));
      setOrder(foundOrder || null);
    }
  }, [checkoutHistory, orderId]);

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
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": { backgroundColor: theme.palette.primary.dark },
                    }}
                    onClick={handleConfirmPayment}
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
    </>
  );
}

export default OrderDetailsPage;
