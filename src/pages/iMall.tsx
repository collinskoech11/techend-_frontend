"use client";

import { Box, Typography, Button, Grid, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Typewriter from "typewriter-effect";

const AccentButton = styled(Button)({
  backgroundColor: "#be1f2f",
  color: "#fff",
  textTransform: "capitalize",
  padding: "14px 32px",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "1.1rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#a01624",
    transform: "translateY(-2px)",
  },
});

const FeatureCard = styled(Card)({
  textAlign: "center",
  padding: "40px 25px",
  borderRadius: "16px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const ImageCard = styled(Card)({
  overflow: "hidden",
  borderRadius: "16px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
  },
});

export default function LandingPage() {
  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", px: 3, pt: 5 }}>
      <Box sx={{ textAlign: "center", py: 12 }}>
        <Zoom>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
            <Typewriter
              options={{
                strings: ["iMall — Calm, Smart eCommerce for SMEs", "Sell Online with Confidence", "Your Business, Simplified"],
                autoStart: true,
                loop: true,
              }}
            />
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: "700px", mx: "auto", mb: 5, color: "text.secondary" }}>
            Everything you need to sell online — designed with simplicity and calm in mind.
          </Typography>
          <AccentButton>Get Started for Free</AccentButton>
        </Zoom>
      </Box>

      <Grid container spacing={8} sx={{ py: 10 }}>
        <Grid item xs={12} md={4}>
          <Fade>
            <FeatureCard>
              <StoreIcon sx={{ fontSize: 70, color: "#be1f2f", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                All-in-One Storefront
              </Typography>
              <Typography color="text.secondary">
                Launch your store quickly with beautiful, intuitive templates.
              </Typography>
            </FeatureCard>
          </Fade>
        </Grid>

        <Grid item xs={12} md={4}>
          <Fade delay={100}>
            <FeatureCard>
              <ShoppingCartIcon sx={{ fontSize: 70, color: "#be1f2f", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Flexible Payments
              </Typography>
              <Typography color="text.secondary">
                Accept payments globally with seamless, stress-free checkout.
              </Typography>
            </FeatureCard>
          </Fade>
        </Grid>

        <Grid item xs={12} md={4}>
          <Fade delay={200}>
            <FeatureCard>
              <TrendingUpIcon sx={{ fontSize: 70, color: "#be1f2f", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Grow With Ease
              </Typography>
              <Typography color="text.secondary">
                Start simple, scale at your pace — add tools only when you need them.
              </Typography>
            </FeatureCard>
          </Fade>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "center", py: 12 }}>
        <Slide direction="up">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 5 }}>
            Explore iMall in Action
          </Typography>

          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} md={4}>
              <ImageCard>
                <img src="https://via.placeholder.com/500x300?text=Storefront+Sample" alt="Storefront" width="100%" />
              </ImageCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageCard>
                <img src="https://via.placeholder.com/500x300?text=Admin+Dashboard" alt="Dashboard" width="100%" />
              </ImageCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageCard>
                <img src="https://via.placeholder.com/500x300?text=Marketplace+View" alt="Marketplace" width="100%" />
              </ImageCard>
            </Grid>
          </Grid>
        </Slide>
      </Box>

      <Box sx={{ textAlign: "center", py: 12 }}>
        <Fade cascade>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography sx={{ mb: 6, color: "text.secondary" }}>
            Affordable plans for every stage — and Marketplace options with no upfront fees.
          </Typography>

          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Starter — $15/mo
                </Typography>
                <Typography color="text.secondary">Ideal for getting your first store online.</Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Growth — $39/mo
                </Typography>
                <Typography color="text.secondary">For growing SMEs with inventory tools.</Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Pro — $79/mo
                </Typography>
                <Typography color="text.secondary">For established sellers with advanced needs.</Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Fade>
      </Box>

      <Box sx={{ textAlign: "center", py: 12 }}>
        <Zoom>
          <AccentButton>Join iMall Today</AccentButton>
        </Zoom>
      </Box>
    </Box>
  );
}
