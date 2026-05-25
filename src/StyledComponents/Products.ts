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
  height: 480, // Balanced fixed height to prevent content overflow
  margin: "auto",
  borderRadius: "16px", // Softer, more modern corners
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)", // Soft, premium shadow instead of harsh dark lines
  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", // Ensures info and actions sit perfectly at the bottom
  overflow: "hidden",
  position: "relative",
  border: "1px solid rgba(0, 0, 0, 0.04)",

  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
  },
}));

export const ProductImageWrapper = styled(Box)({
  width: "100%",
  height: "260px", // Explicit height allocation for the image zone
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
  backgroundColor: "#f9f9f9", // Light fallback background for transparent products
});

export const ProductImage = styled(Image)<ImageProps>({
  width: "100%",
  height: "100%",
  objectFit: "contain", // Prevents vertical stretching or awkward clipping
  padding: "16px", // Generous breathing room for product shots
  transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  
  // Note: Target the parent ProductItemStyled hover state to trigger the scale effect seamlessly
  [`${ProductItemStyled}:hover &`]: {
    transform: "scale(1.06)",
  },
});

export const ProductInfoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  flexGrow: 1, // Dynamically fills the remaining space between the image and actions
  justifyContent: "flex-start",
}));

export const RatingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px", 
  marginBottom: theme.spacing(1),
  
  "& .MuiSvgIcon-root": {
    fontSize: "1.1rem",
    color: "#FFB400", // Industry standard warm gold hue
  },
}));

export const IconActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: theme.spacing(1.5),
  padding: theme.spacing(0, 2, 2, 2), // Keeps actions firmly anchored to the card footer
  width: "100%",

  "& .MuiIconButton-root": {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    color: theme.palette.text.secondary,
    transition: "all 0.2s ease",
    
    "&:hover": {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.background.paper,
      transform: "scale(1.05)",
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