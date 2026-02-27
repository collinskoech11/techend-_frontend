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
  InputAdornment,
  CircularProgress,
  IconButton,
  Card,
  Stack
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  useCreateSubscriptionMutation,
  useInitiateMpesaStkPushSubscriptionMutation
} from "@/Api/services";

// Define the colors for M-Pesa branding
const MPESA_GREEN = "#49b24b";

const plans = {
  Starter: {
    id: 1,
    name: "Starter",
    price: 0,
    priceDisplay: "Free",
    description: "Perfect for new businesses taking their first steps online.",
    features: ["Quick Store Setup", "Showcase up to 50 products", "Standard Support", "Basic Analytics"]
  },
  Growth: {
    id: 2,
    name: "Growth",
    price: 550,
    priceDisplay: "550 Kes",
    description: "Ideal for expanding SMEs ready to scale.",
    features: ["Unlimited Products", "Enhanced Notifications", "Integrated Marketing", "Priority Shop Listing", "Payments Automation"]
  },
  Pro: {
    id: 3,
    name: "Pro",
    price: 1050,
    priceDisplay: "1,050 Kes",
    description: "Designed for established enterprises.",
    features: ["AI targeted marketing", "Multi-User Access", "Dedicated Support", "Full time dev support", "Custom Landing Page"]
  },
};

function PaymentPage() {
  const router = useRouter();
  const { plan } = router.query;
  const theme = useTheme();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [userToken, setUserToken] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState(1); // New state for duration
  
  const [createSubscription, { isLoading: creatingSubscription }] = useCreateSubscriptionMutation();
  const [initiateMpesaStkPushSubscription, { isLoading: initiatingMpesa }] = useInitiateMpesaStkPushSubscriptionMutation();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    const token = Cookies.get("access");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      if (parsedUser.phone_number) setPhoneNumber(parsedUser.phone_number);
    }
    if (token) setUserToken(token);
  }, []);

  const selectedPlan = plans[plan as keyof typeof plans];
  const isProcessing = creatingSubscription || initiatingMpesa;

  const normalizePhoneNumber = (input: string): string => {
    let digits = input.replace(/\D/g, ''); // Remove all non-digit characters

    if (digits.startsWith('0')) {
      digits = '254' + digits.substring(1);
    } else if (digits.startsWith('7') && digits.length === 9) {
      digits = '254' + digits;
    } else if (digits.startsWith('1') && digits.length === 9) {
      digits = '254' + digits;
    } else if (digits.length === 9 && !digits.startsWith('254')) {
      digits = '254' + digits;
    }

    // Ensure it doesn't exceed 12 digits (2547xxxxxxxx)
    if (digits.length > 12) {
      digits = digits.substring(0, 12);
    }
    console.log("Normalized Phone Number:", digits);
    return digits;
  };

  const handleCompletePurchase = async () => {
    if (!userToken) return toast.error("Please log in to continue.");
    if (!selectedPlan) return toast.error("Plan not found.");
    if (!phoneNumber || phoneNumber.length < 10) return toast.error("Enter a valid M-Pesa number.");
    if (selectedMonths < 1) return toast.error("Subscription duration must be at least 1 month.");

    try {
      const loadingToast = toast.loading("Preparing secure checkout...");

      const planDetails = {
        name: selectedPlan.name,
        price: selectedPlan.price.toString(),
        duration_days: selectedMonths * 30, // 30 days per month
      };

      const subscriptionResult = await createSubscription({
        plan_id: selectedPlan.id,
        token: userToken,
        plan: planDetails, // Pass the full plan object
      }).unwrap();

      toast.loading("Sending M-Pesa Prompt...", { id: loadingToast });

      await initiateMpesaStkPushSubscription({
        phone_number: phoneNumber,
        user_subscription_id: subscriptionResult.id,
        duration_months: selectedMonths, // Use selectedMonths for duration
        token: userToken,
      }).unwrap();

      toast.success("Check your phone for the M-Pesa PIN prompt!", { id: loadingToast });
    } catch (err: any) {
      toast.error(err?.data?.detail || "Payment failed", { id: "payment" });
    }
  };

  if (!selectedPlan) return null; // Or a loading spinner

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, #fff 100%)`,
      py: { xs: 4, md: 8 } 
    }}>
      <Container maxWidth="lg">
        {/* Header Navigation */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 2, bgcolor: '#fff', boxShadow: 1 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" fontWeight={800}>Checkout</Typography>
        </Box>

        <Grid container spacing={5}>
          {/* Left Column: Payment Details */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Card variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                   <Box sx={{ bgcolor: alpha(MPESA_GREEN, 0.1), p: 1, borderRadius: 2, mr: 2, display: 'flex' }}>
                      <PhoneIphoneIcon sx={{ color: MPESA_GREEN }} />
                   </Box>
                   <Box>
                    <Typography variant="h6" fontWeight={700}>M-Pesa Payment</Typography>
                    <Typography variant="body2" color="text.secondary">Enter your Safaricom number to receive the STK push</Typography>
                   </Box>
                </Box>

                <Typography variant="body2" fontWeight={600} sx={{ mb: 1, ml: 0.5 }}>Subscription Duration (Months)</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={selectedMonths}
                  onChange={(e) => setSelectedMonths(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1 }}
                  helperText="Select the number of months for your subscription"
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { borderRadius: 3, bgcolor: alpha(theme.palette.common.white, 0.5) },
                  }}
                />

                <Typography variant="body2" fontWeight={600} sx={{ mb: 1, ml: 0.5 }}>Phone Number</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(normalizePhoneNumber(e.target.value))}
                  helperText="Ensure your phone is unlocked and nearby"
                  InputProps={{
                    sx: { borderRadius: 3, bgcolor: alpha(theme.palette.common.white, 0.5) },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mr: 1 }}>+254</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCompletePurchase}
                  disabled={isProcessing}
                  sx={{ 
                    mt: 4, 
                    py: 2, 
                    borderRadius: 3, 
                    textTransform: 'none', 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': { boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}` }
                  }}
                >
                  {isProcessing ? <CircularProgress size={24} color="inherit" /> : `Pay ${selectedPlan.priceDisplay} for ${selectedMonths} Month${selectedMonths > 1 ? 's' : ''}`}
                </Button>

                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 3, opacity: 0.7 }}>
                  <SecurityIcon sx={{ fontSize: 16, color: MPESA_GREEN }} />
                  <Typography variant="caption" fontWeight={600}>Secure 256-bit encrypted payment</Typography>
                </Stack>
              </Card>

              {/* Help Section */}
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', bgcolor: alpha(theme.palette.info.main, 0.02), borderColor: alpha(theme.palette.info.main, 0.1) }}>
                <HelpOutlineIcon sx={{ color: 'info.main', mr: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Having trouble? Ensure you have sufficient balance in your M-Pesa account before initiating.
                </Typography>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column: Order Summary */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 4, 
                  bgcolor: theme.palette.common.white,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundImage: `linear-gradient(to bottom right, #fff, ${alpha(theme.palette.primary.main, 0.02)})`
                }}
              >
                <Typography variant="overline" color="primary" fontWeight={800} letterSpacing={1.2}>
                  Order Summary
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>{selectedPlan.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {selectedPlan.description}
                </Typography>

                <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                <List>
                  {selectedPlan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ color: MPESA_GREEN, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} 
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 4, p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={700}>Total to Pay</Typography>
                    <Typography variant="h5" fontWeight={900} color="primary">
                      {selectedPlan.priceDisplay}
                    </Typography>
                  </Stack>
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