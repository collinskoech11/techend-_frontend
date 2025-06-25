import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Person2Outlined } from "@mui/icons-material";
import { ShoppingBasket } from "@mui/icons-material";
import Image from "next/image";
import Cookies from "js-cookie";

function LinksContainerComponent() {
  const router = useRouter();
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElsec, setAnchorElsec] = useState(null);
  const [username, setUsername] = useState(null);

  const open = Boolean(anchorEl);
  const opensec = Boolean(anchorElsec);

  const user = Cookies.get("username");

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

  const handleClosesec = (link) => {
    router.push(link);
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

  useEffect(() => {
    if (user) setUsername(user);
  }, [user]);

  return (
    <AppBar position="static" sx={{ background: "#BE1E2D", color: "#fff" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          Techend
        </Typography>

        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
          <Button color="inherit" onClick={() => router.push("/")}>Home</Button>
          <Button color="inherit" onClick={() => router.push("/shop")}>Merchandise</Button>
          <IconButton color="inherit" href="https://www.youtube.com/@TechendForgranted" target="_blank">
            <Image src="/assets/youtube.svg" alt="YouTube" width={24} height={24} />
          </IconButton>
          <IconButton color="inherit" href="https://www.instagram.com/techendforgranted?igsh=bTFqdGp6dTdhbm1k" target="_blank">
            <Image src="/assets/instagram.svg" alt="Instagram" width={24} height={24} />
          </IconButton>
          <IconButton color="inherit" href="#" target="_blank">
            <Image src="https://cdn.pixabay.com/photo/2021/06/15/12/28/tiktok-6338432_1280.png" alt="TikTok" width={24} height={24} />
          </IconButton>
          {username ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                color="inherit"
                onClick={handleCartClick}
                aria-controls={opensec ? "user-menu-sec" : undefined}
                aria-haspopup="true"
              >
                <ShoppingBasket />
              </IconButton>
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
              >
                <MenuItem onClick={() => handleClose("/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => handleClose("/settings")}>Settings</MenuItem>
              </Menu>
              <Button variant="outlined" color="inherit" onClick={LogoutFx}>Log out</Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button  sx={{  background:"#BE1E2D", border:"1px solid #fff", color:"#fff" }} onClick={() => router.push("/login")}>Join</Button>
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
          <Button color="inherit" fullWidth onClick={() => router.push("/")}>Home</Button>
          <Button color="inherit" fullWidth onClick={() => router.push("/shop")}>Merchandise</Button>
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
          {username ? (
            <Button variant="outlined" color="inherit" fullWidth sx={{ mt: 2 }} onClick={LogoutFx}>
              Log out
            </Button>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button fullWidth sx={{ mt: 2, background:"#BE1E2D" }} onClick={() => router.push("/login")}>Join</Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default LinksContainerComponent;
