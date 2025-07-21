import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Drawer,
  Box,
  Typography,
  useTheme,
  Divider,
  ListItemIcon,
  Tooltip,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Person2Outlined } from "@mui/icons-material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import CartMenu from "./CartMin";
import Image from "next/image";
import Cookies from "js-cookie";
import AuthDialog from "./AuthDialog";
import Shop2Icon from "@mui/icons-material/Shop2";
import HomeIcon from "@mui/icons-material/Home";
import MuseumIcon from '@mui/icons-material/Museum';
// Added for the mobile menu cart item
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const LinksContainerComponent = forwardRef((props: any, ref: any) => {
  const router = useRouter();
  const theme = useTheme();

  // State for desktop user menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // --- START: Added for Mobile Menu ---
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileAnchorEl);
  // --- END: Added for Mobile Menu ---

  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(Cookies.get("username"));
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const cartRef = useRef<any>(null);

  const refetchUser = () => {
    console.log("called from child");
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (link) => {
    if (typeof link === 'string' && link) {
      router.push(link);
    }
    setAnchorEl(null);
  };

  // --- START: Handlers for Mobile Menu ---
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
  // --- END: Handlers for Mobile Menu ---

  const LogoutFx = () => {
    Cookies.remove("username");
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("shopname");
    Cookies.remove("user");
    handleMobileMenuClose(); // Close mobile menu if open
    router.push("/login");
  };

  const accent = "#be1f2f";

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);


  // --- START: Mobile Menu Definition ---
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      id="mobile-menu"
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 4,
        sx: {
          mt: 1,
          minWidth: 200,
          borderRadius: 2,
        },
      }}
    >
      {user ? (
        <div>
          <MenuItem onClick={() => handleMobileMenuItemClick("/")}>
            <ListItemIcon><HomeIcon fontSize="small" /></ListItemIcon>
            Home
          </MenuItem>
          <MenuItem onClick={() => handleMobileMenuItemClick(`/shop/${shopname}`)}>
            <ListItemIcon><Shop2Icon fontSize="small" /></ListItemIcon>
            Shop
          </MenuItem>
           <MenuItem onClick={() => handleMobileMenuItemClick(`/shop/${shopname}`)}>
            <ListItemIcon><MuseumIcon fontSize="small" /></ListItemIcon>
            Mall
          </MenuItem>
          <MenuItem onClick={() => handleMobileMenuItemClick("/cart")}>
            <ListItemIcon><ShoppingCartOutlinedIcon fontSize="small" /></ListItemIcon>
            Cart
          </MenuItem>
          <MenuItem onClick={() => handleMobileMenuItemClick("/orderhistory")}>
            <ListItemIcon><HistoryOutlinedIcon fontSize="small" /></ListItemIcon>
            Order History
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Badge badgeContent={1} color="warning">
                <NotificationsOutlinedIcon fontSize="small" />
              </Badge>
            </ListItemIcon>
            Notifications
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMobileMenuItemClick("/profile")}>
            <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleMobileMenuItemClick("/settings")}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem
            onClick={LogoutFx}
            sx={{ color: "#BE1E2D", fontWeight: '600' }}
          >
            <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "#BE1E2D" }} /></ListItemIcon>
            Logout
          </MenuItem>
        </div>
      ) : (
        // When not logged in, show AuthDialog or a login link
        // Here we render the AuthDialog directly as a menu item
        <Box sx={{ p: 1 }}>
          <AuthDialog onTrigger={refetchUser} />
        </Box>
      )}
    </Menu>
  );
  // --- END: Mobile Menu Definition ---


  return (
    <AppBar position="static" sx={{ background: `linear-gradient(135deg, ${accent} 0%, #2b0507 100%)`, color: "#fff" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ cursor: "pointer", textTransform: "capitalize" }} onClick={() => router.push(`/_/${shopname}`)}>
          {shopname}
        </Typography>

        {/* --- START: Desktop Icons (Hidden on mobile) --- */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
          {router.pathname === "/" && (
            <>
              {/* <IconButton color="inherit" href="https://www.youtube.com/@TechendForgranted" target="_blank">
                <Image src="/assets/youtube.svg" alt="YouTube" width={24} height={24} />
              </IconButton>
              <IconButton color="inherit" href="https://www.instagram.com/techendforgranted?igsh=bTFqdGp6dTdhbm1k" target="_blank">
                <Image src="/assets/instagram.svg" alt="Instagram" width={24} height={24} />
              </IconButton>
              <IconButton color="inherit" href="#" target="_blank">
                <Image src="https://cdn.pixabay.com/photo/2021/06/15/12/28/tiktok-6338432_1280.png" alt="TikTok" width={24} height={24} />
              </IconButton> */}
            </>
          )}
          <Tooltip title="Mall">
            <IconButton onClick={() => router.push(`/shops`)} sx={{ color: "#fff" }}>
              <MuseumIcon />
            </IconButton>
          </Tooltip>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Home">
                <IconButton onClick={() => router.push(`/`)} sx={{ color: "#fff" }}>
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Shop">
                <IconButton onClick={() => router.push(`/shop/${shopname}`)} sx={{ color: "#fff" }}>
                  <Shop2Icon />
                </IconButton>
              </Tooltip>
              <CartMenu ref={cartRef} />
              <Tooltip title="Order History">
                <IconButton onClick={() => router.push("/orderhistory")} sx={{ color: "#fff" }}>
                  <Badge badgeContent={1} color="warning">
                    <HistoryOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton sx={{ color: "#fff" }}>
                  <Badge badgeContent={1} color="warning">
                    <NotificationsOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <IconButton
                color="inherit"
                onClick={handleClick}
                aria-controls={open ? "user-menu" : undefined}
                aria-haspopup="true"
              >
                <Person2Outlined />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  elevation: 4,
                  sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
                }}
              >
                <MenuItem onClick={() => handleClose("/profile")}>
                  <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleClose("/settings")}>
                  <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={LogoutFx}
                  sx={{ color: "#BE1E2D", fontWeight: "600" }}
                >
                  <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "#BE1E2D" }} /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <AuthDialog onTrigger={refetchUser} />
          )}
        </Box>
        {/* --- END: Desktop Icons --- */}


        {/* --- START: Mobile Menu Icon (Visible on mobile only) --- */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
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
        {/* --- END: Mobile Menu Icon --- */}

      </Toolbar>
      {/* This renders the mobile menu component we defined earlier */}
      {renderMobileMenu}
    </AppBar>
  );
});

export default LinksContainerComponent;