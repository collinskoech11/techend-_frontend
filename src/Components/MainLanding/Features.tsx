"use client";

import React from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  useTheme, 
  alpha, 
  styled 
} from "@mui/material";
import { Fade } from "react-awesome-reveal";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import RocketLaunchTwoToneIcon from "@mui/icons-material/RocketLaunchTwoTone";

// --- Styled Components ---

const SectionWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  background: theme.palette.background.default,
  // Subtle radial gradient in background to highlight the section
  backgroundImage: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(5, 4),
  borderRadius: "24px",
  background: alpha(theme.palette.background.paper, 0.6),
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  backdropFilter: "blur(10px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", // Left align looks more modern for features
  textAlign: "left",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  overflow: "hidden",
  cursor: "default",

  // Hover Effects
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
    
    // Icon animation on card hover
    "& .icon-box": {
      transform: "scale(1.1) rotate(-5deg)",
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      color: "#fff",
      boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
    }
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: "64px",
  height: "64px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  transition: "all 0.3s ease",
  
  // Default State (Soft background)
  background: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  
  "& svg": {
    fontSize: "32px",
  }
}));

const GradientText = styled("span")(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  fontWeight: 800,
}));

// --- Data ---

const featuresData = [
  {
    icon: <StorefrontTwoToneIcon />,
    title: "Instant Storefront",
    description: "Launch a stunning, fully functional online store in minutes. Choose from premium templates that look great on any device."
  },
  {
    icon: <ShoppingCartCheckoutIcon />,
    title: "Seamless Checkout",
    description: "Convert more visitors with a friction-free checkout experience. Integrated global payments ensuring secure transactions."
  },
  {
    icon: <RocketLaunchTwoToneIcon />,
    title: "Growth Engine",
    description: "Don't just sell, grow. Access powerful analytics, automated marketing tools, and SEO features built directly into your dashboard."
  }
];

const Features = () => {
  const theme = useTheme();

  return (
    <SectionWrapper id="features">
      <Container maxWidth="lg">
        
        {/* Section Header */}
        <Box sx={{ mb: 8, textAlign: "center", maxWidth: "700px", mx: "auto" }}>
          <Fade direction="up" triggerOnce>
            <Typography 
              variant="overline" 
              sx={{ 
                color: theme.palette.text.secondary, 
                fontWeight: 700, 
                letterSpacing: 1.2,
                mb: 1,
                display: 'block'
              }}
            >
              POWERFUL INFRASTRUCTURE
            </Typography>
            
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 2, 
                color: theme.palette.text.primary,
                fontSize: { xs: "2rem", md: "2.5rem" } 
              }}
            >
              Why <GradientText>SokoJunction</GradientText> is the engine your business needs
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
            >
              We handle the heavy lifting of e-commerce technology so you can focus on your products and customers.
            </Typography>
          </Fade>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {featuresData.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade direction="up" delay={index * 150} triggerOnce>
                <FeatureCard>
                  <IconBox className="icon-box">
                    {feature.icon}
                  </IconBox>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1.5,
                      color: theme.palette.text.primary 
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Fade>
            </Grid>
          ))}
        </Grid>

      </Container>
    </SectionWrapper>
  );
};

export default Features;