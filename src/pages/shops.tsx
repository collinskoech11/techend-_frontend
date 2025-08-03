import React, { useState, lazy, Suspense } from "react";
import { useRouter } from "next/router";
import { useGetCompaniesQuery } from "@/Api/services";
import { Company, CompanyCardProps } from "@/Types";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Skeleton,
  Tooltip,
  Button,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import toast, { Toaster } from "react-hot-toast";
const Typewriter = lazy(() => import("typewriter-effect"));
const Zoom = lazy(() => import('react-reveal/Zoom'));

import { GreenButton } from "@/StyledComponents/Buttons";
import {
  ProductItemStyled as CompanyCardStyled,
  ProductImage,
  ProductImageWrapper,
  ProductInfoContainer,
  ProductOverlay,
} from "@/StyledComponents/Products";
import {
  ProductTitle,
  ProductDescription,
} from "@/StyledComponents/Typos";
import {
  HeroSection,
  HeroGraphic,
  AccentButton,
} from "@/StyledComponents/Hero"; // Make sure these exist and are styled

// --- Skeletons ---
const BannerSkeleton: React.FC = () => (
  <Skeleton variant="rectangular" animation="wave" height={200} sx={{ borderRadius: 3, mb: 5 }} />
);

const CompanyCardSkeleton: React.FC = () => (
  <CompanyCardStyled>
    <Skeleton variant="rectangular" animation="wave" height={200} />
    <ProductInfoContainer>
      <Skeleton animation="wave" height={30} width="60%" style={{ marginBottom: 6 }} />
      <Skeleton animation="wave" height={20} width="90%" />
      <Skeleton animation="wave" height={20} width="80%" />
    </ProductInfoContainer>
  </CompanyCardStyled>
);

// --- Company Card ---
const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const router = useRouter();
  const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dqokryv6u/';
  const FALLBACK_IMAGE_URL = '/images/shop-placeholder.png';

  const initialLogoUrl = company.logo_image
    ? `${CLOUDINARY_BASE_URL}${company.logo_image}`
    : FALLBACK_IMAGE_URL;

  const [imgSrc, setImgSrc] = useState(initialLogoUrl);

  const handleImageError = () => {
    setImgSrc(FALLBACK_IMAGE_URL);
  };

  const handleVisitShop = () => {
    router.push(`/shop/${company.sluggified_name}`);
  };

  return (
    <CompanyCardStyled>
      <ProductImageWrapper>
        <ProductImage src={imgSrc} alt={`${company.name} logo`} onError={handleImageError} />
        <ProductOverlay className="overlay">
          <GreenButton onClick={handleVisitShop}>Visit Shop</GreenButton>
        </ProductOverlay>
      </ProductImageWrapper>
      <ProductInfoContainer>
        <Box sx={{  gap: 1, mb: 1 }}>
          <ProductTitle sx={{ mb: 0, flexGrow: 1 }}>{company.name}</ProductTitle>
          {company.kyc_approved && (
            <Tooltip title="This company has been verified by our team.">
              <Chip
                icon={<CheckCircleIcon style={{ color: 'inherit' }} />}
                label="Verified"
                color="success"
                size="small"
                variant="outlined"
              />
            </Tooltip>
          )}
        </Box>
        <ProductDescription>
          {company.description?.length > 100
            ? `${company.description.substring(0, 100)}...`
            : company.description}
        </ProductDescription>
      </ProductInfoContainer>
    </CompanyCardStyled>
  );
};

// --- Hero Banner ---
const HeroBanner: React.FC = () => {
  const handleAuthTrigger = () => {
    // Optional: Replace with your real auth modal or route
    console.log("Auth trigger clicked");
  };

  return (
    <HeroSection onClick={handleAuthTrigger}>
      {/* Floating Graphics */}
      <HeroGraphic sx={{ width: 100, height: 100, top: '10%', left: '10%', animationDelay: '0s' }} />
      <HeroGraphic sx={{ width: 150, height: 150, bottom: '15%', right: '10%', animationDelay: '1s' }} />
      <HeroGraphic sx={{ width: 70, height: 70, top: '20%', right: '5%', animationDelay: '0.5s' }} />
      <HeroGraphic sx={{ width: 120, height: 120, bottom: '5%', left: '5%', animationDelay: '1.5s' }} />

      <Suspense fallback={<div>Loading...</div>}>
        <Zoom duration={1200}>
          <Box sx={{
            position: 'relative',
            zIndex: 2,
            px: { xs: 2, sm: 4, md: 3 },
            py: { xs: 8, sm: 10, md: 4 },
            maxWidth: '1000px',
            mx: 'auto',
          }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: { xs: 2, md: 3 },
                color: "#fff",
                fontSize: {
                  xs: '2.4rem',
                  sm: '2.8rem',
                },
                lineHeight: { xs: 1.1, sm: 1.05, md: 1 },
                letterSpacing: { xs: '-0.02em', md: '-0.03em' },
              }}
            >
              <Suspense fallback={<div>Loading...</div>}>
                <Typewriter
                  options={{
                    strings: ["Explore Shops"],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </Suspense>
            </Typography>
          </Box>
        </Zoom>
      </Suspense>
    </HeroSection>
  );
};

// --- Main Component ---
const CompaniesList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: companiesData, error, isLoading } = useGetCompaniesQuery({ page });

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <BannerSkeleton />
        <Grid container spacing={3}>
          {Array.from(new Array(8)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <CompanyCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    toast.error("Failed to load company data.");
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Toaster />
        <Typography color="error">Could not retrieve companies. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Toaster />
      <HeroBanner />
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
        Explore Our Shops
      </Typography>
      <Grid container spacing={3}>
        {companiesData && companiesData.results.length > 0 ? (
          companiesData.results.map((company: Company) => (
            <Grid item key={company.id} xs={12} sm={6} md={4} lg={3}>
              <CompanyCard company={company} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography sx={{ p: 3, textAlign: 'center' }}>No companies are available at the moment.</Typography>
          </Grid>
        )}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          disabled={!companiesData?.previous}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={!companiesData?.next}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default CompaniesList;