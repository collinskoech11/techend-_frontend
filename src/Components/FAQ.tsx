import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid,
  useTheme,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.12)",
  backdropFilter: "blur(12px)",
  borderRadius: "18px !important",
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  overflow: "hidden",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.18)",
    transform: "translateY(-3px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
  },

  "&::before": {
    display: "none",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(2.2, 3),
  "& .MuiAccordionSummary-content": {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 600,
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.7rem",
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2.2, 3),
  fontSize: "1rem",
  lineHeight: 1.7,
  color: theme.palette.text.secondary,
}));

const FAQ = () => {
  const theme = useTheme();

  const faqList = [
    {
      question: "What is sokoJunction and who is it for?",
      answer:
        "sokoJunction is an all-in-one eCommerce platform built for entrepreneurs, SMEs, and growing businesses to launch, manage, and scale online stores effortlessly. We provide powerful tools for storefront customization, secure payments, inventory management, and marketing.",
    },
    {
      question: "Do I need any technical skills to use sokoJunction?",
      answer:
        "Not at all! sokoJunction is designed with user-friendliness in mind. Our intuitive interface and guided setup process allow you to launch a professional online store without writing a single line of code or needing prior technical expertise.",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer:
        "Absolutely. We understand that business needs evolve. You have the flexibility to upgrade or downgrade your plan at any time directly from your account dashboard — no penalties.",
    },
    {
      question: "Is there a free trial or a free plan available?",
      answer:
        "Yes! Our Starter plan is available for free, allowing you to explore the platform and set up your store without any upfront investment.",
    },
    {
      question: "What kind of customer support does sokoJunction offer?",
      answer:
        "We provide email support for all users, priority support for advanced plans, and dedicated account managers for Pro users. Our knowledge base and community forums are also available 24/7.",
    },
    {
      question: "How does sokoJunction handle product shipping and logistics?",
      answer:
        "We integrate with multiple shipping carriers and offer flexible shipping options such as flat rate, weight-based, and free shipping. Our tools help you manage logistics efficiently and connect with third-party providers.",
    },
  ];

  return (
    <Box sx={{ py: { xs: 7, md: 12 }, px: { xs: 2, md: 0 } }}>
      {/* Section Title */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Typography
          variant="h6"
          sx={{
            maxWidth: "700px",
            mx: "auto",
            color: theme.palette.text.secondary,
            fontSize: { xs: "1rem", md: "1.2rem" },
            lineHeight: 1.6,
          }}
        >
          Everything you need to know about getting started with sokoJunction.
        </Typography>
      </Box>

      {/* FAQ Items */}
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          {faqList.map((faq, index) => (
            <StyledAccordion key={index}>
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontSize: "1.15rem", fontWeight: 700 }}>
                  {faq.question}
                </Typography>
              </StyledAccordionSummary>
              <StyledAccordionDetails>
                <Typography>{faq.answer}</Typography>
              </StyledAccordionDetails>
            </StyledAccordion>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FAQ;
