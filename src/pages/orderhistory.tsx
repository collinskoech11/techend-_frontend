import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useGetCheckoutHistoryQuery, useRateProductMutation } from "@/Api/services";
import {
  Box,
  Button,
  Typography,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Container,
  alpha,
  useTheme,
  Stack,
  Paper,
  Divider,
  Rating,
  CircularProgress,
  Chip,
  Grid,
} from "@mui/material";
import OrderDetailsCard from "@/Components/OrderDetailsCard";
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ProductImage } from "@/StyledComponents/Products";
import { PickupLocation } from "@/Types";
import Link from "next/link";
import toast from "react-hot-toast";

const ProductRatingWidget: React.FC<{ productId: number; initialRating: number | null }> = ({
  productId,
  initialRating,
}) => {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [rateProduct, { isLoading }] = useRateProductMutation();
  const token = Cookies.get("access");

  const handleRatingChange = async (_: any, newValue: number | null) => {
    if (!newValue || !token) return;
    setRating(newValue);
    try {
      await rateProduct({ product_id: productId, rating: newValue, token }).unwrap();
      toast.success("Thank you for rating this product!");
    } catch (err: any) {
      toast.error(err?.data?.error || "Could not submit rating. Make sure you bought this product.");
      setRating(initialRating);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
      <Typography variant="caption" sx={{ color: "#71717a", fontWeight: 600 }}>
        {rating ? "Your rating:" : "Rate this item:"}
      </Typography>
      {isLoading ? (
        <CircularProgress size={14} thickness={5} />
      ) : (
        <Rating
          name={`rating-${productId}`}
          value={rating}
          onChange={handleRatingChange}
          size="small"
          disabled={!token}
          sx={{
            "& .MuiRating-iconFilled": {
              color: "#fbbf24",
            },
          }}
        />
      )}
    </Box>
  );
};

function OrderHistory() {
  const theme = useTheme();
  const router = useRouter();
  const token = Cookies.get("access");
  const [mounted, setMounted] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: checkout_data,
    isLoading: checkout_loading,
  } = useGetCheckoutHistoryQuery({ token: token || "" }, { skip: !token });

  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocationForMap, setSelectedLocationForMap] = useState<PickupLocation | null>(null);

  const handleViewMap = (location: PickupLocation) => {
    setSelectedLocationForMap(location);
    setMapOpen(true);
  };

  const ordersList = Array.isArray(checkout_data)
    ? checkout_data
    : (checkout_data?.results || []);

  // Sync selected order with refetched/updated data if matching ID is found
  useEffect(() => {
    if (selectedOrder && checkout_data) {
      const updated = ordersList.find((o: any) => o.id === selectedOrder.id);
      if (updated) {
        setSelectedOrder(updated);
      }
    }
  }, [checkout_data]);

  // Open the most recent order by default when the list loads
  useEffect(() => {
    if (ordersList.length > 0 && !selectedOrder) {
      setSelectedOrder(ordersList[0]);
    }
  }, [checkout_data, selectedOrder]);

  const SkeletonItem = () => (
    <Box
      sx={{
        mb: 2,
        borderRadius: "20px",
        p: 2.5,
        border: `1.5px solid ${alpha(theme.palette.divider, 0.08)}`,
        backgroundColor: "#ffffff",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Skeleton variant="rectangular" width={70} height={20} sx={{ borderRadius: "4px" }} />
        <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: "4px" }} />
      </Box>
      <Skeleton variant="text" width="50%" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="30%" />
    </Box>
  );

  const getPaymentChipStyle = (status: string) => {
    if (status.toLowerCase() === "paid") {
      return {
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        color: "#059669",
        border: "1px solid rgba(16, 185, 129, 0.2)",
      };
    }
    return {
      backgroundColor: "rgba(245, 158, 11, 0.08)",
      color: "#d97706",
      border: "1px solid rgba(245, 158, 11, 0.2)",
    };
  };

  const getShippingChipStyle = (statusVal?: number) => {
    if (statusVal === 2) {
      return {
        label: "Delivered",
        style: {
          backgroundColor: "rgba(16, 185, 129, 0.08)",
          color: "#059669",
          border: "1px solid rgba(16, 185, 129, 0.2)",
        }
      };
    }
    if (statusVal === 1) {
      return {
        label: "Shipping",
        style: {
          backgroundColor: "rgba(59, 130, 246, 0.08)",
          color: "#2563eb",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        }
      };
    }
    return {
      label: "Processing",
      style: {
        backgroundColor: "rgba(245, 158, 11, 0.08)",
        color: "#d97706",
        border: "1px solid rgba(245, 158, 11, 0.2)",
      }
    };
  };

  if (!mounted) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", p: 4 }}>
        <Container maxWidth="lg">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonItem key={index} />
          ))}
        </Container>
      </Box>
    );
  }

  // Auth Guard view
  if (!token) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", py: 10 }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 4,
              backgroundColor: "#ffffff",
              borderRadius: "32px",
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              boxShadow: "0 12px 32px rgba(0,0,0,0.02)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: "4rem", color: alpha(theme.palette.primary.main, 0.3), mb: 2.5 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#18181b", mb: 1.5 }}>
              Access Restrained
            </Typography>
            <Typography variant="body1" sx={{ color: "#71717a", mb: 4, lineHeight: 1.6 }}>
              You need to be logged in to view your order history. Access your account to manage and track your past checkouts.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/login?redirect=orderhistory")}
              sx={{
                borderRadius: "30px",
                px: 5,
                py: 1.5,
                fontSize: "0.95rem",
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: theme.palette.primary.main,
                color: "#ffffff",
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              Log In to Continue
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", pb: 12 }}>
      {/* Header Banner */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          py: { xs: 5, md: 6 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <HistoryToggleOffOutlinedIcon sx={{ fontSize: "2.5rem", color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#18181b", fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 0.5 }}>
                Order History
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", fontWeight: 500 }}>
                Manage, review, and track all your past order checkouts and purchases
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Split-Screen Container */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Master List - Collapses slightly if an order details panel is open */}
          <Grid item xs={12} md={selectedOrder ? 4.8 : 12} sx={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>
            {checkout_loading ? (
              <Stack spacing={1}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonItem key={index} />
                ))}
              </Stack>
            ) : ordersList && ordersList.length > 0 ? (
              <Stack spacing={0.5}>
                {ordersList.map((item: any) => (
                  <OrderDetailsCard
                    key={item.id}
                    item={item}
                    onViewDetails={(selectedItem) => {
                      // Toggle selected order
                      if (selectedOrder && selectedOrder.id === selectedItem.id) {
                        setSelectedOrder(null);
                      } else {
                        setSelectedOrder(selectedItem);
                      }
                    }}
                    isActive={selectedOrder ? selectedOrder.id === item.id : false}
                  />
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 10,
                  px: 3,
                  backgroundColor: "#ffffff",
                  borderRadius: "32px",
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: "4.5rem", color: alpha(theme.palette.primary.main, 0.35), mb: 2.5 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#18181b", mb: 1.5 }}>
                  No Orders Found
                </Typography>
                <Typography variant="body1" sx={{ color: "#71717a", mb: 4, lineHeight: 1.6 }}>
                  It looks like you haven't made any purchases yet. Start exploring our shops to discover products you love.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/shops")}
                  sx={{
                    borderRadius: "30px",
                    px: 5,
                    py: 1.5,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textTransform: "none",
                    backgroundColor: theme.palette.primary.main,
                    color: "#ffffff",
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  Start Shopping
                </Button>
              </Box>
            )}
          </Grid>

          {/* Right Details Panel - Dynamic Sticky Order Details */}
          {selectedOrder && (
            <Grid item xs={12} md={7.2}>
              <Paper
                sx={{
                  p: 3.5,
                  borderRadius: "24px",
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.04)",
                  position: "sticky",
                  top: 90,
                  backgroundColor: "#ffffff",
                  maxHeight: "calc(100vh - 120px)",
                  overflowY: "auto",
                }}
              >
                {/* Panel Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3.5 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#18181b", mb: 0.5 }}>
                      Order #{selectedOrder.id} Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#71717a", fontWeight: 500 }}>
                      Store: <b>{selectedOrder.company_name || "SokoJunction"}</b>
                    </Typography>
                  </Box>
                  <IconButton onClick={() => setSelectedOrder(null)} sx={{ color: "#71717a", backgroundColor: "#f4f4f5", "&:hover": { backgroundColor: "#e4e4e7" } }}>
                    <CloseIcon sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </Box>

                {/* Status Console */}
                <Box sx={{ display: "flex", gap: 1.5, mb: 3.5 }}>
                  <Chip
                    label={`Payment Status: ${selectedOrder.payment_status}`}
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: "8px", ...getPaymentChipStyle(selectedOrder.payment_status) }}
                  />
                  <Chip
                    label={`Shipping: ${getShippingChipStyle(selectedOrder.cart?.status).label}`}
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: "8px", ...getShippingChipStyle(selectedOrder.cart?.status).style }}
                  />
                </Box>

                {/* Items & Ratings Table */}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#18181b", mb: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Items Purchased ({selectedOrder.cart?.items?.length || 0})
                </Typography>
                <Stack spacing={2} sx={{ mb: 4 }}>
                  {(selectedOrder.cart?.items || []).map((cartItem: any, idx: number) => {
                    const prod = cartItem.product;
                    const imgUrl = prod.main_image
                      ? (prod.main_image.startsWith("http") ? prod.main_image : `https://res.cloudinary.com/dqokryv6u/${prod.main_image}`)
                      : "/assets/techendbanner.png";

                    return (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderRadius: "16px",
                          border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <Box sx={{ width: 60, height: 60, borderRadius: "12px", overflow: "hidden", position: "relative", flexShrink: 0, backgroundColor: "#f4f4f5" }}>
                          <ProductImage src={imgUrl} alt={prod.title} width={60} height={60} style={{ objectFit: "cover" }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          {prod.slug ? (
                            <Link href={`/product/${prod.slug}`} passHref>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#18181b",
                                  cursor: "pointer",
                                  "&:hover": { color: theme.palette.primary.main },
                                }}
                              >
                                {prod.title}
                              </Typography>
                            </Link>
                          ) : (
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#18181b" }}>
                              {prod.title}
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ color: "#71717a", fontSize: "0.82rem" }}>
                            Qty: {cartItem.quantity} &bull; Price: Kes {Number(prod.price).toLocaleString()}
                          </Typography>
                          {/* Rating Console */}
                          <ProductRatingWidget productId={prod.id} initialRating={cartItem.user_rating} />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>

                <Divider sx={{ my: 3.5, opacity: 0.5 }} />

                {/* Delivery and Payment breakdown */}
                <Grid container spacing={3} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <LocalShippingOutlinedIcon sx={{ color: theme.palette.primary.main, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#18181b" }}>
                          Delivery Method
                        </Typography>
                        {selectedOrder.pickup_location ? (
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#27272a" }}>
                              {selectedOrder.pickup_location.name} (Store Pickup)
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                              {selectedOrder.pickup_location.address}, {selectedOrder.pickup_location.city}
                            </Typography>
                            {selectedOrder.pickup_location.gmaps_link && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<LocationOnIcon />}
                                onClick={() => handleViewMap(selectedOrder.pickup_location as PickupLocation)}
                                sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem", py: 0.4 }}
                              >
                                View on Map
                              </Button>
                            )}
                          </Box>
                        ) : selectedOrder.delivery_location ? (
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#27272a" }}>
                              {selectedOrder.delivery_location.location_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Route: {selectedOrder.delivery_location.route}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state}, {selectedOrder.postal_code}, {selectedOrder.country}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <CreditCardOutlinedIcon sx={{ color: theme.palette.primary.main, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#18181b" }}>
                          Payment Breakdown
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                          Method: <b>{selectedOrder.payment_method || "Not Specified"}</b>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.2 }}>
                          Shipping Fee: Kes {Number(selectedOrder.delivery_fee || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 800, mt: 0.5 }}>
                          Total: Kes {Number(selectedOrder.total_amount).toLocaleString()}
                        </Typography>

                        {selectedOrder.payment_status.toLowerCase() !== "paid" && (
                          <Link href={`/orderhistory/${selectedOrder.id}`} passHref>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                mt: 2,
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: 700,
                              }}
                            >
                              Complete Payment
                            </Button>
                          </Link>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Map Dialog */}
      <Dialog
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "24px", overflow: "hidden" },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            Pickup Store Location
          </Typography>
          <IconButton onClick={() => setMapOpen(false)} sx={{ color: "#71717a" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: "450px" }}>
          {selectedLocationForMap && selectedLocationForMap.gmaps_link && (
            <iframe
              src={selectedLocationForMap.gmaps_link}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default OrderHistory;