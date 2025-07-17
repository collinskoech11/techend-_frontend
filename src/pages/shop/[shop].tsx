import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs"; // Renamed to avoid conflict
import MuiLink from "@mui/material/Link"; // Renamed to avoid conflict
import Skeleton from "@mui/material/Skeleton";
// Removed: import { BreadCrumbContainer } from "@/StyledComponents/BreadCrumb"; // Will define it here
import {
  MainProductsContainer,
  ProductsContainer,
  ProductItem, // Keep this for the product cards Grid item
} from "@/StyledComponents/Products";
import ProductCard from "@/Components/ProductCard";
import { useRouter } from "next/router";
import { useGetProductsQuery } from "@/Api/services";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  InputAdornment, // For adding icons to TextField
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // Search icon
import FilterListIcon from '@mui/icons-material/FilterList'; // Filter icon
import Cookies from "js-cookie";
import { styled } from "@mui/system"; // Import styled

// --- Color Palette (Consistent with your project) ---
const primaryRed = "#be1f2f"; // Your main red accent
const darkText = "#212121"; // For main text
const lightText = "#555555"; // For secondary text/labels
const lightGrayBackground = "#f8f8f8"; // Background for the page
const whiteBackground = "#ffffff"; // Background for cards/sections
const mediumGrayBorder = "#e0e0e0"; // For borders and dividers

// --- Styled Components for UI Improvements ---

const StyledBreadcrumbWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: whiteBackground,
  padding: theme.spacing(2, 3), // Top/bottom padding, left/right padding
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)", // Subtle shadow
  marginBottom: theme.spacing(4), // Space below breadcrumbs
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2),
  },
}));

const StyledBreadcrumbs = styled(MuiBreadcrumbs)(({ theme }) => ({
  "& ol": {
    justifyContent: "flex-start", // Align items to the start
  },
  "& .MuiBreadcrumbs-separator": {
    color: lightText, // Color of the separator (e.g., '/')
  },
}));

const StyledLink = styled(MuiLink)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.95rem",
  color: lightText,
  transition: "color 0.3s ease",
  "&:hover": {
    color: primaryRed, // Red accent on hover
    textDecoration: "underline",
  },
  "&.MuiTypography-root": { // Style for the last, non-link breadcrumb
    fontWeight: 600,
    color: primaryRed, // Red accent for the active page
    cursor: "default",
  },
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  backgroundColor: whiteBackground,
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    flexDirection: "row", // Horizontal layout on larger screens
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& label.Mui-focused": {
    color: primaryRed, // Red accent for focused label
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", // Slightly rounded corners
    "& fieldset": {
      borderColor: mediumGrayBorder, // Default border color
    },
    "&:hover fieldset": {
      borderColor: primaryRed, // Red accent on hover border
    },
    "&.Mui-focused fieldset": {
      borderColor: primaryRed, // Red accent on focused border
      borderWidth: "2px", // Make border slightly thicker on focus
    },
  },
  "& .MuiInputAdornment-root": {
    color: lightText, // Icon color
    "& .MuiSvgIcon-root": {
      color: lightText, // Icon color
    },
  },
}));


const Shop = forwardRef((props: any, ref: any) => {
  const router = useRouter();
  const cartRef = useRef<any>(null); // This ref seems intended for something else based on context
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const [category, setCategory] = useState<any>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const pathParts = router.asPath.split("/");
    if (pathParts[1] === "shop" && pathParts[2]) {
      const urlShopName = pathParts[2];
      setShopName(urlShopName);
      Cookies.set("shopname", urlShopName, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: "Lax", // 'Strict' can cause issues with direct navigation, 'Lax' is often safer
      });
    }
  }, [router.asPath]);

  // Adjust useGetProductsQuery to use `category` and `searchTerm`
  // You might need to update your API service to handle `search` parameter
  const {
    data: products_data,
    error: products_error,
    isLoading: products_loading,
  } = useGetProductsQuery({ company: shopname, category: category, search: searchTerm }); // Pass searchTerm to API

  // Removed client-side filtering since API will handle it
  // const filteredProducts = (products_data || []).filter((product: any) =>
  //   product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  // );


  const triggerCartRefetch = () => {
    if (cartRef.current) {
      // Assuming cartRef.current is an instance with a triggerCartRefetch method
      // This part depends on how you've set up your cart ref in the parent component.
      // If the cart is part of the Navbar or a global context, this prop might not be necessary here.
      cartRef.current.triggerCartRefetch();
    }
  };

  useImperativeHandle(ref, () => ({
    triggerCartRefetch() {
      triggerCartRefetch();
    },
  }));

  useEffect(() => {
    if (router.isReady) {
      const { category: queryCategory, search: querySearch } = router.query;
      if (queryCategory) {
        setCategory(queryCategory as string);
      }
      if (querySearch) {
        setSearchTerm(querySearch as string);
      }
    }
  }, [router.isReady, router.query]);


  return (
    <>
      <StyledBreadcrumbWrapper>
        <StyledBreadcrumbs aria-label="breadcrumb">
          <Typography color="inherit">
            {shopname.charAt(0).toUpperCase() + shopname.slice(1)} {/* Capitalize shop name */}
          </Typography>
          <StyledLink variant="body1" className="MuiTypography-root" href={`/shop/${shopname}`}> {/* Use Typography for the current page */}
            Shop
          </StyledLink>
        </StyledBreadcrumbs>
      </StyledBreadcrumbWrapper>

      <MainProductsContainer sx={{ mt: 0, px: 3, maxWidth: "1500px", mx: "auto", pb: 6 }}> {/* Adjust margin and padding */}
        {/* Filters Section */}
        <FiltersContainer>
          <Grid item xs={12} md={6}> {/* Use Grid item for responsiveness */}
            <StyledTextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}> {/* Use Grid item for responsiveness */}
            <StyledTextField
              select
              fullWidth
              label="Filter by Category"
              variant="outlined"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {/* These should ideally come from your API or a predefined list */}
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="fashion">Fashion</MenuItem>
              <MenuItem value="beauty">Beauty</MenuItem>
              <MenuItem value="home-appliances">Home Appliances</MenuItem>
              <MenuItem value="books">Books</MenuItem>
            </StyledTextField>
          </Grid>
        </FiltersContainer>

        {/* Products Display */}
        <ProductsContainer container spacing={3}> {/* Increased spacing for better card separation */}
          {products_loading ? (
            // Skeletons mimicking the ProductCard structure
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
          ) : products_data.length === 0 ? ( // Use products_data directly, as API now filters
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
            products_data.map((product: any, index: number) => (
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
      </MainProductsContainer>
    </>
  );
});

export default Shop;