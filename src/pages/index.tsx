"use client";

"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card, Container, List, ListItem, ListItemIcon, ListItemText, useTheme, CircularProgress, TextField, useMediaQuery } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from '@mui/icons-material/Storefront'; // More specific icon
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Typewriter from "typewriter-effect";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/router";
import AuthDialog from "@/Components/AuthDialog";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Icon for primary CTA
const FAQ = lazy(() => import("@/Components/FAQ"));
import Image from "next/image";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import FuturisticButton from "@/Components/FuturisticButton";
import { useCreateContactMessageMutation, useGetCompaniesQuery } from "@/Api/services";
import toast, { Toaster } from "react-hot-toast";
import Carousel from 'react-material-ui-carousel';
import TestimonialCard from "@/Components/TestimonialCard";
import { AccentButton } from "@/StyledComponents/Hero";
import { min } from "date-fns";
// Define a consistent color palette
const lightGray = "#f0f2f5"; // A softer, more modern light gray for backgrounds
const mediumGray = "#e0e0e0"; // For borders and subtle dividers
const darkText = "#212121"; // Very dark gray for main headings and strong text
const lightText = "#555555"; // Softer dark gray for body text

// Keyframes for subtle floating effect
// Animations
const floatAnimation = keyframes`
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const glowAnimation = keyframes`
  0%,100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

// Hero container
const twinkle = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.2; }
`;

const HeroSection = styled(Box)({
  background: `radial-gradient(ellipse at bottom, #0d1b2a 0%, #000 100%)`,
  color: "#fff",
  position: "relative",
  overflow: "hidden",
//  padding: "150px 20px",
  minHeight: "105vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  // Stars layer 1
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "200%",
    height: "200%",
    background: `transparent url("https://www.transparenttextures.com/patterns/stardust.png") repeat`,
    backgroundSize: "300px 300px",
    animation: `${twinkle} 3s infinite alternate`,
    opacity: 0.7,
    zIndex: 0,
  },

  // Stars layer 2 (different size + slower twinkle)
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "200%",
    height: "200%",
    background: `transparent url("https://www.transparenttextures.com/patterns/stardust.png") repeat`,
    backgroundSize: "500px 500px",
    animation: `${twinkle} 6s infinite alternate`,
    opacity: 0.4,
    zIndex: 0,
  },
});

// Floating ecommerce icons
interface FloatingIconProps {
  delay?: number;
  sx?: any;
  children?: React.ReactNode;
}

const FloatingIcon = ({ delay = 0, sx, children }: FloatingIconProps) => (
  <Box
    sx={{
      position: "absolute",
      fontSize: "3rem",
      color: "rgba(255,255,255,0.8)",
      animation: `${floatAnimation} 6s ease-in-out infinite ${delay}s, ${glowAnimation} 3s ease-in-out infinite`,
      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
      ...sx,
    }}
  >
    {children}
  </Box>
);

// Frosted glass container
const GlassBox = styled(Box)({
  position: "relative",
  zIndex: 2,
  maxWidth: "900px",
  margin: "auto",
  padding: "60px 30px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  textAlign: "center",
});

