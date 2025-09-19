import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { format } from "date-fns";
import { useGetCheckoutHistoryQuery } from "@/Api/services";
import { CheckoutResponse, PickupLocation, DeliveryLocation } from "@/Types";
import { ProductImage } from "@/StyledComponents/Products";

function OrderDetailsPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Order Summary', 'Shipping Details', 'Payment Information'];

  const { data: checkoutHistory, isLoading: historyLoading } = useGetCheckoutHistoryQuery({
    token: Cookies.get("access"),
  });

  const [order, setOrder] = useState<CheckoutResponse | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<PickupLocation | null>(null);

  useEffect(() => {
    if (checkoutHistory && orderId) {
      const foundOrder = checkoutHistory.find((item: CheckoutResponse) => item.id === Number(orderId));
      setOrder(foundOrder || null);
    }
  }, [checkoutHistory, orderId]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleViewMap = (location: PickupLocation) => {
    setSelectedLocationForMap(location);
    setMapOpen(true);
  };

  const formatDate = (dateString: string | undefined) => {
    try {
      return dateString ? format(new Date(dateString), "dd MMM yyyy, HH:mm") : "N/A";
    } catch {
      return dateString || "N/A";
    }
  };

  const getStepContent = (step: number) => {
    if (!order) return <Typography>Order not found.</Typography>;

    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
              Order Summary
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Order ID: <b>#{order.id}</b>
                </Typography>
                <Typography variant="body1">
                  Placed on: <b>{formatDate(order.cart?.created_at)}</b>
                </Typography>
                <Typography variant="body1">
                  Subtotal: <b>Kes {order.total_amount}</b>
                </Typography>
                <Typography variant="body1">Shipping: <b>Kes {order.delivery_fee}</b></Typography>
                <Typography variant="h6" sx={{ mt: 1, color: "#BE1E2D" }}>
                  Total: Kes {parseFloat(order.total_amount) + parseFloat(order.delivery_fee)}
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
                Products:
              </Typography>
              <Table size="small">
                <TableBody>
                  {order.cart?.items.map((cartItem, index) => (
                    <TableRow key={index}>
                      <TableCell>{cartItem.product.name}</TableCell>
                      <TableCell>
                        <Box sx={{ width: "50px", height: "50px", display: "flex", alignItems: "center", overflow: "hidden" }}>
                          <ProductImage src={`https://res.cloudinary.com/dqokryv6u/${cartItem.product.main_image}`} alt={cartItem.product.name} width={50} height={50}/>
                        </Box>
                      </TableCell>
                      <TableCell>Qty: {cartItem.quantity}</TableCell>
                      <TableCell>Kes {cartItem.product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h6" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
              Shipping Details
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              {order.pickup_location ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">Pickup Location: {order.pickup_location.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.pickup_location.address}, {order.pickup_location.city}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Delivery Fee: Kes {order.pickup_location.delivery_fee}
                    </Typography>
                  </Box>
                  {order.pickup_location.gmaps_link && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LocationOnIcon />}
                      onClick={() => order.pickup_location && handleViewMap(order.pickup_location)}
                    >
                      View on Map
                    </Button>
                  )}
                </Box>
              ) : order.delivery_location ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold">Delivery Location: {order.delivery_location.location_name} - {order.delivery_location.route}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Delivery Fee: Kes {order.delivery_location.delivery_fee}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" fontWeight="bold">Shipping Address:</Typography>
                  <Typography sx={{ mb: 2 }}>
                    {order.address}, {order.city},{" "}
                    {order.state}, {order.postal_code},{" "}
                    {order.country}
                  </Typography>
                </Box>
              )}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
              Payment Information
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="body1">
                Payment Method: <b>{order.payment_method || "N/A"}</b>
              </Typography>
              <Typography variant="body1">
                Payment Status: <b>{order.payment_status}</b>
              </Typography>
              {/* Add more payment details if available in CheckoutResponse */}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button
                variant="contained"
                onClick={() => router.push(`/shop/${order.company}`)}
              >
                Back to Shop
              </Button>
            </Box>
          </>
        );
      default:
        return 'Unknown step';
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
          Order Details for #{order.id}
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7} key="order-details-content">
            {getStepContent(activeStep)}
          </Grid>

          {/* Order Summary (always visible) - Simplified for display */}
          <Grid item xs={12} md={5} key="order-overview">
            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "#be1f2f" }}>
              Order Overview
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="body1">
                Total Amount: <b>Kes {order.total_amount}</b>
              </Typography>
              <Typography variant="body1">Shipping Cost: <b>Kes {order.delivery_fee}</b></Typography>
              <Typography variant="body1">Payment Status: <b>{order.payment_status}</b></Typography>
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