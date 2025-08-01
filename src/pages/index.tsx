"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card, Container, List, ListItem, ListItemIcon, ListItemText, useTheme, CircularProgress } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from '@mui/icons-material/Storefront'; // More specific icon
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
const Typewriter = lazy(() => import("typewriter-effect"));
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/router";
import AuthDialog from "@/Components/AuthDialog";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Icon for primary CTA
const FAQ = lazy(() => import("@/Components/FAQ"));
import Image from "next/image";
// Define a consistent color palette
const lightGray = "#f0f2f5"; // A softer, more modern light gray for backgrounds
const mediumGray = "#e0e0e0"; // For borders and subtle dividers
const darkText = "#212121"; // Very dark gray for main headings and strong text
const lightText = "#555555"; // Softer dark gray for body text

// Keyframes for subtle floating effect
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, // Deeper gradient
  color: "#fff",
  textAlign: "center",
  borderRadius: "20px", // More rounded for a modern feel
  marginBottom: "100px", // More space after hero
  position: "relative",
  overflow: "hidden",
  // padding: "120px 0", // Generous padding
  [theme.breakpoints.down('sm')]: {
    padding: "80px 0",
    borderRadius: "10px",
  },

  // Diagonal split overlay (new design element)
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)`,
    backgroundSize: '80px 80px',
    opacity: 0.2,
    zIndex: 0,
  },
  '&::after': { // Second, more subtle layer
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(225deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.03) 75%, transparent 75%, transparent)`,
    backgroundSize: '60px 60px',
    opacity: 0.1,
    zIndex: 0,
  },
}));

const HeroGraphic = styled(Box)({
  position: 'absolute',
  // You would replace these with actual SVG or image components
  // For demonstration, these are placeholder circles
  background: 'rgba(255,255,255,0.08)',
  borderRadius: '50%',
  animation: `${floatAnimation} 4s ease-in-out infinite`,
  zIndex: 1, // Below content but above background patterns
});

const AccentButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  textTransform: "uppercase", // More professional
  padding: "16px 40px",
  borderRadius: "30px",
  fontWeight: 700, // Bolder
  fontSize: "1.1rem",
  boxShadow: "0 10px 25px rgba(0,0,0,0.35)", // Stronger, more defined shadow
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-5px) scale(1.03)", // Enhanced hover effect
    boxShadow: "0 15px 35px rgba(0,0,0,0.45)",
  },
  "& .MuiButton-endIcon": {
    marginLeft: theme.spacing(1), // Space for icon
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  textAlign: "center",
  padding: "40px 25px",
  borderRadius: "20px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)", // Softer, more pronounced shadow
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: 'center',
  justifyContent: "flex-start", // Align content to top
  transition: "transform 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease",
  border: `1px solid ${mediumGray}`,
 // Subtle border
  position: 'relative',
  overflow: 'hidden',

  '&::before': { // Subtle pattern/texture
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.02) 75%, transparent 75%, transparent)`,
    backgroundSize: '40px 40px',
    opacity: 0.5,
    zIndex: 0,
  },

  "&:hover": {
    transform: "translateY(-12px) scale(1.02)", // Lift and slightly scale
    boxShadow: "0 20px 45px rgba(0,0,0,0.18)", // More intense shadow on hover
    backgroundColor: '#ffffff', // Ensure background stays light
  },
  "& .MuiSvgIcon-root": { // Style for icons within FeatureCard
    fontSize: 70,
    color: theme.palette.primary.main,
    mb: 3,
    position: 'relative',
    zIndex: 1,
    padding: theme.spacing(2),
    borderRadius: '50%',
    background: '#ffebee', // Light background for icon
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  }
}));

const ImageCard = styled(Card)({
  overflow: "hidden",
  borderRadius: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.12)", // More prominent shadow
  transition: "transform 0.4s ease, box-shadow 0.4s ease",
  "&:hover": {
    transform: "scale(1.01)", // Subtle scale on card hover
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },
  "& img": {
    width: "100%",
    height: "auto",
    display: "block",
    transition: "transform 0.5s ease",
    "&:hover": {
      transform: "scale(1.05)", // Gentle zoom effect on image hover
    },
  },
});

const PricingCard = styled(Card)(({ theme }) => ({
  textAlign: "center",
  padding: "50px 30px", // More vertical padding
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  border: `1px solid ${mediumGray}`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
  background: '#ffffff',

  "&:hover": {
    transform: "translateY(-12px) scale(1.02)", // More lift on hover
    boxShadow: "0 20px 45px rgba(0,0,0,0.15)",
    borderColor: theme.palette.primary.main, // Highlight border on hover
  },
  "&.featured": { // Styling for the featured card (Growth)
    border: `3px solid ${theme.palette.primary.main}`,
    boxShadow: `0 20px 50px rgba(190, 31, 47, 0.3)`,
    transform: "translateY(-15px) scale(1.03)", // Even more lift for featured
    "&:hover": {
      transform: "translateY(-18px) scale(1.04)",
      boxShadow: `0 25px 60px rgba(190, 31, 47, 0.4)`,
    }
  },
  "& .MuiListItem-root": {
    padding: theme.spacing(0.5, 0), // Tighter list items
  },
  "& .MuiListItemIcon-root": {
    minWidth: '32px', // Adjust icon spacing
  }
}));

export default function LandingPage() {
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const theme = useTheme();

  const handleAuthTrigger = () => {
    setShowAuthDialog(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    router.push("/company-onboarding");
  };

  useEffect(() => {
  const currentDomain = window.location.hostname;
  if (currentDomain === "www.cupcoutureshop.com") {
    router.push("/shop/the-cup-couture");
  } else if (currentDomain === "www.boromoto.com") {
    router.push("/shop/boromoto");
  } else {
    console.log("currentDomain  *****", currentDomain);
  }
}, [router]);
  return (
    <Box sx={{ bgcolor: lightGray, minHeight: '100vh' }}>
      {showAuthDialog && (
        <AuthDialog
          onTrigger={handleAuthSuccess}
          forceOpen={true}
          showButton={false}
        />
      )}
      <Container sx={{ mx: "auto", px: 1, pt: 5, pb: 8, maxWidth: { xl: "90vw" } }}>
        {/* Hero Section */}
        <HeroSection onClick={handleAuthTrigger}>
          {/* Decorative floating graphics */}
          <HeroGraphic sx={{ width: 100, height: 100, top: '10%', left: '10%', animationDelay: '0s' }} />
          <HeroGraphic sx={{ width: 150, height: 150, bottom: '15%', right: '10%', animationDelay: '1s' }} />
          <HeroGraphic sx={{ width: 70, height: 70, top: '20%', right: '5%', animationDelay: '0.5s' }} />
          <HeroGraphic sx={{ width: 120, height: 120, bottom: '5%', left: '5%', animationDelay: '1.5s' }} />

          <Zoom duration={1200}>
            <Box sx={{
              position: 'relative',
              zIndex: 2,
              px: { xs: 2, sm: 4, md: 8 },
              py: { xs: 8, sm: 10, md: 12 },
              maxWidth: '1000px', // Slightly narrower for focus
              mx: 'auto',
            }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900, // Extra bold
                  mb: { xs: 2, md: 3 },
                  color: "#fff",
                  fontSize: {
                    xs: '2.4rem',
                    sm: '2.8rem',
                    md: '3.8rem',
                    lg: '4.8rem',
                  },
                  lineHeight: { xs: 1.1, sm: 1.05, md: 1 },
                  letterSpacing: { xs: '-0.02em', md: '-0.03em' }, // Tighter letter spacing for headings
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <Typewriter
                    options={{
                      strings: ["Empower Your Business", "Next-Gen eCommerce", "Simplify, Grow Online"],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </Suspense>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  maxWidth: "700px", // More concise
                  mx: "auto",
                  mb: { xs: 5, md: 6 },
                  color: "rgba(255,255,255,0.9)",
                  fontSize: {
                    xs: '1.1rem',
                    sm: '1.25rem',
                    md: '1.4rem',
                  },
                  lineHeight: 1.5,
                }}
              >
                Launch, manage, and grow your enterprise with sokoJunction the all-in-one platform designed for simplicity, speed, and success in the digital marketplace.
              </Typography>
              <AccentButton
                onClick={handleAuthTrigger}
                endIcon={<ArrowForwardIcon />} // Add icon to main CTA
              >
                Get Started Today
              </AccentButton>
            </Box>
          </Zoom>
        </HeroSection>



        {/* Features Section */}
        <Box sx={{ py: 10 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 8, textAlign: "center", color: darkText }}>
            Why <span style={{ color: theme.palette.primary.main }}>sokoJunction</span> is Your Best Choice
          </Typography>
          <Grid container gap={3} justifyContent="center">
            <Grid item xs={12} md={3}>
              <Fade direction="down" duration={1000}>
                <FeatureCard>
                  <StorefrontIcon /> {/* Changed icon for variety */}
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: darkText }}>
                    Instant Storefront Creation
                  </Typography>
                  <Typography color={lightText}>
                    Launch your fully functional online store in minutes with stunning, customizable templates.
                  </Typography>
                </FeatureCard>
              </Fade>
            </Grid>

            <Grid item xs={12} md={3}>
              <Fade delay={200} duration={1000}>
                <FeatureCard>
                  <ShoppingCartIcon />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: darkText }}>
                    Seamless Checkout & Payments
                  </Typography>
                  <Typography color={lightText}>
                    Offer a smooth, secure shopping experience with integrated global payment solutions.
                  </Typography>
                </FeatureCard>
              </Fade>
            </Grid>

            <Grid item xs={12} md={3}>
              <Fade direction="down" delay={400} duration={1000}>
                <FeatureCard>
                  <TrendingUpIcon />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: darkText }}>
                    Scalable Growth Tools
                  </Typography>
                  <Typography color={lightText}>
                    Access powerful analytics and marketing features to effortlessly expand your reach and sales.
                  </Typography>
                </FeatureCard>
              </Fade>
            </Grid>
          </Grid>
        </Box>



        {/* Explore sokoJunction in Action Section (Alternating Layouts) */}
        <Box sx={{ py: 10 }}>
          <Slide direction="up" triggerOnce>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 8, textAlign: "center", color: darkText }}>
              See <span style={{ color: theme.palette.primary.main }}>sokoJunction</span> in Action
            </Typography>

            {/* Section 1: Sleek Storefronts */}
            <Grid container spacing={6} alignItems="center" sx={{ mb: 12 }}>
              <Grid item xs={12} md={6}>
                <ImageCard sx={{ ml: { md: -5 }, zIndex: 1, position: 'relative' }}> {/* Slight overlap */}
                <Image
                  src="/assets/this.png"
                  alt="Sleek eCommerce Storefront Designs"
                  width={800} // Replace with actual width
                  height={600} // Replace with actual height
                  layout="responsive"
                  priority={false}
                />

                </ImageCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <Fade direction="down" triggerOnce>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: darkText, mb: 2 }}>
                    Stunning, Customizable Storefronts
                  </Typography>
                  <Typography variant="body1" color={lightText} sx={{ mb: 3 }}>
                    First impressions matter. sokoJunction provides a suite of elegant, responsive templates that can be easily customized to reflect your brand&apos;s unique identity. No coding required, just pure design freedom.
                  </Typography>
                  <AccentButton sx={{ py: '12px', px: '25px', fontSize: '1rem' }} onClick={handleAuthTrigger}>
                    Build Your Store
                  </AccentButton>
                </Fade>
              </Grid>
            </Grid>

            {/* Section 2: Intuitive Admin Dashboard */}
            <Grid container spacing={6} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }} sx={{ mb: 12 }}>
              <Grid item xs={12} md={6}>
                <Fade direction="up" triggerOnce>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: darkText, mb: 2 }}>
                    Intuitive Admin Dashboard & Control
                  </Typography>
                  <Typography variant="body1" color={lightText} sx={{ mb: 3 }}>
                    Manage products, orders, customers, and analytics from a single, easy-to-use dashboard. sokoJunction simplifies your daily operations, giving you more time to focus on growth.
                  </Typography>
                  <AccentButton sx={{ py: '12px', px: '25px', fontSize: '1rem' }} onClick={handleAuthTrigger}>
                    Explore Dashboard
                  </AccentButton>
                </Fade>
              </Grid>
              <Grid item xs={12} md={6}>
                <ImageCard sx={{ mr: { md: -5 }, zIndex: 1, position: 'relative' }}> {/* Slight overlap */}
                  <Image
                    src="/assets/admin.png"
                    alt="Powerful Admin Dashboard"
                    width={800} // Replace with actual width
                    height={600} // Replace with actual height
                    layout="responsive"
                    priority={false}
                  />
                </ImageCard>
              </Grid>
            </Grid>

            {/* Section 3: AI-Powered Insights */}
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <ImageCard sx={{ ml: { md: -5 }, zIndex: 1, position: 'relative' }}> {/* Slight overlap */}
                <Image
                  src="/assets/simple.png"
                  alt="AI-Powered Insights Dashboard"
                  width={800} // Replace with actual width
                  height={600} // Replace with actual height
                  layout="responsive"
                  priority={false}
                />

                </ImageCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <Fade direction="down" triggerOnce>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: darkText, mb: 2 }}>
                    AI-Powered Insights for Smarter Decisions
                  </Typography>
                  <Typography variant="body1" color={lightText} sx={{ mb: 3 }}>
                    Leverage artificial intelligence to uncover trends, optimize pricing, and personalize customer experiences. sokoJunction&apos;s AI insights give you the competitive edge.
                  </Typography>
                  <AccentButton sx={{ py: '12px', px: '25px', fontSize: '1rem' }} onClick={handleAuthTrigger}>
                    Unlock Insights
                  </AccentButton>
                </Fade>
              </Grid>
            </Grid>
          </Slide>
        </Box>



        {/* Pricing Section */}
        <Box sx={{ py: 10, px: 4, bgcolor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <Fade cascade triggerOnce>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: "center", color: darkText }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "800px", mx: "auto", mb: 6, color: lightText, textAlign: "center", fontSize: { xs: '1rem', md: '1.15rem' } }}>
              Choose the plan that fits your business needs. No hidden fees, just straightforward pricing designed for your success.
            </Typography>

            <Grid container spacing={5} justifyContent="center"> {/* Tighter spacing */}
              <Grid item xs={12} md={4}>
                <PricingCard>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
                      Starter
                    </Typography>
                    <Typography variant="body2" color={lightText} sx={{ mb: 2 }}>
                      Perfect for new businesses taking their first steps online.
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: darkText }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: lightText, textDecoration: "line-through" }}>
                        $15 <Typography component="span" variant="h6" color={lightText}>/mo</Typography>
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          mb: 2,
                          color: theme.palette.primary.main,
                        }}
                      >
                        $0 <Typography component="span" variant="h6" sx={{ color: darkText }}>/mo</Typography>
                      </Typography>
                    </Typography>
                    <List sx={{ textAlign: 'left', mx: 'auto', maxWidth: '220px', mb: 3 }}>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Quick Store Setup</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Showcase up to 50 products</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Reliable Standard Support</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Basic Analytics</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Custom Theme</Typography>} />
                      </ListItem>
                    </List>
                  </Box>
                  <Button variant="outlined" sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, mt: 3, padding: "10px 25px", borderRadius: "20px", fontWeight: 600, "&:hover": { bgcolor: theme.palette.primary.main, color: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' } }} onClick={handleAuthTrigger}>
                    Choose Starter
                  </Button>
                </PricingCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <PricingCard className="featured"> {/* Apply featured class */}
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
                      Growth <span style={{ fontSize: '0.8em', color: theme.palette.primary.dark }}>(Recommended)</span>
                    </Typography>
                    <Typography variant="body2" color={lightText} sx={{ mb: 2 }}>
                      Ideal for expanding SMEs ready to scale their operations.
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: darkText }}>
                      $39<Typography component="span" variant="h6" color={lightText}>/mo</Typography>
                    </Typography>
                    <List sx={{ textAlign: 'left', mx: 'auto', maxWidth: '220px', mb: 3 }}>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>**All Starter Features**</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>List Unlimited Products</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Enhanced Notifications(SMS,  email, WhatsApp)</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Integrated Email Marketing</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Advanced Sales Reports</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Priority Shop Listing</Typography>} />
                      </ListItem>
                    </List>
                  </Box>
                  <AccentButton onClick={handleAuthTrigger}>Choose Growth</AccentButton>
                </PricingCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <PricingCard>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
                      Pro
                    </Typography>
                    <Typography variant="body2" color={lightText} sx={{ mb: 2 }}>
                      Designed for established enterprises seeking advanced control.
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: darkText }}>
                      $79<Typography component="span" variant="h6" color={lightText}>/mo</Typography>
                    </Typography>
                    <List sx={{ textAlign: 'left', mx: 'auto', maxWidth: '220px', mb: 3 }}>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>**All Growth Features**</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>AI enabled targeted marketing</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Multi-User & Role Access</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Dedicated Priority Support</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Custom Integrations</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Full time dev support</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Custom Landing Page</Typography>} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Custom Domain propagation</Typography>} />
                      </ListItem>
                    </List>
                  </Box>
                  <Button variant="outlined" sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, mt: 3, padding: "10px 25px", borderRadius: "20px", fontWeight: 600, "&:hover": { bgcolor: theme.palette.primary.main, color: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' } }} onClick={handleAuthTrigger}>
                    Choose Pro
                  </Button>
                </PricingCard>
              </Grid>
            </Grid>
          </Fade>
        </Box>


        <Suspense fallback={<CircularProgress />}>
          <FAQ />
        </Suspense>



        {/* Call to Action Section (Final) */}
        <Box sx={{ textAlign: "center", py: 12 }}>
          <Zoom triggerOnce>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, color: darkText }}>
              Ready to Transform Your Business?
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "800px", mx: "auto", mb: 5, color: lightText, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              Join thousands of thriving SMEs who trust sokoJunction to power their online sales. Experience the future of eCommerce, risk-free.
            </Typography>
            <AccentButton onClick={handleAuthTrigger} endIcon={<ArrowForwardIcon />}>
              Start Your Free Trial Now
            </AccentButton>
          </Zoom>
        </Box>
      </Container>
    </Box>
  );
}