import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  alpha,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Confetti from "./Confetti";
import { useRouter } from "next/router";

const VerificationStatus: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: 4,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Confetti />

      {/* Glowing Checkmark Icon */}
      <Box
        sx={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          bgcolor: alpha(theme.palette.success.main, 0.12),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          boxShadow: `0 0 0 16px ${alpha(theme.palette.success.main, 0.06)}`,
          animation: "pulse 2s infinite ease-in-out",
          "@keyframes pulse": {
            "0%": { boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0.2)}` },
            "70%": { boxShadow: `0 0 0 20px ${alpha(theme.palette.success.main, 0)}` },
            "100%": { boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0)}` },
          },
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 52, color: theme.palette.success.main }} />
      </Box>

      {/* Main Title & Subtitle */}
      <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 1, letterSpacing: "-0.01em" }}>
        Application Received & Under Review!
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 540, mb: 4, lineHeight: 1.6 }}>
        Congratulations! Your storefront profile and business documents have been submitted to the SokoJunction compliance desk.
      </Typography>

      {/* 3-Step Review Timeline Card */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 620,
          borderRadius: "16px",
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
          mb: 4,
          textAlign: "left",
          p: 2.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", mb: 2 }}>
          Onboarding Progress Tracker
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Step 1 */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: theme.palette.success.main,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Storefront & KYC Information Submitted
                </Typography>
                <Chip label="Completed" size="small" color="success" sx={{ height: 20, fontSize: "10px", fontWeight: 700 }} />
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Basic details, IDs, business credentials, and branding recorded in the system.
              </Typography>
            </Box>
          </Box>

          {/* Step 2 */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.warning.main, 0.15),
                color: theme.palette.warning.dark,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HourglassEmptyIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Document Compliance & KYC Verification
                </Typography>
                <Chip label="In Review (~24h)" size="small" color="warning" sx={{ height: 20, fontSize: "10px", fontWeight: 700 }} />
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Our team is reviewing your National ID and business registration to activate verified seller standing.
              </Typography>
            </Box>
          </Box>

          {/* Step 3 */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.text.disabled, 0.15),
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <StorefrontIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  Live Storefront & M-Pesa Settlement
                </Typography>
                <Chip label="Upcoming" size="small" variant="outlined" sx={{ height: 20, fontSize: "10px" }} />
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Receive immediate email notification once your digital storefront is live to buyers.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Helpful Quick Tips Cards */}
      <Grid container spacing={2} sx={{ maxWidth: 620, mb: 4, textAlign: "left" }}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 2, borderRadius: "14px", bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}` }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
              <InventoryIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                Prepare Your Inventory
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Have high-resolution product photos and pricing ready to launch your catalog immediately.
            </Typography>
          </Box>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 2, borderRadius: "14px", bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.15)}` }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
              <SupportAgentIcon sx={{ color: theme.palette.info.main, fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                Dedicated Support
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Our merchant onboarding team will contact you if any document needs re-uploading.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={() => router.push("/shops")}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            borderRadius: "12px",
            px: 4,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "15px",
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.28)}`,
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Explore Marketplace
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push("/profile")}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            color: "text.primary",
            borderColor: alpha(theme.palette.divider, 0.8),
          }}
        >
          View Merchant Profile
        </Button>
      </Box>
    </Box>
  );
};

export default VerificationStatus;
