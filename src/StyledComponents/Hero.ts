import { alpha, Box, Button, Card, keyframes, Paper, styled, Tab } from "@mui/material";

const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Keyframes for subtle floating effect
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(-45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
  backgroundSize: '400% 400%',
  animation: `${animatedGradient} 15s ease infinite`,
  color: "#fff",
  textAlign: "center",
  borderRadius: "20px", // More rounded for a modern feel
  marginBottom: "100px", // More space after hero
  position: "relative",
  // minHeight: "500px", // Ensure enough height
  overflow: "hidden",
  padding: "120px 0", // Generous padding
  paddingTop: "360px",
  marginTop: "-360px",
  [theme.breakpoints.down('sm')]: {
    padding: "80px 0",
    borderRadius: "10px",
      paddingTop: "360px",
  marginTop: "-360px",
  },

  // Diagonal split overlay (new design element)
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)`,
    backgroundSize: '80px 80px',
    opacity: 0.2,
    zIndex: 0,
  },
  '&::after': { // Second, more subtle layer
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(225deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.03) 75%, transparent 75%, transparent)`,
    backgroundSize: '60px 60px',
    opacity: 0.1,
    zIndex: 0,
  },
}));

export const HeroGraphic = styled(Box)({
  position: 'absolute',
  // You would replace these with actual SVG or image components
  // For demonstration, these are placeholder circles
  background: 'rgba(255,255,255,0.08)',
  borderRadius: '50%',
  animation: `${floatAnimation} 4s ease-in-out infinite`,
  zIndex: 1, // Below content but above background patterns
});

export const AccentButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  textTransform: "uppercase", // More professional
  padding: "16px 40px",
  borderRadius: "30px",
  fontWeight: 700, // Bolder
  fontSize: "1.1rem",
  boxShadow: "0 10px 25px rgba(0,0,0,0.35)", // Stronger, more defined shadow
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-5px) scale(1.03)", // Enhanced hover effect
    boxShadow: "0 15px 35px rgba(0,0,0,0.45)",
  },
  "& .MuiButton-endIcon": {
    marginLeft: theme.spacing(1), // Space for icon
  }
}));


export const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const PricingCard = styled(Card)(({ theme }) => ({
  textAlign: "center",
  padding: "32px 24px",
  borderRadius: "24px",
  border: `1px solid ${theme.palette.divider}`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  position: 'relative',
  overflow: 'visible',
  "&:hover": {
    transform: "translateY(-12px)",
    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.08)}`,
  },
  "&.featured": {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
    backgroundColor: alpha(theme.palette.primary.main, 0.01),
    "&::before": {
      content: '"CURRENT PLAN"',
      position: 'absolute',
      top: -12,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: '4px 14px',
      borderRadius: '20px',
      fontSize: '0.65rem',
      fontWeight: 900,
      letterSpacing: '1.2px'
    }
  }
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  marginRight: theme.spacing(1),
  minHeight: '48px',
  borderRadius: '12px',
  justifyContent: 'flex-start',
  padding: '12px 20px',
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  }
}));