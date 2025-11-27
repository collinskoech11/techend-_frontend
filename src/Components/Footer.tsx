"use client";

import { Box, Grid, Typography, Link as MuiLink, useTheme, CircularProgress } from "@mui/material";
import React from "react";
import { keyframes, darken } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useGetCompanyBySlugQuery } from "@/Api/services";

// Wave animation keyframes
const waveAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function Footer() {
  const theme = useTheme();
  const router = useRouter();
  const { shop } = router.query;

  const { data: companyData, isLoading, isError } = useGetCompanyBySlugQuery(shop, {
    skip: !shop,
  });

  const renderContactInfo = () => {
    if (!shop) {
      return (
        <>
          <Typography variant="body1" sx={{ mb: 0.5, color: "#e0e0e0" }}>sokojunction@gmail.com</Typography>
          <Typography variant="body1" sx={{ mb: 0.5, color: "#e0e0e0" }}>+254 703 508881</Typography>
          <Typography variant="body2" sx={{ color: "#e0e0e0" }}>Nairobi, Kenya</Typography>
        </>
      );
    }

    if (isLoading) return <CircularProgress size={24} sx={{ color: "#fff" }} />;
    if (isError || !companyData)
      return <Typography variant="body2" sx={{ color: "#e0e0e0" }}>Contact information not available.</Typography>;

    return (
      <>
        <Typography variant="body1" sx={{ mb: 0.5, color: "#e0e0e0" }}>{companyData.contact_email}</Typography>
        <Typography variant="body1" sx={{ mb: 0.5, color: "#e0e0e0" }}>{companyData.contact_phone}</Typography>
        <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
          {companyData.physical_address}, {companyData.city}, {companyData.country}
        </Typography>
      </>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${darken(theme.palette.primary.main, 0.8)} 100%)`,
        color: "#fff",
        pt: { xs: 6, md: 10 },
        pb: { xs: 6, md: 8 },
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100%",
          backgroundRepeat: "repeat-x",
          zIndex: 0,
        },
        "&::before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.08" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')`,
          backgroundSize: "1600px 320px",
          opacity: 0.8,
          animation: `${waveAnimation} 20s linear infinite`,
        },
        "&::after": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,229.3C672,224,768,160,864,160C960,160,1056,224,1152,224C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')`,
          backgroundSize: "1800px 350px",
          opacity: 0.6,
          animation: `${waveAnimation} 25s linear infinite reverse`,
        },
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: "1400px",
          margin: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Contact Us */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.05)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color:"#fff" }}>
              Contact Us
            </Typography>
            {renderContactInfo()}
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.05)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color:"#fff" }}>
              Quick Links
            </Typography>
            {["Features", "Pricing", "Showcase", "Testimonials"].map((link) => (
              <MuiLink
                key={link}
                href={`https://sokojunction.com/#${link.toLowerCase()}`}
                underline="none"
                sx={{
                  display: "block",
                  mb: 1,
                  color: "#e0e0e0",
                  fontSize: 14,
                  "&:hover": { color: theme.palette.primary.main },
                }}
              >
                {link}
              </MuiLink>
            ))}
          </Box>
        </Grid>

        {/* Support */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.05)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color:"#fff" }}>
              Support
            </Typography>
            {["FAQ", "Contact Us", "Terms of Service"].map((link, idx) => (
              <MuiLink
                key={idx}
                href={link === "Terms of Service" ? "https://sokojunction.com/terms" : `https://sokojunction.com/#${link.replace(" ", "").toLowerCase()}`}
                underline="none"
                sx={{
                  display: "block",
                  mb: 1,
                  color: "#e0e0e0",
                  fontSize: 14,
                  "&:hover": { color: theme.palette.primary.main },
                }}
              >
                {link}
              </MuiLink>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
