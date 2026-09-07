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

// Speed-reactive streak stretch keyframes (3x longer at fast points, elegant in center)
const tailStretchRight = keyframes`
  0% { transform: translateY(-50%) scaleX(4.5); opacity: 0.95; }
  20% { transform: translateY(-50%) scaleX(3.8); opacity: 0.9; }
  35% { transform: translateY(-50%) scaleX(1.4); opacity: 0.8; }
  50% { transform: translateY(-50%) scaleX(0.9); opacity: 0.7; }
  65% { transform: translateY(-50%) scaleX(1.3); opacity: 0.78; }
  80% { transform: translateY(-50%) scaleX(3.5); opacity: 0.92; }
  100% { transform: translateY(-50%) scaleX(5.0); opacity: 1; }
`;

const tailStretchLeft = keyframes`
  0% { transform: translateY(-50%) scaleX(4.5); opacity: 0.95; }
  20% { transform: translateY(-50%) scaleX(3.8); opacity: 0.9; }
  35% { transform: translateY(-50%) scaleX(1.4); opacity: 0.8; }
  50% { transform: translateY(-50%) scaleX(0.9); opacity: 0.7; }
  65% { transform: translateY(-50%) scaleX(1.3); opacity: 0.78; }
  80% { transform: translateY(-50%) scaleX(3.5); opacity: 0.92; }
  100% { transform: translateY(-50%) scaleX(5.0); opacity: 1; }
`;

const tailStretchDown = keyframes`
  0% { transform: translateX(-50%) scaleY(4.5); opacity: 0.95; }
  20% { transform: translateX(-50%) scaleY(3.8); opacity: 0.9; }
  35% { transform: translateX(-50%) scaleY(1.4); opacity: 0.8; }
  50% { transform: translateX(-50%) scaleY(0.9); opacity: 0.7; }
  65% { transform: translateX(-50%) scaleY(1.3); opacity: 0.78; }
  80% { transform: translateX(-50%) scaleY(3.5); opacity: 0.92; }
  100% { transform: translateX(-50%) scaleY(5.0); opacity: 1; }
`;

