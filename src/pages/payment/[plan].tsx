import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const plans = {
  Starter: {
    name: "Starter",
    price: "0 Kes",
    oldPrice: "450 Kes",
    description: "Perfect for new businesses taking their first steps online.",
    features: [
      "Quick Store Setup",
      "Showcase up to **50 products**",
      "Reliable Standard Support",
      "Basic Analytics",
      "Custom Theme Selection"
    ],
  },
  Growth: {
    name: "Growth",
    price: "550 Kes",
    description: "Ideal for expanding SMEs ready to scale their operations.",
    features: [
      "**All Starter Features**",
      "List **Unlimited** Products",
      "Enhanced Notifications (SMS, Email, WhatsApp)",
      "Integrated Email Marketing",
      "Advanced Sales Reports",
      "Priority Shop Listing",
      "Payments Automation (Mpesa, Crypto, Cards)"
    ],
  },
  Pro: {
    name: "Pro",
    price: "1050 Kes",
    description: "Designed for established enterprises seeking advanced control.",
    features: [
      "**All Growth Features**",
      "AI enabled targeted marketing",
      "Multi-User & Role Access",
      "Dedicated Priority Support",
      "Custom Integrations",
      "Full time dev support",
      "Custom Landing Page",
      "Custom Domain propagation"
    ],
  },
};

function PaymentPage() {
  const router = useRouter();
  const { plan } = router.query;
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUserDetails(parsedUser);
      // Assuming phone number is available in userDetails
      if (parsedUser.phone_number) {
        setPhoneNumber(parsedUser.phone_number);
      }
    }
  }, []);

  const selectedPlan = plans[plan as keyof typeof plans];

  if (!selectedPlan) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error">Plan not found.</Typography>
        <Button variant="contained" onClick={() => router.push("/profile")} sx={{ mt: 2 }}>
          Go to Profile
        </Button>
      </Container>
    );
  }

  const handlePayment = () => {
    // Static payment logic for now
    alert(`Initiating payment for ${selectedPlan.name} with phone number: ${phoneNumber}`);
    // In a real application, this would trigger an API call to a payment gateway
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}>
        Confirm Your Plan: {selectedPlan.name}
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: "16px", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
          Plan Summary
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          {selectedPlan.price}
          {/* {selectedPlan?.oldPrice && (
            <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 2, textDecoration: "line-through", opacity: 0.7 }}>
              {selectedPlan.oldPrice}
            </Typography>
          )} */}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {selectedPlan.description}
        </Typography>

        <List dense>
          {selectedPlan.features.map((feature, index) => (
            <ListItem key={index} disableGutters>
              <ListItemIcon sx={{ minWidth: '30px' }}>
                <CheckCircleOutlineIcon sx={{ color: theme.palette.secondary.main, fontSize: '1.3rem' }} />
              </ListItemIcon>
              <ListItemText primary={<Typography dangerouslySetInnerHTML={{ __html: feature }} />} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, borderRadius: "16px", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
          Payment Details
        </Typography>
        <TextField
          label="Phone Number"
          fullWidth
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          By clicking "Make Payment", you agree to our <a href="#" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>Terms and Conditions</a> and <a href="#" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>Privacy Policy</a>.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "1.1rem",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          onClick={handlePayment}
        >
          Make Payment
        </Button>
      </Paper>
    </Container>
  );
}

export default PaymentPage;
