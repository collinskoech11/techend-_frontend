import { Box, styled } from "@mui/material";

export const MainBannerContainer = styled(Box)({
  width: "97vw",
  margin: "auto",
  height: "600px",
  marginTop: "20px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  "@media (max-width: 600px)": {
    backgroundPosition: "right",
  },
});
export const BgMask = styled(Box)({
  width: "100%",
  height: "600px",
  display: "flex",
  alignItems:"center"
});

export const BannerTextContainer = styled(Box)({
    maxWidth:"650px",
    marginLeft:"40px"
})