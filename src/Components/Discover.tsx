import { LoginButton } from "@/StyledComponents/Buttons";
import { ProductTitle, RevealMainTypo } from "@/StyledComponents/Typos";
import { Box, Grid, Typography, styled } from "@mui/material";
import React from "react";

function Discover() {
  const MiniTypo = styled(Typography)({
    color: "rgb(125,125,125)",
    fontWeight: "500",
    fontSize: "18px",
    marginTop: "20px",
  });
  return (
    <>
      <Box
        sx={{
          maxWidth: "1600px",
          width: "95%",
          margin: "auto",
          minHeight: "300px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid container sx={{ width: "100%", height: "100%" }}>
          <Grid
            item
            md={7}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: "95%",
                minHeight: "300px",
                p: 4,
                margin: "auto",
                backgroundBlendMode: "multiply",
              }}
            >
              <ProductTitle>Limited Offers 20% OFF</ProductTitle>
              <br />
              <RevealMainTypo>WEEK DEAL</RevealMainTypo>
              <MiniTypo sx={{ backgroundBlendMode: "multiply" }}>
                Explore our handpicked selection of featured suits, showcasing
                the latest trends and timeless classics. Each suit is crafted
                with precision and care, ensuring unparalleled quality and
                comfort.
              </MiniTypo>
              <br />
              <LoginButton
                sx={{
                  fontSize: "22px",
                  borderRadius: "0px",
                  background: "#fff",
                  color: "#000",
                }}
              >
                Shop Now
              </LoginButton>
            </Box>
          </Grid>
          <Grid
            item
            md={5}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: "95%",
                minHeight: "300px",
                p: 4,
                margin: "auto",
                background:
                  "url('https://source.unsplash.com/1600x1200/?white)",
              }}
            >
              <ProductTitle>Limited Offers 20% OFF</ProductTitle>
              <br />
              <RevealMainTypo>WEEK DEAL</RevealMainTypo>
              <MiniTypo>
                Our customers speak for us! &apos;The best suit shopping experience
                I&apos;ve ever had,&apos; says John D. &apos;Exceptional quality and impeccable
                service,&apos; adds Sarah M. Join our community of satisfied clients
                and experience the TechEnd difference.
              </MiniTypo>
              <br />
              <LoginButton
                sx={{
                  fontSize: "22px",
                  borderRadius: "0px",
                  background: "#fff",
                  color: "#000",
                }}
              >
                Shop Now
              </LoginButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Discover;
