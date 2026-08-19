import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useGetCompaniesQuery } from "@/Api/services";
import { Company } from "@/Types";
import {
  Box,
  Typography,
  Container,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Tooltip,
  Button,
  useTheme,
  alpha,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import toast from "react-hot-toast";

// --- ForwardRef Grid wrapper honoring MUI v5 size prop ---
const Grid = React.forwardRef<HTMLDivElement, any>(function Grid(props, ref) {
  const { size, children, ...rest } = props;
  if (size && typeof size === "object") {
    return <Box ref={ref} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }} {...rest}>{children}</Box>;
  }
  return <Box ref={ref} {...rest}>{children}</Box>;
});

// --- Styled Glass Card ---
const ShopCard = styled(Box)(({ theme }) => ({
  borderRadius: "24px",
  overflow: "hidden",
  backgroundColor: "#ffffff",
  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  cursor: "pointer",

  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 24px 48px -12px ${alpha(theme.palette.primary.main, 0.18)}`,
    borderColor: alpha(theme.palette.primary.main, 0.35),

    "& .shop-logo": {
      transform: "scale(1.05)",
    },
    "& .visit-btn": {
      backgroundColor: theme.palette.primary.main,
      color: "#ffffff",
      transform: "translateX(4px)",
    },
  },
}));

const CardBanner = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: 180,
  backgroundColor: alpha(theme.palette.primary.main, 0.06),
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// --- Company Card Component ---
const CompanyCardItem: React.FC<{ company: Company }> = ({ company }) => {
  const theme = useTheme();
  const router = useRouter();
  const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dqokryv6u/";
  const FALLBACK_IMAGE_URL = "/assets/techendbanner.png";

  const initialLogoUrl = company.logo_image
    ? `${CLOUDINARY_BASE_URL}${company.logo_image}`
    : FALLBACK_IMAGE_URL;

  const [imgSrc, setImgSrc] = useState(initialLogoUrl);

  const handleVisitShop = () => {
    const slug = company.sluggified_name || company.name?.toLowerCase().replace(/\s+/g, "-");
    router.push(`/shop/${slug}`);
  };

  return (
    <ShopCard onClick={handleVisitShop}>
      <CardBanner>
        <Image
          className="shop-logo"
          src={imgSrc}
          alt={`${company.name} logo`}
          onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
        />

        {company.kyc_approved && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.2,
              py: 0.4,
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              color: "#10b981",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <VerifiedIcon sx={{ fontSize: "0.95rem" }} />
            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "0.72rem", color: "#065f46" }}>
              Verified
            </Typography>
          </Box>
        )}
      </CardBanner>

      <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#18181b",
              mb: 1,
              lineHeight: 1.2,
            }}
          >
            {company.name}
          </Typography>

          {company.city && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5, color: "#71717a" }}>
              <LocationOnIcon sx={{ fontSize: "0.9rem", color: theme.palette.primary.main }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {company.city}{company.country ? `, ${company.country}` : ""}
              </Typography>
            </Box>
          )}

          <Typography
            variant="body2"
            sx={{
              color: "#52525b",
              lineHeight: 1.6,
              fontSize: "0.88rem",
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {company.description || "Discover premium products and collections directly from this storefront."}
          </Typography>
        </Box>

        <Box
          sx={{
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
            Browse Storefront
          </Typography>
          <Button
            className="visit-btn"
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: "0.9rem !important" }} />}
            sx={{
              borderRadius: "20px",
              px: 2,
              py: 0.6,
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "none",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              transition: "all 0.25s ease",
            }}
          >
            Visit
          </Button>
        </Box>
      </Box>
    </ShopCard>
  );
};

// --- Main Page Component ---
const CompaniesList: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: companiesData, error, isLoading } = useGetCompaniesQuery({ page, page_size: 12 });

  const filteredCompanies = useMemo(() => {
    if (!companiesData?.results) return [];
    if (!searchQuery.trim()) return companiesData.results;
    return companiesData.results.filter((c: Company) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companiesData?.results, searchQuery]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", pb: 12 }}>
      {/* --- HERO SECTION --- */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 12 },
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          backgroundImage: `
            radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.main, 0.04)} 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, ${alpha(theme.palette.secondary.main, 0.04)} 0%, transparent 40%)
          `,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2.5,
                py: 0.75,
                borderRadius: "50px",
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                mb: 3,
              }}
            >
              <StorefrontIcon sx={{ fontSize: "1.1rem", color: theme.palette.primary.main }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.primary.main, letterSpacing: 1 }}>
                DISCOVER CERTIFIED MERCHANTS
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem" },
                color: "#18181b",
                lineHeight: 1.15,
                mb: 2.5,
                letterSpacing: "-0.02em",
              }}
            >
              Explore Top <span style={{ color: theme.palette.primary.main }}>Independent Shops</span>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1.05rem", md: "1.2rem" },
                color: "#71717a",
                lineHeight: 1.7,
                mb: 5,
                maxWidth: "650px",
                mx: "auto",
              }}
            >
              Connect with vetted brand storefronts, local artisans, and enterprise merchants powered by SokoJunction.
            </Typography>

            {/* Search Bar */}
            <Box sx={{ maxWidth: "600px", mx: "auto" }}>
              <TextField
                fullWidth
                placeholder="Search shops by name, category, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.primary.main, fontSize: "1.4rem" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "50px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.06)",
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    fontSize: "0.98rem",
                    py: 0.5,
                    px: 1,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* --- SHOPS GRID CONTAINER --- */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 } }}>
        {isLoading ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }}>
            {Array.from(new Array(8)).map((_, idx) => (
              <Box key={idx} sx={{ borderRadius: "24px", overflow: "hidden", border: "1px solid #e4e4e7", backgroundColor: "#fff", p: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={160} sx={{ borderRadius: "16px", mb: 2 }} />
                <Skeleton width="60%" height={28} sx={{ mb: 1 }} />
                <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
                <Skeleton width="100%" height={40} />
              </Box>
            ))}
          </Box>
        ) : error ? (
          <Box sx={{ textAlignment: "center", py: 8 }}>
            <Typography variant="h6" color="error">
              Could not retrieve merchant storefronts. Please try again later.
            </Typography>
          </Box>
        ) : filteredCompanies.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, backgroundColor: "#ffffff", borderRadius: "24px", p: 6, border: "1px solid rgba(0,0,0,0.06)" }}>
            <StorefrontIcon sx={{ fontSize: "3.5rem", color: "#a1a1aa", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#18181b" }}>
              No Shops Found
            </Typography>
            <Typography color="text.secondary">
              We couldn't find any merchant matching "{searchQuery}". Try searching another keyword.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }}>
              {filteredCompanies.map((company: Company) => (
                <CompanyCardItem key={company.id} company={company} />
              ))}
            </Box>

            {/* Pagination controls */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 8 }}>
              <Button
                variant="outlined"
                disabled={!companiesData?.previous}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                startIcon={<NavigateBeforeIcon />}
                sx={{
                  borderRadius: "30px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Previous Page
              </Button>

              <Chip
                label={`Page ${page}`}
                sx={{
                  fontWeight: 800,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  px: 1,
                }}
              />

              <Button
                variant="outlined"
                disabled={!companiesData?.next}
                onClick={() => setPage((prev) => prev + 1)}
                endIcon={<NavigateNextIcon />}
                sx={{
                  borderRadius: "30px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Next Page
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CompaniesList;