"use client";

import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Fade } from "react-awesome-reveal";
import Carousel from 'react-material-ui-carousel';
import TestimonialCard from "@/Components/TestimonialCard";

const darkText = "#212121";
const lightGray = "#f0f2f5";

interface TestimonialsProps {
  isMobile: boolean;
  companiesData: any;
}

const Testimonials: React.FC<TestimonialsProps> = ({ isMobile, companiesData }) => {
  const theme = useTheme();
  return (
    <Box sx={{ py: 10, bgcolor: lightGray }} id="testimonials">
      <Fade cascade triggerOnce>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 8, textAlign: "center", color: darkText }}>
          What Our <span style={{ color: theme.palette.primary.main }}>Clients</span> Say
        </Typography>
        <Carousel
          autoPlay={true}
          animation="slide"
          indicators={true}
          navButtonsAlwaysVisible={false}
          cycleNavigation={true}
          interval={6000}
          sx={{
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            '.MuiIconButton-root': {
              color: theme.palette.primary.main,
            },
            '.MuiButtonBase-root.MuiIconButton-root': {
              color: theme.palette.primary.main,
            },
            '.MuiSvgIcon-root': {
              color: theme.palette.primary.main,
            },
            '.MuiCarousel-indicator': {
              color: theme.palette.primary.main,
            },
            '.MuiCarousel-indicator.Mui-active': {
              color: theme.palette.primary.dark,
            },
          }}
        >
          {isMobile
            ? companiesData?.results
              ?.filter((company: any) => company.testimonial && company.testimonial.trim() !== '')
              .map((company: any) => (
                <TestimonialCard
                  key={company.id}
                  name={company.name}
                  testimonial={company.testimonial}
                  avatarSrc={`https://res.cloudinary.com/dqokryv6u/${company.logo_image}`}
                />
              ))
            : companiesData?.results
              ?.filter((company: any) => company.testimonial && company.testimonial.trim() !== '')
              .reduce((acc: any[], company: any, index: number) => {
                if (index % 2 === 0) {
                  acc.push([company]);
                } else {
                  acc[acc.length - 1].push(company);
                }
                return acc;
              }, [])
              .map((pair: any[], index: number) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'center', gap: 4, p: 2 }}>
                  {pair.map((company: any) => (
                    <TestimonialCard
                      key={company.id}
                      name={company.name}
                      testimonial={company.testimonial}
                      avatarSrc={`https://res.cloudinary.com/dqokryv6u/${company.logo_image}`}
                    />
                  ))}
                </Box>
              ))}
        </Carousel>
      </Fade>
    </Box>
  );
};

export default Testimonials;
