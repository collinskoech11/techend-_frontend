import { Box, Input, styled } from "@mui/material";

export const PriceFilter = styled(Box)({
  width: "100%",
  margin: "auto",
  border: "1px solid rgb(0,0,0,0.2)",
  borderRadius:"5px",
  padding:"15px",
  marginBottom:"20px"
});

export const MinMaxCntainer = styled(Box)({
    width:"100%",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
})


export const PriceInput = styled(Input)({
    maxWidth:"50px",
    border:"1px solid rgb(125, 125, 125)",
    borderRadius:"5px",
    padding:"5px",
    fontSize:"14px",
    height:"30px"
})


export const CategoryContainer = styled(Box)({
  width: "100%",
  height: "250px",
  overflowY: "scroll",
  marginTop: "20px",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "lightgray",
    borderRadius: "5px",
  },
  "&::-webkit-scrollbar-track": {
    background: "none",
  },
});