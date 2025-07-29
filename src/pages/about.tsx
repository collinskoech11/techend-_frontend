import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info"; // Icon for About
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"; // Icon for Mission
import PolicyIcon from "@mui/icons-material/Policy"; // Icon for Policies
import PeopleIcon from "@mui/icons-material/People"; // Icon for Community

// --- Color Palette (Consistent with your project) ---
const lightGray = "#f8f8f8"; // Page background
const mediumGray = "#e0e0e0"; // Borders/dividers
const darkText = "#212121"; // Main headings and strong text
const lightText = "#555555"; // Body text

// --- Styled Components ---

const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  padding: theme.spacing(6), // Increased padding for more breathing room
  marginBottom: theme.spacing(8), // Space between sections
  "&:last-child": {
    marginBottom: 0,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(5),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "clamp(2.2rem, 4vw, 3.2rem)", // Responsive title size
  fontWeight: 800,
  color: darkText,
  textAlign: "center",
  marginBottom: theme.spacing(6), // More space below title
  position: "relative",
  "&::after": { // Underline effect for titles
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: '-10px',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2px',
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    fontSize: 'clamp(2.5rem, 4.5vw, 3.5rem)',
    color: theme.palette.primary.main,
  }
}));

const Subheading = styled(Typography)(({ theme }) => ({
  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
  fontWeight: 700,
  color: darkText,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const BodyText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  lineHeight: 1.7,
  color: lightText,
  marginBottom: theme.spacing(2),
}));

const ContactInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
    fontSize: "2rem",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: lightGray,
  borderRadius: "8px",
  marginBottom: theme.spacing(1),
  "&:hover": {
    backgroundColor: mediumGray,
  },
  "& .MuiAccordionSummary-content": {
    margin: `${theme.spacing(1.5)} 0 !important`, // Adjust internal padding
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  border: `1px solid ${mediumGray}`,
  borderTop: "none",
  borderRadius: "0 0 8px 8px",
  marginTop: "-8px", // Overlap with summary border-radius
}));


