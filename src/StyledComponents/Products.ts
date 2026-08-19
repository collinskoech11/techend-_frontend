import { styled, Box, Grid, Card, Avatar, alpha } from "@mui/material";
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
  height: "100%",
  minHeight: 460,
  [theme.breakpoints.down("sm")]: {
    minHeight: 360,
  },
  margin: "auto",
  borderRadius: "16px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
  transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.35s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflow: "hidden",
  position: "relative",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  cursor: "pointer",

  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: `0 16px 32px ${alpha(theme.palette.primary.main, 0.12)}, 0 4px 12px rgba(0, 0, 0, 0.05)`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

export const ProductImageWrapper = styled(Box)({
  width: "100%",
  height: 200,
  position: "relative",
  backgroundColor: "#f4f4f5",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const ProductImage = styled(Image)<ImageProps>(({ theme }) => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  padding: 0,
  transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",

  [`${ProductItemStyled}:hover &`]: {
    transform: "scale(1.05)",
  },
}));

export const ProductInfoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(2),
  },
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  justifyContent: "space-between",
}));

export const RatingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "3px",
  marginBottom: theme.spacing(0.5),

  "& .MuiSvgIcon-root": {
    fontSize: "0.95rem",
    color: "#f59e0b",
  },
}));

export const IconActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2, 2, 2),
  width: "100%",
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

export const ShopLogoWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 120,
  height: 120,
  borderRadius: "50%",
  overflow: "hidden",
  border: `4px solid ${theme.palette.background.paper}`,
  marginBottom: theme.spacing(1),
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
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