const tailStretchUp = keyframes`
  0% { transform: translateX(-50%) scaleY(4.5); opacity: 0.95; }
  20% { transform: translateX(-50%) scaleY(3.8); opacity: 0.9; }
  35% { transform: translateX(-50%) scaleY(1.4); opacity: 0.8; }
  50% { transform: translateX(-50%) scaleY(0.9); opacity: 0.7; }
  65% { transform: translateX(-50%) scaleY(1.3); opacity: 0.78; }
  80% { transform: translateX(-50%) scaleY(3.5); opacity: 0.92; }
  100% { transform: translateX(-50%) scaleY(5.0); opacity: 1; }
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
      transformOrigin: "right center",
      width: "90px",
      height: "3.5px",
      background: `linear-gradient(90deg, transparent, ${alpha(glowcolor, 0.2)} 15%, ${glowcolor} 55%, #ffffff 100%)`,
      animation: `${tailStretchRight} ${duration} linear forwards`,
      [theme.breakpoints.down("sm")]: {
        width: "50px",
        height: "2.5px",
      },
    };
  } else if (direction === "left") {
    tailStyles = {
      left: "50%",
      top: "50%",
      transformOrigin: "left center",
      width: "90px",
      height: "3.5px",
      background: `linear-gradient(90deg, #ffffff 0%, ${glowcolor} 45%, ${alpha(glowcolor, 0.2)} 85%, transparent 100%)`,
      animation: `${tailStretchLeft} ${duration} linear forwards`,
      [theme.breakpoints.down("sm")]: {
        width: "50px",
        height: "2.5px",
      },
    };
  } else if (direction === "down") {
    tailStyles = {
      bottom: "50%",
      left: "50%",
      transformOrigin: "center bottom",
      width: "3.5px",
      height: "90px",
      background: `linear-gradient(180deg, transparent, ${alpha(glowcolor, 0.2)} 15%, ${glowcolor} 55%, #ffffff 100%)`,
      animation: `${tailStretchDown} ${duration} linear forwards`,
      [theme.breakpoints.down("sm")]: {
        width: "2.5px",
        height: "50px",
      },
    };
  } else if (direction === "up") {
    tailStyles = {
      top: "50%",
      left: "50%",
      transformOrigin: "center top",
      width: "3.5px",
      height: "90px",
      background: `linear-gradient(180deg, #ffffff 0%, ${glowcolor} 45%, ${alpha(glowcolor, 0.2)} 85%, transparent 100%)`,
      animation: `${tailStretchUp} ${duration} linear forwards`,
      [theme.breakpoints.down("sm")]: {
        width: "2.5px",
        height: "50px",
      },
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
      0 0 16px 5px ${glowcolor},
      0 0 36px 10px ${alpha(glowcolor, 0.8)}
    `,
    zIndex: 1,
    animation: `${pathanimation} ${duration} linear forwards`,
    animationDelay: delay,
    pointerEvents: "none",
    willChange: "transform, opacity",

    "&::after": {
      content: '""',
      position: "absolute",
      borderRadius: "999px",
      filter: `drop-shadow(0 0 8px ${glowcolor}) drop-shadow(0 0 16px ${glowcolor})`,
      pointerEvents: "none",
      ...tailStyles,
    },

    [theme.breakpoints.down("sm")]: {
      display: "block",
      width: `${Math.max(size - 2, 4)}px`,
      height: `${Math.max(size - 2, 4)}px`,
      opacity: 0.85,
      boxShadow: `
        0 0 5px 2px #ffffff,
        0 0 12px 3px ${glowcolor},
        0 0 22px 5px ${alpha(glowcolor, 0.6)}
      `,
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
  background: alpha(theme.palette.background.paper, 0.2),
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "32px",
  padding: theme.spacing(6, 4),
  border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.03)}`,
  animation: `${fadeUp} 1s ease-out`,
  maxWidth: "900px",
  margin: "0 auto",
  
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4, 2.5),
    background: alpha(theme.palette.background.paper, 0.3),
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderRadius: "24px",
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    boxShadow: `0 8px 24px -4px ${alpha(theme.palette.common.black, 0.03)}`,
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

interface ShootingStarItem {
  id: number;
  direction: "right" | "left" | "down" | "up";
  top?: string;
  left?: string;
  animation: any;
  duration: string;
  color: string;
  size: number;
}

const Hero: React.FC<HeroProps> = ({ handleNavigate }) => {
  const theme = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeStars, setActiveStars] = useState<ShootingStarItem[]>([]);
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

  // Randomized non-repetitive shooting star spawner
  useEffect(() => {
    if (!isMounted) return;

    let starIdCounter = 0;
    let isCancelled = false;
    let spawnTimer: NodeJS.Timeout;

    const HORIZONTAL_TRACKS = [12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92];
    const VERTICAL_TRACKS = [15, 25, 35, 45, 55, 65, 75, 85, 92];
    const COLORS = [
      theme.palette.primary.main || "#35408F",   // Brand Blue / Purple
      theme.palette.secondary.main || "#EF5C2A", // Brand Orange
    ];
    const DIRECTIONS: Array<"right" | "left" | "down" | "up"> = ["right", "left", "down", "up"];

    let lastDirection: string = "";
    let lastTrack: number = -1;
    let lastColorIndex: number = -1;

    const spawnStar = () => {
      if (isCancelled) return;

      // Random direction (different from last)
      const availableDirs = DIRECTIONS.filter((d) => d !== lastDirection);
      const direction = availableDirs[Math.floor(Math.random() * availableDirs.length)] || "right";
      lastDirection = direction;

      const isHorizontal = direction === "right" || direction === "left";
      const trackPool = isHorizontal ? HORIZONTAL_TRACKS : VERTICAL_TRACKS;

      // Random track (different from last)
      const availableTracks = trackPool.filter((t) => t !== lastTrack);
      const chosenTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)] || trackPool[0];
      lastTrack = chosenTrack;

      let topStr: string | undefined;
      let leftStr: string | undefined;
      let anim: any;

      if (direction === "right") {
        topStr = `${chosenTrack}%`;
        leftStr = "0%";
        anim = straightRight;
      } else if (direction === "left") {
        topStr = `${chosenTrack}%`;
        leftStr = "100%";
        anim = straightLeft;
      } else if (direction === "down") {
        topStr = "0%";
        leftStr = `${chosenTrack}%`;
        anim = straightDown;
      } else {
        topStr = "100%";
        leftStr = `${chosenTrack}%`;
        anim = straightUp;
      }

      // Slightly varied fast speed: 1.7s to 2.2s
      const randomDuration = (1.7 + Math.random() * 0.5).toFixed(2);
      // Alternate between the 2 logo brand colors (blue/purple and orange)
      const nextColorIndex = lastColorIndex === 0 ? 1 : 0;
      lastColorIndex = nextColorIndex;
      const chosenColor = COLORS[nextColorIndex];
      const randomSize = Math.random() > 0.45 ? 6 : 5;

      const newStar: ShootingStarItem = {
        id: ++starIdCounter,
        direction,
        top: topStr,
        left: leftStr,
        animation: anim,
        duration: `${randomDuration}s`,
        color: chosenColor,
        size: randomSize,
      };

      setActiveStars((prev) => {
        // Keep at most 4 active stars simultaneously
        return [...prev.slice(-3), newStar];
      });

      // Schedule next random spawn between 650ms and 1300ms
      const nextDelay = 650 + Math.floor(Math.random() * 650);
      spawnTimer = setTimeout(spawnStar, nextDelay);
    };

    // Initial staggered spawns on mount
    spawnStar();
    const initTimer = setTimeout(spawnStar, 400);

    return () => {
      isCancelled = true;
      clearTimeout(spawnTimer);
      clearTimeout(initTimer);
    };
  }, [isMounted, theme.palette.primary.main, theme.palette.secondary.main]);

  return (
    <HeroWrapper>
      {/* Dynamically randomized shooting stars */}
      {activeStars.map((star) => (
        <GlowDot
          key={star.id}
          glowcolor={star.color}
          top={star.top}
          left={star.left}
          pathanimation={star.animation}
          direction={star.direction}
          duration={star.duration}
          size={star.size}
          onAnimationEnd={() => {
            setActiveStars((prev) => prev.filter((s) => s.id !== star.id));
          }}
        />
      ))}

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