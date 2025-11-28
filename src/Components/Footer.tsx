"use client";

import {
  Box,
  Grid,
  Typography,
  Link as MuiLink,
  useTheme,
  CircularProgress,
  alpha,
  Divider,
  Stack,
  TextField,
  Button,
  IconButton,
} from "@mui/material";

import React, { useState } from "react";
import { darken, styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useGetCompanyBySlugQuery } from "@/Api/services";

// Social Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";


// Footer Link
const FooterLink = styled(MuiLink)(({ theme }) => ({
  display: "block",
  marginBottom: theme.spacing(1),
  color: alpha(theme.palette.common.white, 0.75),
  fontSize: "0.9rem",
  letterSpacing: 0.2,
  transition: "0.25s ease",
  "&:hover": {
    color: theme.palette.secondary.main,
    textDecoration: "underline",
    transform: "translateX(4px)",
  },
}));

// Footer Section Title
const FooterSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.common.white,
}));

// Glass Card
const GlassBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  background: alpha(theme.palette.common.white, 0.08),
  border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
  backdropFilter: "blur(10px)",
  boxShadow: `0 6px 30px ${alpha("#000", 0.18)}`,
}));


export default function Footer() {
  const theme = useTheme();
  const router = useRouter();
  const slug = router.query.shop as string | undefined;

  const { data: companyData, isLoading, isError } = useGetCompanyBySlugQuery(slug!, {
    skip: !slug,
  });

  const primaryColor = darken(theme.palette.primary.main, 0.65);

  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed: ${newsletterEmail}`);
    setNewsletterEmail("");
  };

  const renderContactContent = () => {
    if (!slug)
      return (
        <Stack spacing={1}>
          <Typography>Email: sokojunction@gmail.com</Typography>
          <Typography>Phone: +254 703 508881</Typography>
          <Typography>Location: Nairobi, Kenya</Typography>
        </Stack>
      );

    if (isLoading) return <CircularProgress size={22} color="inherit" />;

    if (isError || !companyData)
      return <Typography>Contact info unavailable.</Typography>;

    return (
      <Stack spacing={1}>
        {companyData.contact_email && (
          <MuiLink href={`mailto:${companyData.contact_email}`} underline="hover" color="inherit">
            Email: {companyData.contact_email}
          </MuiLink>
        )}
        {companyData.contact_phone && (
          <MuiLink href={`tel:${companyData.contact_phone}`} underline="hover" color="inherit">
            Phone: {companyData.contact_phone}
          </MuiLink>
        )}
        <Typography>
          Location: {companyData.physical_address}, {companyData.city}, {companyData.country}
        </Typography>
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${primaryColor})`,
        color: theme.palette.common.white,
        pt: { xs: 8, md: 10 },
        pb: { xs: 4, md: 6 },
        mt: { xs: 8, md: 12 },
      }}
    >
      {/* Main Footer Content */}
      <Grid
        container
        spacing={6}
        sx={{
          maxWidth: "1300px",
          width: "90%",
          mx: "auto",
          alignItems: "flex-start",
        }}
      >
        {/* Brand + Newsletter */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2.5}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              SokoJunction
            </Typography>

            <Typography variant="body2" sx={{ color: alpha("#fff", 0.8) }}>
              Your marketplace to discover unique products from local shops.
            </Typography>

            {/* Newsletter */}
            <form onSubmit={handleNewsletterSubmit}>
              <Stack direction="row" spacing={1}>
                <TextField
                  type="email"
                  label="Email for updates"
                  size="small"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, opacity: 0.7 }} />,
                    sx: {
                      borderRadius: "30px",
                      color: "#fff",
                      "& fieldset": { borderColor: alpha("#fff", 0.3) },
                      "& input": { color: "#fff" },
                    },
                  }}
                  InputLabelProps={{
                    sx: { color: alpha("#fff", 0.7) },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: "30px",
                    px: 3,
                    fontWeight: 600,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
            </form>

            {/* Social icons */}
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {[FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    color: alpha("#fff", 0.75),
                    "&:hover": { color: theme.palette.secondary.main },
                  }}
                >
                  <Icon fontSize="medium" />
                </IconButton>
              ))}
            </Box>
          </Stack>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={6} md={2}>
          <FooterSectionTitle>Quick Links</FooterSectionTitle>

          {["Home", "Shop", "Mall", "About Us"].map((item) => (
            <FooterLink
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "")}`}
            >
              {item}
            </FooterLink>
          ))}
        </Grid>

        {/* Categories */}
        <Grid item xs={6} md={2}>
          <FooterSectionTitle>Categories</FooterSectionTitle>

          {["Fashion", "Electronics", "Home & Living", "Beauty", "Books"].map((item) => (
            <FooterLink
              key={item}
              href={`/shop/category/${item.toLowerCase().replace(" & ", "-")}`}
            >
              {item}
            </FooterLink>
          ))}
        </Grid>

        {/* Contact */}
        <Grid item xs={12} md={4}>
          <GlassBox>
            <FooterSectionTitle>Contact Info</FooterSectionTitle>
            {renderContactContent()}
          </GlassBox>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider
        sx={{
          mt: 6,
          borderColor: alpha("#fff", 0.2),
          mx: "auto",
          maxWidth: "1300px",
          width: "90%",
        }}
      />

      {/* Copyright */}
      <Box
        sx={{
          textAlign: "center",
          mt: 3,
          opacity: 0.75,
          fontSize: "0.85rem",
        }}
      >
        © {new Date().getFullYear()} SokoJunction. All Rights Reserved.
      </Box>
    </Box>
  );
}
