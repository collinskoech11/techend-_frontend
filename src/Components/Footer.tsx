import { ProductPrice, ReviewText } from "@/StyledComponents/Typos";
import { Box, Button, Grid, TextField, Typography, Link as MuiLink, useTheme } from "@mui/material";
import React from "react";
import { styled, keyframes } from "@mui/material/styles"; // Import keyframes and styled
import { darken } from '@mui/material/styles';

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

// Re-defining AccentButton for consistency if it's used here and elsewhere
const AccentButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  textTransform: "capitalize",
  padding: "12px 28px",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: "none",
  },
}));

function Footer() {
  const theme = useTheme();
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
          {/* Talk to Us Section */}
          <Grid item md={3} xs={12} sm={6} sx={{ mb: { xs: 3, md: 0 } }}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: brighterText }}>
                Talk to Us
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5, color: lightText }}>
                +254 728 000 107
              </Typography>
              <Typography variant="body2" sx={{ color: lightText }}>
                Join our open eCommerce community
              </Typography>
            </Box>
          </Grid>

          {/* Explore Section */}
          <Grid item md={2} xs={12} sm={6} sx={{ mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: brighterText }}>
              Explore
            </Typography>
            <MuiLink href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Open Products</Typography>
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Popular Items</Typography>
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Marketplace</Typography>
            </MuiLink>
          </Grid>

          {/* About Section */}
          <Grid item md={2} xs={12} sm={6} sx={{ mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: brighterText }}>
              About
            </Typography>
            <MuiLink href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Our Mission</Typography>
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Contact Us</Typography>
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Community Guidelines</Typography>
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 0.5, '&:hover': { color: theme.palette.primary.main } }}>
              <Typography variant="body2">Terms & Conditions</Typography>
            </MuiLink>
          </Grid>

          {/* Stay Connected Section */}
          <Grid item md={5} xs={12} sm={6}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: brighterText }}>
              Stay Connected
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: lightText }}>
              Enter your email to get updates on new features, products, and community events.
            </Typography>

            <TextField
              placeholder="Enter your email..."
              variant="outlined"
              size="medium"
              sx={{
                background: "#fff",
                borderRadius: "8px",
                overflow: 'hidden',
                "& .MuiOutlinedInput-root": {
                  paddingRight: 0,
                  borderRadius: "8px",
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
                "& input": {
                  padding: "14px 14px",
                  color: darkBackground,
                },
                width: '100%',
                display: 'flex',
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      fontSize: { xs: "0.85rem", sm: "1rem" },
                      textTransform: "capitalize",
                      padding: { xs: "12px 20px", sm: "15px 35px" },
                      borderRadius: "0 8px 8px 0",
                      height: '100%',
                      minWidth: { xs: '90px', sm: '120px' },
                      "&:hover": {
                        background: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                ),
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Footer;