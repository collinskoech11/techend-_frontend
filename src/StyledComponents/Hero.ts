import { Box, Button, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, keyframes, styled } from "@mui/material";

// Define a consistent color palette
const secondaryColor = "#3f51b5"; // A complementary blue
const lightGray = "#f0f2f5"; // A softer, more modern light gray for backgrounds
const mediumGray = "#e0e0e0"; // For borders and subtle dividers
const darkText = "#212121"; // Very dark gray for main headings and strong text
const lightText = "#555555"; // Softer dark gray for body text


const waveAnimation = keyframes`
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
  background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, // Deeper gradient
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