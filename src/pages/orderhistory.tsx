import Navbar from "@/Components/Navbar";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useGetCheckoutHistoryQuery } from "@/Api/services";
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
      items: {
        product: {
          title: string;
          price: number;
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
    const totalProducts = cartItems.reduce(
      (acc, curr) => acc + curr.quantity,
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
      <Navbar textColor={"#000"} bgColor={"#fff"} />
      <Box sx={{ maxWidth: "800px", width: "95%", margin: "auto", mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
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
        <DialogTitle>Order #{selectedCheckout?.id} Details</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Shipping Address:
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {selectedCheckout?.address}, {selectedCheckout?.city},{" "}
            {selectedCheckout?.state}, {selectedCheckout?.postal_code},{" "}
            {selectedCheckout?.country}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Products:
          </Typography>
          <Table size="small">
            <TableBody>
              {selectedCheckout?.cart?.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product.title}</TableCell>
                  <TableCell>Qty: {item.quantity}</TableCell>
                  <TableCell>Price: Ksh {item.product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          <Typography>
            <strong>Total:</strong> Ksh {selectedCheckout?.total_amount}
          </Typography>
          <Typography>
            <strong>Payment Method:</strong> {selectedCheckout?.payment_method}
          </Typography>
          <Typography>
            <strong>Payment Status:</strong> {selectedCheckout?.payment_status}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCheckout(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default OrderHistory;
