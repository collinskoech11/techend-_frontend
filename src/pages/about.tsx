import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PolicyIcon from "@mui/icons-material/Policy";
import PeopleIcon from "@mui/icons-material/People";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";



// --- Color Palette ---
const darkText = "#18181b";
const lightText = "#71717a";

// --- Styled Components ---
const HeroWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

const SectionWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  border: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
  padding: theme.spacing(5),
  marginBottom: theme.spacing(6),
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    boxShadow: "0 12px 36px rgba(0,0,0,0.04)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    borderRadius: "16px",
    marginBottom: theme.spacing(4),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.8rem",
  fontWeight: 800,
  color: darkText,
  marginBottom: theme.spacing(4),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  "& .MuiSvgIcon-root": {
    fontSize: "2rem",
    color: theme.palette.primary.main,
  },
}));

const CardMetric = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3.5),
  borderRadius: "18px",
  backgroundColor: "#fbfbfb",
  border: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
  textAlign: "center",
  height: "100%",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: "#ffffff",
    borderColor: theme.palette.primary.main,
    transform: "translateY(-4px)",
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.05)}`,
  },
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  height: "100%",
  transition: "all 0.2s",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    transform: "translateY(-3px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  borderRadius: "14px !important",
  marginBottom: theme.spacing(2),
  overflow: "hidden",
  "&::before": {
    display: "none",
  },
  "&.Mui-expanded": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.03)}`,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "#fbfbfb",
  padding: theme.spacing(1, 2.5),
  "&.Mui-expanded": {
    backgroundColor: "#ffffff",
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  },
}));

