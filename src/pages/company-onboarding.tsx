import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  Skeleton,
  useTheme,
  LinearProgress,
  Chip,
  alpha,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { Suspense } from "react";
import Cookies from "js-cookie";
import { useUserLoginMutation, useUserRegistrationMutation, useGetCompanyQuery } from "@/Api/services";
import { z } from "zod";
import toast from "react-hot-toast";

// Step Components
import BasicInfo from "@/Components/Company/BasicInfo";
import KYC from "@/Components/Company/KYC";
import BusinessKYC from "@/Components/Company/BusinessKYC";
import ProofAddress from "@/Components/Company/ProofAddress";
import Branding from "@/Components/Company/Branding";
import TCs from "@/Components/Company/TCs";
import VerificationStatus from "@/Components/Company/VerificationStatus";

// Icons
import StorefrontIcon from "@mui/icons-material/Storefront";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BoltIcon from "@mui/icons-material/Bolt";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const steps = [
  "Authentication",
  "Basic Details",
  "Personal ID",
  "Business Reg",
  "Address",
  "Branding",
  "Terms & Agreement",
];

const stepIcons = [
  VpnKeyOutlinedIcon,
  StorefrontIcon,
  BadgeOutlinedIcon,
  BusinessOutlinedIcon,
  LocationOnOutlinedIcon,
  PaletteOutlinedIcon,
  GavelOutlinedIcon,
];

