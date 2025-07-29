"use client";

import { Box, Typography, Button, Grid, Card, Container, useTheme } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles"; // Import keyframes
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Typewriter from "typewriter-effect";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { useRouter } from "next/router";
import { darken } from '@mui/material/styles';
import Image from 'next/image';


// Define a consistent color palette
const secondaryColor = "#3f51b5"; // A complementary blue
const lightGray = "#f8f8f8";
const darkText = "#333";
const lightText = "#666";

// Keyframes for the wave animation
const waveAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${darken(theme.palette.primary.main, 0.6)} 100%)`, // Still a base gradient
  color: "#fff",
  textAlign: "center",
  padding: "120px 0",
  borderRadius: "16px",
  marginBottom: "80px",
  position: "relative",
  overflow: "hidden", // Ensure waves don't spill
  // Wave overlay with animation
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Using a subtle linear gradient for wave-like texture, animated horizontally
    background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') repeat-x center bottom`,
    backgroundSize: '1600px 320px', // Adjust size for desired wave pattern
    opacity: 0.8, // Make it semi-transparent
    zIndex: 1,
    animation: `${waveAnimation} 20s linear infinite`, // Apply animation
  },
   // A second wave layer for more depth
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,229.3C672,224,768,160,864,160C960,160,1056,224,1152,224C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') repeat-x center bottom`,
    backgroundSize: '1800px 350px', // Slightly different size for variation
    opacity: 0.6,
    zIndex: 1,
    animation: `${waveAnimation} 25s linear infinite reverse`, // Animate in reverse for counter-motion
  },
}));

const AccentButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  textTransform: "capitalize",
  padding: "16px 40px",
  borderRadius: "30px", // More rounded for a softer feel
  fontWeight: 600,
  fontSize: "1.15rem",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)", // Stronger shadow
  transition: "all 0.4s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-3px) scale(1.02)", // Enhanced hover effect
    boxShadow: "0 12px 25px rgba(0,0,0,0.4)",
  },
}));

const FeatureCard = styled(Card)({
  textAlign: "center",
  padding: "40px 25px",
  borderRadius: "20px", // More rounded corners
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)", // Softer, more pronounced shadow
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "transform 0.4s ease, box-shadow 0.4s ease",
  border: `1px solid ${lightGray}`, // Subtle border
  "&:hover": {
    transform: "translateY(-10px) scale(1.02)", // Lift and slightly scale
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  },
});

const ImageCard = styled(Card)({
  overflow: "hidden",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  transition: "transform 0.4s ease, box-shadow 0.4s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  },
  "& img": {
    width: "100%",
    height: "auto",
    display: "block",
    transition: "transform 0.5s ease",
    "&:hover": {
      transform: "scale(1.1)", // Zoom effect on image hover
    },
  },
});

const PricingCard = styled(Card)({
  textAlign: "center",
  padding: "40px 30px",
  borderRadius: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
  border: `1px solid ${lightGray}`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.4s ease, box-shadow 0.4s ease",
  "&:hover": {
    transform: "translateY(-8px) scale(1.01)",
    boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
  },
});

