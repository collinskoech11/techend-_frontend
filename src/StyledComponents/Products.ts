import { styled, Box, Grid, Card, Avatar } from "@mui/material";
import Image, { ImageProps } from "next/image";

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
    width:"100vw"
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
  height: 500, // ⭐ standard fixed height (adjust to your design)
  margin: "auto",
  borderRadius: "12px",
  boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2)`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
  paddingBottom: theme.spacing(2),

  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
  },
}));

export const ProductImageWrapper = styled(Box)(({ }) => ({
  width: "100%",
  height: "300px", // Increased height for better product visibility
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative", // For hover overlay
  borderTopLeftRadius: "12px", // Match card border-radius
  borderTopRightRadius: "12px",
}));

export const ProductImage = styled(Image)<ImageProps>(({
  width: "100%",
  height: "100%",
  objectFit: "cover", // Ensure image covers the area
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)", // Gentle zoom on image hover
  },
}));

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

export const IconActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  width: "100%",
  "& .MuiIconButton-root": {
    backgroundColor: "#f0f0f0",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
}));


export const HeroSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bannerImage',
})<{ bannerImage?: string }>(({ theme, bannerImage }) => ({
  position: 'relative',
  height: '40vh',
  minHeight: 500,
  maxHeight: 600,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  marginTop: '-80px',
  textAlign: 'center',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bannerImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',   // default
    zIndex: 1,
  },

  [theme.breakpoints.up('md')]: {
    '&::before': {
      backgroundPosition: 'center center',
    },
  },

  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));

export const ShopHeader = styled(Box)(({ theme }) => ({
  // display: 'flex',
  // flexDirection: 'column',
  // alignItems: 'left',
  // textAlign: 'left',
  // marginBottom: theme.spacing(2),
  marginTop: theme.spacing(-8),
}));

export const ShopLogo = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius * 2,
  border: `4px solid ${theme.palette.background.paper}`,
  marginBottom: theme.spacing(1),
  boxShadow: '0 0 10px rgba(0,0,0,0.9)',
}));

// interface ShopProps {
//   companyData: any;
//   productsData: any;
//   shopname: string;
//   error?: string;

// <ProductCard product={p} triggerCartRefetch={() => { }} />

            // <Button variant="contained" color="primary" disabled={productsLoading} onClick={() => setPage(page + 1)}>
            //   {productsLoading ? <CircularProgress size={20} /> : 'Load More'}
            // </Button>