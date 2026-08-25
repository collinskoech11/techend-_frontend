import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  alpha,
  useTheme,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface OrderDetailsCardProps {
  item: {
    id: number;
    total_amount: string;
    payment_status: string;
    cart?: {
      created_at?: string;
      status?: any;
      items: any[];
    };
  };
  onViewDetails: (item: any) => void;
  isActive: boolean;
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({ item, onViewDetails, isActive }) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = item.cart?.items || [];
  const totalProducts = cartItems.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0);

  const formatDate = (dateString: string | undefined) => {
    if (!mounted) return "";
    try {
      return dateString ? format(new Date(dateString), "dd MMM yyyy, HH:mm") : "N/A";
    } catch {
      return dateString || "N/A";
    }
  };

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

  const shipStatus = getShippingChipStyle(item.cart?.status);
  const paymentStyle = getPaymentChipStyle(item.payment_status);

  return (
    <Card
      onClick={() => onViewDetails(item)}
      sx={{
        mb: 2,
        borderRadius: "20px",
        boxShadow: isActive
          ? `0 12px 32px ${alpha(theme.palette.primary.main, 0.08)}`
          : "0 6px 20px rgba(0, 0, 0, 0.02)",
        border: `1.5px solid ${isActive ? theme.palette.primary.main : alpha(theme.palette.divider, 0.08)}`,
        cursor: "pointer",
        overflow: "hidden",
        backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.01) : "#ffffff",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.06)}`,
          borderColor: isActive ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              <Chip
                label={`Order #${item.id}`}
                size="small"
                sx={{
                  fontWeight: 800,
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  backgroundColor: "#f4f4f5",
                  color: "#18181b",
                }}
              />
              <Chip
                label={item.payment_status}
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  ...paymentStyle,
                }}
              />
              <Chip
                label={shipStatus.label}
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  ...shipStatus.style,
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "#71717a", fontWeight: 500, mb: 0.5 }}>
              Placed on {formatDate(item.cart?.created_at)}
            </Typography>
            {item.company_name && (
              <Typography variant="caption" display="block" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 0.5, mt: -0.2 }}>
                Store: {item.company_name}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "#27272a", fontWeight: 700 }}>
              {totalProducts} {totalProducts === 1 ? "item" : "items"} &bull; Kes {Number(item.total_amount).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
            <Button
              variant={isActive ? "contained" : "text"}
              size="small"
              endIcon={<KeyboardArrowRightIcon />}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                px: 2,
              }}
            >
              Details
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;
