import { styled, Box, Grid, Card } from "@mui/material";

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
  width: "100%",
  maxWidth: "1500px",
  marginTop: "20px",
  "@media screen and (max-width:800px)":{
    width:"100%"
  }
});

export const ProductItem = styled(Grid)({});

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


export const ProductItemStyled = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "350px", // Set a max-width for better responsiveness and grid alignment
  borderRadius: "12px", // Softer rounded corners
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)", // Softer initial shadow
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden", // Ensures image border-radius applies
  position: "relative", // For image overlay
  "&:hover": {
    transform: "translateY(-5px)", // Slight lift on hover
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)", // Enhanced shadow on hover
  },
  paddingBottom: theme.spacing(2), // Padding at the bottom for content
}));

export const ProductImageWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "220px", // Increased height for better product visibility
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative", // For hover overlay
  borderTopLeftRadius: "12px", // Match card border-radius
  borderTopRightRadius: "12px",
}));

export const ProductImage = styled('img')({
  width: "100%",
  height: "100%",
  objectFit: "cover", // Ensure image covers the area
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)", // Gentle zoom on image hover
  },
});

export const ProductInfoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), // Consistent padding for text content
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", // Align text to left
}));

export const RatingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "2px", // Closer stars
  marginBottom: theme.spacing(1),
  "& .MuiSvgIcon-root": {
    fontSize: "1rem", // Slightly larger stars
    color: "#FFD700", // Gold color for stars
  },
}));

export const ProductOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 1,
  },
}));
