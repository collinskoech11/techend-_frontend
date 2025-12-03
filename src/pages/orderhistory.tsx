import Navbar from "@/Components/Navbar";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { ProductImage } from "@/StyledComponents/Products";
import { useGetCheckoutHistoryQuery } from "@/Api/services";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import OrderDetailsCard from "@/Components/OrderDetailsCard";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import { DeliveryLocation, PickupLocation } from "@/Types";

function OrderHistory() {
  const {
    data: checkout_data,
    isLoading: checkout_loading,
  } = useGetCheckoutHistoryQuery({ token: Cookies.get("access") });

  // Define the type for a checkout item (adjust fields as needed)
  type CheckoutItem = {
    id: number;
    address: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
    total_amount: number;
    payment_method?: string;
    payment_status: string;
    delivery_fee: string;
    pickup_location?: PickupLocation | null;
    delivery_location?: DeliveryLocation | null;
    cart?: {
      created_at?: string;
      status?: any;
      items: {
        product: {
          title: string;
          price: number;
          main_image: string;
        };
        quantity: number;
      }[];
    };
  };

  const [selectedCheckout, setSelectedCheckout] = useState<CheckoutItem | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<PickupLocation | null>(null);

  const handleViewMap = (location: PickupLocation) => {
    setSelectedLocationForMap(location);
    setMapOpen(true);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch {
      return dateString;
    }
  };

  const SkeletonItem = () => (
    <Box
      sx={{
        mb: 2,
        borderRadius: 3,
        p: 2,
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        backgroundColor: "#fff",
      }}
    >
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" width="100%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="30%" height={36} />
    </Box>
  );

  return (
    <>
      {/* <Navbar textColor={"#000"} bgColor={"#fff"} /> */}
      <Box sx={{ maxWidth: "800px", width: "95%", margin: "auto", mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color:"#BE1E2D" }}>
          My Order History
        </Typography>

        {checkout_loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonItem key={index} />
          ))
        ) : checkout_data?.length > 0 ? (
          checkout_data.map((item) => (
            <OrderDetailsCard key={item.id} item={item} onViewMap={handleViewMap} />
          ))
        ) : (
          <Typography>No orders found.</Typography>
        )}
      </Box>

      {/* Dialog for View Details */}
<Dialog
  open={Boolean(selectedCheckout)}
  onClose={() => setSelectedCheckout(null)}
  maxWidth="sm"
  fullWidth
  disablePortal
  keepMounted
>
  <DialogTitle sx={{ fontWeight: "bold" }}>Order #{selectedCheckout?.id} Details</DialogTitle>
  
  <DialogContent dividers>

    {/* Payment Status Timeline */}
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
      Payment Status:
    </Typography>
    <Timeline position="left" sx={{ p: 0, mb: 2}}>
      <TimelineItem sx={{ textAlign: "left" }}>
        <TimelineSeparator sx={{ textAlign: "left"}}>
          <TimelineDot color={selectedCheckout?.payment_status === "Paid" ? "success" : "error"} />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          {selectedCheckout?.payment_status === "Paid" ? "Payment Completed" : "Payment Pending"}
        </TimelineContent>
      </TimelineItem>
    </Timeline>

    {/* Delivery Status Timeline */}
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
      Delivery Status:
    </Typography>
    <Timeline position="left" sx={{ p: 0, mb: 2 }}>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Order Placed</TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={selectedCheckout?.cart?.status >= 1 ? "primary" : "grey"} />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>In Progress</TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={selectedCheckout?.cart?.status === 2 ? "success" : "grey"} />
        </TimelineSeparator>
        <TimelineContent>Delivered</TimelineContent>
      </TimelineItem>
    </Timeline>

    {/* Shipping Address */}
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
      Shipping Address:
    </Typography>
    <Typography sx={{ mb: 2 }}>
      {selectedCheckout?.address}, {selectedCheckout?.city},{" "}
      {selectedCheckout?.state}, {selectedCheckout?.postal_code},{" "}
      {selectedCheckout?.country}
    </Typography>

    {/* Products Table */}
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
      Products:
    </Typography>
    <Table size="small">
      <TableBody>
        {selectedCheckout?.cart?.items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.product.title}</TableCell>
            <TableCell>
              <Box sx={{ width: "50px", height: "50px", display: "flex", alignItems: "center", overflow: "hidden" }}>
                <ProductImage src={`https://res.cloudinary.com/dqokryv6u/${item.product.main_image}`} alt={item.product.title} width={50} height={50}/>
              </Box>
            </TableCell>
            <TableCell>Qty: {item.quantity}</TableCell>
            <TableCell>Ksh {item.product.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Divider sx={{ my: 2 }} />

    {/* Payment Summary */}
    <Typography sx={{ mb: 1 }}>
      <strong>Total:</strong> Ksh {selectedCheckout?.total_amount}
    </Typography>
    <Typography sx={{ mb: 1 }}>
      <strong>Payment Method:</strong> {selectedCheckout?.payment_method}
    </Typography>
    <Typography>
      <strong>Payment Status:</strong>{" "}
      <span style={{ color: selectedCheckout?.payment_status === "Paid" ? "green" : "#BE1E2D", fontWeight: "bold" }}>
        {selectedCheckout?.payment_status}
      </span>
    </Typography>

  </DialogContent>
  <DialogActions>
    <Button onClick={() => setSelectedCheckout(null)} variant="outlined">
      Close
    </Button>
  </DialogActions>
</Dialog>

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

export default OrderHistory;