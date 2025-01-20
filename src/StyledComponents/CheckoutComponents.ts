import { CheckBox } from "@mui/icons-material";
import { Box, FormControlLabel, Input, Typography, styled } from "@mui/material";

export const MainCheckoutBody = styled(Box)({
  width: "100vw",
  padding: "30px",
  background: "#F5F5F5",
  minHeight:"79vh"
});

export const ShippingMainContainer = styled(Box)({
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    flexWrap:"wrap",
})

export const ShippingSubContainerMain = styled(Box)({
    width:"63%",
    minHeight:"500px",
    "@media screen and (max-width:800px)":{
        width:"100%"
    }
})

export const ShippingSubContainerSub = styled(Box)({
  width: "32%",
  minHeight:"500px",
  "@media screen and (max-width:800px)":{
    width:"100%"  
  }
});

export const ShippingTitle = styled(Typography)({
    fontWeight:"500",
    color:"rgb(61, 70, 77)",
    fontSize:"13px",
    textTransform:"uppercase",
    width:"100%"
})

export const FormContainer = styled(Box)({
    width:"100%",
    background:"#fff"
})

export const ShippingInput = styled(Input)({
  border: "1px solid rgb(0,0,0,0.2)",
  width:"48%",
    height:"40px",
    margin:"auto",
    borderRadius:"5px",
    marginBottom:"20px",
    padding:"10px",
    "@media screen and (max-width:800px)":{
      width:"97%",
       height:"50px",
    }
});
export const ShippingInputLabel = styled(Typography)({
  width: "48%",
  color: "rgb(125, 125, 125)",
  fontSize: "15px",
  fontWeight: "500",
  height: "30px",
});

export const ShippingCheckBoxWrap  = styled(FormControlLabel)({
    width:"96%",
    paddingTop:"15px"
})
export const ShippingCheckBox = styled(CheckBox)({
})