import { styled, Box, Grid } from "@mui/material";

export const MainProductsContainer = styled(Box)({
  maxWidth: "1500px",
  minHeight: "100px",
  // border:"1px solid rgb(0,0,0,0.3)",
  margin: "auto",
  height: "auto",
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
});

export const FiltersContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  height: "35px",
});

export const ExtendedFilters = styled(Box)({
  width: "19%",
  marginTop: "20px",
  "@media screen and (max-width:800px)":{
    width:"100%"
  }
});

export const ProductsContainer = styled(Grid)({
  width: "80%",
  maxWidth: "1400px",
  marginTop: "20px",
  "@media screen and (max-width:800px)":{
    width:"100%"
  }
});

export const ProductItem = styled(Grid)({});
export const ProductItemStyled = styled(Box)({
  width: "94%",
  margin: "auto",
  border: "1px solid rgb(0,0,0,0.2)",
  minHeight:"400px",
  height: "auto",
  borderRadius: "5px",
  padding: "15px",
  textAlign: "center",
  marginBottom: "40px",
  overflow: "hidden",
  cursor: "pointer",
});


export const ProductImage = styled("img")({
  width: "100%",
  height: "400px", // Set a fixed height
  objectFit: "cover",
});
export const RatingContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  margin: "auto",
  width: "160px",
  alignItems: "center",
});

export const IconsContainer = styled(Box)({
  position: "relative",
  top: "0",
  right: "10px",
  transform: "translateY(-100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  transition: "opacity 1s smooth ease-in-out",
  opacity: 1, // initially visible
  marginTop: "-110px",
  width: "70px",
  marginLeft: "70%",
  height: "88px",
});

export const IconWrapper = styled(Box)({
  cursor: "pointer",
  background: "#fff",
  borderRadius: "50%",
  padding: "5px",
  // marginBottom: "5px",
  transition: "background-color 0.5s ease",

  "&:hover": {
    backgroundColor: "rgba(0, 0, 0)",
    transition: "background-color 0.5s ease",
    "*": {
      color: "#fff",
    },
  },
});
