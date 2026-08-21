
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getProducts, getCompanyBySlug, useGetCompanyCategoriesQuery } from "@/Api/services";
import { GetServerSidePropsContext } from "next";
import {
  Box,
  Grid as MuiGrid,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Button,
  IconButton,
  Menu,
  FormControlLabel,
  Switch,
  CircularProgress,
  Chip,
  Tooltip,
} from "@mui/material";

// Grid component adhering to size prop standard
const Grid = forwardRef<HTMLDivElement, any>(({ size, ...props }, ref) => {
  if (size && typeof size === "object") {
    return <MuiGrid ref={ref} item {...size} {...props} />;
  }
  return <MuiGrid ref={ref} {...props} />;
});
Grid.displayName = "Grid";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VerifiedIcon from "@mui/icons-material/Verified";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Cookies from "js-cookie";
import Image from "next/image";

import { AccentButton } from "@/StyledComponents/Hero";
import {
  ShopLogoWrapper,
} from "@/StyledComponents/Products";
import {
  BoutiqueLabel,
  ShopSerifHeading,
} from "@/StyledComponents/Typos";

const ProductCard = dynamic(() => import("@/Components/ProductCard"), {
  loading: () => (
    <Box sx={{ width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#ffffff" }}>
      <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: "4 / 4.5" }} />
      <Box sx={{ p: 2 }}>
        <Skeleton width="40%" height={16} sx={{ mb: 1 }} />
        <Skeleton width="80%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="50%" height={20} sx={{ mb: 2 }} />
        <Skeleton width="100%" height={36} sx={{ borderRadius: "10px" }} />
      </Box>
    </Box>
  ),
});

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { shop } = context.query;

  if (!shop || typeof shop !== "string") {
    return {
      notFound: true,
    };
  }

  try {
    const companyData = await getCompanyBySlug(shop);
    const productsData = await getProducts({ company: shop, page: 1, page_size: 12 });

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
  const theme = useTheme();
  const router = useRouter();
  const cartRef = useRef<any>(null);

  const [category, setCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
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
    setPage(1);
    handleFilterClose();
  };

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
      }, 350);
    };
  }, []);

  const handleClearSearch = () => {
    setInputValue("");
    setSearchTerm("");
    setPage(1);
  };

  const handleResetFilters = () => {
    setInputValue("");
    setSearchTerm("");
    setCategory("");
    setOnSale(false);
    setPage(1);
  };

  const [products, setProducts] = useState<any[]>(productsData?.results || []);
  const [totalCount, setTotalCount] = useState<number>(productsData?.count || 0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(Boolean(productsData?.next));
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
        const response = await getProducts({
          company: shopname,
          category: category,
          search: searchTerm,
          page,
          on_sale: onSale,
          page_size: pageSize,
        });

        if (page === 1) {
          setProducts(response?.results || []);
        } else {
          setProducts((prev) => [...prev, ...(response?.results || [])]);
        }
        setTotalCount(response?.count ?? 0);
        setHasNextPage(Boolean(response?.next));
        setProductsError(null);
      } catch (err: any) {
        setProductsError(err);
        if (page === 1) setProducts([]);
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
    if (pageSize !== 12) newQuery.page_size = String(pageSize);

    router.replace(
      { pathname: router.pathname, query: newQuery },
      undefined,
      { shallow: true, scroll: false }
    );
  }, [searchTerm, category, onSale, page, pageSize]);

  const triggerCartRefetch = () => {
    if (cartRef.current) {
      cartRef.current.triggerCartRefetch();
    }
  };

  const handleOnSaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setOnSale(isChecked);
    setPage(1);
  };

  useImperativeHandle(ref, () => ({
    triggerCartRefetch() {
      triggerCartRefetch();
    },
  }));

  // Fetch company categories via dedicated endpoint GET /companies/<company_slug_or_id>/categories/
  const { data: apiCategories } = useGetCompanyCategoriesQuery(shopname, {
    skip: !shopname,
  });

  // Unique categories derived from company API endpoint + fallback from products
  const availableCategories = useMemo(() => {
    if (apiCategories && Array.isArray(apiCategories) && apiCategories.length > 0) {
      return [
        { label: "All Items", value: "" },
        ...apiCategories.map((c) => ({ label: c.name, value: c.name })),
      ];
    }

    const set = new Set<string>();
    (productsData?.results || []).forEach((p: any) => {
      if (p.categories && Array.isArray(p.categories)) {
        p.categories.forEach((catObj: any) => {
          if (catObj?.name) set.add(catObj.name.trim());
        });
      }
    });
    products.forEach((p: any) => {
      if (p.categories && Array.isArray(p.categories)) {
        p.categories.forEach((catObj: any) => {
          if (catObj?.name) set.add(catObj.name.trim());
        });
      }
    });

    const categoryList = Array.from(set);
    return [
      { label: "All Items", value: "" },
      ...categoryList.map((c) => ({ label: c, value: c })),
    ];
  }, [apiCategories, products, productsData]);

  useEffect(() => {
    if (!router.isReady) return;

    const { category: queryCategory, search, on_sale, page: queryPage, page_size } = router.query;

    setCategory((queryCategory as string) || "");
    setSearchTerm((search as string) || "");
    setInputValue((search as string) || "");
    setOnSale(on_sale === "true");
    setPage(Number(queryPage) || 1);
    setPageSize(Number(page_size) || 12);
  }, [router.query, router.isReady]);

  const rawPhone = (companyData?.contact_phone || "").replace(/\D/g, "");
  const formattedPhone = rawPhone.startsWith("0") ? `254${rawPhone.slice(1)}` : rawPhone;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* --- CUP COUTURE INSPIRED STOREFRONT HERO --- */}
      <Box
        sx={{
          backgroundColor: "#fbfbfb",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          pt: { xs: 4, md: 6 },
          pb: { xs: 5, md: 7 },
        }}
      >
        <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2.5, sm: 4, md: 6 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              justifyContent: "space-between",
              gap: { xs: 3, md: 5 },
            }}
          >
            {/* Left: Store Logo & Brand Identity */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-start" },
                gap: 3,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {companyData ? (
                <ShopLogoWrapper
                  sx={{
                    width: { xs: 110, sm: 125 },
                    height: { xs: 110, sm: 125 },
                    border: `3px solid ${theme.palette.primary.main}`,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={getCloudinaryLogo(companyData?.logo_image)}
                    alt={companyData?.name || "Shop Logo"}
                    fill
                    sizes="130px"
                    priority
                    style={{ objectFit: "cover" }}
                  />
                </ShopLogoWrapper>
              ) : (
                <Skeleton
                  variant="circular"
                  width={110}
                  height={110}
                  sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
                />
              )}

              <Box sx={{ maxWidth: "680px" }}>
                <BoutiqueLabel sx={{ mb: 0.5 }}>
                  Authentic Storefront
                </BoutiqueLabel>

                <ShopSerifHeading
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.4rem" },
                    color: "#18181b",
                    mb: 1,
                  }}
                >
                  {companyData?.name || shopname}
                </ShopSerifHeading>

                {companyData?.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#71717a",
                      fontSize: { xs: "0.9rem", sm: "0.95rem" },
                      lineHeight: 1.6,
                      mb: 2,
                    }}
                  >
                    {companyData.description}
                  </Typography>
                )}

                {/* Badges & Social Links */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1.5,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Chip
                    icon={<ShoppingBagOutlinedIcon sx={{ fontSize: "1rem !important", color: `${theme.palette.primary.main} !important` }} />}
                    label={`${totalCount || products.length} Available Items`}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      borderRadius: "20px",
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  />

                  {companyData?.kyc_approved && (
                    <Chip
                      icon={<VerifiedIcon sx={{ fontSize: "1rem !important", color: "#10b981 !important" }} />}
                      label="Verified Partner"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        borderRadius: "20px",
                        backgroundColor: "rgba(16, 185, 129, 0.08)",
                        color: "#059669",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                      }}
                    />
                  )}

                  {/* Social Buttons */}
                  <Box sx={{ display: "flex", gap: 1, ml: { sm: 1 } }}>
                    {companyData?.instagram_link && (
                      <Tooltip title="Follow on Instagram" arrow>
                        <IconButton
                          component="a"
                          href={companyData.instagram_link}
                          target="_blank"
                          rel="noreferrer"
                          size="small"
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#18181b",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              borderColor: theme.palette.primary.main,
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <InstagramIcon sx={{ fontSize: "1.15rem" }} />
                        </IconButton>
                      </Tooltip>
                    )}

                    {companyData?.facebook_link && (
                      <Tooltip title="Visit Facebook" arrow>
                        <IconButton
                          component="a"
                          href={companyData.facebook_link}
                          target="_blank"
                          rel="noreferrer"
                          size="small"
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#18181b",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              borderColor: theme.palette.primary.main,
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <FacebookIcon sx={{ fontSize: "1.15rem" }} />
                        </IconButton>
                      </Tooltip>
                    )}

                    {companyData?.twitter_link && (
                      <Tooltip title="Follow on Twitter / X" arrow>
                        <IconButton
                          component="a"
                          href={companyData.twitter_link}
                          target="_blank"
                          rel="noreferrer"
                          size="small"
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#18181b",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              borderColor: theme.palette.primary.main,
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <TwitterIcon sx={{ fontSize: "1.15rem" }} />
                        </IconButton>
                      </Tooltip>
                    )}

                    {formattedPhone && (
                      <Tooltip title="Inquire on WhatsApp" arrow>
                        <IconButton
                          component="a"
                          href={`https://wa.me/${formattedPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          size="small"
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1px solid rgba(37, 211, 102, 0.3)",
                            backgroundColor: "rgba(37, 211, 102, 0.08)",
                            color: "#25D366",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              backgroundColor: "#25D366",
                              color: "#fff",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <WhatsAppIcon sx={{ fontSize: "1.15rem" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Right: Quick Inquiry Button (Desktop) */}
            {formattedPhone && (
              <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right" }}>
                <Button
                  component="a"
                  href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent(`Hello ${companyData?.name || ""}, I'm browsing your online collection.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  startIcon={<WhatsAppIcon sx={{ color: "#25D366" }} />}
                  sx={{
                    borderRadius: "12px",
                    px: 3,
                    py: 1.2,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textTransform: "none",
                    borderColor: "rgba(0,0,0,0.12)",
                    color: "#18181b",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    "&:hover": {
                      borderColor: "#25D366",
                      backgroundColor: "rgba(37, 211, 102, 0.06)",
                    },
                  }}
                >
                  Direct Inquiry
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* --- PRODUCTS & COLLECTION SECTION --- */}
      <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2.5, sm: 4, md: 6 }, py: { xs: 4, md: 6 } }}>
        {/* Section Heading */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "flex-end" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <BoutiqueLabel sx={{ mb: 0.5 }}>
                Curated Selection
              </BoutiqueLabel>
              <ShopSerifHeading variant="h2" sx={{ fontSize: { xs: "1.8rem", sm: "2.4rem" } }}>
                Explore The Collection
              </ShopSerifHeading>
            </Box>

            <Typography variant="body2" sx={{ color: "#71717a", fontWeight: 500 }}>
              Showing {products.length} of {totalCount} items
            </Typography>
          </Box>
        </Box>

        {/* --- STICKY CATEGORIES BAR --- */}
        <Box
          sx={{
            position: "sticky",
            top: { xs: 62, md: 70 },
            zIndex: 90,
            backgroundColor: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(18px) saturate(180%)",
            WebkitBackdropFilter: "blur(18px) saturate(180%)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            py: 1.5,
            mb: 3,
            mx: { xs: -2.5, sm: -4, md: -6 },
            px: { xs: 2.5, sm: 4, md: 6 },
            transition: "all 0.25s ease",
          }}
        >
          {/* Dynamic Category Chips Scroll Area */}
          <Box
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              py: 0.2,
            }}
          >
            {availableCategories.map((cat) => {
              const isSelected = category === cat.value || (cat.value === "" && !category);
              return (
                <Button
                  key={cat.value || "all"}
                  onClick={() => handleCategorySelect(cat.value)}
                  size="small"
                  sx={{
                    width: "auto",
                    minWidth: "fit-content",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    px: { xs: 2, sm: 2.5 },
                    py: 0.8,
                    borderRadius: "30px",
                    fontSize: "0.84rem",
                    fontWeight: isSelected ? 700 : 500,
                    textTransform: "none",
                    letterSpacing: "0.02em",
                    backgroundColor: isSelected
                      ? theme.palette.primary.main
                      : "rgba(0, 0, 0, 0.04)",
                    color: isSelected ? "#ffffff" : "#27272a",
                    border: `1px solid ${isSelected ? theme.palette.primary.main : "rgba(0,0,0,0.08)"}`,
                    boxShadow: isSelected
                      ? `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`
                      : "none",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? theme.palette.primary.main
                        : alpha(theme.palette.primary.main, 0.08),
                      color: isSelected ? "#ffffff" : theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  {cat.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* --- SEARCH & FILTER CONTROLS BAR --- */}
        <Box
          sx={{
            p: 2,
            mb: 4,
            borderRadius: "16px",
            backgroundColor: "#f9fafb",
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Search Input */}
            <Grid size={{ xs: 12, sm: 6, md: 7 }}>
              <TextField
                fullWidth
                placeholder="Search products, sizes, colors..."
                value={inputValue}
                onChange={handleSearchChange}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                    "&.Mui-focused": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                    "& fieldset": { border: "none" },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.9rem",
                    color: "#18181b",
                    py: 1.2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.primary.main, fontSize: "1.2rem", mr: 0.5 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {(isTyping || isSearching) && (
                        <CircularProgress size={18} sx={{ color: theme.palette.primary.main, mr: inputValue ? 0.5 : 0 }} />
                      )}
                      {inputValue && (
                        <IconButton size="small" onClick={handleClearSearch} aria-label="Clear search">
                          <ClearIcon sx={{ fontSize: "1rem", color: "#71717a" }} />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Sale Filter Switch */}
            <Grid size={{ xs: 7, sm: 3, md: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={onSale}
                    onChange={handleOnSaleChange}
                    sx={{
                      width: 42,
                      height: 24,
                      padding: 0,
                      "& .MuiSwitch-switchBase": {
                        padding: "2px",
                        "&.Mui-checked": {
                          transform: "translateX(18px)",
                          color: "#fff",
                          "& + .MuiSwitch-track": {
                            backgroundColor: theme.palette.primary.main,
                            opacity: 1,
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      },
                      "& .MuiSwitch-thumb": {
                        width: 20,
                        height: 20,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      },
                      "& .MuiSwitch-track": {
                        borderRadius: 20,
                        backgroundColor: "rgba(0,0,0,0.12)",
                        opacity: 1,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#18181b", pl: 0.5 }}>
                    Sale Only
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            </Grid>

            {/* Filter Menu Dropdown */}
            <Grid size={{ xs: 5, sm: 3, md: 2 }} sx={{ textAlign: "right" }}>
              <Button
                onClick={handleFilterClick}
                startIcon={<FilterListIcon sx={{ color: theme.palette.primary.main }} />}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "20px",
                  borderColor: "rgba(0,0,0,0.12)",
                  color: "#18181b",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                Categories
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleFilterClose}
                PaperProps={{
                  elevation: 6,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: "14px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    py: 1,
                  },
                }}
              >
                {availableCategories.map((cat) => (
                  <MenuItem
                    key={cat.value || "all"}
                    onClick={() => handleCategorySelect(cat.value)}
                    selected={category === cat.value}
                    sx={{
                      fontSize: "0.88rem",
                      fontWeight: category === cat.value ? 700 : 500,
                      color: category === cat.value ? theme.palette.primary.main : "#18181b",
                      borderRadius: "8px",
                      mx: 1,
                      my: 0.3,
                      "&.Mui-selected": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    {cat.label}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Box>

        {/* --- PRODUCTS GRID DISPLAY --- */}
        <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3, lg: 3.5 }}>
          {productsLoading && page === 1 ? (
            [...Array(8)].map((_, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={index}>
                <Box sx={{ width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#ffffff" }}>
                  <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: "4 / 4.5" }} />
                  <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Skeleton width="35%" height={14} sx={{ mb: 1 }} />
                    <Skeleton width="85%" height={22} sx={{ mb: 1 }} />
                    <Skeleton width="45%" height={20} sx={{ mb: 2 }} />
                    <Skeleton width="100%" height={36} sx={{ borderRadius: "10px" }} />
                  </Box>
                </Box>
              </Grid>
            ))
          ) : productsError ? (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  py: 8,
                  px: 3,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Typography variant="h6" sx={{ color: "#e11d48", fontWeight: 600, mb: 1 }}>
                  Unable to load products
                </Typography>
                <Typography variant="body2" sx={{ color: "#71717a", mb: 3 }}>
                  {productsError.message || "Please check your network connection and try again."}
                </Typography>
                <Button
                  onClick={handleResetFilters}
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 600 }}
                >
                  Reload Products
                </Button>
              </Box>
            </Grid>
          ) : products.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  py: 10,
                  px: 3,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  borderRadius: "20px",
                  border: "1px dashed rgba(0,0,0,0.12)",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: "2rem" }} />
                </Box>
                <ShopSerifHeading variant="h4" sx={{ fontSize: "1.8rem", mb: 1 }}>
                  No Products Found
                </ShopSerifHeading>
                <Typography variant="body2" sx={{ color: "#71717a", maxWidth: "450px", mx: "auto", mb: 3 }}>
                  We couldn&apos;t find any items matching your selected criteria. Try resetting filters or searching with different keywords.
                </Typography>
                <Button
                  onClick={handleResetFilters}
                  startIcon={<RestartAltIcon />}
                  variant="contained"
                  sx={{
                    borderRadius: "30px",
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  Reset All Filters
                </Button>
              </Box>
            </Grid>
          ) : (
            products.map((product: any) => (
              <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={product.id || product.slug}>
                <ProductCard
                  product={product}
                  triggerCartRefetch={triggerCartRefetch}
                />
              </Grid>
            ))
          )}
        </Grid>

        {/* --- LOAD MORE SECTION --- */}
        {hasNextPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 4 }}>
            <AccentButton
              disabled={productsLoading}
              onClick={() => setPage((prev) => prev + 1)}
              startIcon={productsLoading ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : null}
              sx={{
                borderRadius: "30px",
                px: 5,
                py: 1.4,
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {productsLoading ? "Loading Collection..." : "Load More Products"}
            </AccentButton>
          </Box>
        )}
      </Box>
    </Box>
  );
});

Shop.displayName = "Shop";

export default React.memo(Shop);