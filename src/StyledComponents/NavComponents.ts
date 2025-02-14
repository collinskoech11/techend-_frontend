import {Box, Typography, styled} from "@mui/material";
import Link from "next/link";

export const OfferNav = styled(Box)({
  width: "100vw",
  height: "30px",
  background: " #BE1E2D",
  textAlign:"center",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontFamily:"sans-serif"
});

export const MainNav = styled(Box)({
    display:"flex",
    justifyContent:"space-between",
    width:"100vw",
    height:"70px",
    alignItems:"center"
})

export const ButtonsContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  padding: "20px",
  alignItems: "center",
  "*": {
    marginLeft: "10px",
    marginRight: "10px",
  },
});
export const LinksContainer  = styled(Box)({
    width:"100vw",
    display:"flex",
    height:"100px",
    alignItems:"center",
    position:"fixed",
    justifyContent:"space-between",
    background:"rgb(2, 110, 129, 0.3)"
})

export const  LinksSubContainer = styled(Box)({
    margin:"auto",
    display:"flex",
    "@media (max-width: 600px)": {
      flexDirection:"column",
      alignItems:"center",
    },
})

export const NavLink = styled(Link)({
    fontSize:"15px",
    textTransform:"uppercase",
    fontWeight:"500",
    textDecoration:"none",
    color:"#000",
    fontFamily:"sans-serif",
    paddingLeft:"10px",
    paddingRight:"10px",
    "@media (max-width: 600px)": {
      width: "100vw",
      display: "flex",
      "&:hover": {
        background: "#F3F3BF",
      },
    },

})
export const NavButton = styled(Typography)({
  fontSize: "15px",
  textTransform: "uppercase",
  fontWeight: "500",
  textDecoration: "none",
  color: "#000",
  fontFamily: "sans-serif",
  paddingLeft: "10px",
  paddingRight: "10px",
  cursor:"pointer"
});
export const MiniPopper = styled(Typography)({
  fontSize: "15px",
  textTransform: "uppercase",
  fontWeight: "500",
  textDecoration: "none",
  color: "#000",
  fontFamily: "sans-serif",
  paddingLeft: "10px",
  paddingRight: "10px",
});