
'use client';

import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  use,
} from "react";
import MuiLink from "@mui/material/Link"; // Renamed to avoid conflict
import Skeleton from "@mui/material/Skeleton";
import {
  MainProductsContainer,
  ProductsContainer,
  ProductItem, // Keep this for the product cards Grid item
} from "@/StyledComponents/Products";
import ProductCard from "@/Components/ProductCard";
import { useRouter } from "next/router";
import Chip from "@mui/material/Chip";
import { useGetProductsQuery, useGetCompanyBySlugQuery } from "@/Api/services";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  InputAdornment, // For adding icons to TextField
  Button,
  IconButton,
  Menu,
  FormControlLabel,
  Checkbox,
  Switch,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // Search icon
import FilterListIcon from '@mui/icons-material/FilterList'; // Filter icon
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Cookies from "js-cookie";
import { styled, useTheme } from "@mui/system"; // Import styled

// --- Color Palette (Consistent with your project) ---
const darkText = "#212121"; // For main text
const lightText = "#555555"; // For secondary text/labels
const lightGrayBackground = "#f8f8f8"; // Background for the page
const whiteBackground = "#ffffff"; // Background for cards/sections
const mediumGrayBorder = "#e0e0e0"; // For borders and dividers

// --- Styled Components for UI Improvements ---

const HeroSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bannerImage',
})<{ bannerImage?: string }>(({ theme, bannerImage }) => ({
  position: 'relative',
  maxHeight: '40vh',
  height: '500px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  marginTop: "-80px",
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${bannerImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // filter: 'brightness(0.8)',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));

const ShopHeader = styled(Box)(({ theme }) => ({
  // display: 'flex',
  // flexDirection: 'column',
  // alignItems: 'left',
  // textAlign: 'left',
  // marginBottom: theme.spacing(2),
  marginTop: theme.spacing(-8),
}));

const ShopLogo = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius * 2,
  border: `4px solid ${theme.palette.background.paper}`,
  marginBottom: theme.spacing(1),
  boxShadow: '0 0 10px rgba(0,0,0,0.9)',
}));



const Shop = forwardRef((props: any, ref: any) => {
  Shop.displayName = "Shop";
  const theme = useTheme(); // Assuming theme is passed as a prop
  const router = useRouter();
  const cartRef = useRef<any>(null); // This ref seems intended for something else based on context
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const primaryRed = theme.palette.primary.main; // Your main red accent
  const [category, setCategory] = useState<any>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorEl(null);
  };
  const handleCategorySelect = (value: string) => {
    setCategory(value);
    handleFilterClose();
  };



  const [products, setProducts] = useState<any[]>([]);

  const { data: companyData, error: companyError, isLoading: companyLoading } = useGetCompanyBySlugQuery(shopname);

  useEffect(() => {
    const cleanPath = router.asPath.split("?")[0]; // Remove query string
    const pathParts = cleanPath.split("/");

    if (pathParts[1] === "shop" && pathParts[2]) {
      const urlShopName = pathParts[2];
      setShopName(urlShopName);
      Cookies.set("shopname", urlShopName, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "Lax",
      });
    }
  }, [router.asPath]);

  // Wait for company data to be fetched before setting shopDetails
  useEffect(() => {
    if (!companyLoading && companyData) {
      console.log("Fetched company data:", companyData);
      Cookies.set("shopDetails", JSON.stringify(companyData), {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "Lax",
      });

      // ✅ Proceed to any next steps here (e.g., navigation, state updates, etc.)
    }
  }, [companyLoading, companyData]);


  // Adjust useGetProductsQuery to use `category` and `searchTerm`
  // You might need to update your API service to handle `search` parameter
  const {
    data: products_data,
    error: products_error,
    isLoading: products_loading,
  } = useGetProductsQuery({ company: shopname, category: category, search: searchTerm, page, on_sale: onSale });

  useEffect(() => {
    if (products_data) {
      if (page === 1) {
        setProducts(products_data.results);
      } else {
        setProducts(prev => [...prev, ...products_data.results]);
      }
    }
  }, [products_data, page]);

  const triggerCartRefetch = () => {
    if (cartRef.current) {
      // Assuming cartRef.current is an instance with a triggerCartRefetch method
      // This part depends on how you've set up your cart ref in the parent component.
      // If the cart is part of the Navbar or a global context, this prop might not be necessary here.
      cartRef.current.triggerCartRefetch();
    }
  };

  const handleOnSaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setOnSale(isChecked);
    setPage(1);
    const { pathname, query } = router;
    const { on_sale, ...restQuery } = query;

    const newQuery = isChecked ? { ...restQuery, on_sale: 'true' } : restQuery;

    router.push({ pathname, query: newQuery }, undefined, { shallow: true });
  };

  useImperativeHandle(ref, () => ({
    triggerCartRefetch() {
      triggerCartRefetch();
    },
  }));

  useEffect(() => {
    if (router.isReady) {
      const { category: queryCategory, search: querySearch, on_sale: queryOnSale } = router.query;
      if (queryCategory) {
        setCategory(queryCategory as string);
      }
      if (querySearch) {
        setSearchTerm(querySearch as string);
      }
      if (queryOnSale) {
        setOnSale(queryOnSale === 'true');
      }
      setPage(1);
    }
  }, [router.isReady, router.query]);


  return (
    <>
      <HeroSection bannerImage={`${companyData?.banner_image}`} />
      <Box sx={{ minHeight: "calc(100dvh - 64px)", background: "#fff", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", pt: 4, mt: -2, zIndex: 10, position: "relative", boxShadow: '0 0 10px rgba(0,0,0,0.9)', }}>
        <MainProductsContainer sx={{ px: 3, maxWidth: "1500px", mx: "auto", pb: 6 }}>
          {/* SHOP HEADER */}
          <ShopHeader
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 3,
              mb: 4,
              p: 3,
              borderRadius: 4,
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              width:{md:"fit-content", xs:"100%"}
            }}
          >
            <ShopLogo
              src={
                companyData?.logo_image
                  ? `https://res.cloudinary.com/dqokryv6u/${companyData.logo_image}`
                  : "https://res.cloudinary.com/dqokryv6u/image/upload/v1753441959/z77vea2cqud8gra2hvz9.jpg"
              }
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            />

            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {companyData?.name}
              </Typography>
              {/* <Typography variant="body1" sx={{ maxWidth: "700px", color: lightText, mb: 1 }}>
                {companyData?.description}
              </Typography> */}



              {/* Social Icons */}
              <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
                <Chip
                  label={`${products_data?.count} Products`}
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    // backgroundColor: theme.palette.primary.light,
                    // color: theme.palette.primary.contrastText,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  }}
                />
                {companyData?.facebook_link && (
                  <a href={companyData.facebook_link} target="_blank" rel="noreferrer">
                    <FacebookIcon
                      sx={{
                        color: "#000",
                        fontSize: "2rem",
                        transition: "0.25s",
                        "&:hover": { transform: "scale(1.15)" },
                      }}
                    />
                  </a>
                )}
                {companyData?.twitter_link && (
                  <a href={companyData.twitter_link} target="_blank" rel="noreferrer">
                    <TwitterIcon
                      sx={{
                        color: "#000",
                        fontSize: "2rem",
                        transition: "0.25s",
                        "&:hover": { transform: "scale(1.15)" },
                      }}
                    />
                  </a>
                )}
                {companyData?.instagram_link && (
                  <a href={companyData.instagram_link} target="_blank" rel="noreferrer">
                    <InstagramIcon
                      sx={{
                        color: "#000",
                        fontSize: "2rem",
                        transition: "0.25s",
                        "&:hover": { transform: "scale(1.15)" },
                      }}
                    />
                  </a>
                )}
              </Box>

            </Box>
          </ShopHeader>



          {/* FILTERS */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">

              {/* SEARCH */}
              <Grid item xs={12} sm={7}>
                <TextField
                  fullWidth
                  placeholder="Search products…"
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(e.target.value);
                  }}
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "40px",
                      background: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.12)" },
                      "& fieldset": { border: "none" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 16px",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#888", mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* SALE SWITCH */}
              <Grid item xs={6} sm={3}>
                <FormControlLabel
                  control={<Switch checked={onSale} onChange={handleOnSaleChange} color="primary" />}
                  label={<Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>Sale</Typography>}
                  sx={{ ml: 0 }}
                />
              </Grid>

              {/* FILTER ICON */}
              <Grid item xs={6} sm={2} textAlign="right">
                <IconButton
                  onClick={handleFilterClick}
                  sx={{
                    borderRadius: "50%",
                    border: "1px solid #ddd",
                    p: 1.25,
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.3s",
                    "&:hover": {
                      background: "#f5f5f5",
                      transform: "scale(1.1)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <FilterListIcon sx={{ color: "#555" }} />
                </IconButton>

                <Menu anchorEl={anchorEl} open={open} onClose={handleFilterClose}>
                  <MenuItem onClick={() => handleCategorySelect("")}>All Categories</MenuItem>
                  <MenuItem onClick={() => handleCategorySelect("electronics")}>Electronics</MenuItem>
                  <MenuItem onClick={() => handleCategorySelect("fashion")}>Fashion</MenuItem>
                  <MenuItem onClick={() => handleCategorySelect("beauty")}>Beauty</MenuItem>
                  <MenuItem onClick={() => handleCategorySelect("home-appliances")}>Home Appliances</MenuItem>
                  <MenuItem onClick={() => handleCategorySelect("books")}>Books</MenuItem>
                </Menu>
              </Grid>

            </Grid>
          </Box>


          {/* Products Display */}
          <ProductsContainer container spacing={3}> {/* Increased spacing for better card separation */}
            {products_loading && page === 1 ? (
              [...Array(8)].map((_, index) => (
                <ProductItem item xs={12} sm={6} md={4} lg={3} key={index}> {/* Responsive grid */}
                  <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: '12px' }} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton width="80%" height={20} sx={{ mt: 1 }} />
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={15} />
                    <Skeleton width="100%" height={40} sx={{ mt: 2, borderRadius: '8px' }} />
                    <Skeleton width="100%" height={40} sx={{ mt: 1, borderRadius: '8px' }} />
                  </Box>
                </ProductItem>
              ))
            ) : products_error ? (
              <Grid item xs={12}>
                <Box sx={{ padding: 4, textAlign: 'center', backgroundColor: whiteBackground, borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <Typography variant="h6" color="error">
                    Failed to load products. Please try again.
                  </Typography>
                  <Typography variant="body2" color={lightText} mt={1}>
                    {products_error.message || "An unknown error occurred."}
                  </Typography>
                </Box>
              </Grid>
            ) : products.length === 0 ? ( // Use products_data directly, as API now filters
              <Grid item xs={12}>
                <Box sx={{ padding: 4, textAlign: 'center', backgroundColor: whiteBackground, borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <Typography variant="h6" color={darkText}>
                    No products found.
                  </Typography>
                  <Typography variant="body1" color={lightText} mt={1}>
                    Try adjusting your search or filters.
                  </Typography>
                </Box>
              </Grid>
            ) : (
              products.map((product: any, index: number) => (
                <ProductItem item xs={12} sm={6} md={4} lg={3} key={index}> {/* Responsive grid for ProductCard */}
                  <ProductCard
                    product={product}
                    isLoading={false} // ProductCard itself handles its loading state if data is ready
                    triggerCartRefetch={triggerCartRefetch}
                  />
                </ProductItem>
              ))
            )}
          </ProductsContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!products_data?.next || products_loading}
              onClick={() => setPage(page + 1)}
              startIcon={products_loading && <CircularProgress size={20} />}
            >
              {products_loading ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        </MainProductsContainer>
      </Box>
    </>
  );
});

export default Shop;
