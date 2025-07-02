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
} from "@mui/material";
import { format } from "date-fns";
// https://res.cloudinary.com/dqokryv6u
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
    cart?: {
      created_at?: string;
      status?:any;
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

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch {
      return dateString;
    }
  };

  const HistoryItem = ({ item }) => {
    const cartItems = item.cart?.items || [];
    console.log(cartItems, "*&*^")
    const totalProducts = cartItems.reduce(
      (acc:any, curr:any) => acc + curr.quantity,
      0
    );

    return (
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          p: 2,
        }}
      >
        <CardContent>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Order #{item.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Placed on: {formatDate(item.cart?.created_at)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Products: {totalProducts}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography>
                <strong>Total:</strong> Ksh {item.total_amount}
              </Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      item.payment_status === "Paid" ? "green" : "#BE1E2D",
                    fontWeight: "bold",
                  }}
                >
                  {item.payment_status}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Button
                variant="contained"
                sx={{
                  background: "#BE1E2D",
                  ":hover": { background: "#A31B26" },
                }}
                onClick={() => setSelectedCheckout(item)}
              >
                View Details
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Shipping to: {item.address}, {item.city}, {item.country}
          </Typography>
        </CardContent>
      </Card>
    );
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
            <HistoryItem key={item.id} item={item} />
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
                <ProductImage src={`https://res.cloudinary.com/dqokryv6u/${item.product.main_image}`} />
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
    </>
  );
}

export default OrderHistory;