function AboutPage() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa", pb: 12 }}>
      {/* Premium Hero Section */}
      <HeroWrapper>
        <Container maxWidth="md">
          <Chip 
            label="Empowering Digital Commerce" 
            variant="outlined" 
            sx={{ 
              borderRadius: "30px", 
              fontWeight: 700, 
              color: theme.palette.primary.main, 
              borderColor: alpha(theme.palette.primary.main, 0.3),
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              mb: 3,
              px: 1
            }} 
          />
          <Typography variant="h1" sx={{ fontWeight: 900, color: darkText, fontSize: { xs: "2.5rem", md: "3.6rem" }, mb: 2, letterSpacing: "-0.02em" }}>
            About sokoJunction
          </Typography>
          <Typography variant="h5" sx={{ color: lightText, fontWeight: 500, lineHeight: 1.6, maxW: "700px", mx: "auto", fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
            We build simple, powerful, and scalable tools that empower local entrepreneurs and businesses to establish their digital storefronts and thrive in the global marketplace.
          </Typography>
        </Container>
      </HeroWrapper>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          
          {/* Brand Identity / Story Section */}
          <SectionWrapper>
            <SectionTitle><InfoIcon /> Our Story & Offer</SectionTitle>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: darkText, mb: 1.5 }}>
                  The Journey
                </Typography>
                <Typography variant="body1" sx={{ color: lightText, lineHeight: 1.7, mb: 2 }}>
                  Founded in 2023, sokoJunction emerged from a passion for simplifying the complexities of online retail. We saw a gap in the market for a platform that truly understood the needs of growing businesses — offering robust, premium features without prohibitive costs or steep technical learning curves.
                </Typography>
                <Typography variant="body1" sx={{ color: lightText, lineHeight: 1.7 }}>
                  Our journey began with a simple commitment: democratize eCommerce. We aim to make setting up an online business accessible, profitable, and smooth for everyone.
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: darkText, mb: 1.5 }}>
                  What We Offer
                </Typography>
                <Typography variant="body1" sx={{ color: lightText, lineHeight: 1.7, mb: 2 }}>
                  sokoJunction provides a comprehensive suite of digital merchant tools. Our platform includes customizable storefronts, secure payment integrations (such as instant M-Pesa STK push and Card billing), detailed inventory controls, advanced analytics, and integrated delivery systems.
                </Typography>
                <Typography variant="body1" sx={{ color: lightText, lineHeight: 1.7 }}>
                  Built on a modern stack emphasizing security, efficiency, and exceptional UX, we handle the complexity so you can focus on building your brand.
                </Typography>
              </Box>
            </Box>
          </SectionWrapper>

          {/* Mission & Core Values */}
          <SectionWrapper>
            <SectionTitle><RocketLaunchIcon /> Our Core Mission</SectionTitle>
            <Typography variant="body1" sx={{ color: lightText, lineHeight: 1.7, mb: 4, maxW: "750px" }}>
              Our mission is to empower businesses of all sizes to achieve their absolute potential in the digital realm. We strive to provide an innovative, reliable, and user-friendly platform that catalyzes growth and simplifies the daily operations of local merchants.
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 3 }}>
              <CardMetric>
                <RocketLaunchIcon sx={{ fontSize: "2.5rem", color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: darkText, mb: 1 }}>
                  Innovation
                </Typography>
                <Typography variant="body2" sx={{ color: lightText, lineHeight: 1.6 }}>
                  Constantly evolving our technology and endpoints to keep your storefront fast, secure, and modern.
                </Typography>
              </CardMetric>

              <CardMetric>
                <HandshakeIcon sx={{ fontSize: "2.5rem", color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: darkText, mb: 1 }}>
                  Accessibility
                </Typography>
                <Typography variant="body2" sx={{ color: lightText, lineHeight: 1.6 }}>
                  Making premium eCommerce tools affordable and easy to use without requiring coding or complex setups.
                </Typography>
              </CardMetric>

              <CardMetric>
                <LocalActivityIcon sx={{ fontSize: "2.5rem", color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: darkText, mb: 1 }}>
                  Merchant Growth
                </Typography>
                <Typography variant="body2" sx={{ color: lightText, lineHeight: 1.6 }}>
                  Dedicated support, local payment channels (Kes), and tools designed to help you expand your customer reach.
                </Typography>
              </CardMetric>
            </Box>
          </SectionWrapper>

          {/* Guidelines Section */}
          <SectionWrapper>
            <SectionTitle><PeopleIcon /> Community Guidelines</SectionTitle>
            <Typography variant="body1" sx={{ color: lightText, mb: 4 }}>
              SokoJunction thrives on trust, transparency, and respect. Our community guidelines ensure a safe, reliable, and successful environment for both buyers and sellers.
            </Typography>

            <StyledAccordion>
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: darkText }}>Respectful Conduct</Typography>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ p: 3, backgroundColor: "#ffffff" }}>
                <Typography variant="body2" sx={{ color: lightText, lineHeight: 1.7 }}>
                  Treat all members of the sokoJunction community with dignity. Harassment, discrimination, hate speech, or abuse will not be tolerated. Engage in constructive discussions and maintain professional ethics.
                </Typography>
              </AccordionDetails>
            </StyledAccordion>

            <StyledAccordion>
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: darkText }}>Authenticity & Transparency</Typography>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ p: 3, backgroundColor: "#ffffff" }}>
                <Typography variant="body2" sx={{ color: lightText, lineHeight: 1.7 }}>
                  Ensure all details provided in your product listings, company profile, and store catalog are accurate and up to date. Avoid misleading ads or deceptive selling methods. Transparency builds buyer loyalty.
                </Typography>
              </AccordionDetails>
            </StyledAccordion>

            <StyledAccordion>
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: darkText }}>Safe & Secure Transactions</Typography>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ p: 3, backgroundColor: "#ffffff" }}>
                <Typography variant="body2" sx={{ color: lightText, lineHeight: 1.7 }}>
                  Merchants must utilize safe billing endpoints and fulfill orders as agreed. Buyers are encouraged to complete M-Pesa STK prompts securely. Report any suspicious behavior or payment issues immediately to customer service.
                </Typography>
              </AccordionDetails>
            </StyledAccordion>
          </SectionWrapper>

          {/* Terms & Policies */}
          <SectionWrapper>
            <SectionTitle><PolicyIcon /> Terms & Policies</SectionTitle>
            <Typography variant="body1" sx={{ color: lightText, mb: 4 }}>
              Please review our primary platform terms. By creating a store or placing an order on sokoJunction, you agree to these policies.
            </Typography>

            <StyledAccordion>
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: darkText }}>User Accounts & Shop Ownership</Typography>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ p: 3, backgroundColor: "#ffffff" }}>
                <Typography variant="body2" sx={{ color: lightText, lineHeight: 1.7 }}>
                  Merchants are responsible for maintaining the confidentiality of their credentials and all operations carried out in their storefronts. You are responsible for ensuring that your products comply with local trade laws.
                </Typography>
              </AccordionDetails>
            </StyledAccordion>

            <StyledAccordion>
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: darkText }}>Limitation of Liability</Typography>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ p: 3, backgroundColor: "#ffffff" }}>
                <Typography variant="body2" sx={{ color: lightText, lineHeight: 1.7 }}>
                  sokoJunction functions as a facilitator of digital commerce. We are not directly liable for disputes arising between individual buyers and sellers, though we provide verification badges (KYC) to protect community trust.
                </Typography>
              </AccordionDetails>
            </StyledAccordion>
          </SectionWrapper>

          {/* Contact Section */}
          <SectionWrapper>
            <SectionTitle>Get In Touch</SectionTitle>
            <Typography variant="body1" sx={{ color: lightText, mb: 4, textAlign: "center" }}>
              Have questions, feedback, or need help setting up your store? Contact our customer support team.
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 3, mb: 4 }}>
              <ContactCard>
                <EmailIcon color="primary" sx={{ fontSize: "2.5rem", mb: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: darkText, mb: 0.5 }}>
                  Email Support
                </Typography>
                <Typography variant="body2" sx={{ color: lightText }}>
                  sokojunction@gmail.com
                </Typography>
              </ContactCard>

              <ContactCard>
                <PhoneIcon color="primary" sx={{ fontSize: "2.5rem", mb: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: darkText, mb: 0.5 }}>
                  Phone Support
                </Typography>
                <Typography variant="body2" sx={{ color: lightText }}>
                  +254 (703) 508-881
                </Typography>
              </ContactCard>

              <ContactCard>
                <LocationOnIcon color="primary" sx={{ fontSize: "2.5rem", mb: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: darkText, mb: 0.5 }}>
                  Our Location
                </Typography>
                <Typography variant="body2" sx={{ color: lightText }}>
                  Nairobi, Kenya
                </Typography>
              </ContactCard>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                href="mailto:sokojunction@gmail.com"
                sx={{
                  borderRadius: "12px",
                  fontWeight: 800,
                  textTransform: "none",
                  px: 5,
                  py: 1.5,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                }}
              >
                Send Us an Email
              </Button>
            </Box>
          </SectionWrapper>

        </Box>
      </Container>
    </Box>
  );
}

export default AboutPage;