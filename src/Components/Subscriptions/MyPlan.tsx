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
  List
} from "@mui/material";
import router from "next/router";
import React from "react";
import Payment from "../Company/Payment";
import { PricingCard } from "@/StyledComponents/Hero";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { id } from "zod/v4/locales";

function MyPlan({ userDetails }: any) {
  const theme = useTheme();

  // ✅ Get company + subscription safely
  const company = userDetails?.companies?.[0];

  const currentPlan =
    company?.subscription?.plan_name ||
    company?.subscription // fallback default

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
      <Grid container spacing={3} alignItems="flex-end">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.title;
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
                {/* ✅ Current Plan Badge */}
                {isCurrent && (
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
                )}

                {/* Popular Badge */}
                {plan.popular && !isCurrent && (
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
                {isCurrent ? (
                  <Box sx={{ mt: "auto" }}>
                    <Payment />
                  </Box>
                ) : (
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
                )}
              </PricingCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default MyPlan;