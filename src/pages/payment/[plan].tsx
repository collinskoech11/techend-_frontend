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
  alpha,
  Grid,
  Divider,
  InputAdornment
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const plans = {
  Starter: {
    name: "Starter",
    price: "0 Kes",
    description: "Perfect for new businesses taking their first steps online.",
    features: ["Quick Store Setup", "Showcase up to **50 products**", "Reliable Standard Support", "Basic Analytics", "Custom Theme Selection"],
  },
  Growth: {
    name: "Growth",
    price: "550 Kes",
    description: "Ideal for expanding SMEs ready to scale their operations.",
    features: ["**All Starter Features**", "Unlimited Products", "Enhanced Notifications", "Integrated Marketing", "Advanced Sales Reports", "Priority Shop Listing", "Payments Automation"],
  },
  Pro: {
    name: "Pro",
    price: "1050 Kes",
    description: "Designed for established enterprises seeking advanced control.",
    features: ["**All Growth Features**", "AI targeted marketing", "Multi-User Access", "Dedicated Support", "Custom Integrations", "Full time dev support", "Custom Landing Page"],
  },
};

function PaymentPage() {
  const router = useRouter();
  const { plan } = router.query;
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userDetails, setUserDetails] = useState<any>(null);
  console.log("Selected plan from query:", userDetails);
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUserDetails(parsedUser);
      if (parsedUser.phone_number) setPhoneNumber(parsedUser.phone_number);
    }
  }, []);

  const selectedPlan = plans[plan as keyof typeof plans];

  if (!selectedPlan) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
        <Paper elevation={0} sx={{ p: 5, border: `1px solid ${theme.palette.divider}`, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Plan not found</Typography>
          <Button variant="outlined" onClick={() => router.push("/profile")} sx={{ mt: 2, borderRadius: 2 }}>
            Return to Profile
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Top Navigation */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button 
            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />} 
            onClick={() => router.back()}
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.disabled' }}>
            <LockIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" fontWeight={700}>SECURE ENCRYPTED CHECKOUT</Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left: Checkout Details */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Checkout</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Almost there! Enter your payment details to upgrade your experience.
            </Typography>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                M-Pesa Mobile Payment
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>M-Pesa Registered Number</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. 0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Box>

              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.08), borderRadius: 3, mb: 4 }}>
                <Typography variant="body2" sx={{ color: theme.palette.info.dark, fontWeight: 500 }}>
                  <strong>Instructions:</strong> Click the button below. You will receive an M-Pesa prompt on your phone. Enter your PIN to authorize the transaction.
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                  textTransform: "none"
                }}
                onClick={() => alert(`Initiating M-Pesa push to ${phoneNumber}`)}
              >
                Complete Purchase
              </Button>

              <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 3, color: 'text.disabled' }}>
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </Typography>
            </Paper>
          </Grid>

          {/* Right: Plan Summary */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 4, 
                  border: `2px solid ${theme.palette.primary.main}`,
                  background: theme.palette.background.paper 
                }}
              >
                <Typography variant="overline" color="primary" fontWeight={800} letterSpacing={1}>
                  Selected Plan
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="h5" fontWeight={800}>{selectedPlan.name}</Typography>
                  <Typography variant="h5" color="primary" fontWeight={800}>{selectedPlan.price}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Monthly billing
                </Typography>

                <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Included features:</Typography>
                <List dense>
                  {selectedPlan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: '32px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.secondary.main, fontSize: '1.2rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: feature }} />} 
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={700}>Total Due:</Typography>
                    <Typography variant="subtitle1" fontWeight={800}>{selectedPlan.price}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PaymentPage;