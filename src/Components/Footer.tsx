"use client";

import { Box, Grid, Typography, Link as MuiLink, useTheme, CircularProgress, alpha } from "@mui/material";
import React from "react";
import { keyframes, darken, styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useGetCompanyBySlugQuery } from "@/Api/services";

// Wave animation keyframes
const waveAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- Styled Component for Footer Links ---
const FooterLink = styled(MuiLink)(({ theme }) => ({
    display: "block",
    marginBottom: theme.spacing(1.5),
    color: alpha(theme.palette.common.white, 0.7), // Faint white
    fontSize: 15, // Slightly larger font
    transition: 'color 0.3s ease',
    
    // Premium hover effect: change to the accent color
    "&:hover": { 
        color: theme.palette.secondary.light, // Use secondary/lighter accent for hover
        textDecoration: 'underline'
    },
}));

// --- Styled Component for Inner Cards (Glass effect) ---
const GlassBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 3, // More pronounced rounding
    // Cleaner, stronger glass effect
    background: alpha(theme.palette.common.white, 0.08), 
    backdropFilter: 'blur(5px)',
    boxShadow: `0 8px 30px ${alpha(theme.palette.common.black, 0.3)}`,
    height: '100%',
}));


function Footer() {
  const theme = useTheme();
  const router = useRouter();
  // Ensure we use the correct type for router query slug
  const shopSlug = router.query.shop as string | undefined;

  const { data: companyData, isLoading, isError } = useGetCompanyBySlugQuery(shopSlug!, {
    skip: !shopSlug,
  });

  const primaryDark = darken(theme.palette.primary.main, 0.7);

  const renderContactInfo = () => {
    // Default data for the main site (when not a shop slug)
    if (!shopSlug) {
      return (
        <>
          <Typography variant="body1" sx={{ mb: 1, color: alpha(theme.palette.common.white, 0.9) }}>sokojunction@gmail.com</Typography>
          <Typography variant="body1" sx={{ mb: 1, color: alpha(theme.palette.common.white, 0.9) }}>+254 703 508881</Typography>
          <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.9) }}>Nairobi, Kenya</Typography>
        </>
      );
    }

    if (isLoading) return <CircularProgress size={24} sx={{ color: alpha(theme.palette.common.white, 0.9) }} />;
    if (isError || !companyData)
      return <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.9) }}>Contact information not available.</Typography>;

    // Shop-specific data
    return (
      <>
        <Typography variant="body1" sx={{ mb: 1, color: alpha(theme.palette.common.white, 0.9) }}>{companyData.contact_email}</Typography>
        <Typography variant="body1" sx={{ mb: 1, color: alpha(theme.palette.common.white, 0.9) }}>{companyData.contact_phone}</Typography>
        <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.9) }}>
          {companyData.physical_address}, {companyData.city}, {companyData.country}
        </Typography>
      </>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        // Enhanced Gradient Background: use theme colors consistently
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${primaryDark} 100%)`,
        color: theme.palette.common.white,
        pt: { xs: 8, md: 12 }, // More vertical padding
        pb: { xs: 4, md: 6 },
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%", // Increased width for smoother wave scroll
          height: "100%",
          backgroundRepeat: "repeat-x",
          zIndex: 0,
          opacity: 0.1, // Softer wave effect
        },
        "&::before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')`,
          backgroundSize: "2000px 320px",
          animation: `${waveAnimation} 30s linear infinite`,
        },
        "&::after": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="1" d="M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,229.3C672,224,768,160,864,160C960,160,1056,224,1152,224C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')`,
          backgroundSize: "2200px 350px",
          animation: `${waveAnimation} 35s linear infinite reverse`,
        },
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          width: "1200px", // Slightly tighter constraint for focus
          maxWidth: "95%",
          margin: "auto",
          position: "relative",
          zIndex: 1,
          px: { xs: 2, md: 0 }
        }}
      >
        {/* Contact Us */}
        <Grid item xs={12} md={4}>
          <GlassBox>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: theme.palette.common.white }}>
              Contact Us 📧
            </Typography>
            {renderContactInfo()}
          </GlassBox>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={4}>
          <GlassBox>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: theme.palette.common.white }}>
              Quick Links
            </Typography>
            {["Features", "Pricing", "Showcase", "Testimonials"].map((link) => (
              <FooterLink
                key={link}
                href={`https://sokojunction.com/#${link.toLowerCase()}`}
                underline="none"
              >
                {link}
              </FooterLink>
            ))}
          </GlassBox>
        </Grid>

        {/* Support */}
        <Grid item xs={12} md={4}>
          <GlassBox>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: theme.palette.common.white }}>
              Support
            </Typography>
            {["FAQ", "Contact Us", "Terms of Service"].map((link, idx) => (
              <FooterLink
                key={idx}
                href={link === "Terms of Service" ? "https://sokojunction.com/terms" : `https://sokojunction.com/#${link.replace(" ", "").toLowerCase()}`}
                underline="none"
              >
                {link}
              </FooterLink>
            ))}
          </GlassBox>
        </Grid>
      </Grid>
      
      {/* Copyright */}
      <Box
        sx={{
          textAlign: "center",
          mt: 8, // More space above copyright
          color: alpha(theme.palette.common.white, 0.6), // Muted copyright text
          fontSize: 14,
          position: "relative",
          zIndex: 1,
          borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, // Subtle separator line
          pt: 3,
          mx: { xs: 2, md: 0 }
        }}
      >
        © {new Date().getFullYear()} SokoJunction. All rights reserved.
      </Box>
    </Box>
  );
}

export default Footer;