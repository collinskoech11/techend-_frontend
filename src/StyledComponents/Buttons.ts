import { Button, styled } from "@mui/material";

export const LoginButton = styled(Button)({
  color: "#fff",
  background: "#BE1E2D",
  textTransform: "capitalize",
  fontSize: "10px",
  "&:hover": {
    background: "#0C0C4C", 
  },
});

export const ShopNowButton = styled(Button)({
  background: "#000",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textTransform: "capitalize",
  paddingLeft: "20px",
  paddingRight: "20px"
});

export const GreenButton = styled(Button)({
  padding: "10px",
  color: "#fff",
  borderRadius: "0px",
  width: "160px",
  textAlign: "left",
  background: "#BE1E2D",
  "&:hover": {
    border: "1px solid #BE1E2D",
    color:"#BE1E2D",
  },
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


export const BorderedButton = styled(Button)({
  color: "#000",
  background: "#fff",
  border: "1px solid #000",
  borderRadius:"0",
  textTransform:"capitalize",
  width:"100%",
  "&:hover": {
    background: "#000",
    color:"#fff",
  },
});