"use client";

import React, { Suspense } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  keyframes,
  styled,
  useTheme,
  Chip,
  alpha,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import dynamic from "next/dynamic";

const Typewriter = dynamic(() => import("typewriter-effect"), { ssr: false });

// --- Animations ---

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const blobMove = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

// --- Styled Components ---

const HeroWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(12, 2),
  background: theme.palette.background.default,
  marginTop: "-80px", // Compensating for navbar

  // 1. Grid Pattern Overlay
  backgroundImage: `
    linear-gradient(${alpha(theme.palette.divider, 0.1)} 1px, transparent 1px),
    linear-gradient(90deg, ${alpha(theme.palette.divider, 0.1)} 1px, transparent 1px)
  `,
  backgroundSize: "40px 40px",

  // 2. Animated Blobs
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "60vw",
    height: "60vw",
    maxWidth: "600px",
    maxHeight: "600px",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.4,
    zIndex: 0,
    animation: `${blobMove} 20s infinite alternate`,
  },
  "&::before": {
    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    top: "-10%",
    left: "-10%",
  },
  "&::after": {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
    bottom: "-10%",
    right: "-10%",
    animationDelay: "-10s",
  },
}));

// Glass Card for Content
const ContentCard = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  background: alpha(theme.palette.background.paper, 0.4),
  backdropFilter: "blur(20px)",
  borderRadius: "32px",
  padding: theme.spacing(6, 4),
  border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.05)}`,
  animation: `${fadeUp} 1s ease-out`,
  maxWidth: "900px",
  margin: "0 auto",
  
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4, 2),
    background: "transparent", // Remove card effect on mobile for more space
    border: "none",
    backdropFilter: "none",
    boxShadow: "none",
  }
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  display: "inline-block",
  fontWeight: 800,
}));

const GlowButton = styled(Button)(({ theme }) => ({
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

const GlassButton = styled(Button)(({ theme }) => ({
  padding: "14px 32px",
  borderRadius: "50px",
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  color: theme.palette.text.primary,
  background: alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: "blur(10px)",
  "&:hover": {
    background: alpha(theme.palette.background.paper, 0.8),
    borderColor: theme.palette.text.primary,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 600,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  marginBottom: theme.spacing(3),
  animation: `${float} 6s ease-in-out infinite`,
}));

interface HeroProps {
  handleNavigate: () => void;
  handleAuthTrigger: () => void;
}

const Hero: React.FC<HeroProps> = ({ handleNavigate, handleAuthTrigger }) => {
  const theme = useTheme();

  return (
    <HeroWrapper>
      <Container maxWidth="lg">
        <ContentCard>
          
          {/* Badge / Announcement */}
          <StyledChip 
            icon={<RocketLaunchIcon fontSize="small" />} 
            label="v2.0 is now live: Start selling faster" 
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Build your <br />
            <Suspense fallback={<span>Online Business</span>}>
              <GradientText>
                <Typewriter
                  options={{
                    strings: [
                      "Dream Store.",
                      "Digital Empire.",
                      "Future Today.",
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    deleteSpeed: 50,
                  }}
                />
              </GradientText>
            </Suspense>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 5,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
            }}
          >
            SokoJunction provides the all-in-one infrastructure to launch, scale, 
            and manage your commerce business. No coding required.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <GlowButton 
              endIcon={<ArrowForwardIcon />} 
              onClick={handleNavigate}
              size="large"
            >
              Start Free Trial
            </GlowButton>
{/* 
            <GlassButton 
              onClick={handleAuthTrigger}
              size="large"
            >
              View Demo
            </GlassButton> */}
          </Box>
          
          {/* Optional: Add social proof text below buttons */}
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: 4, 
              opacity: 0.6, 
              fontSize: '0.85rem' 
            }}
          >
            Trusted by 5,000+ businesses across Africa
          </Typography>

        </ContentCard>
      </Container>
    </HeroWrapper>
  );
};

export default Hero;