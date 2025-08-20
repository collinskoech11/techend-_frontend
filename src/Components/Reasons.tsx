import { Box, Grid, Typography, styled } from "@mui/material";
import React from "react";
import Image from "next/image";

function Reasons() {
  const GridIternalItem = styled(Box)({
    width: "95%",
    margin: "auto",
    background: "#EEEEEC",
    textAlign: "center",
    padding: "40px",
  });
  const ImageContain = styled(Image)({
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  });
  const LeadTypo = styled(Typography)({
    fontSize: "20px",
    fontWeight: "600",
  });
  const MiniTypo = styled(Typography)({
    color: "rgb(125,125,125)",
    fontWeight: "500",
    fontSize: "18px",
    marginTop: "20px",
  });
  return (
    <>
      <Grid container sx={{ maxWidth: "1500px", margin: "auto", mt: 5 }}>
        <Grid item md={4} xs={12} sx={{ mb: 3 }}>
          <GridIternalItem>
            {/* <ImageContain
              src="https://source.unsplash.com/1000x1000/?suit"
              alt="reason"
            /> */}
            <LeadTypo sx={{ mt: 3 }}>WHOLE COUNTRY DELIVERY</LeadTypo>
            <MiniTypo>
              Enjoy fast and reliable delivery across the country. No matter
              where you are, your perfect suit is just a few clicks away.
            </MiniTypo>
          </GridIternalItem>
        </Grid>
        <Grid item md={4} xs={12} sx={{ mb: 3 }}>
          <GridIternalItem>
            {/* <ImageContain
              src="https://source.unsplash.com/1000x1000/?suit"
              alt="reason"
            /> */}
            <LeadTypo sx={{ mt: 3 }}>Secure Payments</LeadTypo>
            <MiniTypo>
              Shop with confidence using our secure payment options. Your
              financial information is protected with advanced encryption
              technology.
            </MiniTypo>
          </GridIternalItem>
        </Grid>
        <Grid item md={4} xs={12} sx={{ mb: 3 }}>
          <GridIternalItem>
            {/* <ImageContain
              src="https://source.unsplash.com/1000x1000/?suit"
              alt="reason"
            /> */}
            <LeadTypo sx={{ mt: 3 }}>30 Days return policy</LeadTypo>
            <MiniTypo>
              Not completely satisfied? No worries! Our 30-day return policy
              ensures you can shop with peace of mind and find your perfect fit.
            </MiniTypo>
          </GridIternalItem>
        </Grid>
      </Grid>
    </>
  );
}

export default Reasons;
