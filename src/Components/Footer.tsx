import { ProductPrice, ReviewText } from "@/StyledComponents/Typos";
import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";

function Footer() {
  return (
    <>
      <Box sx={{ width: "100vw", background: "#be1f2f", pt: 6, pb: 6, mt:"100px" }}>
        <Grid
          container
          sx={{
            color: "#fff",
            padding: "20px",
            maxWidth: "1400px",
            margin: "auto",
          }}
        >
          <Grid item md={3} xs={12} sx={{ mb: { xs: 3, md: 0 } }}>
            <Box>
              <ProductPrice sx={{ color: "#fff" }}>Talk to Us</ProductPrice>
              <ProductPrice sx={{ color: "#fff" }}>+254 728 000 107</ProductPrice>
              <ReviewText sx={{ color: "#fff" }}>
                Join our open eCommerce community
              </ReviewText>
            </Box>
          </Grid>
          <Grid item md={2} xs={12} sx={{ mb: { xs: 3, md: 0 } }}>
            <ProductPrice sx={{ color: "#fff" }}>Explore</ProductPrice>
            <ReviewText sx={{ color: "#fff" }}>Open Products</ReviewText>
            <ReviewText sx={{ color: "#fff" }}>Popular Items</ReviewText>
            <ReviewText sx={{ color: "#fff" }}>Marketplace</ReviewText>
          </Grid>
          <Grid item md={2} xs={12} sx={{ mb: { xs: 3, md: 0 } }}>
            <ProductPrice sx={{ color: "#fff" }}>About</ProductPrice>
            <ReviewText sx={{ color: "#fff" }}>Our Mission</ReviewText>
            <ReviewText sx={{ color: "#fff" }}>Contact Us</ReviewText>
            <ReviewText sx={{ color: "#fff" }}>Community Guidelines</ReviewText>
            <ReviewText sx={{ color: "#fff" }}>Terms & Conditions</ReviewText>
          </Grid>
          <Grid item md={5} xs={12}>
            <ProductPrice sx={{ fontSize: "34px", mt: "-13px", color: "#fff" }}>
              Stay Connected
            </ProductPrice>
            <ReviewText sx={{ color: "#fff" }}>
              Enter your email to get updates on new features, products, and
              community events.
            </ReviewText>
            <br />
            <br />
            <TextField
              placeholder="Enter your email..."
              sx={{
                background: "#fff",
                borderRadius: "4px",
                "& input": { padding: "10px" },
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    sx={{
                      color: "#fff",
                      background: "#000",
                      fontSize: "16px",
                      textTransform: "capitalize",
                      padding: "15px 35px",
                      borderRadius: "0 4px 4px 0",
                      "&:hover": {
                        background: "#333",
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                ),
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Footer;
