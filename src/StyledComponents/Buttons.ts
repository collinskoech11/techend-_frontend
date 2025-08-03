import { Button, styled } from "@mui/material";
import { alpha } from "@mui/material/styles";
export const LoginButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  background: theme.palette.primary.main,
  textTransform: "capitalize",
  // fontSize: "10px",
  fontWeight:"bolder",
  borderRadius:"15px",
  "&:hover": {
    background: "#0C0C4C", 
  },
}));

export const ShopNowButton = styled(Button)({
  background: "#000",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textTransform: "capitalize",
  paddingLeft: "20px",
  paddingRight: "20px"
});

export const CouponButton = styled(Button)({
  background: "#EDF1FF",
  width: "30%",
  color: "#000",
  height: "30px",
  fontSize: "14px",
  textTransform:"capitalize",
  borderRadius:"0px"
});
export const YellowButton = styled(Button)({
  color: "#000",
  background: "#FFD333",
  borderRadius:"0",
  textTransform:"capitalize",
  width:"100%",
});

export const BorderedButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "uppercase",
  fontWeight: 600,
  borderRadius: "8px", // Slightly less rounded for a modern edge
  padding: theme.spacing(1, 2),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: theme.palette.primary.main,
  },
}));

export const GreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Use primary color for main action
  color: "#fff",
  textTransform: "uppercase",
  fontWeight: 600,
  borderRadius: "8px",
  padding: theme.spacing(1, 2),
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)", // Subtle shadow
  "&:hover": {
    backgroundColor: theme.palette.primary.dark, // Darker shade on hover
    boxShadow: "0 5px 12px rgba(0, 0, 0, 0.25)",
  },
}));

