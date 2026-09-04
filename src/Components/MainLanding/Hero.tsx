"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  keyframes,
  styled,
  useTheme,
  alpha,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import dynamic from "next/dynamic";
import { useGetPlatformStatsQuery } from "@/Api/services";
import Cookies from "js-cookie";

const Typewriter = dynamic(() => import("typewriter-effect"), { ssr: false });

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const blobMove1 = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(12vw, -10vh) scale(1.2); }
  66% { transform: translate(-8vw, 15vh) scale(0.8); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const blobMove2 = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(-12vw, 15vh) scale(0.8); }
  66% { transform: translate(10vw, -8vh) scale(1.15); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const straightRight = keyframes`
  0% { transform: translate3d(0, 0, 0); opacity: 0; }
  2% { opacity: 1; }
  20% { transform: translate3d(36vw, 0, 0); }
  35% { transform: translate3d(46vw, 0, 0); }
  50% { transform: translate3d(52.5vw, 0, 0); }
  65% { transform: translate3d(59vw, 0, 0); }
  80% { transform: translate3d(69vw, 0, 0); }
  98% { opacity: 1; }
  100% { transform: translate3d(105vw, 0, 0); opacity: 0; }
`;

const straightLeft = keyframes`
  0% { transform: translate3d(0, 0, 0); opacity: 0; }
  2% { opacity: 1; }
  20% { transform: translate3d(-36vw, 0, 0); }
  35% { transform: translate3d(-46vw, 0, 0); }
  50% { transform: translate3d(-52.5vw, 0, 0); }
  65% { transform: translate3d(-59vw, 0, 0); }
  80% { transform: translate3d(-69vw, 0, 0); }
  98% { opacity: 1; }
  100% { transform: translate3d(-105vw, 0, 0); opacity: 0; }
`;

const straightDown = keyframes`
  0% { transform: translate3d(0, 0, 0); opacity: 0; }
  2% { opacity: 1; }
  20% { transform: translate3d(0, 36vh, 0); }
  35% { transform: translate3d(0, 46vh, 0); }
  50% { transform: translate3d(0, 52.5vh, 0); }
  65% { transform: translate3d(0, 59vh, 0); }
  80% { transform: translate3d(0, 69vh, 0); }
  98% { opacity: 1; }
  100% { transform: translate3d(0, 105vh, 0); opacity: 0; }
`;

const straightUp = keyframes`
  0% { transform: translate3d(0, 0, 0); opacity: 0; }
  2% { opacity: 1; }
  20% { transform: translate3d(0, -36vh, 0); }
  35% { transform: translate3d(0, -46vh, 0); }
  50% { transform: translate3d(0, -52.5vh, 0); }
  65% { transform: translate3d(0, -59vh, 0); }
  80% { transform: translate3d(0, -69vh, 0); }
  98% { opacity: 1; }
  100% { transform: translate3d(0, -105vh, 0); opacity: 0; }
`;

interface GlowDotProps {
  glowcolor: string;
  delay?: string;
  duration?: string;
  top?: string;
  left?: string;
  pathanimation: any;
  direction?: "right" | "left" | "down" | "up";
  size?: number;
}

const GlowDot = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "glowcolor" &&
    prop !== "delay" &&
    prop !== "duration" &&
    prop !== "top" &&
    prop !== "left" &&
    prop !== "pathanimation" &&
    prop !== "direction" &&
    prop !== "size",
})<GlowDotProps>(({ theme, glowcolor, delay = "0s", duration = "1.5s", top, left, pathanimation, direction = "right", size = 6 }) => {
  let tailStyles: any = {};
  if (direction === "right") {
    tailStyles = {
      right: "50%",
      top: "50%",
      transform: "translateY(-50%)",
      width: "70px",
      height: "2px",
      background: `linear-gradient(90deg, transparent, ${alpha(glowcolor, 0.4)} 60%, #ffffff)`,
    };
  } else if (direction === "left") {
    tailStyles = {
      left: "50%",
      top: "50%",
      transform: "translateY(-50%)",
      width: "70px",
      height: "2px",
      background: `linear-gradient(90deg, #ffffff, ${alpha(glowcolor, 0.4)} 40%, transparent)`,
    };
  } else if (direction === "down") {
    tailStyles = {
      bottom: "50%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "2px",
      height: "70px",
      background: `linear-gradient(180deg, transparent, ${alpha(glowcolor, 0.4)} 60%, #ffffff)`,
    };
  } else if (direction === "up") {
    tailStyles = {
      top: "50%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "2px",
      height: "70px",
      background: `linear-gradient(180deg, #ffffff, ${alpha(glowcolor, 0.4)} 40%, transparent)`,
    };
  }

  return {
    position: "absolute",
    top: top,
    left: left,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    boxShadow: `
      0 0 6px 2px #ffffff,
      0 0 14px 4px ${glowcolor},
      0 0 30px 8px ${alpha(glowcolor, 0.6)}
    `,
    zIndex: 1,
    animation: `${pathanimation} ${duration} linear infinite`,
    animationDelay: delay,
    pointerEvents: "none",
    willChange: "transform, opacity",

    "&::after": {
      content: '""',
      position: "absolute",
      borderRadius: "999px",
      filter: `drop-shadow(0 0 6px ${glowcolor})`,
      pointerEvents: "none",
      ...tailStyles,
    },

    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  };
});

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
    [theme.breakpoints.down("sm")]: {
      opacity: 0.15,
      width: "80vw",
      height: "80vw",
    },
  },
  "&::before": {
    background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
    top: "-10%",
    left: "-10%",
    animation: `${blobMove1} 25s ease-in-out infinite`,
  },
  "&::after": {
    background: `radial-gradient(circle, ${theme.palette.secondary.main} 0%, transparent 70%)`,
    bottom: "-10%",
    right: "-10%",
    animation: `${blobMove2} 25s ease-in-out infinite`,
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


interface HeroProps {
  handleNavigate: () => void;
  handleAuthTrigger: () => void;
}

const AnimatedCounter: React.FC<{ endValue: number; formatFn?: (val: number) => string }> = ({ endValue, formatFn }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5 seconds animation
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentVal = Math.floor(start + easeOutQuad(progress) * (endValue - start));
      
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue]);

  return <>{formatFn ? formatFn(count) : count.toLocaleString()}</>;
};

