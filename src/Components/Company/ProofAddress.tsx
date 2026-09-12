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
  alpha,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import PublicIcon from "@mui/icons-material/Public";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";
import DocumentUploadZone from "./DocumentUploadZone";

const ProofAddress: React.FC<YourChildProps> = ({
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

  const handleUtilityChange = (file: File) => {
    setCompanyData({ ...companyData, utility_bill_image: file });
  };

  const handleUtilityRemove = () => {
    setCompanyData({ ...companyData, utility_bill_image: null });
  };

  const handleLeaseChange = (file: File) => {
    setCompanyData({ ...companyData, lease_agreement_image: file });
  };

  const handleLeaseRemove = () => {
    setCompanyData({ ...companyData, lease_agreement_image: null });
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
      toast.success("Address and location details saved!");
      refetchCompany();
      if (triggerRerender) triggerRerender();
      nextStep();
    } catch (error) {
      toast.error("Failed to save address details. Please verify your inputs.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Section Header */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.01em" }}>
          Business Location & Proof of Address
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Specify your physical shop, office, or dispatch center. Courier partners rely on this for seamless package pickups.
        </Typography>
      </Box>

      {/* Address Form Fields */}
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Physical Business Address"
            name="physical_address"
            value={companyData?.physical_address || ""}
            onChange={handleChange}
            placeholder="e.g. 3rd Floor, Westlands Square, Ring Road Parklands"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
            helperText="Building, street, door or room number where orders are packaged"
          />
        </Grid>

        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="City / Town"
            name="city"
            value={companyData?.city || ""}
            onChange={handleChange}
            placeholder="e.g. Nairobi"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
          />
        </Grid>

        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="State / County"
            name="state"
            value={companyData?.state || ""}
            onChange={handleChange}
            placeholder="e.g. Nairobi County"
            InputProps={{
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
          />
        </Grid>

        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Postal Address"
            name="postal_address"
            value={companyData?.postal_address || ""}
            onChange={handleChange}
            placeholder="e.g. P.O. Box 45678"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MarkunreadMailboxOutlinedIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
          />
        </Grid>

        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Postal Code"
            name="postal_code"
            value={companyData?.postal_code || ""}
            onChange={handleChange}
            placeholder="e.g. 00100"
            InputProps={{
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
          />
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={companyData?.country || "Kenya"}
            onChange={handleChange}
            placeholder="Kenya"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PublicIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
          />
        </Grid>
      </Grid>

      {/* Address Document Uploads */}
      <Grid container spacing={2.5}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <DocumentUploadZone
            label="Utility Bill (Electricity/Water/Internet)"
            helperText="Recent bill within last 3 months with your business/registered name."
            value={companyData?.utility_bill_image || null}
            onChange={handleUtilityChange}
            onRemove={handleUtilityRemove}
            accept="image/*,application/pdf"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <DocumentUploadZone
            label="Lease Agreement / Tenancy Proof"
            helperText="Current lease agreement or property ownership proof."
            value={companyData?.lease_agreement_image || null}
            onChange={handleLeaseChange}
            onRemove={handleLeaseRemove}
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

export default ProofAddress;
