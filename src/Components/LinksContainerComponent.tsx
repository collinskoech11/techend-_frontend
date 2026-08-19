import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
  Box,
  Typography,
  useTheme,
  ListItemIcon,
  Tooltip,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutline from "@mui/icons-material/PersonOutline";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Cookies from "js-cookie";
import { useGetCompanyBySlugQuery } from "@/Api/services";
import { useCart } from "@/contexts/CartContext";
import { CartMenu } from "./CartMin";

const AuthDialog = dynamic(() => import("./AuthDialog"), { ssr: false });

const DEFAULT_BRAND_URLS = [
  "/shops",
  "/payment",
  "/",
  "/about",
  "/contact",
  "/company-onboarding",
  "/profile",
  "/login",
];

const LinksContainerComponent = forwardRef((_props, ref) => {
  const router = useRouter();
  const theme = useTheme();
  const cookieShop = Cookies.get("shopname");

  // Determine active shop from URL query, asPath, or cookies
  const urlShop =
    typeof router.query.shop === "string"
      ? router.query.shop
      : router.asPath.startsWith("/shop/")
      ? router.asPath.split("/shop/")[1]?.split("?")[0]
      : null;

  const currentShopSlug = urlShop || cookieShop || "Sokojunction";
  const isDefaultBrandPage = DEFAULT_BRAND_URLS.includes(router.pathname);
  const rawShopName = isDefaultBrandPage ? "SokoJunction" : currentShopSlug;
  const displayShopName = /^\d+$/.test(rawShopName) ? "SokoJunction" : rawShopName;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isUserMenuOpen = Boolean(anchorEl);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<string | undefined>(undefined);
  const [shopname, setShopName] = useState(currentShopSlug);

  useEffect(() => {
    const cUser = Cookies.get("username");
    setUser(cUser);
    setUsername(cUser || null);
  }, []);

  const { data: companyData } = useGetCompanyBySlugQuery(displayShopName, {
    skip: isDefaultBrandPage || !displayShopName || displayShopName.toLowerCase() === "sokojunction",
  });

  const [displayedBrand, setDisplayedBrand] = useState("SokoJunction");

  useEffect(() => {
    const isDefault = DEFAULT_BRAND_URLS.includes(router.pathname);
    const activeCookieShop = Cookies.get("shopname");
    const activeUrlShop =
      typeof router.query.shop === "string"
        ? router.query.shop
        : router.asPath.startsWith("/shop/")
        ? router.asPath.split("/shop/")[1]?.split("?")[0]
        : null;

    const rawShop = activeUrlShop || activeCookieShop || "SokoJunction";
    // Check if rawShop is a numeric ID string
    const isNumeric = /^\d+$/.test(rawShop);

    if (isDefault) {
      setDisplayedBrand("SokoJunction");
    } else if (companyData?.name) {
      setDisplayedBrand(companyData.name);
    } else if (!isNumeric && rawShop !== "Sokojunction") {
      setDisplayedBrand(rawShop);
    } else {
      setDisplayedBrand("SokoJunction");
    }
  }, [router.pathname, router.query.shop, router.asPath, companyData]);

  const { sessionId } = useCart();
  const cartRef = useRef<any>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const refetchUser = () => {
    const u = Cookies.get("username");
    setUser(u);
    setUsername(u || null);
  };

  const triggerCartRefetch = () => {
    if (cartRef.current) {
      cartRef.current.cart_refetch?.();
    }
  };

  useImperativeHandle(ref, () => ({
    triggerCartRefetch() {
      triggerCartRefetch();
    },
  }));

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = (link?: string | null) => {
    if (typeof link === "string" && link) {
      router.push(link);
    }
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("shopname");
    Cookies.remove("user");
    setUser(undefined);
    setUsername(null);
    setAnchorEl(null);
    setIsMobileDrawerOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);

  // Keep shop in sync with cookies and route changes
  useEffect(() => {
    const syncShopFromCookies = () => {
      const activeShop =
        (typeof router.query.shop === "string" ? router.query.shop : null) ||
        (router.asPath.startsWith("/shop/") ? router.asPath.split("/shop/")[1]?.split("?")[0] : null) ||
        Cookies.get("shopname") ||
        "Sokojunction";
      setShopName(activeShop);

      const cUser = Cookies.get("username");
      setUser(cUser);
      setUsername(cUser || null);
    };

    syncShopFromCookies();

    router.events.on("routeChangeComplete", syncShopFromCookies);
    return () => {
      router.events.off("routeChangeComplete", syncShopFromCookies);
    };
  }, [router.events, router.query, router.asPath]);

  const isNavActive = (path: string) => {
    if (path === "/" && router.pathname === "/") return true;
    if (path !== "/" && router.asPath.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Storefront", path: `/shop/${shopname}` },
    { label: "Explore Shops", path: "/shops" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1200,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          color: "#18181b",
          transition: "background-color 0.3s ease",
        }}
      >
        <Box sx={{ maxWidth: "1400px", width: "100%", mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              height: { xs: 62, md: 70 },
            }}
          >
            {/* --- LEFT: BRAND LOGO --- */}
            <Box
              onClick={() => router.push("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                userSelect: "none",
                transition: "opacity 0.2s ease",
                "&:hover": {
                  opacity: 0.85,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.6)}`,
                    transition: "all 0.3s ease",
                  }}
                />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: { xs: "1.45rem", sm: "1.7rem", md: "1.9rem" },
                    letterSpacing: "-0.02em",
                    color: "#18181b",
                    lineHeight: 1,
                    transition: "color 0.2s ease",
                  }}
                >
                  {displayedBrand}
                </Typography>
              </Box>
            </Box>

            {/* --- CENTER: DESKTOP NAVIGATION LINKS --- */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {navLinks.map((link) => {
                const active = isNavActive(link.path);
                return (
                  <Button
                    key={link.path}
                    onClick={() => router.push(link.path)}
                    sx={{
                      px: 2,
                      py: 0.8,
                      borderRadius: "20px",
                      fontSize: "0.86rem",
                      fontWeight: active ? 700 : 500,
                      letterSpacing: "0.02em",
                      textTransform: "none",
                      color: active ? theme.palette.primary.main : "#52525b",
                      backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : "transparent",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Box>

            {/* --- RIGHT: DESKTOP USER ACTIONS & CART --- */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {user && (
                <>
                  <Tooltip title="Order History" arrow>
                    <IconButton
                      onClick={() => router.push("/orderhistory")}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        color: "#52525b",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <HistoryOutlined sx={{ fontSize: "1.3rem" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Notifications" arrow>
                    <IconButton
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        color: "#52525b",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Badge
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: theme.palette.primary.main,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                          },
                        }}
                      >
                        <NotificationsNoneOutlined sx={{ fontSize: "1.3rem" }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {/* Shopping Bag Button */}
              <CartMenu ref={cartRef} />

              {/* User Account / Sign In */}
              {user ? (
                <Box>
                  <Button
                    onClick={handleUserMenuOpen}
                    aria-controls={isUserMenuOpen ? "user-account-menu" : undefined}
                    aria-haspopup="true"
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: "1.1rem !important", color: "#71717a" }} />}
                    sx={{
                      borderRadius: "30px",
                      px: 1.5,
                      py: 0.6,
                      border: "1px solid rgba(0,0,0,0.08)",
                      backgroundColor: "#fafafa",
                      textTransform: "none",
                      color: "#18181b",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        backgroundColor: "#f4f4f5",
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        mr: 1,
                        bgcolor: theme.palette.primary.main,
                        color: "#ffffff",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                      }}
                    >
                      {username ? username[0].toUpperCase() : "U"}
                    </Avatar>
                    <Typography sx={{ fontSize: "0.84rem", fontWeight: 600, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {username || "Account"}
                    </Typography>
                  </Button>

                  <Menu
                    id="user-account-menu"
                    anchorEl={anchorEl}
                    open={isUserMenuOpen}
                    onClose={() => handleUserMenuClose(null)}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: "16px",
                        boxShadow: "0 16px 36px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
                        border: "1px solid rgba(0,0,0,0.08)",
                        p: 1,
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ px: 1.5, py: 1, mb: 0.5 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                        Signed in as
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#18181b" }}>
                        {username}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 0.8, borderColor: "rgba(0,0,0,0.06)" }} />

                    <MenuItem
                      onClick={() => handleUserMenuClose("/profile")}
                      sx={{
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        py: 1,
                        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.06), color: theme.palette.primary.main },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                        <AccountCircleOutlined fontSize="small" />
                      </ListItemIcon>
                      My Profile
                    </MenuItem>

                    <MenuItem
                      onClick={() => handleUserMenuClose("/orderhistory")}
                      sx={{
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        py: 1,
                        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.06), color: theme.palette.primary.main },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                        <HistoryOutlined fontSize="small" />
                      </ListItemIcon>
                      Order History
                    </MenuItem>

                    <MenuItem
                      onClick={() => handleUserMenuClose(`/shop/${shopname}`)}
                      sx={{
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        py: 1,
                        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.06), color: theme.palette.primary.main },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                        <ShoppingBagOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      Storefront
                    </MenuItem>

                    <Divider sx={{ my: 0.8, borderColor: "rgba(0,0,0,0.06)" }} />

                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        py: 1,
                        color: "#e11d48",
                        "&:hover": { backgroundColor: "rgba(225, 29, 72, 0.06)" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, color: "#e11d48" }}>
                        <LogoutOutlined fontSize="small" />
                      </ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setIsAuthDialogOpen(true)}
                  startIcon={<PersonOutline sx={{ fontSize: "1.1rem" }} />}
                  sx={{
                    borderRadius: "30px",
                    px: 2.8,
                    py: 0.8,
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    textTransform: "none",
                    borderColor: "rgba(0,0,0,0.18)",
                    color: "#18181b",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>

            {/* --- MOBILE ACTIONS & HAMBURGER --- */}
            <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 0.5 }}>
              {(user || sessionId) && <CartMenu ref={cartRef} />}
              <IconButton
                aria-label="Open Navigation Menu"
                onClick={() => setIsMobileDrawerOpen(true)}
                sx={{
                  color: "#18181b",
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      {/* --- LUXURY MOBILE NAVIGATION DRAWER --- */}
      <Drawer
        anchor="right"
        open={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            maxWidth: "85vw",
            backgroundColor: "#ffffff",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          {/* Drawer Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#18181b",
              }}
            >
              {displayedBrand}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsMobileDrawerOpen(false)}
              sx={{
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#71717a",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* User Profile Summary Card */}
          {user ? (
            <Box
              sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: "14px",
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: "#fff",
                  fontWeight: 700,
                  width: 36,
                  height: 36,
                }}
              >
                {username ? username[0].toUpperCase() : "U"}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#18181b", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {username}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.primary.main, fontWeight: 600 }}>
                  Active Member
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: "14px",
                backgroundColor: "#fafafa",
                border: "1px solid rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#18181b", mb: 0.5 }}>
                Welcome to {displayedBrand}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#71717a", mb: 1.5 }}>
                Sign in to view orders and manage your account.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsAuthDialogOpen(true);
                }}
                sx={{
                  borderRadius: "20px",
                  py: 0.8,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "none",
                  backgroundColor: theme.palette.primary.main,
                  color: "#ffffff",
                }}
              >
                Sign In / Register
              </Button>
            </Box>
          )}

          {/* Navigation Links */}
          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  router.push("/");
                  setIsMobileDrawerOpen(false);
                }}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: router.pathname === "/" ? alpha(theme.palette.primary.main, 0.08) : "transparent",
                  color: router.pathname === "/" ? theme.palette.primary.main : "#18181b",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Home" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  router.push(`/shop/${shopname}`);
                  setIsMobileDrawerOpen(false);
                }}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: router.asPath.startsWith(`/shop/${shopname}`) ? alpha(theme.palette.primary.main, 0.08) : "transparent",
                  color: router.asPath.startsWith(`/shop/${shopname}`) ? theme.palette.primary.main : "#18181b",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <ShoppingBagOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Storefront Collection" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  router.push("/shops");
                  setIsMobileDrawerOpen(false);
                }}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: router.pathname === "/shops" ? alpha(theme.palette.primary.main, 0.08) : "transparent",
                  color: router.pathname === "/shops" ? theme.palette.primary.main : "#18181b",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <StoreOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Explore All Shops" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  router.push("/about");
                  setIsMobileDrawerOpen(false);
                }}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: router.pathname === "/about" ? alpha(theme.palette.primary.main, 0.08) : "transparent",
                  color: router.pathname === "/about" ? theme.palette.primary.main : "#18181b",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="About" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>

            {user && (
              <>
                <Divider sx={{ my: 1.5, borderColor: "rgba(0,0,0,0.06)" }} />

                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      router.push("/orderhistory");
                      setIsMobileDrawerOpen(false);
                    }}
                    sx={{
                      borderRadius: "12px",
                      color: "#18181b",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                      <HistoryOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Order History" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      router.push("/profile");
                      setIsMobileDrawerOpen(false);
                    }}
                    sx={{
                      borderRadius: "12px",
                      color: "#18181b",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                      <AccountCircleOutlined />
                    </ListItemIcon>
                    <ListItemText primary="My Profile" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>

        {/* Drawer Bottom Action */}
        {user && (
          <Box sx={{ pt: 2, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogout}
              startIcon={<LogoutOutlined />}
              sx={{
                borderRadius: "14px",
                py: 1,
                color: "#e11d48",
                borderColor: "rgba(225, 29, 72, 0.2)",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                "&:hover": {
                  backgroundColor: "rgba(225, 29, 72, 0.05)",
                  borderColor: "#e11d48",
                },
              }}
            >
              Sign Out
            </Button>
          </Box>
        )}
      </Drawer>

      <AuthDialog
        forceOpen={isAuthDialogOpen}
        onTrigger={() => {
          refetchUser();
          setIsAuthDialogOpen(false);
        }}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </>
  );
});

LinksContainerComponent.displayName = "LinksContainerComponent";

export default LinksContainerComponent;