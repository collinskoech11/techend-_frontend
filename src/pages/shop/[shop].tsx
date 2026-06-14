
// 'use client';

import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
import { alpha } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import {
  MainProductsContainer,
  ProductsContainer,
  ProductItem, // Keep this for the product cards Grid item
} from "@/StyledComponents/Products";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Chip from "@mui/material/Chip";
import { getProducts, getCompanyBySlug } from "@/Api/services"; // Modified import
import { GetServerSidePropsContext } from "next"; // New import
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
  Switch,
  CircularProgress,
  // Avatar,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // Search icon
import FilterListIcon from '@mui/icons-material/FilterList'; // Filter icon
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Cookies from "js-cookie";
import { styled, useTheme } from "@mui/material"; // Import styled
import Image from "next/image";
import React from "react";


// --- Color Palette (Consistent with your project) ---
const darkText = "#212121"; // For main text
const lightText = "#555555"; // For secondary text/labels
// const lightGrayBackground = "#f8f8f8"; // Background for the page
const whiteBackground = "#ffffff"; // Background for cards/sections
// const mediumGrayBorder = "#e0e0e0"; // For borders and dividers

// --- Styled Components for UI Improvements ---

// const HeroSection = styled(Box, {
//   shouldForwardProp: (prop) => prop !== 'bannerImage',
// })<{ bannerImage?: string }>(({ theme, bannerImage }) => ({
//   position: 'relative',
//   height: '40vh',
//   minHeight: 500,
//   maxHeight: 600,
//   width: '100%',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   color: '#fff',
//   marginTop: '-80px',
//   textAlign: 'center',
//   overflow: 'hidden',

//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     inset: 0,
//     backgroundImage: `url(${bannerImage})`,
//     backgroundSize: 'contain',
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',   // default
//     zIndex: 1,
//   },

//   [theme.breakpoints.up('md')]: {
//     '&::before': {
//       backgroundPosition: 'center center',
//     },
//   },

//   '& > *': {
//     position: 'relative',
//     zIndex: 2,
//   },
// }));
const ProductCard = dynamic(() => import("@/Components/ProductCard"), {
  loading: () => <Skeleton variant="rectangular" width="100%" height={320} />,
});
const ShopHeader = styled(Box)(({ theme }) => ({
  // display: 'flex',
  // flexDirection: 'column',
  // alignItems: 'left',
  // textAlign: 'left',
  // marginBottom: theme.spacing(2),
  marginTop: theme.spacing(-8),
}));

export const ShopLogoWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  width: 120,
  height: 120,
  borderRadius: "50%",
  overflow: "hidden",
  border: `4px solid ${theme.palette.background.paper}`,
  marginBottom: theme.spacing(1),
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
}));

// const ShopLogo = styled(Image)(({ theme }) => ({
//   width: 120,
//   height: 120,
//   borderRadius: theme.shape.borderRadius * 2,
//   border: `4px solid ${theme.palette.background.paper}`,
//   marginBottom: theme.spacing(1),
//   boxShadow: '0 0 10px rgba(0,0,0,0.9)',
// }));



export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { shop } = context.query;

  if (!shop || typeof shop !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const companyData = await getCompanyBySlug(shop);
    const productsData = await getProducts({ company: shop, page: 1, page_size: 10 });

    return {
      props: {
        companyData: companyData || null,
        productsData: productsData || null,
        shopname: shop,
      },
    };
  } catch (error) {
    console.error("Error fetching data in getServerSideProps:", error);
    return {
      props: {
        companyData: null,
        productsData: null,
        shopname: shop,
        error: "Failed to load shop data.",
      },
    };
  }
}

