
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

const HeroSection = styled(Box)<{ bannerImage?: string }>(({ theme, bannerImage }) => ({
  position: 'relative',
  height: '35vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  marginTop:"-20px",
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${bannerImage || '/assets/images2/banner-1.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.8)',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));

const ShopHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  textAlign: 'left',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(-8),
}));

const ShopLogo = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius * 2,
  border: `4px solid ${theme.palette.background.paper}`,
  marginBottom: theme.spacing(1),
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
      console.log(companyData, "(&*^&%")
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
  }, [products_data]);

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
      <HeroSection bannerImage={`https://res.cloudinary.com/dqokryv6u/${companyData?.banner_image}` || `https://res.cloudinary.com/dqokryv6u/${companyData?.logo_image}` || 'https://res.cloudinary.com/dqokryv6u/image/upload/v1759399099/ommvqgcgupxula0d3mvj.png'} />
      <Box sx={{ minHeight: "calc(100dvh - 64px)", background:"#fff", borderTopLeftRadius:"20px", borderTopRightRadius:"20px", pt:4, mt:-2, zIndex: 10, position:"relative" }}>
        <MainProductsContainer sx={{ px: 3, maxWidth: "1500px", mx: "auto", pb: 6 }}>
          <ShopHeader>
            <ShopLogo src={`https://res.cloudinary.com/dqokryv6u/${companyData?.logo_image}` || 'https://res.cloudinary.com/dqokryv6u/image/upload/v1753441959/z77vea2cqud8gra2hvz9.jpg'} />
            <Box sx={{width: '600px',maxWidth:"70dvw", textAlign: 'left' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                {companyData?.name}
              </Typography>
              <Typography variant="body1" sx={{ color: lightText }}>
                {companyData?.description}
              </Typography>
              <Button variant="contained" sx={{ mt: 1 }}>
                {products_data?.count} Products
              </Button>
            </Box>
          </ShopHeader>

        {/* Filters Section */}
        <Box sx={{ mb: 2 }}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            
            <Grid item xs={8}>
              <TextField
                fullWidth
                placeholder="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value)
                }}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={<Switch checked={onSale} onChange={handleOnSaleChange} color="primary" />}
                label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Sale</Typography>}
                sx={{ mr: 1 }}
              />
            </Grid>

            <Grid item xs={1}>
              {/* Show Filter Icon instead of select on mobile */}
              <IconButton
                aria-label="filter categories"
                onClick={handleFilterClick}
                sx={{
                  ml: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <FilterListIcon />
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
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'flex-end' }}>
                {companyData?.facebook_link && (
                  <a href={companyData.facebook_link} target="_blank" rel="noreferrer">
                    <FacebookIcon sx={{ color: '#1877F2', fontSize: '2rem' }} />
                  </a>
                )}
                {companyData?.twitter_link && (
                  <a href={companyData.twitter_link} target="_blank" rel="noreferrer">
                    <TwitterIcon sx={{ color: '#1DA1F2', fontSize: '2rem' }} />
                  </a>
                )}
                {companyData?.instagram_link && (
                  <a href={companyData.instagram_link} target="_blank" rel="noreferrer">
                    <InstagramIcon sx={{ color: '#E1306C', fontSize: '2rem' }} />
                  </a>
                )}
              </Box>
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
