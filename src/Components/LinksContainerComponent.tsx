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
  Divider, ListItemIcon,
  Tooltip,
  Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Person2Outlined } from "@mui/icons-material";
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import CartMenu from "./CartMin";
import Image from "next/image";
import Cookies from "js-cookie";
import AuthDialog from "./AuthDialog";



const LinksContainerComponent = forwardRef((props: any, ref: any) => {
  const router = useRouter();
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElsec, setAnchorElsec] = useState(null);
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(Cookies.get("username"))
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend")
  // const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");
  const cartRef = useRef<any>(null);
  const open = Boolean(anchorEl);
  const opensec = Boolean(anchorElsec);

  // const user = Cookies.get("username");

  const refetchUser = () => {
    console.log("called from child")
    setUser(Cookies.get("username"));
  }
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
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (link) => {
    router.push(link);
    setAnchorEl(null);
  };

  const handleClicksec = (event) => {
    setAnchorElsec(event.currentTarget);
  };

  const handleClosesec = (link: any) => {
    if (link !== "") {
      router.push(link);
    }
    setAnchorElsec(null);
  };

  const LogoutFx = () => {
    Cookies.remove("username");
    Cookies.remove("access");
    Cookies.remove("refresh");
    router.push("/login");
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  const accent = "#be1f2f";

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);

  return (
    <AppBar position="static" sx={{ background: `linear-gradient(135deg, ${accent} 0%, #2b0507 100%)`, color: "#fff" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ cursor: "pointer", textTransform:"capitalize" }} onClick={() => router.push(`/_/${shopname}`)}>
          {shopname}
        </Typography>

        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
          {router.pathname === "/" && (
            <Button color="inherit" onClick={() => router.push("/")}>Home</Button>
          )}
          <Button color="inherit" onClick={() => router.push(`/shop/${shopname}`)}>Shop</Button>
          {router.pathname === "/" && (
            <>
              <IconButton color="inherit" href="https://www.youtube.com/@TechendForgranted" target="_blank">
                <Image src="/assets/youtube.svg" alt="YouTube" width={24} height={24} />
              </IconButton>
              <IconButton color="inherit" href="https://www.instagram.com/techendforgranted?igsh=bTFqdGp6dTdhbm1k" target="_blank">
                <Image src="/assets/instagram.svg" alt="Instagram" width={24} height={24} />
              </IconButton>
              <IconButton color="inherit" href="#" target="_blank">
                <Image src="https://cdn.pixabay.com/photo/2021/06/15/12/28/tiktok-6338432_1280.png" alt="TikTok" width={24} height={24} />
              </IconButton>
            </>
          )}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CartMenu ref={cartRef} />
              <Tooltip title="Order History">
                <IconButton sx={{ mr: 1 }}>
                  <Badge badgeContent={1} color="warning">
                    <HistoryOutlinedIcon sx={{ color: "#fff" }} onClick={() => router.push("/orderhistory")} />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifications">
                <IconButton sx={{ mr: 1 }}>
                  <Badge badgeContent={1} color="warning">
                    <NotificationsOutlinedIcon sx={{ color: "#fff" }} />
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
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "& .MuiMenuItem-root": {
                      px: 2,
                      py: 1.5,
                      fontSize: "0.95rem",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => handleClose("/profile")}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>

                <MenuItem onClick={() => handleClose("/settings")}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    // You can replace this with your logout logic
                    Cookies.remove("access");
                    Cookies.remove("refresh");
                    Cookies.remove("username");
                    handleClose("/");
                  }}
                  sx={{
                    color: "#BE1E2D",
                    fontWeight: "600",
                    "&:hover": {
                      backgroundColor: "#ffebeb",
                    },
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: "#BE1E2D" }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
              {/* <Button variant="outlined" color="inherit" onClick={LogoutFx}>Log out</Button> */}
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AuthDialog onTrigger={refetchUser} />
            </Box>
          )}
        </Box>

        <IconButton
          color="inherit"
          edge="end"
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ p: 2, background: "#BE1E2D", color: "#fff", height: "100vh" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton color="inherit" onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {router.pathname === "/" && (
            <Button color="inherit" fullWidth onClick={() => router.push("/")}>Home</Button>
          )}
          <Button color="inherit" fullWidth onClick={() => router.push(`/shop/${Cookies.get("shopname")}`)}>shop</Button>
          <Button color="inherit" fullWidth ><CartMenu ref={cartRef} /> CART</Button>
          <Button color="inherit" fullWidth onClick={() => router.push("/orderhistory")}>
            <Tooltip title="Order History">
              <IconButton sx={{ mr: 1 }}>
                <HistoryOutlinedIcon sx={{ color: "#fff" }}  />
                &nbsp;<Typography color={'#fff'}>ORDER HISTORY</Typography>
              </IconButton>
            </Tooltip>
          </Button>
          <Button color="inherit" fullWidth >
            <Tooltip title="Notifications">
              <IconButton sx={{ mr: 1 }}>
                <NotificationsOutlinedIcon sx={{ color: "#fff" }} />
                &nbsp;<Typography color={'#fff'}>NOTIFICATIONS</Typography>

              </IconButton>
            </Tooltip>
          </Button>
          <Button color="inherit" fullWidth >
            <IconButton
              color="inherit"
              onClick={handleClick}
              aria-controls={open ? "user-menu" : undefined}
              aria-haspopup="true"
            >
              <Person2Outlined />
              &nbsp;<Typography color={'#fff'}>PROFILE</Typography>
            </IconButton>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1.5,
                  fontSize: "0.95rem",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                },
              },
            }}
          >
            <MenuItem onClick={() => handleClose("/profile")}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem onClick={() => handleClose("/settings")}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                // You can replace this with your logout logic
                Cookies.remove("access");
                Cookies.remove("refresh");
                Cookies.remove("username");
                handleClose("/");
              }}
              sx={{
                color: "#BE1E2D",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "#ffebeb",
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: "#BE1E2D" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          {router.pathname === "/" && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              <IconButton color="inherit" href="https://www.youtube.com/@TechendForgranted" target="_blank">
                <Image src="/assets/youtube.svg" alt="YouTube" width={24} height={24} />
              </IconButton>
              <IconButton color="inherit" href="https://www.instagram.com/techendforgranted?igsh=bTFqdGp6dTdhbm1k" target="_blank">
                <Image src="/assets/instagram.svg" alt="Instagram" width={24} height={24} />
              </IconButton>
              <IconButton color="inherit" href="#" target="_blank">
                <Image src="https://cdn.pixabay.com/photo/2021/06/15/12/28/tiktok-6338432_1280.png" alt="TikTok" width={24} height={24} />
              </IconButton>
            </Box>
          )}
          {/* {username ? (
            <Button variant="outlined" color="inherit" fullWidth sx={{ mt: 2 }} onClick={LogoutFx}>
              Log out
            </Button>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AuthDialog onTrigger={refetchUser} />
            </Box>
          )} */}
        </Box>
      </Drawer>
    </AppBar>
  );
})

export default LinksContainerComponent;
