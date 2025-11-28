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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close"; // Keeping CloseIcon for mobile menu
import { PersonOutline, HistoryOutlined, NotificationsNoneOutlined, LogoutOutlined, AccountCircleOutlined, SettingsOutlined } from "@mui/icons-material"; // Modernized icons
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

// A modern, functional Navbar component
const LinksContainerComponent = forwardRef((props, ref) => {
  LinksContainerComponent.displayName = "LinksContainerComponent";
  const router = useRouter();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null); // Desktop user menu
  const open = Boolean(anchorEl);

  const [mobileAnchorEl, setMobileAnchorEl] = useState(null); // Mobile menu
  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  const [username, setUsername] = useState<any>(null);
  const [user, setUser] = useState(Cookies.get("username"));
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const { data: companyData, isLoading: companyLoading } = useGetCompanyBySlugQuery(shopname); // Added isLoading
  const { sessionId } = useCart();
  const cartRef = useRef<any>(null);

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
          <MenuItem onClick={() => handleMobileMenuItemClick("/settings")}>
            <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
            Settings
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
          <AuthDialog onTrigger={refetchUser} />
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {router.pathname.startsWith('/shop/') && companyData?.logo ? (
            <Box
              sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}
              onClick={() => router.push(`/`)}
            >
              <Image
                src={`https://res.cloudinary.com/dqokryv6u/${companyData?.logo_image}` || 'https://res.cloudinary.com/dqokryv6u/image/upload/v1753441959/z77vea2cqud8gra2hvz9.jpg'}
                alt={shopname}
                width={32} // Slightly smaller for a cleaner look
                height={32}
                style={{ borderRadius: '4px' }} // Subtle rounded corners for the logo
              />
              {!companyLoading && ( // Only show text if data is loaded
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                    display: { xs: 'none', md: 'block' }, // Hide on small screens
                  }}
                >
                  {shopname} {/* Display company name if available */}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: "pointer", textTransform: "capitalize", fontWeight: 'bold' }}
              onClick={() => router.push(`/`)}
            >
              {shopname || "Sokojunction"}
            </Typography>
          )}
        </Box>

        {/* Desktop Navigation & User Actions */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
          <Tooltip title="Mall">
            <IconButton onClick={() => router.push(`/shops`)} color="inherit">
              <StoreOutlinedIcon />
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <Tooltip title="Home">
                <IconButton onClick={() => router.push(`/`)} color="inherit">
                  <HomeOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Shop">
                <IconButton onClick={() => router.push(`/shop/${shopname}`)} color="inherit">
                  <ShoppingBagOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Order History">
                <IconButton onClick={() => router.push("/orderhistory")} color="inherit">
                  <Badge badgeContent={1} color="error" overlap="circular" variant="dot">
                    <HistoryOutlined />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton color="inherit">
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
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  aria-controls={open ? "user-menu" : undefined}
                  aria-haspopup="true"
                  sx={{ p: 0 }} // Remove default padding for Avatar
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
                <MenuItem onClick={() => handleUserMenuClose("/settings")}>
                  <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
                  Settings
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
            <Suspense fallback={<CircularProgress size={24} color="inherit" />}>
              <AuthDialog onTrigger={refetchUser} />
            </Suspense>
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
    </AppBar>
  );
});

export default LinksContainerComponent;