import {
  alpha,
  Typography,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  Box,
  Grid,
  List,
  Alert,
  Skeleton // Added Skeleton
} from "@mui/material";
import router from "next/router";
import React, { useEffect, useState } from "react";
import Payment from "../Company/Payment";
import { PricingCard } from "@/StyledComponents/Hero";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useGetActiveSubscriptionQuery } from "@/Api/services"; // Import the new hook
import Cookies from "js-cookie"; // Import Cookies
// import { UserSubscription } from "@/Types"; // Import UserSubscription type

function MyPlan() {
  const theme = useTheme();
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("access");
    if (token) setUserToken(token);
  }, []);

  const { data: activeSubscription, isLoading, isError } = useGetActiveSubscriptionQuery(
    { token: userToken! },
    { skip: !userToken } // Skip query if no token
  );

  // ✅ Get company + subscription safely
//   const company = userDetails?.companies?.[0];

  // The hardcoded plans array will be used if no active subscription is found
  const plans = [
    {
        id: 1,
      title: "Starter",
      price: "1,050",
      billing: "per month",
      desc: "Essentials for new setups",
      features: [
        "Unlimited Products",
        "Standard Analytics",
        "Email Support",
        "Email Notifications",
        "Custom Domain",
      ],
    },
    {
        id: 2,
      title: "Growth",
      price: "1,550",
      billing: "per month",
      desc: "Advanced tools for scaling",
      features: [
        "All starter features",
        "Priority Listing",
        "Mobile app access",
        "Custom Domain",
        "Dedicated Dev Support",
      ],
      popular: true,
    },
    {
        id: 3,
      title: "Sales",
      price: "5%",
      billing: "fee on all sales",
      desc: "Pay only when you sell",
      features: [
        "AI Marketing",
        "Dedicated Dev Support",
        "Multi-user Roles",
        "No monthly subscription",
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4}>My Subscription Plan</Typography>

      {isLoading ? (
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12}>
            <PricingCard
              sx={{
                pt: 6,
                height: 400, // Fixed height for skeleton
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Skeleton variant="rectangular" width="80%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="40%" height={4} sx={{ mb: 3 }} />
              <List sx={{ width: '80%', mb: 4 }}>
                {[...Array(4)].map((_, index) => (
                  <ListItem key={index} sx={{ py: 0.5, px: 0, justifyContent: "center" }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Skeleton variant="circular" width={18} height={18} />
                    </ListItemIcon>
                    <ListItemText primary={<Skeleton variant="text" width="70%" />} />
                  </ListItem>
                ))}
              </List>
              <Skeleton variant="rectangular" width="90%" height={50} />
            </PricingCard>
          </Grid>
        </Grid>
      ) : isError ? (
        <Alert severity="error">Failed to load subscription details.</Alert>
      ) : activeSubscription ? (
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12}>
            <PricingCard
              sx={{
                position: "relative",
                pt: 6,
                borderColor: theme.palette.primary.main,
                background: `linear-gradient(to bottom, ${alpha(
                  theme.palette.primary.main,
                  0.03
                )}, #fff)`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "primary.main",
                  color: "#fff",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  letterSpacing: 1,
                }}
              >
                CURRENT PLAN
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight={800}
                color="primary.main"
              >
                {activeSubscription.plan.name}
              </Typography>

              <Box sx={{ my: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    display: "inline-flex",
                    alignItems: "baseline",
                  }}
                >
                  <Typography
                    component="span"
                    variant="h6"
                    sx={{ mr: 0.5, fontWeight: 700, opacity: 0.7 }}
                  >
                    Ksh
                  </Typography>
                  {activeSubscription.plan.price}
                </Typography>

                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {activeSubscription.plan.duration_days / 30} month(s)
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, px: 1 }}
              >
                Your subscription is active until{" "}
                {activeSubscription.end_date ? new Date(activeSubscription.end_date).toLocaleDateString() : 'N/A'}.
              </Typography>

              <Divider
                sx={{
                  mb: 3,
                  width: "40px",
                  mx: "auto",
                  borderWidth: 2,
                  borderColor: "primary.main",
                }}
              />

              <List sx={{ mb: 4, flexGrow: 1 }}>
                {/* Find the corresponding plan in the local 'plans' array to get features */}
                {plans.find(p => p.title === activeSubscription.plan.name)?.features.map((feat) => (
                  <ListItem
                    key={feat}
                    sx={{ py: 0.5, px: 0, justifyContent: "center" }}
                  >
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleOutlineIcon
                        sx={{
                          fontSize: 18,
                          color: "primary.main",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={feat}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    />
                  </ListItem>
                ))}
                {/* Add other relevant subscription details */}
                <ListItem sx={{ py: 0.5, px: 0, justifyContent: "center" }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Start Date: ${new Date(activeSubscription.start_date).toLocaleDateString()}`}
                    primaryTypographyProps={{ variant: "body2", fontWeight: 600, textAlign: "left" }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5, px: 0, justifyContent: "center" }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`End Date: ${activeSubscription.end_date ? new Date(activeSubscription.end_date).toLocaleDateString() : 'N/A'}`}
                    primaryTypographyProps={{ variant: "body2", fontWeight: 600, textAlign: "left" }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5, px: 0, justifyContent: "center" }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Payment Status: ${activeSubscription.payment_status}`}
                    primaryTypographyProps={{ variant: "body2", fontWeight: 600, textAlign: "left" }}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: "auto" }}>
                <Payment /> {/* Assuming Payment component is for managing current subscription */}
              </Box>
            </PricingCard>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3} alignItems="flex-end">
          {plans.map((plan) => {
            const isGrowth = plan.title === "Growth";
            const isCommissionPlan = plan.billing === "fee on all sales";

            return (
              <Grid item xs={12} lg={4} key={plan.title}>
                <PricingCard
                  sx={{
                    position: "relative",
                    pt: plan.popular ? 6 : 4,
                    borderColor: isGrowth
                      ? theme.palette.primary.main
                      : theme.palette.divider,
                    background: isGrowth
                      ? `linear-gradient(to bottom, ${alpha(
                          theme.palette.primary.main,
                          0.03
                        )}, #fff)`
                      : "#fff",
                  }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bgcolor: theme.palette.primary.main,
                        color: "#fff",
                        py: 0.5,
                        borderTopLeftRadius: "22px",
                        borderTopRightRadius: "22px",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        letterSpacing: 1,
                        textAlign: "center",
                      }}
                    >
                      MOST POPULAR
                    </Box>
                  )}

                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    color={isGrowth ? "primary.main" : "text.primary"}
                  >
                    {plan.title}
                  </Typography>

                  {/* ✅ Flexible Price Display */}
                  <Box sx={{ my: 2 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        display: "inline-flex",
                        alignItems: "baseline",
                      }}
                    >
                      {isCommissionPlan ? (
                        plan.price
                      ) : (
                        <>
                          <Typography
                            component="span"
                            variant="h6"
                            sx={{ mr: 0.5, fontWeight: 700, opacity: 0.7 }}
                          >
                            Ksh
                          </Typography>
                          {plan.price}
                        </>
                      )}
                    </Typography>

                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      {plan.billing}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, px: 1 }}
                  >
                    {plan.desc}
                  </Typography>

                  <Divider
                    sx={{
                      mb: 3,
                      width: "40px",
                      mx: "auto",
                      borderWidth: 2,
                      borderColor: isGrowth
                        ? "primary.main"
                        : theme.palette.divider,
                    }}
                  />

                  <List sx={{ mb: 4, flexGrow: 1 }}>
                    {plan.features.map((feat) => (
                      <ListItem
                        key={feat}
                        sx={{ py: 0.5, px: 0, justifyContent: "center" }}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleOutlineIcon
                            sx={{
                              fontSize: 18,
                              color: "primary.main",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feat}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 600,
                            textAlign: "left",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {/* ✅ Action Area */}
                  <Button
                    fullWidth
                    variant={isGrowth ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => router.push(`/payment/${plan.title}`)}
                    sx={{
                      mt: "auto",
                      borderRadius: "14px",
                      py: 1.5,
                      fontWeight: 800,
                      textTransform: "none",
                      boxShadow: isGrowth
                        ? `0 8px 20px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`
                        : "none",
                    }}
                  >
                    {isCommissionPlan
                      ? "Activate Revenue Share"
                      : "Upgrade Plan"}
                  </Button>
                </PricingCard>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default MyPlan;