import React from "react";
import { Box, Container, Typography, Button, useTheme, useMediaQuery, Link, Card, Grid, alpha } from "@mui/material";
import { styled } from "@mui/system";
import Head from "next/head";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  BarChart3,
  Store,
  UserCog,
  ShieldCheck
} from "lucide-react";

// Modern Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  // Using a darker, more vibrant gradient to make white text truly "pop"
  background: `linear-gradient(135deg, #1a237e 0%, ${theme.palette.primary.main} 50%, #0d47a1 100%)`,
  color: "#ffffff",
  padding: theme.spacing(15, 0, 12),
  clipPath: "polygon(0 0, 100% 0, 100% 90%, 0% 100%)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(10, 0, 8),
  },
}));
const FeatureCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: "20px",
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  backgroundColor: "#ffffff",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.05)}`,
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const IconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "iconColor",
})<{ iconColor: string }>(({ theme, iconColor }) => ({
  width: "56px",
  height: "56px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(iconColor, 0.12), // Soft background
  color: iconColor, // Vibrant icon
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  width: "50px",
  height: "50px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  opacity: 0.9
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
}));

const features = [
  {
    title: "Dashboard",
    desc: "A centralized hub to monitor your vital business health and daily metrics at a glance.",
    icon: <LayoutDashboard size={28} />,
    color: "#2563eb" // Blue
  },
  {
    title: "Product Suite",
    desc: "Full-lifecycle inventory management. Upload, edit, and categorize items in seconds.",
    icon: <Package size={28} />,
    color: "#7c3aed" // Violet
  },
  {
    title: "Live Tracking",
    desc: "Real-time order processing pipelines to ensure your customers never miss a beat.",
    icon: <TrendingUp size={28} />,
    color: "#059669" // Emerald
  },
  {
    title: "Deep Analytics",
    desc: "Transform raw data into actionable insights with professional-grade reporting tools.",
    icon: <BarChart3 size={28} />,
    color: "#db2777" // Pink
  },
  {
    title: "Store Control",
    desc: "Manage multiple pickup locations and branch settings from one master interface.",
    icon: <Store size={28} />,
    color: "#ea580c" // Orange
  },
  {
    title: "Enterprise Security",
    desc: "Multi-factor authentication and OTP protocols to keep your commercial data locked down.",
    icon: <ShieldCheck size={28} />,
    color: "#0284c7" // Sky Blue
  },
];

export default function MobileAppPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Head>
        <title>SokoJunction Manager | Empower Your Business</title>
      </Head>

      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
        {/* Hero */}
        <HeroSection>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography
              variant={isMobile ? "h4" : "h2"}
              component="h1"
              gutterBottom
              fontWeight={800}
              sx={{
                letterSpacing: "-0.02em",
                textShadow: "0px 2px 4px rgba(0,0,0,0.2)" // Adds depth for better legibility
              }}
            >
              SokoJunction Manager
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 5,
                opacity: 1, // Resetting to 1 to ensure full contrast
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                color: "rgba(255, 255, 255, 0.95)", // High-contrast off-white
                lineHeight: 1.6
              }}
            >
              Your business doesn&apos;t stop when you leave your desk. Manage inventory, track sales, and grow your store from anywhere.
            </Typography>

            <Box sx={{ mt: 4 }}>
              {/* Early Access Badge */}
              <Typography
                variant="caption"
                sx={{
                  display: 'inline-block',
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                  fontWeight: 700,
                  mb: 2,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}
              >
                🚀 Early Access: Android Only
              </Typography>

              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                gap: 2,
                alignItems: 'center'
              }}>
                {/* Android Download Button */}
                <DownloadButton
                  variant="contained"
                  href="/downloads/sokojunction.apk.zip"
                  sx={{
                    bgcolor: "#ffffff",
                    color: theme.palette.primary.main,
                    "&:hover": { bgcolor: "#f5f5f5" },
                    px: 4,
                    py: 2,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                  }}
                >
                  Download APK for Android
                </DownloadButton>

                {/* Disabled iOS Button */}
                <Box sx={{ textAlign: 'center' }}>
                  <DownloadButton
                    disabled
                    variant="outlined"
                    sx={{
                      color: 'rgba(255,255,255,0.5) !important',
                      borderColor: 'rgba(255,255,255,0.3) !important',
                      px: 4,
                      py: 2
                    }}
                  >
                    App Store (Coming Soon)
                  </DownloadButton>
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{ mt: 2, color: "rgba(255,255,255,0.7)", fontStyle: 'italic' }}
              >
                Currently in private beta. iOS version is under development.
              </Typography>
            </Box>
          </Container>
        </HeroSection>

        {/* Features */}
        <Box sx={{ bgcolor: "#fafafa", py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="overline"
                sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 1.5 }}
              >
                POWERFUL CAPABILITIES
              </Typography>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  mt: 1,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: "#1e293b"
                }}
              >
                Everything you need to scale
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}>
                The SokoJunction Manager ecosystem is built for speed, accuracy, and growth.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {features.map((f, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <FeatureCard elevation={0}>
                    <IconBox iconColor={f.color}>
                      {f.icon}
                    </IconBox>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: "#1e293b" }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.7 }}>
                      {f.desc}
                    </Typography>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ bgcolor: "#fff", py: 10, borderTop: "1px solid #eee" }}>
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Ready to take control?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Join hundreds of managers optimizing their workflow with SokoJunction.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" size="large" sx={{ borderRadius: '10px' }}>Get Started</Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}