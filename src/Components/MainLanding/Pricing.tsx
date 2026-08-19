"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  Theme,
  alpha
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// Ensure AccentButton is the GlowButton from the Hero component
// Re-defining AccentButton here for self-contained functionality
const AccentButton = styled(Button)(({ theme }) => ({
  padding: "14px 32px",
  borderRadius: "50px",
  fontWeight: 700,
  fontSize: "1rem",
  textTransform: "none",
  background: theme.palette.primary.main,
  color: "#fff",
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    background: theme.palette.primary.dark,
    transform: "translateY(-3px)",
    boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.7)}`,
  },
}));

// Helper function to get theme colors (for consistency)
const getThemeColor = (theme: Theme) => ({
  primary: theme.palette.text.primary,
  secondary: theme.palette.text.secondary,
  accent: theme.palette.primary.main,
});

const PricingCard = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: "40px 30px",
  borderRadius: "24px",
  // Modern Glassmorphism effect
  background: alpha(theme.palette.background.paper, 0.7),
  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  backdropFilter: "blur(15px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
  position: 'relative',
  overflow: 'hidden',

  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 20px 45px ${alpha(theme.palette.common.black, 0.1)}`,
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },

  // Featured Plan Styling (Growth)
  "&.featured": {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 25px 50px -12px ${alpha(theme.palette.primary.main, 0.4)}`,
    transform: "scale(1.05)",
    background: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.dark, 0.1)
      : alpha(theme.palette.primary.light, 0.15),

    "&:hover": {
      transform: "translateY(-5px) scale(1.06)",
      boxShadow: `0 30px 60px -15px ${alpha(theme.palette.primary.main, 0.6)}`,
    },
  },

  "& .MuiListItem-root": {
    padding: theme.spacing(0.75, 0),
    alignItems: 'flex-start',
  },
  "& .MuiListItemIcon-root": {
    minWidth: '32px',
    marginTop: theme.spacing(0.5),
  },
  "& .MuiListItemText-primary": {
    fontSize: '0.95rem', // Slightly smaller font for list items
  }
}));

const PricingLabel = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(0.5, 2),
  borderRadius: '50px',
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '0.85rem',
  marginBottom: theme.spacing(1),
}));


interface PricingProps {
  handleAuthTrigger: () => void;
}

const Pricing: React.FC<PricingProps> = ({ handleAuthTrigger }) => {
  const theme = useTheme();
  const colors = getThemeColor(theme);

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
      price: "4.5%",
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
    <Box sx={{ py: 12, px: { md: 5, xs: 2 }, background: theme.palette.background.default }} id="pricing">
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1, 
            px: 2, 
            py: 0.5, 
            borderRadius: '50px', 
            bgcolor: alpha(theme.palette.primary.main, 0.1), 
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700, letterSpacing: 1.2 }}>
            💎 FLEXIBLE PRICING
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 2,
          textAlign: "center",
          color: colors.primary,
          fontSize: { xs: "2rem", md: "2.5rem" }
        }}
      >
        Simple, <span style={{ color: colors.accent }}>Transparent</span> Pricing
      </Typography>
      <Typography
        variant="h6"
        sx={{
          maxWidth: "800px",
          mx: "auto",
          mb: 8,
          color: colors.secondary,
          textAlign: "center",
          fontSize: { xs: '1rem', md: '1.15rem' },
          lineHeight: 1.6
        }}
      >
        Choose the plan that fits your business needs. No hidden fees, just straightforward pricing designed for your success.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => {
          const isFeatured = plan.popular;

          return (
            <Grid item xs={12} sm={8} md={4} key={plan.id}>
              <PricingCard className={isFeatured ? "featured" : ""}>
                <Box>
                  <PricingLabel
                    sx={
                      isFeatured
                        ? {
                          backgroundColor: colors.accent,
                          color: "#fff",
                          boxShadow: `0 4px 15px ${alpha(colors.accent, 0.4)}`,
                        }
                        : {}
                    }
                  >
                    {plan.title}
                    {isFeatured && (
                      <span style={{ fontSize: "0.9em" }}> (Recommended)</span>
                    )}
                  </PricingLabel>

                  <Typography variant="body2" color={colors.secondary} sx={{ mb: 2 }}>
                    {plan.desc}
                  </Typography>

                  {/* Price */}
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, mb: 3, color: colors.primary }}
                  >
                    {plan.price}
                    <Typography component="span" variant="h5" color={colors.secondary}>
                      {" "}
                      {plan.billing === "per month" ? "/mo" : ""}
                    </Typography>
                  </Typography>

                  {/* Features */}
                  <List sx={{ textAlign: "left", mx: "auto", maxWidth: "280px" }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleOutlineIcon
                            sx={{ color: colors.accent, fontSize: "1.3rem" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography color={colors.secondary}>{feature}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Button Logic */}
                {isFeatured ? (
                  <AccentButton
                    onClick={() => handleAuthTrigger()}
                    sx={{ width: "100%" }}
                  >
                    Choose {plan.title} Plan
                  </AccentButton>
                ) : (
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: colors.accent,
                      color: colors.accent,
                      mt: 3,
                      padding: "12px 28px",
                      borderRadius: "50px",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: colors.accent,
                        color: "#fff",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                      },
                    }}
                    onClick={() => handleAuthTrigger()}
                  >
                    {plan.title === "Sales" ? "Start Now!" : `Choose ${plan.title} Plan`}
                  </Button>
                )}
              </PricingCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Pricing;