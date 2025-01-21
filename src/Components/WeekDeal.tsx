import { LoginButton } from "@/StyledComponents/Buttons";
import { ProductTitle, RevealMainTypo } from "@/StyledComponents/Typos";
import { Box, Grid, Typography, styled } from "@mui/material";
import React from "react";

function WeekDeal() {
    const MiniTypo = styled(Typography)({
        color: "rgb(125,125,125)",
        fontWeight: "500",
        fontSize: "18px",
        marginTop:"20px"
      });
  return (
    <>
      <Box
        sx={{
          maxWidth: "1600px",
          width: "95%",
          margin: "auto",
          minHeight: "60vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url('https://res.cloudinary.com/dqokryv6u/image/upload/v1721152227/dap2dqll2u5i64qee7z3.jpg')",
        }}
      >
        <Grid container sx={{ width: "100%", minHeight: "50vh" }}>
          <Grid
            item
            md={6}
            xs={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 5,
            }}
          ></Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: {md:5, xs:0},
              height: "100%",
            }}
          >
            <Box sx={{width:{md:"90%", xs:"100%"}, margin:"auto", background:"#fff", padding:"30px"}}>
              <ProductTitle>Limited Offers 20% OFF</ProductTitle>
              <br/>
              <RevealMainTypo>
              WEEK DEAL
              </RevealMainTypo>
              <MiniTypo>
              Welcome to TechEnd, where elegance meets excellence. Discover our exquisite collection of finely tailored suits designed to make you look and feel your best.
              </MiniTypo>
              <br/>
              <LoginButton sx={{fontSize:"22px", borderRadius:"0px"}}>
                Shop Now
              </LoginButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default WeekDeal;
