import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, lazy, Suspense } from "react";
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
  CircularProgress,
  Avatar, // Keeping Avatar for potential future use or custom user display
  styled,
} from "@mui/material";
import { keyframes } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { PersonOutline, HistoryOutlined, NotificationsNoneOutlined, LogoutOutlined, AccountCircleOutlined } from "@mui/icons-material"; // Modernized icons
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined"; // Modernized Shop icon
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"; // Modernized Home icon
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'; // Modernized Mall icon
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'; // Modernized Cart icon
import Image from "next/image";
import Cookies from "js-cookie";
const AuthDialog = lazy(() => import("./AuthDialog"));
import { useGetCompanyBySlugQuery } from "@/Api/services";
import { useCart } from "@/contexts/CartContext";
import { alpha } from '@mui/material/styles'; // For better alpha color manipulation
import CartMenu from "./CartMin";
const DEFAULT_BRAND_URLS = [
  "/shops",
  "/payment",
  "/",
  "/about",
  "/contact",
  "/company-onboarding",
  "/profile",
];
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); } 
  40% { transform: scale(1); }
`;

const BouncingEllipsis = styled('span')(({ theme }) => ({
  display: 'inline-block',
  width: '24px',
  textAlign: 'left',
  '& > span': {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    margin: '0 2px',
    backgroundColor: theme.palette.common.white,
    borderRadius: '50%',
    animation: `${bounce} 1.4s infinite ease-in-out both`,
  },
  '& > span:nth-of-type(1)': { animationDelay: '0s' },
  '& > span:nth-of-type(2)': { animationDelay: '0.2s' },
  '& > span:nth-of-type(3)': { animationDelay: '0.4s' },
}));
// A modern, functional Navbar component
const LinksContainerComponent = forwardRef((props, ref) => {

  const router = useRouter();
  const theme = useTheme();
  const cookieShop = Cookies.get("shopname");
  LinksContainerComponent.displayName = "LinksContainerComponent";
  const isDefaultBrandPage = DEFAULT_BRAND_URLS.includes(router.pathname);
  const displayShopName = isDefaultBrandPage
    ? "SokoJunction"
    : cookieShop || "SokoJunction";
  const [anchorEl, setAnchorEl] = useState(null); // Desktop user menu
  const open = Boolean(anchorEl);

  const [mobileAnchorEl, setMobileAnchorEl] = useState(null); // Mobile menu
  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  const [username, setUsername] = useState<any>(null);
  const [user, setUser] = useState(Cookies.get("username"));
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "Sokojunction");

  const { data: companyData, isLoading: companyLoading } =
    useGetCompanyBySlugQuery(displayShopName, {
      skip: isDefaultBrandPage || !cookieShop,
    });
  const brandLabel =
    !isDefaultBrandPage && companyData?.name
      ? companyData.name
      : displayShopName || "SokoJunction";
  const [displayedBrand, setDisplayedBrand] = useState(
    !isDefaultBrandPage && companyData?.name
      ? companyData.name
      : displayShopName || "SokoJunction"
  );

  const [isUpdatingBrand, setIsUpdatingBrand] = useState(companyLoading);
  useEffect(() => {
    setIsUpdatingBrand(companyLoading); // true while loading, false when done

    if (!companyLoading) {
      const newBrand =
        !isDefaultBrandPage && companyData?.name
          ? companyData.name
          : displayShopName || "SokoJunction";

      if (newBrand !== displayedBrand) {
        setDisplayedBrand(newBrand);
      }
    }
  }, [companyLoading, companyData, isDefaultBrandPage, displayShopName, displayedBrand]);
  const { sessionId } = useCart();
  const cartRef = useRef<any>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const refetchUser = () => {
    setUser(Cookies.get("username"));
  };

  const triggerCartRefetch = () => {
    if (cartRef.current) {
      cartRef.current.cart_refetch();
    }
  };

  useImperativeHandle(ref, () => ({
    triggerCartRefetch() {
      triggerCartRefetch();
    },
  }));

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = (link) => {
    if (typeof link === 'string' && link) {
      router.push(link);
    }
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleMobileMenuItemClick = (path) => {
    router.push(path);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("shopname");
    Cookies.remove("user");
    handleMobileMenuClose();
    router.push("/login");
  };

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);

  // keep shop in sync with cookies on every navigation
  useEffect(() => {
    const syncShopFromCookies = () => {
      const cookieShop = Cookies.get("shopname") || "Sokojunction";
      setShopName(cookieShop);

      const cookieUser = Cookies.get("username");
      setUser(cookieUser);
      setUsername(cookieUser);
    };

    // run once on mount
    syncShopFromCookies();

    // run after every route change
    router.events.on("routeChangeComplete", syncShopFromCookies);

    return () => {
      router.events.off("routeChangeComplete", syncShopFromCookies);
    };
  }, [router.events]);

  // Unified menu item styling for better consistency
  const menuSx = {
    "& .MuiMenuItem-root": {
      borderRadius: theme.shape.borderRadius, // Rounded corners for menu items
      mb: 0.5,
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08), // Subtle hover effect
      },
    },
    "& .MuiListItemIcon-root": {
      minWidth: 32, // Adjust icon spacing
      color: 'inherit', // Icons inherit text color
    }
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      id="mobile-menu"
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 8, // More prominent shadow for modern feel
        sx: {
          mt: 1.5,
          minWidth: 220,
          borderRadius: theme.shape.borderRadius * 2, // More rounded
          backgroundColor: alpha(theme.palette.background.paper, 0.9), // Slightly translucent background
          backdropFilter: "blur(10px) saturate(150%)",
          WebkitBackdropFilter: "blur(10px) saturate(150%)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          py: 1, // Padding inside the menu
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      sx={menuSx}
    >
      {user ? (
        <Box sx={{ p: 1 }}>
          <MenuItem onClick={() => handleMobileMenuItemClick("/")}>
            <ListItemIcon><HomeOutlinedIcon fontSize="small" /></ListItemIcon>
            Home
          </MenuItem>
          <MenuItem onClick={() => handleMobileMenuItemClick(`/shop/${shopname}`)}>
            <ListItemIcon><ShoppingBagOutlinedIcon fontSize="small" /></ListItemIcon>
            Shop
          </MenuItem>
          <MenuItem onClick={() => handleMobileMenuItemClick(`/shops`)}>
            <ListItemIcon><StoreOutlinedIcon fontSize="small" /></ListItemIcon>
            Mall
          </MenuItem>
          <MenuItem onClick={() => handleMobileMenuItemClick("/cart")}>
            <ListItemIcon><ShoppingCartOutlinedIcon fontSize="small" /></ListItemIcon>
            Cart
          </MenuItem>
          <MenuItem onClick={() => handleMobileMenuItemClick("/orderhistory")}>
            <ListItemIcon><HistoryOutlined fontSize="small" /></ListItemIcon>
            Order History
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Badge badgeContent={1} color="error" overlap="circular" variant="dot">
                <NotificationsNoneOutlined fontSize="small" />
              </Badge>
            </ListItemIcon>
            Notifications
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={() => handleMobileMenuItemClick("/profile")}>
            <ListItemIcon><AccountCircleOutlined fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ color: theme.palette.error.main, fontWeight: 'medium' }}
          >
            <ListItemIcon><LogoutOutlined fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
            Logout
          </MenuItem>
        </Box>
      ) : (
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sessionId && (
            <MenuItem onClick={() => handleMobileMenuItemClick("/cart")}>
              <ListItemIcon><ShoppingCartOutlinedIcon fontSize="small" /></ListItemIcon>
              Cart
            </MenuItem>
          )}
          <MenuItem onClick={() => { setIsAuthDialogOpen(true); handleMobileMenuClose(); }}>
            <ListItemIcon><PersonOutline fontSize="small" /></ListItemIcon>
            Login
          </MenuItem>
        </Box>
      )}
    </Menu>
  );

  return (
    <AppBar
      position="fixed" // Ensure it's fixed
      sx={{
        zIndex: theme.zIndex.appBar, // Use theme's zIndex for consistency
        backgroundColor: alpha(theme.palette.background.paper, 0.8), // Smoother translucent bg
        backdropFilter: "blur(18px) saturate(180%)", // Enhanced frosted glass
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        boxShadow: theme.shadows[3], // Use theme shadows for modern depth
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`, // Subtle bottom border
        color: theme.palette.text.primary, // Inherit text color from theme
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          height: 64, // Standard app bar height
          px: { xs: 2, md: 3 }, // Responsive padding
        }}
      >
        {/* Logo/Title Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => router.push(`/`)}
        >
          {isUpdatingBrand ? (
            <BouncingEllipsis>
              <span></span>
              <span></span>
              <span></span>
            </BouncingEllipsis>
          ) : (
            <Typography
              variant="h6"
              component="div"
              sx={{
                textTransform: "capitalize",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                transition: "opacity 0.25s ease",
              }}
            >
              {displayedBrand}
            </Typography>
          )}
        </Box>

        {/* Desktop Navigation & User Actions */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
          <Tooltip title="Mall">
            <IconButton onClick={() => router.push(`/shops`)} sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
            >
              <StoreOutlinedIcon />
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <Tooltip title="Home">
                <IconButton onClick={() => router.push(`/`)} sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
                >
                  <HomeOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Shop">
                <IconButton onClick={() => router.push(`/shop/${shopname}`)} sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
                >
                  <ShoppingBagOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Order History">
                <IconButton onClick={() => router.push("/orderhistory")} sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
                >
                  <Badge badgeContent={1} color="error" overlap="circular" variant="dot">
                    <HistoryOutlined />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
                >
                  <Badge badgeContent={1} color="error" overlap="circular" variant="dot">
                    <NotificationsNoneOutlined />
                  </Badge>
                </IconButton>
              </Tooltip>
            </>
          )}

          {(user || sessionId) && <CartMenu ref={cartRef} />}

          {user ? (
            <Box>
              <Tooltip title={username || "User Account"}>
                <IconButton
                  onClick={handleUserMenuOpen}
                  aria-controls={open ? "user-menu" : undefined}
                  aria-haspopup="true"
                  sx={{
                    p: 0, color: theme.palette.primary.main, "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }} // Remove default padding for Avatar
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, fontSize: '0.9rem' }}>
                    {username ? username[0].toUpperCase() : <PersonOutline fontSize="small" />}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleUserMenuClose(null)}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: theme.shape.borderRadius * 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(10px) saturate(150%)",
                    WebkitBackdropFilter: "blur(10px) saturate(150%)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    py: 1,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={menuSx}
              >
                <MenuItem onClick={() => handleUserMenuClose("/profile")}>
                  <ListItemIcon><AccountCircleOutlined fontSize="small" /></ListItemIcon>
                  Profile
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: theme.palette.error.main, fontWeight: "medium" }}
                >
                  <ListItemIcon><LogoutOutlined fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => setIsAuthDialogOpen(true)}>
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Navigation & User Actions */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
          {(user || sessionId) && <CartMenu ref={cartRef} />}
          <IconButton
            size="large"
            aria-label="show navigation menu"
            aria-controls="mobile-menu"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      {renderMobileMenu}
      <Suspense fallback={<div />}>
        <AuthDialog
          forceOpen={isAuthDialogOpen}
          onTrigger={() => {
            refetchUser();
            setIsAuthDialogOpen(false);
          }}
          onClose={() => setIsAuthDialogOpen(false)}
          showButton={false}
        />
      </Suspense>
    </AppBar>
  );
});

export default LinksContainerComponent;