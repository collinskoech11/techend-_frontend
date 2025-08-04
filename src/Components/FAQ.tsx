import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Changed to ExpandMoreIcon for standard behavior

const FAQ = () => {
    return (
            <Box sx={{ py: { xs: 6, md: 10 }}}> {/* Apply page background */}
                <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: { xs: 2, md: 4 }, textAlign: "center" }}>
                    Frequently Asked Questions
                </Typography>
                <Typography variant="h6" component="p" sx={{ maxWidth: "800px", mx: "auto", mb: { xs: 4, md: 6 }, textAlign: "center", px: { xs: 2, md: 0 } }}>
                    Everything you need to know about getting started with sokoJunction.
                </Typography>

                <Grid container spacing={3} justifyContent="center" sx={{ px: { xs: 2, sm: 3, md: 0 } }}> {/* Add horizontal padding for smaller screens */}
                    <Grid item xs={12} md={10} lg={8}>
                        {[
                            {
                                question: "What is sokoJunction and who is it for?",
                                answer: "sokoJunction is an all-in-one eCommerce platform built for entrepreneurs, SMEs, and growing businesses to launch, manage, and scale online stores effortlessly. We provide powerful tools for storefront customization, secure payments, inventory management, and marketing."
                            },
                            {
                                question: "Do I need any technical skills to use sokoJunction?",
                                answer: "Not at all! sokoJunction is designed with user-friendliness in mind. Our intuitive interface and guided setup process allow you to launch a professional online store without writing a single line of code or needing prior technical expertise."
                            },
                            {
                                question: "Can I upgrade or downgrade my plan later?",
                                answer: "Absolutely. We understand that business needs evolve. You have the flexibility to upgrade or downgrade your sokoJunction plan at any time directly from your account dashboard, with no hidden contracts or penalties. We're here to support your growth journey."
                            },
                            {
                                question: "Is there a free trial or a free plan available?",
                                answer: "Yes! To help you get started risk-free and explore our platform's capabilities, our Starter plan is currently available for free. This allows you to set up your store and begin selling without any initial investment."
                            },
                            {
                                question: "What kind of customer support does sokoJunction offer?",
                                answer: "sokoJunction provides comprehensive customer support tailored to your plan. This includes standard email support for all users, priority support for advanced plans, and dedicated account management for our Pro users. Our knowledge base and community forums are also available 24/7."
                            },
                            {
                                question: "How does sokoJunction handle product shipping and logistics?",
                                answer: "sokoJunction integrates with various shipping carriers and offers flexible shipping rate options, including flat rates, weight-based rates, and free shipping. While we don't directly handle physical logistics, our platform provides the tools to manage your shipping process efficiently and connect with third-party logistics providers."
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
    );
}

export default FAQ;