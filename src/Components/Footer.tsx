import { ProductPrice, ReviewText } from "@/StyledComponents/Typos";
import { Box, Button, Grid, IconButton, TextField } from "@mui/material";
import React from "react";

function Footer() {
  return (
    <>
      <Box sx={{ width: "100vw", background: "#F7F7F7", pt: 6, pb:6 }}>
        <Grid
          container
          sx={{
            color: "#fff",
            padding: "20px",
            maxWidth: "1400px",
            margin: "auto",
          }}
        >
          <Grid item md={3} xs={12}>
            <Box>
              <ProductPrice>Call Us</ProductPrice>
              <ProductPrice>+254 728 000 107</ProductPrice>
              <ReviewText>Find a location near you</ReviewText>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>
            <ProductPrice>Company</ProductPrice>
            <ReviewText>New Products</ReviewText>
            <ReviewText>Best Sellers</ReviewText>
          </Grid>
          <Grid item md={2} xs={12}>
            <ProductPrice>Information</ProductPrice>
            <ReviewText>Start a Return</ReviewText>
            <ReviewText>Contact Us</ReviewText>
            <ReviewText>Shipping FAQ&apos;s</ReviewText>
            <ReviewText>Terms &amp; Conditions</ReviewText>
          </Grid>
          <Grid item md={5} xs={12}>
            <ProductPrice sx={{ fontSize: "34px", mt: "-13px" }}>
              Good emails.
            </ProductPrice>
            <ReviewText>
              Enter your email below to be the first to know about new
              collections and product launches.
            </ReviewText>
            <br/>
            <br/>
            <TextField
              placeholder="Type something..."
              sx={{padding:"0"}}
              InputProps={{
                endAdornment: (
                  <Button sx={{color:"#fff", background:"#000", fontSize:"16px", textTransform:"capitalize", padding:"15px 35px"}}>
                    Subscribe
                  </Button>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Footer;
