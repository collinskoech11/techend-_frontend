import { Typography, styled } from "@mui/material";

export const OfferNavTypo = styled(Typography)({
  fontWeight: "700",
  fontSize: "15px",
  color:"#fff"
});
export const HeaderTypo = styled(Typography)({
  fontWeight: "700",
  fontSize: "32px",
  color: "rgb(125, 125, 125)",
  marginLeft: "20px",
  "@media (max-width: 600px)": {
    fontSize: "14px",
  },
});
export const CartBalanceTypo = styled(Typography)({
  fontSize: "15px",
  opacity: "0.7",
  fontWeight: "700",
});

export const RevealMainTypo = styled(Typography)({
  fontWeight: "600",
  fontSize: "56px",
  color: "#fff",
  textShadow: "2px 2px 4px rgba(255, 255, 255, 0.5)", // Add text shadow here
});

export const BannerSubTypo = styled(Typography)({
  color: "rgb(125, 125, 125)",
  fontSize: "18px",
  fontWeight: "500",
});

export const ReviewText = styled(Typography)({
    color:"rgb(125, 125, 125)",
    fontSize:"14px",
    fontWeight:"400"
})

export const PriceTitle = styled(Typography)({
  fontWeight:"500",
  fontSize:"20px",
  color:"#000",
  width:"100%",
  margin:"auto"
})

export const PriceMinTypo = styled(Typography)({
  fontWeight:"500",
  fontSize:"16px",
  color:"rgb(125,125,125)"
})

export const FilterCategory = styled(Typography)({
  fontWeight: "500",
  fontSize: "16px",
  color: "#000",
  width: "100%",
  margin: "auto",
  marginBottom:"5px"
});

export const ProductPrice = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 700,
  letterSpacing: "0.02em",
  color: theme.palette.text.primary,
  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "6px",
}));

export const ProductTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.15rem",
  fontWeight: 600,
  color: "#18181b",
  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  fontVariantNumeric: "lining-nums",
  fontFeatureSettings: '"lnum" 1',
  letterSpacing: "-0.01em",
  lineHeight: 1.25,
  minHeight: "40px",
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  marginBottom: theme.spacing(0.5),
  transition: "color 0.2s ease",
}));

export const ProductDescription = styled(Typography)(({ theme }) => ({
  fontSize: "0.825rem",
  color: "#71717a",
  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  lineHeight: 1.4,
  marginBottom: theme.spacing(1),
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
}));

export const BoutiqueLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.725rem",
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontWeight: 600,
  color: theme.palette.primary.main,
  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
}));

export const ShopSerifHeading = styled(Typography)({
  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  color: "#18181b",
});

