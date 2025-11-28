"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import AuthDialog from "@/Components/AuthDialog";
import { useGetCompaniesQuery } from "@/Api/services";
import toast from "react-hot-toast";

import Hero from "@/Components/MainLanding/Hero";
import Features from "@/Components/MainLanding/Features";
import Showcase from "@/Components/MainLanding/Showcase";
import Pricing from "@/Components/MainLanding/Pricing";
import Testimonials from "@/Components/MainLanding/Testimonials";
import Contact from "@/Components/MainLanding/Contact";
import FinalCTA from "@/Components/MainLanding/FinalCTA";

const FAQ = lazy(() => import("@/Components/FAQ"));

const lightGray = "#f0f2f5";

export default function LandingPage() {
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: companiesData } = useGetCompaniesQuery({});

  const handleAuthTrigger = () => {
    setShowAuthDialog(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    router.push("/company-onboarding");
  };

  const handleNavigate = () => {
    router.push("/company-onboarding");
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentDomain = window.location.hostname;
      if (currentDomain === "www.cupcoutureshop.com") {
        router.push("/shop/the-cup-couture");
      } else if (currentDomain === "www.boromoto.com") {
        router.push("/shop/boromoto");
      }
    }
  }, [router]);

  return (
    <Box sx={{ bgcolor: lightGray, minHeight: '100vh' }}>
      {showAuthDialog && (
        <AuthDialog
          onTrigger={handleAuthSuccess}
          forceOpen={true}
          showButton={false}
        />
      )}
      <Box sx={{ p: 0, mt: "-100px" }}>
        <Hero handleNavigate={handleNavigate} handleAuthTrigger={handleAuthTrigger} />

        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Features />
          <Showcase handleAuthTrigger={handleAuthTrigger} />
          <Pricing handleAuthTrigger={handleAuthTrigger} />
          <Suspense fallback={<div>Loading FAQs...</div>}>
            <div id="faq">
              <FAQ />
            </div>
          </Suspense>
          <Testimonials isMobile={isMobile} companiesData={companiesData} />
          <Contact />
          <FinalCTA handleAuthTrigger={handleAuthTrigger} />
        </Container>
      </Box>
    </Box>
  );
}