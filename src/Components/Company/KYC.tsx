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
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";
import DocumentUploadZone from "./DocumentUploadZone";

const KYC: React.FC<YourChildProps> = ({
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
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleFrontChange = (file: File) => {
    setCompanyData({ ...companyData, id_front_image: file });
  };

  const handleFrontRemove = () => {
    setCompanyData({ ...companyData, id_front_image: null });
  };

  const handleBackChange = (file: File) => {
    setCompanyData({ ...companyData, id_back_image: file });
  };

  const handleBackRemove = () => {
    setCompanyData({ ...companyData, id_back_image: null });
  };

  const handleSubmit = async () => {
    if (!companyData?.id_number?.trim()) {
      toast.error("Please provide your National ID or Passport number");
      return;
    }

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
      toast.success("Identity verification details saved!");
      refetchCompany();
      if (triggerRerender) triggerRerender();
      nextStep();
    } catch (error) {
      toast.error("Failed to update verification details. Please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Section Header */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.01em" }}>
          Personal Identification (KYC)
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Verify the store owner&apos;s identity. SokoJunction safeguards all buyers and sellers by ensuring all merchants are verified.
        </Typography>
      </Box>

      {/* Security Banner */}
      <Alert
        icon={<LockOutlinedIcon fontSize="inherit" />}
        severity="info"
        sx={{
          borderRadius: "14px",
          bgcolor: alpha(theme.palette.info.main, 0.07),
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          "& .MuiAlert-message": { fontSize: "13px", lineHeight: 1.5 },
        }}
      >
        <strong>Confidential & 256-bit Encrypted:</strong> Your identification documents are strictly utilized for compliance and legal merchant payouts. They are never shared publicly.
      </Alert>

      {/* ID Number Field */}
      <TextField
        fullWidth
        required
        label="National ID or Passport Number"
        name="id_number"
        value={companyData?.id_number || ""}
        onChange={handleChange}
        placeholder="e.g. 12345678 or A0123456"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BadgeOutlinedIcon sx={{ color: theme.palette.primary.main }} />
            </InputAdornment>
          ),
          sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
        }}
        helperText="Enter your official Kenyan National ID number, Military ID, or Passport number"
      />

      {/* Upload Zones Grid */}
      <Grid container spacing={2.5}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <DocumentUploadZone
            label="ID Front Photo"
            helperText="Clear photo or scan showing your full name, photo, and ID number."
            value={companyData?.id_front_image || null}
            onChange={handleFrontChange}
            onRemove={handleFrontRemove}
            required
            accept="image/*,application/pdf"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <DocumentUploadZone
            label="ID Back Photo"
            helperText="Clear photo or scan of the back side with serial/barcode."
            value={companyData?.id_back_image || null}
            onChange={handleBackChange}
            onRemove={handleBackRemove}
            required
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

export default KYC;