function AboutPage() {
  const theme = useTheme();
  return (
    // Assuming PageContainer from root layout wraps this component
    <Container maxWidth="lg" sx={{ py: 8 }}>

      {/* About Section */}
      <SectionWrapper>
        <SectionTitle><InfoIcon /> About iMall</SectionTitle>
        <BodyText sx={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 4 }}>
          Welcome to **iMall**, your premier destination for building and growing successful online businesses. We believe in empowering entrepreneurs and small-to-medium enterprises (SMEs) with cutting-edge eCommerce solutions that are powerful, intuitive, and designed for scalability.
        </BodyText>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Subheading>Our Story</Subheading>
            <BodyText>
              Founded in 2023, iMall emerged from a passion for simplifying the complexities of online retail. We saw a gap in the market for a platform that truly understood the needs of growing businesses – offering robust features without the prohibitive costs or steep learning curves. Our journey began with a commitment to democratize eCommerce, making it accessible and profitable for everyone.
            </BodyText>
          </Grid>
          <Grid item xs={12} md={6}>
            <Subheading>What We Offer</Subheading>
            <BodyText>
              iMall provides an all-in-one suite of tools including customizable storefronts, secure payment gateways, comprehensive inventory management, advanced analytics, and integrated marketing features. Our platform is built on a foundation of innovation, security, and exceptional user experience, ensuring that you have everything you need to thrive in the digital marketplace.
            </BodyText>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Our Mission Section */}
      <SectionWrapper>
        <SectionTitle><RocketLaunchIcon /> Our Mission</SectionTitle>
        <BodyText sx={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 4 }}>
          Our mission at iMall is to **empower businesses of all sizes to achieve their fullest potential in the digital realm.** We are dedicated to providing an innovative, reliable, and user-friendly eCommerce platform that not only simplifies online selling but also accelerates growth and fosters sustainable success.
        </BodyText>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>Innovation</Typography>
            <BodyText>Constantly evolving our technology to provide the best tools and features.</BodyText>
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>Accessibility</Typography>
            <BodyText>Making powerful eCommerce solutions affordable and easy to use for everyone.</BodyText>
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>Growth</Typography>
            <BodyText>Committed to helping our users scale their businesses and reach new heights.</BodyText>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Contact Us Section */}
      <SectionWrapper>
        <SectionTitle>Contact Us</SectionTitle>
        <BodyText sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto', mb: 4 }}>
          We're here to help! Whether you have a question, need support, or just want to chat, feel free to reach out to our team.
        </BodyText>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <ContactInfoItem>
              <EmailIcon />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Email Support</Typography>
                <Typography variant="body1" color={lightText}>support@imall.com</Typography>
              </Box>
            </ContactInfoItem>
          </Grid>
          <Grid item xs={12} md={4}>
            <ContactInfoItem>
              <PhoneIcon />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Phone</Typography>
                <Typography variant="body1" color={lightText}>+1 (555) 123-4567</Typography>
              </Box>
            </ContactInfoItem>
          </Grid>
          <Grid item xs={12} md={4}>
            <ContactInfoItem>
              <LocationOnIcon />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Address</Typography>
                <Typography variant="body1" color={lightText}>123 eCommerce Blvd, Suite 400, Digital City, TX 78701</Typography>
              </Box>
            </ContactInfoItem>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.dark },
                    padding: '12px 30px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                href="mailto:support@imall.com"
            >
                Send Us an Email
            </Button>
        </Box>
      </SectionWrapper>

      {/* Community Guidelines Section */}
      <SectionWrapper>
        <SectionTitle><PeopleIcon /> Community Guidelines</SectionTitle>
        <BodyText sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto', mb: 4 }}>
          Our community thrives on respect and integrity. These guidelines are designed to ensure a safe and positive environment for all iMall users.
        </BodyText>

        <Accordion sx={{ boxShadow: 'none', border: `1px solid ${mediumGray}`, borderRadius: '8px', mb: 2 }}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Respectful Conduct</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BodyText>
              Treat all members of the iMall community with respect. Harassment, discrimination, hate speech, or any form of abuse will not be tolerated. Engage in constructive dialogue and maintain professionalism in all interactions.
            </BodyText>
          </StyledAccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 'none', border: `1px solid ${mediumGray}`, borderRadius: '8px', mb: 2 }}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Authenticity & Transparency</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BodyText>
              Ensure all information you provide, including product listings and business details, is accurate and truthful. Avoid misleading practices, false advertising, or misrepresentation. Transparency builds trust.
            </BodyText>
          </StyledAccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 'none', border: `1px solid ${mediumGray}`, borderRadius: '8px', mb: 2 }}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Legal Compliance</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BodyText>
              All activities on iMall must comply with applicable local, national, and international laws and regulations. This includes laws related to consumer protection, intellectual property, data privacy, and taxation.
            </BodyText>
          </StyledAccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 'none', border: `1px solid ${mediumGray}`, borderRadius: '8px' }}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4a-content" id="panel4a-header">
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Safe & Secure Practices</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BodyText>
              Do not engage in any activity that could compromise the security or integrity of the iMall platform or its users' data. Report any suspicious activity or vulnerabilities immediately.
            </BodyText>
          </StyledAccordionDetails>
        </Accordion>
      </SectionWrapper>

      {/* Terms & Conditions Section */}
      <SectionWrapper>
        <SectionTitle><PolicyIcon /> Terms & Conditions</SectionTitle>
        <BodyText sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto', mb: 4 }}>
          By using iMall, you agree to abide by these terms. Please read them carefully.
        </BodyText>

        <Accordion sx={{ boxShadow: 'none', border: `1px solid ${mediumGray}`, borderRadius: '8px', mb: 2 }}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="terms-panel1a-content" id="terms-panel1a-header">
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Acceptance of Terms</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BodyText>
              By accessing or using the iMall platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
            </BodyText>
          </StyledAccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 'none', border: `1px solid ${mediumGray}`, borderRadius: '8px', mb: 2 }}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="terms-panel2a-content" id="terms-panel2a-header">
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>User Accounts</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BodyText>
              To access certain features of iMall, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </BodyText>
          </StyledAccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 'none', border: `1px solid ${mediumGray}`, borderRadius: '8px', mb: 2 }}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="terms-panel3a-content" id="terms-panel3a-header">
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Intellectual Property</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BodyText>
              All content on iMall, including text, graphics, logos, images, and software, is the property of iMall or its content suppliers and protected by international copyright laws. You may not reproduce, distribute, or create derivative works from any content without explicit permission.
            </BodyText>
          </StyledAccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 'none', border: `1px solid ${mediumGray}`, borderRadius: '8px' }}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="terms-panel4a-content" id="terms-panel4a-header">
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkText }}>Limitation of Liability</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BodyText>
              iMall will not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from the use or the inability to use the service.
            </BodyText>
          </StyledAccordionDetails>
        </Accordion>
      </SectionWrapper>
    </Container>
  );
}

export default AboutPage;