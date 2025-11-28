"use client";

import React from "react";
import { Box, Typography, useTheme, alpha, styled, Button, Theme } from "@mui/material";
import { Zoom } from "react-awesome-reveal";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// Assuming AccentButton is the GlowButton/PrimaryButton defined earlier

// Helper function to get theme colors
const getThemeColor = (theme: Theme) => ({
    accent: theme.palette.primary.main,
    secondaryAccent: theme.palette.secondary.main,
});

// Reusing the Glow Button style (for self-contained functionality)
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

// --- New CTA Wrapper Style ---
const CTAWrap = styled(Box)(({ theme }) => {
    const colors = getThemeColor(theme);
    return {
        padding: theme.spacing(8, 4),
        borderRadius: '24px',
        margin: theme.spacing(0, 'auto'),
        maxWidth: '1000px',
        textAlign: "center",
        
        // Dynamic Gradient Background for high impact
        background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondaryAccent})`,
        
        // Strong Shadow for an elevated "platform" feel
        boxShadow: `0 20px 50px -15px ${alpha(colors.accent, 0.6)}`,
        
        // Ensure text is light/white inside the dark box
        color: theme.palette.common.white,

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(6, 2),
        }
    };
});

interface FinalCTAProps {
  handleAuthTrigger: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ handleAuthTrigger }) => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 12 }}>
      <Zoom triggerOnce>
        <CTAWrap>
            <Typography 
                variant="h3" 
                sx={{ 
                    fontWeight: 800, 
                    mb: 3, 
                    color: theme.palette.common.white, // Ensure text is white
                    fontSize: { xs: "2rem", md: "3rem" } 
                }}
            >
                Ready to Transform Your Business?
            </Typography>
            <Typography 
                variant="h6" 
                sx={{ 
                    maxWidth: "800px", 
                    mx: "auto", 
                    mb: 5, 
                    color: alpha(theme.palette.common.white, 0.9), // Slightly transparent white
                    fontSize: { xs: '1rem', md: '1.25rem' } 
                }}
            >
                Join thousands of thriving SMEs who trust sokoJunction to power their online sales. Experience the future of eCommerce, risk-free.
            </Typography>
            
            {/* The AccentButton will stand out sharply against the gradient background */}
            <AccentButton 
                onClick={handleAuthTrigger} 
                endIcon={<ArrowForwardIcon />}
                size="large"
                // Optional: Override button style to be white/outline for max contrast
                sx={{
                    background: theme.palette.common.white,
                    color: theme.palette.primary.main,
                    boxShadow: 'none',
                    "&:hover": {
                        background: alpha(theme.palette.common.white, 0.9),
                        transform: "translateY(-2px)",
                    }
                }}
            >
                Start Your Free Trial Now
            </AccentButton>
        </CTAWrap>
      </Zoom>
    </Box>
  );
};

export default FinalCTA;