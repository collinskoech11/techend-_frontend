import { Box, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";

export const CartBanner = styled(Box)({
  width: "100vw",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "300px",
  background: "rgb(237,241,255)",
  marginBottom:"30px"
});
export const CartSummaryContainer = styled(Box)({
    display:"flex",
    flexWrap:"wrap",
    width:"100vw",
    minHeight:"200px",
    justifyContent:"space-around"
})
export const CartTableContainer = styled(TableContainer)({
    width:"68%",
    "@media screen and (max-width:800px)":{
      width:"100%"
    }
})
export const CartTable = styled(Table)({

})
export const CartTableHead = styled(TableHead)({
  background: "#EDF1FF",
  height: "30px",
  "*": {
    border: "none",
    fontWeight:"800"
  },
});
export const CartTableRow = styled(TableRow)({
    height:"30px"
})
export const CartTableCell = styled(TableCell)({
  border: "1px solid rgb(125,125,125,0.3)",
  height: "40px",
  padding:"0px",
  textAlign:"center"
});
export const CartTableBody = styled(TableBody)({

})
export const CartSummary = styled(Box)({
  width: "28%",
  minHeight: "200px",
  "@media screen and (max-width:800px)":{
    width:"100%"
  }
});

export const CouponContainer = styled(Box)({
  width:"100%",
  display:"flex",
  marginBottom:"20px"
})

export const CouponInput = styled(Input)({
  width: "70%",
  border: "1px solid #EDF1FF",
  height:"30px"
});

export const CartSummarySub = styled(Box)({
  display: "flex",
  flexDirection: "row",
  marginTop: "20px",
  flexWrap: "wrap",
  border: "1px solid #EDF1FF",
});
export const CartSummaryTitle = styled(Typography)({
  background: "#EDF1FF",
  color:"#000",
  fontWeight:"600",
  fontSize:"16px",
  width:"100%",
  padding:"7px"
});
export const CartSummaryContent = styled(Typography)({
  width:"100%",
  display: "flex",
  justifyContent: "space-between",
  padding: "15px",
  borderBottom: "1px solid #EDF1FF",
  "span":{
    fontSize:"12px"
  }
});