const Hero: React.FC<HeroProps> = ({ handleNavigate }) => {
  const theme = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { data: stats } = useGetPlatformStatsQuery();

  const formatVolume = (val: number) => {
    if (val >= 1.0e9) {
      return `Kes ${(val / 1.0e9).toFixed(1).replace(/\.0$/, "")}B+`;
    }
    if (val >= 1.0e6) {
      return `Kes ${(val / 1.0e6).toFixed(1).replace(/\.0$/, "")}M+`;
    }
    if (val >= 1.0e3) {
      return `Kes ${(val / 1.0e3).toFixed(1).replace(/\.0$/, "")}K+`;
    }
    return `Kes ${val.toLocaleString()}+`;
  };

  useEffect(() => {
    setIsMounted(true);
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        if (parsedUser && parsedUser.companies && parsedUser.companies.length > 0) {
          setIsOwner(true);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return (
    <HeroWrapper>
      {/* Fast straight-path shooting stars (5 total) */}
      {/* Horizontal: Left to Right */}
      <GlowDot glowcolor={theme.palette.primary.main || "#00b0ff"} top="20%" left="0%" pathanimation={straightRight} direction="right" duration="1.9s" delay="0s" size={6} />
      <GlowDot glowcolor={theme.palette.secondary.main || "#ef5c2a"} top="72%" left="0%" pathanimation={straightRight} direction="right" duration="2.1s" delay="1.4s" size={5} />

      {/* Horizontal: Right to Left */}
      <GlowDot glowcolor={theme.palette.secondary.main || "#ef5c2a"} top="42%" left="100%" pathanimation={straightLeft} direction="left" duration="1.8s" delay="0.7s" size={6} />

      {/* Vertical: Top to Bottom */}
      <GlowDot glowcolor={theme.palette.primary.main || "#00b0ff"} top="0%" left="20%" pathanimation={straightDown} direction="down" duration="2.0s" delay="2.1s" size={5} />

      {/* Vertical: Bottom to Top */}
      <GlowDot glowcolor="#38bdf8" top="100%" left="80%" pathanimation={straightUp} direction="up" duration="2.0s" delay="2.8s" size={6} />

      <Container maxWidth="lg">
        <ContentCard>
          

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
            <GradientText>
              {isMounted ? (
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
              ) : (
                "Dream Store."
              )}
            </GradientText>
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
              onClick={() => {
                if (isOwner) {
                  window.location.href = "https://merchant.sokojunction.com";
                } else {
                  handleNavigate();
                }
              }}
              size="large"
            >
              {isOwner ? "Manage Your Store" : "Start Selling Now"}
            </GlowButton>
          </Box>
          
          {/* Trust Metrics & Statistical Counters */}
          <Box 
            sx={{ 
              mt: 6, 
              pt: 4, 
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: 3
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                <AnimatedCounter endValue={stats?.total_merchants ?? 0} formatFn={(val) => `${val.toLocaleString()}+`} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Active Merchants
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.secondary.main }}>
                <AnimatedCounter endValue={stats?.total_orders ?? 0} formatFn={(val) => `${val.toLocaleString()}+`} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Orders Completed
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                <AnimatedCounter endValue={stats?.total_volume ?? 0} formatFn={formatVolume} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Transaction Volume
              </Typography>
            </Box>
          </Box>

        </ContentCard>
      </Container>
    </HeroWrapper>
  );
};

export default Hero;