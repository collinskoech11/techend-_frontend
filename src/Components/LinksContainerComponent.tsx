import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import {
  LinksContainer,
  LinksSubContainer,
  NavLink,
  NavButton,
} from "@/StyledComponents/NavComponents";
import { useTheme } from "@mui/material/styles";
import { LoginButton } from "@/StyledComponents/Buttons";
import { Box, Typography, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import Image from "next/image";

function LinksContainerComponent({textColor, bgColor}) {
  console.log(textColor, bgColor, "+_+_+_+_+)_")
  const router = useRouter();
  const navigate = (link: string) => {
    router.push(link);
  };

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (link: string) => {
    router.push(link);
    setAnchorEl(null);
  };

  const [anchorElsec, setAnchorElsec] = React.useState(null);
  const opensec = Boolean(anchorElsec);
  const handleClicksec = (event) => {
    setAnchorElsec(event.currentTarget);
  };
  const handleClosesec = (link: string) => {
    router.push(link);
    setAnchorElsec(null);
  };

  const theme = useTheme();

  const [username, setUsername] = useState<any>(null);

  const user = Cookies.get("username");

  const LogoutFx = () => {
    Cookies.remove("username");
    Cookies.remove("access");
    Cookies.remove("refresh");
    router.push("/login");
  };
  const StandardImage = styled('img')({
    padding: 0,
    height:"25px"
  });
  const LinkText = styled(Box)({
    height: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight:"bolder",
    color:textColor
  });
  useEffect(() => {
    // Get the user from cookies
    if (user) {
      setUsername(user);
    }
  }, [username]);

  return (
    <>
      <LinksContainer >
        <IconButton
          sx={{
            display: {
              xs: "block",
              sm: "none",
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "end",
              textAlign: "right",
            },
          }}
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <LinksSubContainer sx={{ display: { xs: "none", sm: "flex" } }}>
          <NavLink href="/">
            <LinkText>home</LinkText>
          </NavLink>
          <NavLink href="/shop">
            <LinkText>Merchendise</LinkText>
          </NavLink>
          <NavLink href="https://www.youtube.com/@TechendForgranted">
            <StandardImage
              src="/assets/youtube.svg"
              alt="youtube logo"
            />
          </NavLink>
          <NavLink href="https://www.instagram.com/techendforgranted?igsh=bTFqdGp6dTdhbm1k">
            <StandardImage
              src="/assets/instagram.svg"
              alt="youtube logo"
            />
          </NavLink>
          <NavLink href="#">
          <StandardImage
              src="https://cdn.pixabay.com/photo/2021/06/15/12/28/tiktok-6338432_1280.png"
              alt="youtube logo"
            />
          </NavLink>
          {/* <NavButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            collection
          </NavButton>
          <NavButton
            id="basic-button-two"
            aria-controls={opensec ? "basic-menu-two" : undefined}
            aria-haspopup="true"
            aria-expanded={opensec ? "true" : undefined}
            onClick={handleClicksec}
          >
            men's essentials
          </NavButton>
          <NavLink href="#">our laundry</NavLink> */}
        </LinksSubContainer>
      </LinksContainer>

      <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer(false)}>
        <LinksSubContainer
          sx={{
            display: { xs: "block", sm: "flex" }, // Conditionally set display property
            [theme.breakpoints.down("xs")]: {
              // Apply styles for xs breakpoint
              display: "block",
            },
          }}
        >
          <Box>
            {/* close button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100vw",
              }}
            >
              <IconButton aria-label="close" onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <br />
          <br />

          <NavLink href="/">home</NavLink>
          <br />
          <br />
          <NavLink href="/shop">shop</NavLink>
          <br />
          <br />
          <NavButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            collection
          </NavButton>
          <br />
          <NavButton
            id="basic-button-two"
            aria-controls={opensec ? "basic-menu-two" : undefined}
            aria-haspopup="true"
            aria-expanded={opensec ? "true" : undefined}
            onClick={handleClicksec}
          >
            men's essentials
          </NavButton>
          <br />
          <NavLink href="#">our laundry</NavLink>
          <br />
          <br />
          <Box sx={{ width: "80%", margin: "auto" }}>
            {username ? (
              <>
                <Box
                  sx={{
                    width: "100%",
                    margin: "auto",
                    background: "#BE1E2D",
                    textAlign: "center",
                    p: 1,
                    borderRadius: "5px",
                  }}
                >
                  <Typography sx={{ color: "#fff", fontWeight: "700" }}>
                    Welcome : {username}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    margin: "auto",
                    border: " 1px solid #BE1E2D",
                    textAlign: "center",
                    p: 1,
                    mt: 2,
                    borderRadius: "5px",
                  }}
                  onClick={() => LogoutFx()}
                >
                  <Typography sx={{ color: "#BE1E2D", fontWeight: "700" }}>
                    Log out
                  </Typography>
                </Box>
              </>
            ) : (
              <LoginButton onClick={() => navigate("/login")}>
                Login/Register
              </LoginButton>
            )}
          </Box>
          <br />
          <br />
        </LinksSubContainer>
      </Drawer>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleClose("/shop?category=suits")}>
          Suits
        </MenuItem>
        <MenuItem onClick={() => handleClose("/shop?category=casualWear")}>
          Casual Wear
        </MenuItem>
        <MenuItem onClick={() => handleClose("/shop?category=footWear")}>
          Foot Wear
        </MenuItem>
      </Menu>
      <Menu
        id="basic-menu-two"
        anchorEl={anchorElsec}
        open={opensec}
        onClose={handleClosesec}
        MenuListProps={{
          "aria-labelledby": "basic-button-two",
        }}
      >
        <MenuItem onClick={() => handleClosesec("/shop?category=socks")}>
          Socks
        </MenuItem>
        <MenuItem onClick={() => handleClosesec("/shop?category=Underwear")}>
          Underwear
        </MenuItem>
        <MenuItem onClick={() => handleClosesec("/shop?category=Undershirts")}>
          Undershirts
        </MenuItem>
        <MenuItem onClick={() => handleClosesec("/shop?category=Belts")}>
          Belts
        </MenuItem>
        <MenuItem onClick={() => handleClosesec("/shop?category=Watches")}>
          Watches
        </MenuItem>
        <MenuItem onClick={() => handleClosesec("/shop?category=Hats")}>
          Hats
        </MenuItem>
        <MenuItem onClick={() => handleClosesec("/shop?category=SunGlasses")}>
          SunGlasses
        </MenuItem>
      </Menu>
    </>
  );
}

export default LinksContainerComponent;
