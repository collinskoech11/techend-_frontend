"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card, Container, List, ListItem, ListItemIcon, ListItemText, useTheme, CircularProgress, TextField } from "@mui/material";
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

import FuturisticButton from "@/Components/FuturisticButton";
import { useCreateContactMessageMutation } from "@/Api/services";
import toast, { Toaster } from "react-hot-toast";
import { AccentButton } from "@/StyledComponents/Hero";
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

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
  100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
`;

const gridAnimation = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 40px 40px; }
`;

const rotateGlobe = keyframes`
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
`;

const moveMap = keyframes`
  from { background-position: 0 0; }
  to { background-position: 300px 0; }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  background: `
    radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)
  `,
  color: "#fff",
  textAlign: "center",
  borderRadius: "30px",
  marginBottom: "100px",
  position: "relative",
  overflow: "hidden",
  padding: "60px 0", // Adjusted padding

  // Animated grid overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 2px, transparent 0),
      linear-gradient(45deg, rgba(255, 255, 255, 0.05) 2px, transparent 0)
    `,
    backgroundSize: '40px 40px',
    animation: `${gridAnimation} 4s linear infinite`,
    zIndex: 1,
  },
}));

const HeroGraphic = styled(Box)({
  position: 'absolute',
  background: 'rgba(255,255,255,0.08)',
  borderRadius: '50%',
  animation: `${floatAnimation} 4s ease-in-out infinite, ${glowAnimation} 2s ease-in-out infinite alternate`,
  zIndex: 1,
  filter: 'blur(2px)', // Subtle blur for a futuristic feel
});



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
  const [createContactMessage, { isLoading }] = useCreateContactMessageMutation();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createContactMessage({ body: formState }).unwrap();
      toast.success("Message sent successfully!");
      setFormState({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

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

    const heroSection = document.getElementById("hero-section");
    const globe = document.getElementById("globe");

    if (heroSection && globe) {
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = heroSection;
        const centerX = offsetWidth / 2;
        const centerY = offsetHeight / 2;

        const rotateX = ((clientY - centerY) / centerY) * 10; // Max 10deg rotation
        const rotateY = ((clientX - centerX) / centerX) * -10; // Max 10deg rotation

        globe.style.transform = `translateY(-50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      };

      heroSection.addEventListener("mousemove", handleMouseMove);

      return () => {
        heroSection.removeEventListener("mousemove", handleMouseMove);
      };
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
        <HeroSection>
          {/* Decorative floating graphics */}
          <HeroGraphic sx={{ width: 100, height: 100, top: '10%', left: '10%', animationDelay: '0s' }} />
          <HeroGraphic sx={{ width: 150, height: 150, bottom: '15%', right: '10%', animationDelay: '1s' }} />
          <HeroGraphic sx={{ width: 70, height: 70, top: '20%', right: '5%', animationDelay: '0.5s' }} />
          <HeroGraphic sx={{ width: 120, height: 120, bottom: '5%', left: '5%', animationDelay: '1.5s' }} />

          {/* Interactive Globe */}
          <Box
            sx={{
              position: 'absolute',
              width: '50px',
              height: '50px',
              right: '10%',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              display: { xs: 'none', md: 'block' },
              perspective: '1000px',
            }}
          >
            <Box
              id="globe"
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 100px 100px, #555, #000)',
                position: 'relative',
                transformStyle: 'preserve-3d',
                animation: `${rotateGlobe} 30s linear infinite`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'url(/assets/globe-map.png) repeat-x',
                  backgroundSize: 'cover',
                  animation: 'moveMap 30s linear infinite',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 50% 50%, transparent 70%, rgba(0,0,0,0.5) 100%)',
                },
              }}
            />
          </Box>

          <Zoom duration={1200}>
            <Box sx={{
              position: 'relative',
              zIndex: 2,
              px: { xs: 2, sm: 4, md: 8 },
              py: { xs: 8, sm: 10, md: 12 },
              maxWidth: '1000px',
              mx: 'auto',
              background: 'rgba(255, 255, 255, 0.05)', // Semi-transparent background
              backdropFilter: 'blur(10px)', // Glassmorphism blur
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
              boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )' // Glassmorphism shadow
            }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: { xs: 2, md: 3 },
                  color: "#fff",
                  minHeight: '140px', // Ensure space for typewriter effect
                  fontSize: {
                    xs: '1.4rem',
                    sm: '1.8rem',
                    md: '2.8rem',
                    lg: '3.8rem',
                  },
                  lineHeight: { xs: 1.1, sm: 1.05, md: 1 },
                  letterSpacing: { xs: '-0.02em', md: '-0.03em' },
                  textShadow: '0 0 10px rgba(255,255,255,0.5)' // Subtle text glow
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <Typewriter
                    options={{
                      strings: ["Empower Your Business","Set up an e-commerce website in minutes...", "Next-Gen e-commerce", "Simplify, Grow Online", "Set up an e-commerce website in minutes..."],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </Suspense>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  maxWidth: "700px",
                  mx: "auto",
                  mb: { xs: 5, md: 6 },
                  color: "rgba(255,255,255,0.9)",
                  fontSize: {
                    xs: '1.1rem',
                    sm: '1.25rem',
                    md: '1.4rem',
                  },
                  lineHeight: 1.5,
                  textShadow: '0 0 5px rgba(255,255,255,0.3)' // Subtle text glow
                }}
              >
                Launch, manage, and grow your enterprise with sokoJunction the all-in-one platform designed for simplicity, speed, and success in the digital marketplace.
              </Typography>
              <FuturisticButton
                onClick={handleAuthTrigger}
                endIcon={<ArrowForwardIcon />} // Add icon to main CTA
              >
                Get Started Today
              </FuturisticButton>
            </Box>
          </Zoom>
        </HeroSection>



        {/* Features Section */}
        <Box sx={{ py: 10 }} id="features">
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
        <Box sx={{ py: 10 }} id="showcase">
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
        <Box sx={{ py: 10, px: 4, bgcolor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} id="pricing">
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
                      <ListItem>
                        <ListItemIcon><CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} /></ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color={lightText}>Payments Automation (Mpesa, Crypto, Cards)</Typography>} />
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
          <div id="faq">
            <FAQ />
          </div>
        </Suspense>

        {/* Contact Us Section */}
        <Box sx={{ py: 10, px: 4, bgcolor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} id="contact">
          <Fade cascade triggerOnce>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: "center", color: darkText }}>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "800px", mx: "auto", mb: 6, color: lightText, textAlign: "center", fontSize: { xs: '1rem', md: '1.15rem' } }}>
              Have a question or want to learn more? Send us a message and we&apos;ll get back to you as soon as possible.
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={8}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Name" name="name" value={formState.name} onChange={handleInputChange} variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email" name="email" value={formState.email} onChange={handleInputChange} variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth multiline rows={4} label="Message" name="message" value={formState.message} onChange={handleInputChange} variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, py: '12px', px: '30px', fontSize: '1rem', borderRadius: '20px', fontWeight: 600 }}>
                        {isLoading ? <CircularProgress size={24} /> : "Send Message"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Fade>
        </Box>



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
      <Toaster />
      </Container>
    </Box>
  );
}