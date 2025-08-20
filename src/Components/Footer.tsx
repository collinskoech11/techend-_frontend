import { Box, Button, Grid, TextField, Typography, Link as MuiLink, useTheme, CircularProgress } from "@mui/material";
import React from "react";
import { styled, keyframes } from "@mui/material/styles"; // Import keyframes and styled
import { darken } from '@mui/material/styles';
import { useRouter } from "next/router";
import { useGetCompanyBySlugQuery } from "@/Api/services";

// Define your brand colors (assuming these are consistent across your app)
const darkBackground = "#1a1a1a"; // A dark, sophisticated background for the footer
const lightText = "#e0e0e0"; // Light text for contrast on dark background
const brighterText = "#ffffff"; // For primary text like titles

// Define the wave animation keyframes - IMPORTANT: Ensure this is defined once globally
// or within the scope where HeroSection and Footer can both access it.
const waveAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function Footer() {
  const theme = useTheme();
  const router = useRouter();
  const { shop } = router.query;

  const { data: companyData, isLoading, isError } = useGetCompanyBySlugQuery(shop, {
    skip: !shop,
  });

  const renderContactInfo = () => {
    if (!shop) {
      return (
        <>
          <Typography variant="body1" sx={{ mb: 0.5, color: lightText }}>
            techendforgranted@gmail.com
          </Typography>
          <Typography variant="body1" sx={{ mb: 0.5, color: lightText }}>
            +254 728 000 107
          </Typography>
          <Typography variant="body2" sx={{ color: lightText }}>
            Nairobi, Kenya
          </Typography>
        </>
      );
    }

    if (isLoading) {
      return <CircularProgress size={24} sx={{ color: 'white' }} />;
    }

    if (isError || !companyData) {
      return <Typography variant="body2" sx={{ color: lightText }}>Contact information not available.</Typography>;
    }

    return (
      <>
        <Typography variant="body1" sx={{ mb: 0.5, color: lightText }}>
          {companyData.contact_email}
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5, color: lightText }}>
          {companyData.contact_phone}
        </Typography>
        <Typography variant="body2" sx={{ color: lightText }}>
          {companyData.physical_address}, {companyData.city}, {companyData.country}
        </Typography>
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${darken(theme.palette.primary.main, 0.8)} 100%)`,
          color: "#fff",
          pt: { xs: 4, md: 8 },
          pb: { xs: 4, md: 6 },
          // mt: "100px",

          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw", // Ensures full viewport width
            height: "100%",
            backgroundRepeat: "repeat-x",
            zIndex: 0,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          },

          "&::before": {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')`,
            backgroundSize: "1600px 320px",
            opacity: 0.8,
            animation: `${waveAnimation} 20s linear infinite`,
          },

          "&::after": {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,229.3C672,224,768,160,864,160C960,160,1056,224,1152,224C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')`,
            backgroundSize: "1800px 350px",
            opacity: 0.6,
            animation: `${waveAnimation} 25s linear infinite reverse`,
          },
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            color: lightText,
            padding: { xs: "20px", md: "20px" },
            maxWidth: "1400px",
            margin: "auto",
            position: 'relative', // Ensures grid content sits above waves
            zIndex: 1, // Ensures grid content sits above waves
          }}
        >
          {/* Contact Us Section */}
          <Grid item md={4} xs={12} sm={6} sx={{ mb: { xs: 3, md: 0 } }}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: brighterText }}>
                Contact Us
              </Typography>
              {renderContactInfo()}
            </Box>
          </Grid>

          {/* Quick Links Section */}
          <Grid item md={4} xs={12} sm={6} sx={{ mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: brighterText }}>
              Quick Links
            </Typography>
            <MuiLink href="https://sokojunction.com/#features" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Features</Typography>
            </MuiLink>
            <MuiLink href="https://sokojunction.com/#pricing" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Pricing</Typography>
            </MuiLink>
            <MuiLink href="https://sokojunction.com/#showcase" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Showcase</Typography>
            </MuiLink>
            <MuiLink href="https://sokojunction.com/#testimonials" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Testimonials</Typography>
            </MuiLink>
          </Grid>

          {/* Support Section */}
          <Grid item md={4} xs={12} sm={6} sx={{ mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: brighterText }}>
              Support
            </Typography>
            <MuiLink href="https://sokojunction.com/#faq" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">FAQ</Typography>
            </MuiLink>
            <MuiLink href="https://sokojunction.com/#contact" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Contact Us</Typography>
            </MuiLink>
            <MuiLink href="https://sokojunction.com/terms" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Terms of Service</Typography>
            </MuiLink>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Footer;
