"use client";

import React from "react";
import { Box, Typography, Grid, useTheme, Theme, styled, alpha, Container } from "@mui/material";
import Image from "next/image";
import { AccentButton } from "@/StyledComponents/Hero";


const ImageCard = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  borderRadius: "20px",
  position: 'relative',
  zIndex: 10,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: `0 30px 60px -15px ${alpha(theme.palette.common.black, 0.15)}`,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  backdropFilter: 'blur(5px)',

  "&:hover": {
    transform: "translateY(-6px) scale(1.01)",
    boxShadow: `0 35px 70px -15px ${alpha(theme.palette.primary.main, 0.3)}`,
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },
  
  "& img": {
    width: "100%",
    height: "auto",
    display: "block",
    transition: "transform 0.8s ease",
  },
  
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
        py: 16, 
        px: 3,
        background: `radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 40%), 
                     radial-gradient(circle at 90% 80%, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 40%),
                     ${theme.palette.background.default}`,
        position: "relative",
        overflow: 'hidden'
      }} 
      id="showcase"
    >
      {/* Decorative Blur Orbs */}
      <Box sx={{
        position: "absolute",
        top: "15%",
        left: "-10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      <Box sx={{
        position: "absolute",
        bottom: "15%",
        right: "-10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 70%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ textAlign: "center", mb: 12 }}>
          <Typography
            component="span"
            sx={{
              fontSize: "0.85rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.09),
              px: 2.5,
              py: 1,
              borderRadius: "20px",
              display: "inline-block",
              mb: 3,
            }}
          >
            Product Tour
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              color: colors.primary,
              fontSize: { xs: "2.25rem", md: "3.25rem" },
              letterSpacing: "-0.03em",
              lineHeight: 1.2
            }}
          >
            See <span style={{ 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.dark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>sokoJunction</span> in Action
          </Typography>
          <Typography variant="body1" sx={{ color: colors.secondary, mt: 2.5, maxWidth: "600px", mx: "auto", fontSize: "1.1rem" }}>
            Take a visual tour through our powerful ecosystem built to launch, run, and scale your digital storefront.
          </Typography>
        </Box>

        {/* --- Section 1: Sleek Storefronts (Image Left) --- */}
        <Grid container spacing={8} alignItems="center" sx={{ mb: 16 }}>
          <Grid item xs={12} md={6}>
              <ImageCard 
                sx={{ 
                  ml: { md: 2 },
                  transform: { md: 'rotate(-1.5deg)' }
                }}
              >
                <Image
                  src="/assets/this.png"
                  alt="Sleek eCommerce Storefront Designs"
                  width={800}
                  height={600}
                  layout="responsive"
                  priority={false}
                  loading="lazy"
                />
              </ImageCard>
          </Grid>
          <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.primary, mb: 2, letterSpacing: "-0.01em" }}>
                  Stunning, Customizable Storefronts 🚀
                </Typography>
                <Typography variant="body1" color={colors.secondary} sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
                  First impressions matter. sokoJunction provides a suite of elegant, responsive templates that can be easily customized to reflect your brand&apos;s unique identity. No coding required, just pure design freedom.
                </Typography>
                <AccentButton onClick={handleAuthTrigger}>
                  Build Your Store Now
                </AccentButton>
              </Box>
          </Grid>
        </Grid>

        {/* --- Section 2: Intuitive Admin Dashboard (Image Right) --- */}
        <Grid container spacing={8} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }} sx={{ mb: 16 }}>
          <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.primary, mb: 2, letterSpacing: "-0.01em" }}>
                  Intuitive Admin Dashboard & Control 📊
                </Typography>
                <Typography variant="body1" color={colors.secondary} sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
                  Manage products, orders, customers, and analytics from a single, easy-to-use dashboard. sokoJunction simplifies your daily operations, giving you more time to focus on growth.
                </Typography>
                <AccentButton onClick={handleAuthTrigger}>
                  Explore Dashboard Demo
                </AccentButton>
              </Box>
          </Grid>
          <Grid item xs={12} md={6}>
              <ImageCard 
                sx={{ 
                  mr: { md: 2 },
                  transform: { md: 'rotate(1.5deg)' }
                }}
              >
                <Image
                  src="/assets/admin.png"
                  alt="Powerful Admin Dashboard"
                  width={800}
                  height={600}
                  layout="responsive"
                  priority={false}
                  loading="lazy"
                />
              </ImageCard>
          </Grid>
        </Grid>

        {/* --- Section 3: AI-Powered Insights (Image Left) --- */}
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
              <ImageCard 
                sx={{ 
                  ml: { md: 2 },
                  transform: { md: 'rotate(-1.5deg)' } 
                }}
              >
                <Image
                  src="/assets/simple.png"
                  alt="AI-Powered Insights Dashboard"
                  width={800}
                  height={600}
                  layout="responsive"
                  priority={false}
                  loading="lazy"
                />
              </ImageCard>
          </Grid>
          <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.primary, mb: 2, letterSpacing: "-0.01em" }}>
                  AI-Powered Insights for Smarter Decisions 💡
                </Typography>
                <Typography variant="body1" color={colors.secondary} sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
                  Leverage artificial intelligence to uncover trends, optimize pricing, and personalize customer experiences. sokoJunction&apos;s AI insights give you the competitive edge.
                </Typography>
                <AccentButton onClick={handleAuthTrigger}>
                  Unlock Insights
                </AccentButton>
              </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Showcase;