import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { ProductImage } from "@/StyledComponents/Products";
import { format } from "date-fns";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { PickupLocation, DeliveryLocation } from "@/Types";

interface OrderDetailsCardProps {
  item: {
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
  onViewMap: (location: PickupLocation) => void;
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({ item, onViewMap }) => {
  const cartItems = item.cart?.items || [];
  const totalProducts = cartItems.reduce(
    (acc: any, curr: any) => acc + curr.quantity,
    0
  );

  const formatDate = (dateString: string | undefined) => {
    try {
      return dateString ? format(new Date(dateString), "dd MMM yyyy, HH:mm") : "N/A";
    } catch {
      return dateString || "N/A";
    }
  };

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
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Typography>
              <strong>Total:</strong> Kes {item.total_amount}
            </Typography>
            <Typography>
              <strong>Shipping Cost:</strong> Kes {item.delivery_fee}
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
        </Grid>
        <Divider sx={{ my: 2 }} />

        {/* Shipping/Pickup Location Details */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
          {item.pickup_location ? "Pickup Location:" : "Shipping Address:"}
        </Typography>
        {item.pickup_location ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight="bold">{item.pickup_location.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {item.pickup_location.address}, {item.pickup_location.city}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Delivery Fee: Kes {item.pickup_location.delivery_fee}
              </Typography>
            </Box>
            {item.pickup_location.gmaps_link && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<LocationOnIcon />}
                onClick={() => onViewMap(item.pickup_location as PickupLocation)}
              >
                View on Map
              </Button>
            )}
          </Box>
        ) : item.delivery_location ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">{item.delivery_location.location_name} - {item.delivery_location.route}</Typography>
            <Typography variant="body2" color="textSecondary">
              Delivery Fee: Kes {item.delivery_location.delivery_fee}
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ mb: 2 }}>
            {item.address}, {item.city},{" "}
            {item.state}, {item.postal_code},{" "}
            {item.country}
          </Typography>
        )}

        {/* Products Table */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
          Products:
        </Typography>
        <Table size="small">
          <TableBody>
            {cartItems.map((cartItem, index) => (
              <TableRow key={index}>
                <TableCell>{cartItem.product.title}</TableCell>
                <TableCell>
                  <Box sx={{ width: "50px", height: "50px", display: "flex", alignItems: "center", overflow: "hidden" }}>
                    <ProductImage src={`https://res.cloudinary.com/dqokryv6u/${cartItem.product.main_image}`} alt={cartItem.product.title} width={50} height={50}/>
                  </Box>
                </TableCell>
                <TableCell>Qty: {cartItem.quantity}</TableCell>
                <TableCell>Kes {cartItem.product.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* Payment Summary */}
        <Typography sx={{ mb: 1 }}>
          <strong>Payment Method:</strong> {item.payment_method}
        </Typography>
        <Typography>
          <strong>Payment Status:</strong>{" "}
          <span style={{ color: item.payment_status === "Paid" ? "green" : "#BE1E2D", fontWeight: "bold" }}>
            {item.payment_status}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;