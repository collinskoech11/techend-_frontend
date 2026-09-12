import React from "react";
import { YourChildProps } from "@/Types";
import { useUpdateCompanyMutation } from "@/Api/services";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  useTheme,
  Typography,
  Grid,
  InputAdornment,
  Alert,
  alpha,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import toast from "react-hot-toast";
import DocumentUploadZone from "./DocumentUploadZone";

const BusinessKYC: React.FC<YourChildProps> = ({
  nextStep,
  prevStep,
  activeStep,
  companyData,
  setCompanyData,
  token,
  refetchCompany,
  triggerRerender,
}) => {
  const [updateCompany, { isLoading }] = useUpdateCompanyMutation();
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: name === "tax_pin_number" ? value.toUpperCase() : value,
    });
  };

  const handlePermitChange = (file: File) => {
    setCompanyData({ ...companyData, business_permit_image: file });
  };

  const handlePermitRemove = () => {
    setCompanyData({ ...companyData, business_permit_image: null });
  };

  const handleTaxCertChange = (file: File) => {
    setCompanyData({ ...companyData, tax_certificate_image: file });
  };

  const handleTaxCertRemove = () => {
    setCompanyData({ ...companyData, tax_certificate_image: null });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(companyData).forEach(([key, value]) => {
      if (value instanceof File || typeof value === "string" || typeof value === "boolean") {
        formData.append(key, value as any);
      }
    });
    formData.append("company_onboarding_step", (activeStep + 1).toString());

    try {
      await updateCompany({
        token,
        id: (companyData as any).id,
        body: formData,
      }).unwrap();
      toast.success("Business verification details saved!");
      refetchCompany();
      if (triggerRerender) triggerRerender();
      nextStep();
    } catch (error) {
      toast.error("Failed to save business details. Please check your inputs.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Section Header */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.01em" }}>
          Business Verification & Tax Compliance
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Provide your enterprise registration details and Kenya Revenue Authority (KRA) tax credentials.
        </Typography>
      </Box>

      {/* Verification Callout */}
      <Alert
        icon={<VerifiedUserOutlinedIcon fontSize="inherit" />}
        severity="success"
        sx={{
          borderRadius: "14px",
          bgcolor: alpha(theme.palette.success.main, 0.08),
          border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
          "& .MuiAlert-message": { fontSize: "13px", lineHeight: 1.5 },
        }}
      >
        <strong>Verified Merchant Status:</strong> Stores with verified business permits and KRA PIN certificates receive the <strong>Verified Merchant</strong> badge, boosting buyer confidence and conversion by up to 40%.
      </Alert>

      {/* Registration Numbers Grid */}
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Business Reg / Incorporation Number"
            name="business_registration_number"
            value={companyData?.business_registration_number || ""}
            onChange={handleChange}
            placeholder="e.g. BN-X7Y8Z9 or CPR/2023/12345"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
            helperText="From your BRS Certificate of Registration"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="KRA Tax PIN Number"
            name="tax_pin_number"
            value={companyData?.tax_pin_number || ""}
            onChange={handleChange}
            placeholder="e.g. P051234567Z or A012345678X"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ReceiptLongIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
            helperText="11 characters (A/P followed by 9 digits and 1 letter)"
          />
        </Grid>
      </Grid>

      {/* Document Uploads Grid */}
      <Grid container spacing={2.5}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <DocumentUploadZone
            label="Business Permit / Registration"
            helperText="County Single Business Permit or BRS Incorporation Certificate."
            value={companyData?.business_permit_image || null}
            onChange={handlePermitChange}
            onRemove={handlePermitRemove}
            accept="image/*,application/pdf"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <DocumentUploadZone
            label="KRA PIN / Tax Certificate"
            helperText="KRA PIN Certificate or Tax Compliance Certificate (TCC)."
            value={companyData?.tax_certificate_image || null}
            onChange={handleTaxCertChange}
            onRemove={handleTaxCertRemove}
            accept="image/*,application/pdf"
          />
        </Grid>
      </Grid>

      {/* Navigation Footer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}>
        <Button
          variant="outlined"
          onClick={prevStep}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            color: "text.secondary",
            borderColor: alpha(theme.palette.divider, 0.8),
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          endIcon={!isLoading && <ArrowForwardIcon />}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            borderRadius: "12px",
            px: 4,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "15px",
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.28)}`,
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
              boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Save & Continue"}
        </Button>
      </Box>
    </Box>
  );
};

export default BusinessKYC;
