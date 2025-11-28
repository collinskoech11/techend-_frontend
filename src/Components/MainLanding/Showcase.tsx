"use client";

import React from "react";
import { Box, Typography, Grid, useTheme, Theme, styled, alpha, Button } from "@mui/material";
import { Fade, Slide } from "react-awesome-reveal";
import Image from "next/image";
// Assuming AccentButton is the GlowButton/PrimaryButton you defined previously
// If not available, you can use a styled MUI Button here.
// For this example, I'll use a styled Button to ensure it works.

// Assuming the previous GlowButton style for consistency
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


const ImageCard = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  borderRadius: "16px", // Slightly less round than before for a sharp look
  position: 'relative',
  zIndex: 10, // Ensure it sits above the background
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  // Updated shadow for a premium floating effect
  boxShadow: `0 30px 60px -15px ${alpha(theme.palette.common.black, 0.3)}`,
  transition: "transform 0.5s ease, box-shadow 0.5s ease",
  backdropFilter: 'blur(5px)', // Subtle glass effect on the card itself

  "&:hover": {
    transform: "translateY(-5px) scale(1.005)", // Slight lift and scale
    boxShadow: `0 40px 80px -15px ${alpha(theme.palette.primary.main, 0.3)}`, // Primary color accent glow
  },
  
  // Style for the actual image
  "& img": {
    width: "100%",
    height: "auto",
    display: "block",
    transition: "transform 0.8s ease",
  },
  
  // No deep hover scale on image to keep it clean, the card lift is enough
  "&:hover img": {
    transform: "scale(1.0)",
  },
  
  // Optional: Add a subtle overlay to the image to integrate it better
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.05) 0%, transparent 50%)',
    zIndex: 11,
    pointerEvents: 'none',
  }
}));

// Function to replace hardcoded colors with theme colors
const getThemeColor = (theme: Theme) => ({
  primary: theme.palette.text.primary,
  secondary: theme.palette.text.secondary,
  accent: theme.palette.primary.main,
});

interface ShowcaseProps {
  handleAuthTrigger: () => void;
}

const Showcase: React.FC<ShowcaseProps> = ({ handleAuthTrigger }) => {
  const theme = useTheme();
  const colors = getThemeColor(theme);

  return (
    <Box 
      sx={{ 
        py: 12, 
        background: theme.palette.background.default, // Use theme background
        overflow: 'hidden' // Prevents layout shift from card margins
      }} 
      id="showcase"
    >
      <Slide direction="up" triggerOnce>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            mb: 10, 
            textAlign: "center", 
            color: colors.primary,
            fontSize: { xs: "2rem", md: "2.5rem" } 
          }}
        >
          See <span style={{ color: colors.accent }}>sokoJunction</span> in Action
        </Typography>

        {/* --- Section 1: Sleek Storefronts (Image Left) --- */}
        <Grid container spacing={8} alignItems="center" sx={{ mb: 12 }}>
          <Grid item xs={12} md={6}>
            <Fade direction="left" triggerOnce>
              <ImageCard 
                sx={{ 
                  ml: { md: 2 }, // Larger offset for dramatic effect
                  transform: { md: 'rotate(-2deg)' } // Subtle tilt
                }}
              >
                <Image
                  src="/assets/this.png"
                  alt="Sleek eCommerce Storefront Designs"
                  width={800}
                  height={600}
                  layout="responsive"
                  priority={false}
                />
              </ImageCard>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade direction="right" triggerOnce delay={200}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary, mb: 2 }}>
                Stunning, Customizable Storefronts 🚀
              </Typography>
              <Typography variant="body1" color={colors.secondary} sx={{ mb: 4, fontSize: '1.15rem', lineHeight: 1.7 }}>
                First impressions matter. sokoJunction provides a suite of elegant, responsive templates that can be easily customized to reflect your brand&apos;s unique identity. No coding required, just pure design freedom.
              </Typography>
              <AccentButton onClick={handleAuthTrigger}>
                Build Your Store Now
              </AccentButton>
            </Fade>
          </Grid>
        </Grid>

        {/* --- Section 2: Intuitive Admin Dashboard (Image Right) --- */}
        <Grid container spacing={8} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }} sx={{ mb: 12 }}>
          <Grid item xs={12} md={6}>
            <Fade direction="left" triggerOnce delay={200}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary, mb: 2 }}>
                Intuitive Admin Dashboard & Control 📊
              </Typography>
              <Typography variant="body1" color={colors.secondary} sx={{ mb: 4, fontSize: '1.15rem', lineHeight: 1.7 }}>
                Manage products, orders, customers, and analytics from a single, easy-to-use dashboard. sokoJunction simplifies your daily operations, giving you more time to focus on growth.
              </Typography>
              <AccentButton onClick={handleAuthTrigger}>
                Explore Dashboard Demo
              </AccentButton>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade direction="right" triggerOnce>
              <ImageCard 
                sx={{ 
                  mr: { md: 2 }, // Larger offset for dramatic effect
                  transform: { md: 'rotate(2deg)' } // Subtle tilt (opposite direction)
                }}
              >
                <Image
                  src="/assets/admin.png"
                  alt="Powerful Admin Dashboard"
                  width={800}
                  height={600}
                  layout="responsive"
                  priority={false}
                />
              </ImageCard>
            </Fade>
          </Grid>
        </Grid>

        {/* --- Section 3: AI-Powered Insights (Image Left) --- */}
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade direction="left" triggerOnce>
              <ImageCard 
                sx={{ 
                  ml: { md: 2 },
                  transform: { md: 'rotate(-2deg)' } 
                }}
              >
                <Image
                  src="/assets/simple.png"
                  alt="AI-Powered Insights Dashboard"
                  width={800}
                  height={600}
                  layout="responsive"
                  priority={false}
                />
              </ImageCard>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade direction="right" triggerOnce delay={200}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary, mb: 2 }}>
                AI-Powered Insights for Smarter Decisions 💡
              </Typography>
              <Typography variant="body1" color={colors.secondary} sx={{ mb: 4, fontSize: '1.15rem', lineHeight: 1.7 }}>
                Leverage artificial intelligence to uncover trends, optimize pricing, and personalize customer experiences. sokoJunction&apos;s AI insights give you the competitive edge.
              </Typography>
              <AccentButton onClick={handleAuthTrigger}>
                Unlock Insights
              </AccentButton>
            </Fade>
          </Grid>
        </Grid>
      </Slide>
    </Box>
  );
};

export default Showcase;