const Shop = forwardRef(({ companyData, productsData, shopname }: any, ref: any) => {
  const theme = useTheme(); // Assuming theme is passed as a prop
  const router = useRouter();
  const cartRef = useRef<any>(null); // This ref seems intended for something else based on context
  // const primaryRed = theme.palette.primary.main; // Your main red accent
  const [category, setCategory] = useState<any>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // New state for immediate input value
  const [isTyping, setIsTyping] = useState(false); // New state to track typing activity
  const [isSearching, setIsSearching] = useState(false); // New state to track active search query
  const [onSale, setOnSale] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Added pageSize state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const getCloudinaryLogo = useCallback((path?: string) => {
    const base = path
      ? `https://res.cloudinary.com/dqokryv6u/${path}`
      : "https://res.cloudinary.com/dqokryv6u/image/upload/v1753441959/z77vea2cqud8gra2hvz9.jpg";

    return base.replace("/upload/", "/upload/f_auto,q_auto,w_240,h_240,c_fill/");
  }, []);
  const open = Boolean(anchorEl);
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorEl(null);
  };
  const handleCategorySelect = (value: string) => {
    setCategory(value);
    setPage(1); // Reset page to 1 when category changes
    handleFilterClose();
  };

  // const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = useMemo(() => {
    let timeout: NodeJS.Timeout;

    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setIsTyping(true);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (value.length >= 2 || value.length === 0) {
          setPage(1);
          setSearchTerm(value);
          setIsSearching(true);
        }
        setIsTyping(false);
      }, 300);
    };
  }, []);

  const [products, setProducts] = useState<any[]>(productsData?.results || []);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<Error | null>(null);

  useEffect(() => {
    if (!shopname) return;
    if (Cookies.get("shopname") !== shopname) {
      Cookies.set("shopname", shopname, { expires: 7, sameSite: "Lax" });
    }
  }, [shopname]);

  useEffect(() => {
    if (!companyData) return;
    const current = Cookies.get("shopDetails");
    const next = JSON.stringify(companyData);
    if (current !== next) {
      Cookies.set("shopDetails", next, { expires: 7, sameSite: "Lax" });
    }
  }, [companyData]);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await getProducts({ company: shopname, category: category, search: searchTerm, page, on_sale: onSale, page_size: pageSize });
        if (page === 1) {
          setProducts(response.results);
        } else {
          setProducts(prev => [...prev, ...response.results]);
        }
        setProductsError(null);
      } catch (err: any) {
        setProductsError(err);
        setProducts([]);
      } finally {
        setProductsLoading(false);
        setIsSearching(false);
      }
    };

    if (shopname) {
      fetchProducts();
    }
  }, [shopname, category, searchTerm, page, onSale, pageSize]);



  useEffect(() => {
    if (!router.isReady) return;

    const newQuery: Record<string, string> = {
      shop: router.query.shop as string,
    };

    if (searchTerm) newQuery.search = searchTerm;
    if (category) newQuery.category = category;
    if (onSale) newQuery.on_sale = "true";
    if (page !== 1) newQuery.page = String(page);
    if (pageSize !== 10) newQuery.page_size = String(pageSize);

    router.replace(
      { pathname: router.pathname, query: newQuery },
      undefined,
      { shallow: true, scroll: false }
    );
  }, [searchTerm, category, onSale, page, pageSize]);

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


  const categories = useMemo(() => [
    { label: "All Categories", value: "" },
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
    { label: "Beauty", value: "beauty" },
    { label: "Home Appliances", value: "home-appliances" },
    { label: "Books", value: "books" },
  ], []);


  useEffect(() => {
    if (!router.isReady) return;

    const { category, search, on_sale, page, page_size } = router.query;

    setCategory(category as string || "");
    setSearchTerm(search as string || "");
    setInputValue(search as string || "");
    setOnSale(on_sale === "true");
    setPage(Number(page) || 1);
    setPageSize(Number(page_size) || 10);
  }, [router.query, router.isReady]);