export default function LandingPage() {
  const router = useRouter();
      const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const theme = useTheme();

  const getCardType = () => {
    if (/^4/.test(cardNumber)) return "visa";
    if (/^5[1-5]/.test(cardNumber)) return "mastercard";
    if (/^3[47]/.test(cardNumber)) return "amex";
    if (/^6(?:011|5)/.test(cardNumber)) return "discover";
    return null;
  };

  const handleSimulatePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;
      setPaymentStatus(isSuccess ? "success" : "error");

      if (isSuccess) {
        setTimeout(() => {
          reset();
        }, 2000);
      }
    }, 2000);
  };

  const reset = () => {
    setPaymentStatus("idle");
    setPhone("");
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setCryptoAddress("");
    setSelectedPaymentMethod("");
    setSelectedPlan("");
    setOpen(false);
  };

  const cardType = getCardType();
  return (
    <Box sx={{ bgcolor: lightGray }}> {/* Light background for the whole page */}
      <Container maxWidth="xl" 
          onClick={() =>{router.push("/company-onboarding")}}
      sx={{ mx: "auto", px: 3, pt: 5, pb: 8 }}>
        {/* Hero Section */}
      <HeroSection>
        <Zoom duration={1200}>
          <Box sx={{
            position: 'relative',
            zIndex: 2,
            px: { xs: 2, sm: 4, md: 8 },
            py: { xs: 8, sm: 10, md: 12 },
            maxWidth: '1200px',
            mx: 'auto',
          }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: { xs: 2, md: 3 },
                color: "#fff",
                fontSize: {
                  xs: '2.5rem',
                  sm: '3.25rem',
                  md: '4rem',
                  lg: '4.5rem',
                },
                lineHeight: { xs: 1.2, sm: 1.15, md: 1.1 },
              }}
            >
              <Typewriter
                options={{
                  strings: ["Smart eCommerce for SMEs", "Sell Online with Confidence", "Your Business, Simplified"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                mb: { xs: 4, md: 5 },
                color: "rgba(255,255,255,0.9)",
                fontSize: {
                  xs: '1rem',
                  sm: '1.05rem',
                  md: '1.25rem',
                  lg: '1.2rem',
                },
              }}
            >
              Everything you need to sell online — designed with **simplicity** and **calm** in mind. Empowering small and medium-sized enterprises to thrive in the digital marketplace.
            </Typography>
            <AccentButton sx={{
                padding: { xs: '10px 20px', sm: '12px 28px' },
                fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
            onClick={() =>{router.push("/company-onboarding")}}
            >Get Started for Free</AccentButton>
          </Box>
        </Zoom>
      </HeroSection>



        {/* Features Section */}
        <Box sx={{ py: 10 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 8, textAlign: "center", color: darkText }}>
            Why Choose <span style={{ color: theme.palette.primary.main }}>iMall</span>?
          </Typography>
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Fade direction="down" duration={1000}>
                <FeatureCard>
                  <StoreIcon sx={{ fontSize: 70, color: theme.palette.primary.main, mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: darkText }}>
                    All-in-One Storefront
                  </Typography>
                  <Typography color={lightText}>
                    Launch your store quickly with beautiful, intuitive templates and robust backend tools.
                  </Typography>
                </FeatureCard>
              </Fade>
            </Grid>

            <Grid item xs={12} md={4}>
              <Fade delay={200} duration={1000}>
                <FeatureCard>
                  <ShoppingCartIcon sx={{ fontSize: 70, color: theme.palette.primary.main, mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: darkText }}>
                    Flexible Payments
                  </Typography>
                  <Typography color={lightText}>
                    Accept payments globally with seamless, stress-free checkout integrations.
                  </Typography>
                </FeatureCard>
              </Fade>
            </Grid>

            <Grid item xs={12} md={4}>
              <Fade direction="up" delay={400} duration={1000}>
                <FeatureCard>
                  <TrendingUpIcon sx={{ fontSize: 70, color: theme.palette.primary.main, mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: darkText }}>
                    Grow With Ease
                  </Typography>
                  <Typography color={lightText}>
                    Start simple, scale at your pace — add advanced tools only when your business demands it.
                  </Typography>
                </FeatureCard>
              </Fade>
            </Grid>
          </Grid>
        </Box>

        {/* Explore iMall in Action Section */}
        <Box sx={{ py: 10 }}>
          <Slide direction="up" triggerOnce>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 8, textAlign: "center", color: darkText }}>
              Explore <span style={{ color: theme.palette.primary.main }}>iMall</span> in Action
            </Typography>

            <Grid container spacing={6} justifyContent="center">
              <Grid item xs={12} md={4}>
                <ImageCard>
                <Image
                  src="/assets/sample_ui_2.png"
                  alt="Modern eCommerce Storefront"
                  width={800} // replace with actual width
                  height={600} // replace with actual height
                  layout="responsive" // makes the image responsive within its container
                  priority={false} // set to true if it's above the fold
                />
                </ImageCard>
                <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center", color: lightText, fontWeight: 600 }}>
                  Sleek Storefront Designs
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <ImageCard>
                   <Image
                      src="/assets/sample_ui_1.png"
                      alt="Intuitive Admin Dashboard"
                      width={800} // Replace with actual image width
                      height={600} // Replace with actual image height
                      layout="responsive"
                      priority={false} // Set to true if this image should load immediately
                    />
                </ImageCard>
                <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center", color: lightText, fontWeight: 600 }}>
                  Powerful Admin Dashboard
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <ImageCard>
                  <Image
                    src="/assets/sample_ui.png"
                    alt="Engaging Marketplace View"
                    width={800} // adjust based on actual image dimensions
                    height={600} // adjust based on actual image dimensions
                    layout="responsive"
                    priority={false} // set to true if this image should load immediately
                  />

                </ImageCard>
                <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center", color: lightText, fontWeight: 600 }}>
                  Dynamic Marketplace Options
                </Typography>
              </Grid>
            </Grid>
          </Slide>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ py: 10, bgcolor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <Fade cascade triggerOnce>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: "center", color: darkText }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "800px", mx: "auto", mb: 6, color: lightText, textAlign: "center" }}>
              Affordable plans for every stage of your business — and Marketplace options with no upfront fees, just a small commission on sales.
            </Typography>

            <Grid container spacing={6} justifyContent="center">
              <Grid item xs={12} md={4}>
                <PricingCard>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                      Starter
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: darkText }}>
                      $15<Typography component="span" variant="h6" color={lightText}>/mo</Typography>
                    </Typography>
                    <Typography color={lightText} sx={{ mb: 3 }}>
                      Ideal for getting your first store online.
                    </Typography>
                    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '0 auto 20px auto', maxWidth: '200px' }}>
                      <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Basic Store Setup</Typography>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Product Listings (up to 50)</Typography>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Standard Support</Typography>
                      </li>
                    </ul>
                  </Box>
                  <Button variant="outlined" sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, mt: 3, padding: "10px 25px", borderRadius: "20px", "&:hover": { bgcolor: theme.palette.primary.main, color: '#fff' } }} onClick={() =>{router.push("/company-onboarding")}}>
                    Choose Plan
                  </Button>
                </PricingCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <PricingCard sx={{ border: `2px solid ${theme.palette.primary.main}`, boxShadow: `0 15px 40px rgba(190, 31, 47, 0.2)` }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                      Growth
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: darkText }}>
                      $39<Typography component="span" variant="h6" color={lightText}>/mo</Typography>
                    </Typography>
                    <Typography color={lightText} sx={{ mb: 3 }}>
                      For growing SMEs with inventory and marketing tools.
                    </Typography>
                    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '0 auto 20px auto', maxWidth: '200px' }}>
                      <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>All Starter Features</Typography>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Unlimited Products</Typography>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Inventory Management</Typography>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Email Marketing Tools</Typography>
                      </li>
                    </ul>
                  </Box>
                  <AccentButton onClick={() =>{router.push("/company-onboarding")}}>Choose Plan</AccentButton>
                </PricingCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <PricingCard>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                      Pro
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: darkText }}>
                      $79<Typography component="span" variant="h6" color={lightText}>/mo</Typography>
                    </Typography>
                    <Typography color={lightText} sx={{ mb: 3 }}>
                      For established sellers with advanced needs and priority support.
                    </Typography>
                    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '0 auto 20px auto', maxWidth: '200px' }}>
                      <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>All Growth Features</Typography>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Advanced Analytics</Typography>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Multi-User Access</Typography>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body1" color={lightText}>Priority Support</Typography>
                      </li>
                    </ul>
                  </Box>
                  <Button variant="outlined" sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, mt: 3, padding: "10px 25px", borderRadius: "20px", "&:hover": { bgcolor: theme.palette.primary.main, color: '#fff' } }} onClick={() =>{router.push("/company-onboarding")}}>
                    Choose Plan
                  </Button>
                </PricingCard>
              </Grid>
            </Grid>
          </Fade>
        </Box>

        {/* Call to Action Section */}
        <Box sx={{ textAlign: "center", py: 12 }}>
          <Zoom triggerOnce>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: darkText }}>
              Ready to simplify your online selling?
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "700px", mx: "auto", mb: 5, color: lightText }}>
              Join hundreds of SMEs already growing with iMall. Start your free trial today!
            </Typography>
            <AccentButton>Join iMall Today</AccentButton>
          </Zoom>
        </Box>
      </Container>
    </Box>
  );
}