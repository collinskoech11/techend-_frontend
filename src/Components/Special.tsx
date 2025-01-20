import { LoginButton } from "@/StyledComponents/Buttons";
import { ProductTitle, ReviewText } from "@/StyledComponents/Typos";
import { Box, Grid, styled, Typography } from "@mui/material";
import React from "react";

function Special() {
  const ImageContainer = styled("img")({

  })
  return (
    <>
      <Box sx={{ width: "100%", maxWidth: "1400px", margin: "auto", mt: 4, mb:16 }}>
        <Grid container>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <ImageContainer
              src="https://res.cloudinary.com/dqokryv6u/image/upload/v1721422692/ge0lnkyjez93mbcjtrss.jpg"
              alt="Special"
              sx={{ width: {xs:"90%",md:"40%"}, height: "350px", mb:"30px" }}
              />
            <ImageContainer
              src="https://res.cloudinary.com/dqokryv6u/image/upload/v1721152227/dap2dqll2u5i64qee7z3.jpg"
              alt="Special"
              sx={{ width: "50%", height: "450px", display:{xs:"none", md:"block"} }}
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box sx={{ width: "80%", margin: "auto" }}>
              <ProductTitle>
                SPECIAL OFFER &nbsp;{" "}
                <span
                  style={{
                    background: "#BE1E2D",
                    padding: "3px",
                    color: "#fff",
                  }}
                >
                  - 20%
                </span>
              </ProductTitle>
              <Typography
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontFamily: "sans-serif",
                  fontWeight: "600",
                  fontSize: "34px",
                }}
              >
                Men Black Suit
              </Typography>
              <ReviewText sx={{ fontSize: "18px" }}>
                Made using clean, non-toxic ingredients, our products are
                designed for everyone.
              </ReviewText>
              <Typography
                sx={{
                  color: "rgb(78, 116, 96)",
                  fontSize: {md:"48px", xs:"30px"},
                  fontWeight: "500",
                  letterSpacing: "13px",
                }}
              >
                15:21:46:08
              </Typography>
              <br/>
              <LoginButton sx={{ fontSize: "22px", borderRadius: "0px", p:"10px 28px" }}>
                Get only $599.00
              </LoginButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Special;
