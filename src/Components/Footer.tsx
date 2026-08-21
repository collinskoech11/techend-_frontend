import {
  Box,
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
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useGetCompanyBySlugQuery } from "@/Api/services";

// Social Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import { keyframes } from "@emotion/react";

// ForwardRef Grid wrapper honoring MUI v5 size prop
const Grid = React.forwardRef<HTMLDivElement, any>(function Grid(props, ref) {
  const { size, children, ...rest } = props;
  if (size && typeof size === "object") {
    return <Box ref={ref} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1.5fr" }, gap: 4 }} {...rest}>{children}</Box>;
  }
  return <Box ref={ref} {...rest}>{children}</Box>;
});

// Bounce animation for dots
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); } 
  40% { transform: scale(1); }
`;

// Ellipsis container
const BouncingEllipsis = styled('span')(({ theme }) => ({
  display: 'inline-block',
  width: '24px',
  textAlign: 'left',
  '& > span': {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    margin: '0 2px',
    backgroundColor: theme.palette.common.white,
    borderRadius: '50%',
    animation: `${bounce} 1.4s infinite ease-in-out both`,
  },
  '& > span:nth-of-type(1)': { animationDelay: '0s' },
  '& > span:nth-of-type(2)': { animationDelay: '0.2s' },
  '& > span:nth-of-type(3)': { animationDelay: '0.4s' },
}));

// Footer Link
const FooterLink = styled(MuiLink)(({ theme }) => ({
  display: "inline-block",
  marginBottom: theme.spacing(1.2),
  color: alpha(theme.palette.common.white, 0.7),
  fontSize: "0.92rem",
  fontWeight: 500,
  textDecoration: "none",
  transition: "all 0.25s ease",
  "&:hover": {
    color: theme.palette.primary.light,
    transform: "translateX(4px)",
  },
}));

// Footer Section Title
const FooterSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginBottom: theme.spacing(2.5),
  color: theme.palette.common.white,
}));

// Glass Card
const GlassBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3.5),
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(16px)",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
}));

const DEFAULT_BRAND_URLS = [
  "/shops",
  "/payment/Growth",
  "/",
  "/about",
  "/contact",
  "/company-onboarding",
  "/profile",
  "/login",
];

export default function Footer() {
  const theme = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [cookieShop, setCookieShop] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setCookieShop(Cookies.get("shopname") || null);
  }, []);

  const isDefaultBrandPage = DEFAULT_BRAND_URLS.includes(router.pathname);

  const displayShopName = isDefaultBrandPage
    ? "SokoJunction"
    : cookieShop || "SokoJunction";
  const { data: companyData, isLoading: companyLoading } =
    useGetCompanyBySlugQuery(displayShopName, {
      skip: isDefaultBrandPage || !cookieShop,
    });

  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterEmail("");
  };

  const renderContactContent = () => {
    if (isDefaultBrandPage || !companyData) {
      return (
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: alpha("#fff", 0.85) }}>
            <EmailIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.light }} />
            <Typography variant="body2">sokojunction@gmail.com</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: alpha("#fff", 0.85) }}>
            <PhoneIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.light }} />
            <Typography variant="body2">+254 703 508881</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: alpha("#fff", 0.85) }}>
            <LocationOnIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.light }} />
            <Typography variant="body2">Nairobi, Kenya</Typography>
          </Box>
        </Stack>
      );
    }

    if (companyLoading) return <CircularProgress size={22} color="inherit" />;

    return (
      <Stack spacing={2}>
        {companyData.contact_email && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: alpha("#fff", 0.85) }}>
            <EmailIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.light }} />
            <MuiLink href={`mailto:${companyData.contact_email}`} underline="hover" color="inherit" variant="body2">
              {companyData.contact_email}
            </MuiLink>
          </Box>
        )}
        {companyData.contact_phone && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: alpha("#fff", 0.85) }}>
            <PhoneIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.light }} />
            <MuiLink href={`tel:${companyData.contact_phone}`} underline="hover" color="inherit" variant="body2">
              {companyData.contact_phone}
            </MuiLink>
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, color: alpha("#fff", 0.85) }}>
          <LocationOnIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.light, mt: 0.2 }} />
          <Typography variant="body2">
            {companyData.physical_address}, {companyData.city}, {companyData.country}
          </Typography>
        </Box>
      </Stack>
    );
  };

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#09090b",
        color: theme.palette.common.white,
        pt: { xs: 8, md: 12 },
        pb: { xs: 5, md: 6 },
        mt: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Box
        sx={{
          maxWidth: "1350px",
          width: "90%",
          mx: "auto",
        }}
      >
        <Grid container spacing={5} size={{ xs: 12, md: 4 }}>
          {/* Brand + Newsletter */}
          <Box>
            <Stack spacing={3}>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.02em", color: "#ffffff" }}>
                {!mounted || isDefaultBrandPage
                  ? "SokoJunction"
                  : companyLoading
                    ? (
                      <BouncingEllipsis>
                        <span></span>
                        <span></span>
                        <span></span>
                      </BouncingEllipsis>
                    )
                    : companyData?.name || "SokoJunction"
                }
              </Typography>

              <Typography variant="body2" sx={{ color: alpha("#fff", 0.7), lineHeight: 1.7, maxWidth: "420px" }}>
                {isDefaultBrandPage
                  ? "SokoJunction powers independent digital storefronts, local artisans, and enterprise merchants across Africa."
                  : companyData?.description || "Your marketplace to discover unique products from local shops."
                }
              </Typography>

              {/* Newsletter */}
              <form onSubmit={handleNewsletterSubmit}>
                <Stack direction="row" spacing={1} sx={{ maxWidth: "440px" }}>
                  <TextField
                    type="email"
                    placeholder="Enter email for updates..."
                    size="small"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: alpha("#fff", 0.5) }} />,
                      sx: {
                        borderRadius: "30px",
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                        color: "#fff",
                        fontSize: "0.88rem",
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                        "&:hover fieldset": { borderColor: theme.palette.primary.main },
                        "& input": { color: "#fff" },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon sx={{ fontSize: "0.9rem !important" }} />}
                    sx={{
                      borderRadius: "30px",
                      px: 3,
                      fontWeight: 700,
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      backgroundColor: theme.palette.primary.main,
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                </Stack>
              </form>

              {/* Social icons */}
              <Box sx={{ display: "flex", gap: 1.5, pt: 1 }}>
                {[FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon].map((Icon, i) => (
                  <IconButton
                    key={i}
                    size="small"
                    sx={{
                      color: alpha("#fff", 0.75),
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        color: theme.palette.primary.light,
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        borderColor: theme.palette.primary.main,
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Stack>
          </Box>

          {/* Quick Links */}
          <Box>
            <FooterSectionTitle>Navigation</FooterSectionTitle>
            <Stack spacing={0.5}>
              {[
                { name: "Home", path: "/" },
                { name: "Explore Shops", path: "/shops" },
                { name: "About Platform", path: "/about" },
                { name: "Mobile App", path: "/mobile-app" },
                { name: "Merchant Setup", path: "/company-onboarding" },
              ].map((item) => (
                <FooterLink key={item.name} href={item.path}>
                  {item.name}
                </FooterLink>
              ))}
            </Stack>
          </Box>

          {/* Contact */}
          <Box>
            <GlassBox>
              <FooterSectionTitle sx={{ mb: 2 }}>Store Info</FooterSectionTitle>
              {renderContactContent()}
            </GlassBox>
          </Box>
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            mt: 8,
            mb: 4,
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            opacity: 0.75,
            fontSize: "0.85rem",
          }}
        >
          <Typography variant="caption" sx={{ color: alpha("#fff", 0.7) }}>
            © {new Date().getFullYear()} SokoJunction E-Commerce Infrastructure. All Rights Reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <MuiLink href="/" underline="none" sx={{ color: alpha("#fff", 0.7), fontSize: "0.8rem", "&:hover": { color: "#fff" } }}>
              Privacy Policy
            </MuiLink>
            <MuiLink href="/" underline="none" sx={{ color: alpha("#fff", 0.7), fontSize: "0.8rem", "&:hover": { color: "#fff" } }}>
              Terms of Service
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}