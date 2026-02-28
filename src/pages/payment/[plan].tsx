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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SecurityIcon from "@mui/icons-material/Security";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  useCreateSubscriptionMutation,
  useInitiateMpesaStkPushSubscriptionMutation
} from "@/Api/services";

const MPESA_GREEN = "#49b24b";

const plans = {
  Starter: {
    id: 1,
    name: "Starter",
    price: "1,050",
    priceDisplay: "1,050 Kes",
    description: "Perfect for new businesses taking their first steps online.",
    features: ["Quick Store Setup", "Showcase up to 50 products", "Standard Support", "Basic Analytics"]
  },
  Growth: {
    id: 2,
    name: "Growth",
    price: "1,550",
    priceDisplay: "1,550 Kes",
    description: "Ideal for expanding SMEs ready to scale.",
    features: ["Unlimited Products", "Enhanced Notifications", "Integrated Marketing", "Priority Shop Listing", "Payments Automation"]
  },
  Sales: {
    id: 3,
    name: "Sales",
    price: "4.5% of sales",
    priceDisplay: "4.5 % of sales",
    description: "Designed for established enterprises.",
    features: ["AI targeted marketing", "Multi-User Access", "Dedicated Support", "Full time dev support", "Custom Landing Page"]
  }
};

function PaymentPage() {
  const router = useRouter();
  const { plan } = router.query;
  const theme = useTheme();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [userToken, setUserToken] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState(1);

  const [createSubscription, { isLoading: creatingSubscription }] =
    useCreateSubscriptionMutation();

  const [initiateMpesaStkPushSubscription, { isLoading: initiatingMpesa }] =
    useInitiateMpesaStkPushSubscriptionMutation();

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
  const isSalesPlan = selectedPlan?.name === "Sales";

  const normalizePhoneNumber = (input: string): string => {
    let digits = input.replace(/\D/g, "");

    if (digits.startsWith("0")) digits = "254" + digits.substring(1);
    else if (digits.length === 9) digits = "254" + digits;

    if (digits.length > 12) digits = digits.substring(0, 12);

    return digits;
  };

  const handleCompletePurchase = async () => {
    if (!userToken) return toast.error("Please log in to continue.");
    if (!selectedPlan) return toast.error("Plan not found.");
    if (selectedMonths < 1) return toast.error("Invalid duration.");

    if (!isSalesPlan) {
      if (!phoneNumber || phoneNumber.length < 10) {
        return toast.error("Enter a valid M-Pesa number.");
      }
    }

    try {
      const loadingToast = toast.loading("Preparing subscription...");

      const planDetails = {
        name: selectedPlan.name,
        price: selectedPlan.price.toString(),
        duration_days: selectedMonths * 30
      };

      const subscriptionResult = await createSubscription({
        plan_id: selectedPlan.id,
        token: userToken,
        plan: planDetails
      }).unwrap();

      // SALES PLAN → NO PAYMENT
      if (isSalesPlan) {
        toast.success("Sales plan activated successfully!", { id: loadingToast });
        router.push("/profile");
        return;
      }

      // OTHER PLANS → MPESA FLOW
      toast.loading("Sending M-Pesa prompt...", { id: loadingToast });

      await initiateMpesaStkPushSubscription({
        phone_number: phoneNumber,
        user_subscription_id: subscriptionResult.id,
        duration_months: selectedMonths,
        token: userToken
      }).unwrap();

      toast.success("Check your phone to complete payment!", { id: loadingToast });

    } catch (err: any) {
      toast.error(err?.data?.detail || "Payment failed");
    }
  };

  if (!selectedPlan) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, #fff 100%)`,
        py: { xs: 4, md: 8 }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 2, bgcolor: "#fff", boxShadow: 1 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" fontWeight={800}>
            Checkout
          </Typography>
        </Box>

        <Grid container spacing={5}>
          {/* PAYMENT COLUMN */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Card
                variant="outlined"
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  border: "none",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.04)"
                }}
              >
                {!isSalesPlan && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          bgcolor: alpha(MPESA_GREEN, 0.1),
                          p: 1,
                          borderRadius: 2,
                          mr: 2,
                          display: "flex"
                        }}
                      >
                        <PhoneIphoneIcon sx={{ color: MPESA_GREEN }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          M-Pesa Payment
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enter your Safaricom number to receive STK push
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                      Subscription Duration (Months)
                    </Typography>

                    <TextField
                      fullWidth
                      type="number"
                      value={selectedMonths}
                      onChange={(e) =>
                        setSelectedMonths(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      sx={{ mb: 3 }}
                    />

                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                      Phone Number
                    </Typography>

                    <TextField
                      fullWidth
                      placeholder="0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(normalizePhoneNumber(e.target.value))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography fontWeight={700}>+254</Typography>
                          </InputAdornment>
                        )
                      }}
                    />
                  </>
                )}

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
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 700
                  }}
                >
                  {isProcessing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isSalesPlan ? (
                    "Activate Sales Plan"
                  ) : (
                    `Pay ${selectedPlan.priceDisplay} for ${selectedMonths} Month${
                      selectedMonths > 1 ? "s" : ""
                    }`
                  )}
                </Button>

                {!isSalesPlan && (
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
                    <SecurityIcon sx={{ fontSize: 16, color: MPESA_GREEN }} />
                    <Typography variant="caption" fontWeight={600}>
                      Secure 256-bit encrypted payment
                    </Typography>
                  </Stack>
                )}
              </Card>

              {!isSalesPlan && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: alpha(theme.palette.info.main, 0.02)
                  }}
                >
                  <HelpOutlineIcon sx={{ color: "info.main", mr: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Ensure you have sufficient M-Pesa balance before initiating payment.
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Grid>

          {/* SUMMARY COLUMN */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: "#fff",
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="overline" color="primary" fontWeight={800}>
                  Order Summary
                </Typography>

                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {selectedPlan.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {selectedPlan.description}
                </Typography>

                <Divider sx={{ mb: 3, borderStyle: "dashed" }} />

                <List>
                  {selectedPlan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ color: MPESA_GREEN }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={700}>Total</Typography>
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