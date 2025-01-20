import { Typography, styled } from "@mui/material";

export const OfferNavTypo = styled(Typography)({
  fontWeight: "700",
  fontSize: "15px",
  color:"#fff"
});
export const HeaderTypo = styled(Typography)(({ theme }) => ({
  fontWeight: "700",
  fontSize: "32px",
  color: "rgb(125, 125, 125)",
  marginLeft: "20px",
  "@media (max-width: 600px)": {
    fontSize: "14px", // Adjust font size for smaller screens
  },
}));
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

export const ProductPrice = styled(Typography)({
  fontWeight: "700",
  fontSize: "16px",
  color: "#000",
  marginBottom:"10px"
});
export const ProductTitle = styled(Typography)({
  fontSize: "15px",
  fontWeight: "500",
  color: "#000",
  cursor:"pointer",
  marginBottom:"10px",
  "&:hover": {
    color: "rgb(78, 116, 96)",
  },
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