// Gradient CTA button
const GradientButton = styled(Button)({
  padding: "12px 30px",
  borderRadius: "50px",
  fontWeight: "700",
  fontSize: "1.1rem",
  background: "linear-gradient(90deg,#ff8a00,#e52e71)",
  color: "#fff",
  "&:hover": {
    background: "linear-gradient(90deg,#e52e71,#ff8a00)",
  },
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
  const { data: companiesData, isLoading: isLoadingCompanies, isError: isErrorCompanies } = useGetCompaniesQuery({});

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
  const handleNavigate = () => {
    router.push("/company-onboarding");
  };
  return (
    <Box sx={{ bgcolor: lightGray, minHeight: '100vh' }}>
      {showAuthDialog && (
        <AuthDialog
          onTrigger={handleAuthSuccess}
          forceOpen={true}
          showButton={false}
        />
      )}
      <Box sx={{ p: 0, mt: "-100px" }}>
        {/* Hero Section */}
        <HeroSection>
          {/* Floating ecommerce icons */}
          <FloatingIcon sx={{ top: "20%", left: "10%" }} delay={0}>
            <ShoppingCartOutlinedIcon fontSize="inherit" />
          </FloatingIcon>
          <FloatingIcon sx={{ bottom: "25%", right: "12%" }} delay={2}>
            <LocalOfferOutlinedIcon fontSize="inherit" />
          </FloatingIcon>
          <FloatingIcon sx={{ top: "35%", right: "20%" }} delay={1}>
            <CreditCardOutlinedIcon fontSize="inherit" />
          </FloatingIcon>
          <FloatingIcon sx={{ bottom: "15%", left: "15%" }} delay={3}>
            <LocalShippingOutlinedIcon fontSize="inherit" />
          </FloatingIcon>

          {/* Globe */}

          {/* Glass content */}
          <GlassBox>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                background: "linear-gradient(90deg,#ff8a00,#e52e71)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <Suspense fallback={<span>Loading...</span>}>
                <Typewriter
                  options={{
                    strings: [
                      "Empower Your Business",
                      "Launch Your Online Store",
                      "Next-Gen eCommerce",
                      "Grow with SokoJunction",
                    ],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </Suspense>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 5,
                color: "rgba(255,255,255,0.8)",
                maxWidth: "700px",
                mx: "auto",
              }}
            >
              Launch, manage, and grow your enterprise with SokoJunction — the all-in-one platform built for speed and success in the digital marketplace.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <GradientButton endIcon={<ArrowForwardIcon />} onClick={handleNavigate}>
                Get Started
              </GradientButton>
              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  borderColor: "rgba(255,255,255,0.5)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </GlassBox>
        </HeroSection>

        <Container maxWidth="xl" sx={{ py: 8 }}>
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
          <Box sx={{ py: 10, bgcolor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} id="pricing">
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
                          450 Kes <Typography component="span" variant="h6" color={lightText}>/mo</Typography>
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            mb: 2,
                            color: theme.palette.primary.main,
                          }}
                        >
                          0 Kes <Typography component="span" variant="h6" sx={{ color: darkText }}>/mo</Typography>
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
                        550 Kes<Typography component="span" variant="h6" color={lightText}>/mo</Typography>
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
                        1050 Kes<Typography component="span" variant="h6" color={lightText}>/mo</Typography>
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
          <Suspense fallback={<div>Loading FAQs...</div>}>
            <div id="faq">
              <FAQ />
            </div>
          </Suspense>
          {/* Testimonials Section */}
          <Box sx={{ py: 10, bgcolor: lightGray }} id="testimonials">
            <Fade cascade triggerOnce>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 8, textAlign: "center", color: darkText }}>
                What Our <span style={{ color: theme.palette.primary.main }}>Clients</span> Say
              </Typography>
              <Carousel
                autoPlay={true}
                animation="slide"
                indicators={true}
                navButtonsAlwaysVisible={false}
                cycleNavigation={true}
                interval={6000}
                sx={{
                  width: '100%',
                  maxWidth: '1200px',
                  mx: 'auto',
                  '.MuiIconButton-root': {
                    color: theme.palette.primary.main,
                  },
                  '.MuiButtonBase-root.MuiIconButton-root': {
                    color: theme.palette.primary.main,
                  },
                  '.MuiSvgIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '.MuiCarousel-indicator': {
                    color: theme.palette.primary.main,
                  },
                  '.MuiCarousel-indicator.Mui-active': {
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                {isMobile
                  ? companiesData?.results
                    ?.filter((company: any) => company.testimonial && company.testimonial.trim() !== '')
                    .map((company: any) => (
                      <TestimonialCard
                        key={company.id}
                        name={company.name}
                        testimonial={company.testimonial}
                        avatarSrc={`https://res.cloudinary.com/dqokryv6u/${company.logo_image}`}
                      />
                    ))
                  : companiesData?.results
                    ?.filter((company: any) => company.testimonial && company.testimonial.trim() !== '')
                    .reduce((acc: any[], company: any, index: number) => {
                      if (index % 2 === 0) {
                        acc.push([company]);
                      } else {
                        acc[acc.length - 1].push(company);
                      }
                      return acc;
                    }, [])
                    .map((pair: any[], index: number) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'center', gap: 4, p: 2 }}>
                        {pair.map((company: any) => (
                          <TestimonialCard
                            key={company.id}
                            name={company.name}
                            testimonial={company.testimonial}
                            avatarSrc={`https://res.cloudinary.com/dqokryv6u/${company.logo_image}`}
                          />
                        ))}
                      </Box>
                    ))}
              </Carousel>
            </Fade>
          </Box>
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
        </Container>
        <Toaster />
      </Box>
    </Box>
  );
}
