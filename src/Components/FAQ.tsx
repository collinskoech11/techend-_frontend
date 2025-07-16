import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    Grid,
    createTheme, // Import createTheme
    ThemeProvider, // Import ThemeProvider
    CssBaseline // For baseline CSS
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Changed to ExpandMoreIcon for standard behavior
import { styled } from '@mui/system';

// --- Color Palette ---
const accent = "#be1f2f"; // Your primary red accent
const lightGray = "#f0f2f5"; // Used for accordion details background
const pageBackground = "#f8f8f8"; // A slightly lighter gray for the overall page background
const darkText = "#212121"; // Darker text for headings and strong emphasis
const mediumText = "#4a4a4a"; // For primary body text
const lightText = "#757575"; // For secondary, subtle text

const primaryColor = accent; // Alias for consistency

// --- Custom Theme Definition ---
// In a real app, this would be in a separate theme.js and wrapped in _app.tsx
const imallTheme = createTheme({
  typography: {
    fontFamily: [
      'Roboto', // Material-UI default
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: {
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', // Responsive font size
      fontWeight: 800,
      color: darkText,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
      fontWeight: 400,
      color: mediumText,
      lineHeight: 1.6,
    },
    body1: { // For general body text like answers
      fontSize: '1rem',
      lineHeight: 1.6,
      color: lightText,
    },
    subtitle1: { // For question text in summary
      fontSize: '1.15rem',
      fontWeight: 600,
      color: darkText,
    }
  },
  palette: {
    primary: {
      main: primaryColor,
    },
    grey: {
        '50': pageBackground,
        '100': lightGray,
        '200': '#e0e0e0', // For borders
    }
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important', // Ensure consistent radius
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)', // Slightly more pronounced shadow
          '&:not(:last-of-type)': {
            marginBottom: '16px', // Space between accordions
          },
          '&.Mui-expanded': {
            margin: '16px 0', // Maintain margin when expanded
          },
          '&::before': {
            display: 'none', // Remove default Material-UI divider
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: pageBackground,
          borderRadius: '12px !important',
          minHeight: '64px', // Ensure minimum height for summary
          padding: '16px 24px', // Standard padding
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#fafafa', // Light hover effect
          },
          '&.Mui-expanded': {
            minHeight: '64px', // Maintain height when expanded
            borderBottomLeftRadius: 0, // Remove bottom radius when expanded
            borderBottomRightRadius: 0,
          },
          '& .MuiAccordionSummary-content': {
            margin: '0 !important', // Reset default content margin
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.15rem', // Match subtitle1
            fontWeight: 600, // Match subtitle1
            color: darkText, // Match subtitle1
          },
        },
        expandIconWrapper: {
          color: primaryColor,
          transition: 'transform 0.3s ease',
          '&.Mui-expanded': {
            transform: 'rotate(90deg)', // Rotate icon 90 degrees
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: lightGray,
          padding: '24px', // Consistent padding
          borderBottomLeftRadius: '12px', // Apply radius to bottom
          borderBottomRightRadius: '12px',
          borderTop: `1px solid #be1f2f`, // Subtle top border
        },
      },
    },
  },
});


const FAQ = () => {
    return (
        <ThemeProvider theme={imallTheme}> {/* Wrap with ThemeProvider */}
            <CssBaseline /> {/* Optional: For consistent baseline styles */}
            <Box sx={{ py: { xs: 6, md: 10 }}}> {/* Apply page background */}
                <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: { xs: 2, md: 4 }, textAlign: "center", color: darkText }}>
                    Frequently Asked Questions
                </Typography>
                <Typography variant="h6" component="p" sx={{ maxWidth: "800px", mx: "auto", mb: { xs: 4, md: 6 }, color: mediumText, textAlign: "center", px: { xs: 2, md: 0 } }}>
                    Everything you need to know about getting started with iMall.
                </Typography>

                <Grid container spacing={3} justifyContent="center" sx={{ px: { xs: 2, sm: 3, md: 0 } }}> {/* Add horizontal padding for smaller screens */}
                    <Grid item xs={12} md={10} lg={8}>
                        {[
                            {
                                question: "What is iMall and who is it for?",
                                answer: "iMall is an all-in-one eCommerce platform built for entrepreneurs, SMEs, and growing businesses to launch, manage, and scale online stores effortlessly. We provide powerful tools for storefront customization, secure payments, inventory management, and marketing."
                            },
                            {
                                question: "Do I need any technical skills to use iMall?",
                                answer: "Not at all! iMall is designed with user-friendliness in mind. Our intuitive interface and guided setup process allow you to launch a professional online store without writing a single line of code or needing prior technical expertise."
                            },
                            {
                                question: "Can I upgrade or downgrade my plan later?",
                                answer: "Absolutely. We understand that business needs evolve. You have the flexibility to upgrade or downgrade your iMall plan at any time directly from your account dashboard, with no hidden contracts or penalties. We're here to support your growth journey."
                            },
                            {
                                question: "Is there a free trial or a free plan available?",
                                answer: "Yes! To help you get started risk-free and explore our platform's capabilities, our Starter plan is currently available for free. This allows you to set up your store and begin selling without any initial investment."
                            },
                            {
                                question: "What kind of customer support does iMall offer?",
                                answer: "iMall provides comprehensive customer support tailored to your plan. This includes standard email support for all users, priority support for advanced plans, and dedicated account management for our Pro users. Our knowledge base and community forums are also available 24/7."
                            },
                            {
                                question: "How does iMall handle product shipping and logistics?",
                                answer: "iMall integrates with various shipping carriers and offers flexible shipping rate options, including flat rates, weight-based rates, and free shipping. While we don't directly handle physical logistics, our platform provides the tools to manage your shipping process efficiently and connect with third-party logistics providers."
                            }
                        ].map((faq, index) => (
                            <Accordion
                                key={index}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />} // Changed to standard ExpandMoreIcon
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                >
                                    <Typography variant="subtitle1">
                                        {faq.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default FAQ;