export default function CompanyOnboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState<any>(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        return JSON.parse(userCookie);
      } catch (error) {
        return null;
      }
    }
    return null;
  });
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setAuthToken(Cookies.get("access"));
  }, []);

  const [companyExists, setCompanyExists] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [login, { isLoading: isLoggingIn }] = useUserLoginMutation();
  const [register, { isLoading: isRegistering }] = useUserRegistrationMutation();
  const token = Cookies.get("access");
  const [refresh, setRefresh] = useState(0);
  const theme = useTheme();

  const triggerRerender = () => {
    setRefresh((prev) => prev + 1);
  };

  const {
    data: companyDetails,
    refetch: refetch_company_details,
    isLoading: loading_get_my_company,
    error: error_company_data,
  } = useGetCompanyQuery(token, { skip: !token });

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);

  const [companyData, setCompanyData] = useState<any>({
    name: "",
    description: "",
    logo_image: null,
    website: "",
    contact_email: "",
    contact_phone: "",
    id_number: "",
    id_front_image: null,
    id_back_image: null,
    business_registration_number: "",
    business_permit_image: null,
    tax_pin_number: "",
    tax_certificate_image: null,
    utility_bill_image: null,
    lease_agreement_image: null,
    postal_address: "",
    physical_address: "",
    country: "Kenya",
    city: "",
    state: "",
    postal_code: "",
    primary_color: theme.palette.primary.main,
    secondary_color: theme.palette.secondary?.main || "#EF5C2A",
    accent_color: "#F8FAFC",
    acceptTerms: false,
    company_onboarding_step: 1,
  });

  const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  useEffect(() => {
    const username = Cookies.get("username");
    if (username && token) {
      setUser(username);
      if (activeStep === 0) {
        setActiveStep(1);
      }
    } else {
      setActiveStep(0);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setActiveStep(0);
      return;
    }
    if (error_company_data && "status" in error_company_data && error_company_data.status === 404) {
      setActiveStep(1);
    } else if (companyDetails) {
      setCompanyData((prev: any) => ({
        ...prev,
        ...companyDetails,
      }));
      setCompanyExists(true);
      if (companyDetails.onboarding_complete) {
        setActiveStep(7);
      } else if (companyDetails.company_onboarding_step) {
        setActiveStep(Math.min(6, companyDetails.company_onboarding_step));
      }
    }
  }, [companyDetails, error_company_data, token]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    try {
      loginSchema.parse(loginData);
      const response = await login({ body: loginData });
      if (response.data) {
        const { access, refresh, user } = response.data;
        Cookies.set("access", access, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("refresh", refresh, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("username", user.username, { expires: 7, secure: false, sameSite: "Strict" });
        setAuthToken(access);
        setUser(user.username);
        toast.success("Welcome back! Login successful.");
        setActiveStep(1);
      } else {
        const err = response.error as any;
        toast.error(err?.data?.non_field_errors?.[0] || err?.data?.detail || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Invalid credentials");
    }
  };

  const registerUser = async () => {
    try {
      registerSchema.parse(registerData);
      const response = await register({ body: registerData });
      if (response.data) {
        const { access, refresh, user } = response.data;
        Cookies.set("access", access, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("refresh", refresh, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("username", user.username, { expires: 7, secure: false, sameSite: "Strict" });
        setAuthToken(access);
        setUser(user.username);
        toast.success("Account created successfully!");
        setActiveStep(1);
      } else {
        const err = response.error as any;
        const msg =
          err?.data?.email?.[0] ||
          err?.data?.username?.[0] ||
          err?.data?.password?.[0] ||
          "Registration failed";
        toast.error(msg);
      }
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Please fill all required fields correctly.");
    }
  };

  const nextStep = () => setActiveStep((prev) => Math.min(7, prev + 1));
  const prevStep = () => setActiveStep((prev) => Math.max(1, prev - 1));

  // Progress calculations
  const progressPercent = activeStep >= 7 ? 100 : Math.round((activeStep / 6) * 100);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 7 },
        px: { xs: 2, sm: 3 },
        bgcolor: "#f8fafc",
        backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.04)} 1px, transparent 1px), radial-gradient(${alpha(theme.palette.primary.main, 0.04)} 1px, #f8fafc 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      <Box sx={{ maxWidth: "860px", mx: "auto" }}>
        {/* Top Branding Banner */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.6, borderRadius: "20px", bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, mb: 1.5 }}>
            <StorefrontIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              SokoJunction Merchant Portal
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.025em",
              fontSize: { xs: "1.75rem", sm: "2.25rem" },
            }}
          >
            Merchant Onboarding & Setup
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", mt: 1, maxWidth: 540, mx: "auto" }}>
            Build your verified storefront, upload compliance documents, and reach thousands of buyers across Kenya.
          </Typography>
        </Box>

        {/* Main Card Container */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4, md: 5 },
            bgcolor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.05)",
          }}
        >
          {loading_get_my_company ? (
            <Box sx={{ py: 4 }}>
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: "12px" }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: "12px" }} />
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 3, borderRadius: "12px" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton variant="rectangular" width={100} height={44} sx={{ borderRadius: "12px" }} />
                <Skeleton variant="rectangular" width={140} height={44} sx={{ borderRadius: "12px" }} />
              </Box>
            </Box>
          ) : (
            <>
              {/* Overall Progress Header */}
              {activeStep < 7 && (
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Chip
                      label={`Step ${activeStep + 1} of ${steps.length}: ${steps[activeStep]}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                      {progressPercent}% Completed
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              )}

              {/* Desktop Stepper */}
              {activeStep < 7 && (
                <Box sx={{ display: { xs: "none", md: "block" }, mb: 4.5 }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => {
                      const isCompleted = activeStep > index;
                      const isActive = activeStep === index;
                      const StepIconComponent = stepIcons[index];

                      return (
                        <Step key={label} completed={isCompleted}>
                          <StepLabel
                            StepIconComponent={() => (
                              <Box
                                sx={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: isCompleted
                                    ? theme.palette.success.main
                                    : isActive
                                    ? theme.palette.primary.main
                                    : alpha(theme.palette.text.disabled, 0.15),
                                  color: isCompleted || isActive ? "#fff" : "text.secondary",
                                  boxShadow: isActive ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}` : "none",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {isCompleted ? (
                                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                                ) : (
                                  <StepIconComponent sx={{ fontSize: 18 }} />
                                )}
                              </Box>
                            )}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: isActive ? 800 : isCompleted ? 600 : 500,
                                color: isActive
                                  ? theme.palette.primary.main
                                  : isCompleted
                                  ? "text.primary"
                                  : "text.secondary",
                                fontSize: "11px",
                              }}
                            >
                              {label}
                            </Typography>
                          </StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </Box>
              )}

              {/* Step 0: Authentication (Login / Register) */}
              {activeStep === 0 && (
                <Box sx={{ maxWidth: 480, mx: "auto" }}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                      Merchant Account Setup
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                      Sign in or create a new merchant account to own and manage your digital storefront.
                    </Typography>
                  </Box>

                  {/* Tabs Switcher */}
                  <Box sx={{ bgcolor: "#f1f5f9", p: 0.5, borderRadius: "14px", mb: 3 }}>
                    <Tabs
                      value={tabIndex}
                      onChange={(_, val) => setTabIndex(val)}
                      variant="fullWidth"
                      sx={{
                        minHeight: 44,
                        "& .MuiTabs-indicator": { display: "none" },
                        "& .MuiTab-root": {
                          minHeight: 40,
                          borderRadius: "10px",
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: "14px",
                          color: "text.secondary",
                          "&.Mui-selected": {
                            bgcolor: "#ffffff",
                            color: theme.palette.primary.main,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          },
                        },
                      }}
                    >
                      <Tab label="Existing Merchant Login" />
                      <Tab label="Create New Account" />
                    </Tabs>
                  </Box>

                  {/* Login Form */}
                  {tabIndex === 0 && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                      <TextField
                        fullWidth
                        label="Username or Email"
                        name="username"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: "14px" },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPasswordLogin ? "text" : "password"}
                        value={loginData.password}
                        onChange={handleLoginChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPasswordLogin(!showPasswordLogin)} edge="end">
                                {showPasswordLogin ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: { borderRadius: "14px" },
                        }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={loginUser}
                        disabled={isLoggingIn}
                        sx={{
                          mt: 1,
                          py: 1.3,
                          borderRadius: "14px",
                          bgcolor: theme.palette.primary.main,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "15px",
                          textTransform: "none",
                          boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.28)}`,
                          "&:hover": { bgcolor: theme.palette.primary.dark },
                        }}
                      >
                        {isLoggingIn ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Sign In & Continue"}
                      </Button>
                    </Box>
                  )}

                  {/* Register Form */}
                  {tabIndex === 1 && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="e.g. jannestore"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: "14px" },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="janne@example.com"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: "14px" },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPasswordRegister ? "text" : "password"}
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        helperText="Minimum 6 characters"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPasswordRegister(!showPasswordRegister)} edge="end">
                                {showPasswordRegister ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: { borderRadius: "14px" },
                        }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={registerUser}
                        disabled={isRegistering}
                        sx={{
                          mt: 1,
                          py: 1.3,
                          borderRadius: "14px",
                          bgcolor: theme.palette.primary.main,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "15px",
                          textTransform: "none",
                          boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.28)}`,
                          "&:hover": { bgcolor: theme.palette.primary.dark },
                        }}
                      >
                        {isRegistering ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Create Account & Start Onboarding"}
                      </Button>
                    </Box>
                  )}

                  {/* Merchant Value Badges */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, pt: 3, borderTop: "1px solid #e2e8f0" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <BoltIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        Instant Storefront
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <PaymentsIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        Lipa Na M-Pesa
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <LocalShippingIcon sx={{ fontSize: 16, color: theme.palette.info.main }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        Nationwide Delivery
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Step 1: Basic Info */}
              {activeStep === 1 && (
                <BasicInfo
                  nextStep={nextStep}
                  prevStep={prevStep}
                  steps={steps}
                  activeStep={activeStep}
                  companyData={companyData}
                  setCompanyData={setCompanyData}
                  token={authToken}
                  companyExists={companyExists}
                  refetchCompany={refetch_company_details}
                  triggerRerender={triggerRerender}
                />
              )}

              {/* Step 2: Personal KYC */}
              {activeStep === 2 && (
                <KYC
                  nextStep={nextStep}
                  prevStep={prevStep}
                  steps={steps}
                  activeStep={activeStep}
                  companyData={companyData}
                  setCompanyData={setCompanyData}
                  token={authToken}
                  refetchCompany={refetch_company_details}
                  triggerRerender={triggerRerender}
                />
              )}

              {/* Step 3: Business KYC */}
              {activeStep === 3 && (
                <BusinessKYC
                  nextStep={nextStep}
                  prevStep={prevStep}
                  steps={steps}
                  activeStep={activeStep}
                  companyData={companyData}
                  setCompanyData={setCompanyData}
                  token={authToken}
                  refetchCompany={refetch_company_details}
                  triggerRerender={triggerRerender}
                />
              )}

              {/* Step 4: Proof of Address */}
              {activeStep === 4 && (
                <ProofAddress
                  nextStep={nextStep}
                  prevStep={prevStep}
                  steps={steps}
                  activeStep={activeStep}
                  companyData={companyData}
                  setCompanyData={setCompanyData}
                  token={authToken}
                  refetchCompany={refetch_company_details}
                  triggerRerender={triggerRerender}
                />
              )}

              {/* Step 5: Branding */}
              {activeStep === 5 && (
                <Suspense fallback={<CircularProgress />}>
                  <Branding
                    nextStep={nextStep}
                    prevStep={prevStep}
                    steps={steps}
                    activeStep={activeStep}
                    companyData={companyData}
                    setCompanyData={setCompanyData}
                    token={authToken}
                    refetchCompany={refetch_company_details}
                    triggerRerender={triggerRerender}
                  />
                </Suspense>
              )}

              {/* Step 6: Terms & Conditions */}
              {activeStep === 6 && (
                <TCs
                  nextStep={nextStep}
                  prevStep={prevStep}
                  steps={steps}
                  activeStep={activeStep}
                  companyData={companyData}
                  setCompanyData={setCompanyData}
                  token={authToken}
                  refetchCompany={refetch_company_details}
                  triggerRerender={triggerRerender}
                />
              )}

              {/* Step 7: Completion & Verification Status */}
              {activeStep === 7 && <VerificationStatus />}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}