const BouncingDots = React.memo(function BouncingDots() {
  return (
    <Box sx={{ display: "inline-flex", gap: 0.4, ml: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            backgroundColor: "currentColor",
            animation: "bounce 1.2s infinite",
            animationDelay: `${i * 0.2}s`,
            "@keyframes bounce": {
              "0%, 80%, 100%": { transform: "scale(0)" },
              "40%": { transform: "scale(1)" },
            },
          }}
        />
      ))}
    </Box>
  );
});

  return (
    <>
      {/* <HeroSection bannerImage={`${companyData?.banner_image}`} /> */}
      <Box sx={{ minHeight: "calc(100dvh - 64px)", background: "#fff", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", pt: 4, mt: -2, zIndex: 10, position: "relative", boxShadow: '0 0 10px rgba(0,0,0,0.9)', }}>
        <MainProductsContainer sx={{ px: 3, maxWidth: "1500px", mx: "auto", pb: 6, mt: 10 }}>
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
              width: { md: "fit-content", xs: "100%" }
            }}
          >
            {companyData ? (
              <ShopLogoWrapper>
                <Image
                  src={getCloudinaryLogo(companyData?.logo_image)}
                  alt="shop logo"
                  fill
                  sizes="120px"
                  priority={false}
                />
              </ShopLogoWrapper>
            ) : (
              <CircularProgress size={110} sx={{ color: theme.palette.primary.main }} />
            )}

            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: theme.palette.primary.main }}>
                {companyData ? companyData?.name : <BouncingDots />}
              </Typography>

              {/* <Typography variant="body1" sx={{ maxWidth: "700px", color: lightText, mb: 1 }}>
                {companyData?.description}
              </Typography> */}



              {/* Social Icons */}
              <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
                <Chip
                  label={
                    productsData?.count !== undefined ? (
                      `${productsData.count} Items`
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <BouncingDots />
                      </Box>
                    )
                  }
                  sx={(theme) => ({
                    px: 2,
                    py: 1,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                    // ✨ dynamic company color styling
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,

                    // optional subtle hover polish
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.18),
                    },
                  })}
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
                  value={inputValue}
                  onChange={handleSearchChange}
                  size="medium"
                  sx={(theme) => ({
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "40px",
                      background: alpha(theme.palette.primary.main, 0.04), // soft brand tint
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                      transition: "all 0.2s ease",

                      "&:hover": {
                        boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.22)}`,
                      },

                      "&.Mui-focused": {
                        background: alpha(theme.palette.primary.main, 0.06),
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
                      },

                      "& fieldset": { border: "none" },
                    },

                    "& .MuiInputBase-input": {
                      padding: "12px 16px",
                      color: theme.palette.primary.main,
                    },
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={(theme) => ({
                            color: theme.palette.primary.main,
                            mr: 1,
                          })}
                        />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        {(isTyping || isSearching) && (
                          <CircularProgress
                            size={20}
                            sx={(theme) => ({
                              color: theme.palette.primary.main,
                            })}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* SALE SWITCH */}
              <Grid item xs={6} sm={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={onSale}
                      onChange={handleOnSaleChange}
                      sx={(theme) => ({
                        width: 42,
                        height: 26,
                        padding: 0,

                        "& .MuiSwitch-switchBase": {
                          padding: "3px",

                          "&.Mui-checked": {
                            transform: "translateX(16px)",
                            color: theme.palette.primary.main,

                            "& + .MuiSwitch-track": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.25),
                              opacity: 1,
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                            },
                          },
                        },

                        "& .MuiSwitch-thumb": {
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          width: 20,
                          height: 20,
                          backgroundColor: theme.palette.primary.main,
                        },

                        "& .MuiSwitch-track": {
                          borderRadius: 20,
                          backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          opacity: 1,
                        },
                      })}
                    />
                  }
                  label={
                    <Typography
                      sx={(theme) => ({
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: theme.palette.primary.main,
                        paddingLeft: 1,
                      })}
                    >
                      Sale
                    </Typography>
                  }
                  sx={{ ml: 0 }}
                />
              </Grid>
              {/* FILTER ICON */}
              <Grid item xs={6} sm={2} textAlign="right">
                <IconButton
                  onClick={handleFilterClick}
                  aria-label="filter products"
                  sx={(theme) => ({
                    borderRadius: "50%",
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                    p: 1.25,
                    background: alpha(theme.palette.primary.main, 0.05),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.18)}`,
                    transition: "all 0.25s ease",

                    "&:hover": {
                      background: alpha(theme.palette.primary.main, 0.12),
                      transform: "scale(1.08)",
                      boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.28)}`,
                    },
                  })}
                >
                  <FilterListIcon
                    sx={(theme) => ({
                      color: theme.palette.primary.main,
                    })}
                  />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleFilterClose}
                  PaperProps={{
                    elevation: 8,
                    sx: (theme) => ({
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: theme.shape.borderRadius * 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.06),
                      backdropFilter: "blur(12px) saturate(160%)",
                      WebkitBackdropFilter: "blur(12px) saturate(160%)",
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.18)}`,
                      py: 1,
                    }),
                  }}
                  sx={{
                    "& .MuiMenuItem-root": {
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      fontWeight: 500,
                      color: (theme) => theme.palette.primary.main,
                      transition: "all 0.2s ease",

                      "&:hover": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.12),
                      },
                    },
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem
                      key={cat.value || "all"}
                      onClick={() => handleCategorySelect(cat.value)}
                    >
                      {cat.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>

            </Grid>
          </Box>


          {/* Products Display */}
          <ProductsContainer container spacing={3}> {/* Increased spacing for better card separation */}
            {productsLoading && page === 1 ? (
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
            ) : productsError ? (
              <Grid item xs={12}>
                <Box sx={{ padding: 4, textAlign: 'center', backgroundColor: whiteBackground, borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <Typography variant="h6" color="error">
                    Failed to load products. Please try again.
                  </Typography>
                  <Typography variant="body2" color={lightText} mt={1}>
                    {productsError.message || "An unknown error occurred."}
                  </Typography>
                </Box>
              </Grid>
            ) : products.length === 0 ? ( // Use products directly
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
                    // isLoading={false} // ProductCard itself handles its loading state if data is ready
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
              disabled={!productsData?.next || productsLoading}
              onClick={() => setPage(page + 1)}
              startIcon={productsLoading && <CircularProgress size={20} />}
            >
              {productsLoading ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        </MainProductsContainer>
      </Box>
    </>
  );
});
Shop.displayName = "Shop";

export default React.memo(Shop);