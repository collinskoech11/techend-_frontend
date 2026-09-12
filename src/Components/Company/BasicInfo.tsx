import React from "react";
import { YourChildProps } from "@/Types";
import { useCreateCompanyMutation, useUpdateCompanyMutation } from "@/Api/services";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  useTheme,
  Grid,
  Typography,
  InputAdornment,
  Chip,
  alpha,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinkIcon from "@mui/icons-material/Link";
import toast from "react-hot-toast";
import DocumentUploadZone from "./DocumentUploadZone";

const BasicInfo: React.FC<YourChildProps> = ({
  nextStep,
  prevStep,
  activeStep,
  companyData,
  setCompanyData,
  token,
  companyExists,
  refetchCompany,
  triggerRerender,
}) => {
  const [createCompany, { isLoading: isLoadingCreate }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isLoadingUpdate }] = useUpdateCompanyMutation();
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "website" && value && !/^https?:\/\//i.test(value)) {
      updatedValue = `https://${value}`;
    }

    setCompanyData({
      ...companyData,
      [name]: updatedValue,
    });
  };

  const handleLogoChange = (file: File) => {
    setCompanyData({ ...companyData, logo_image: file });
  };

  const handleLogoRemove = () => {
    setCompanyData({ ...companyData, logo_image: null });
  };

  const storeSlug = (companyData?.name || "your-store")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    if (!companyData?.name?.trim()) {
      toast.error("Please enter a company or store name");
      return;
    }
    if (!companyData?.contact_email?.trim()) {
      toast.error("Please provide a contact email");
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
      if (!companyExists) {
        await createCompany({ token, body: formData }).unwrap();
        toast.success("Storefront details created!");
      } else {
        await updateCompany({ token, body: formData }).unwrap();
        toast.success("Storefront details saved!");
      }
      refetchCompany();
      if (triggerRerender) triggerRerender();
      nextStep();
    } catch (error) {
      toast.error("Failed to save company details. Please verify your inputs.");
    }
  };

  const isSaving = isLoadingCreate || isLoadingUpdate;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Section Header */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.01em" }}>
          Storefront Profile & Contact Details
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Enter your shop branding and contact details. Customers and courier partners will see this information on order receipts.
        </Typography>
      </Box>

      {/* Store Logo Upload Dropzone */}
      <DocumentUploadZone
        label="Storefront Logo"
        helperText="Upload your official brand logo. Transparent PNG or SVG recommended (Square, min 200x200px)."
        value={companyData?.logo_image || null}
        onChange={handleLogoChange}
        onRemove={handleLogoRemove}
        isAvatar={true}
        accept="image/*"
      />

      {/* Form Fields */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <TextField
            fullWidth
            required
            label="Store / Business Name"
            name="name"
            value={companyData?.name || ""}
            onChange={handleChange}
            placeholder="e.g. The Cup Couture"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StorefrontIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
            }}
          />
          {companyData?.name && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, px: 0.5 }}>
              <LinkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Storefront URL:
              </Typography>
              <Chip
                label={`sokojunction.com/shop/${storeSlug}`}
                size="small"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  height: 22,
                }}
              />
            </Box>
          )}
        </Box>

        <TextField
          fullWidth
          label="Store Description & Bio"
          name="description"
          value={companyData?.description || ""}
          onChange={handleChange}
          multiline
          rows={3}
          placeholder="Briefly tell customers what you sell, your specialties, and shipping locations..."
          InputProps={{
            sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
          }}
          helperText="Appears on your store header and search previews"
        />

        <TextField
          fullWidth
          label="Website URL (Optional)"
          name="website"
          value={companyData?.website || ""}
          onChange={handleChange}
          placeholder="https://cupcoutureshop.com"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LanguageIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
          }}
        />

        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Contact Email"
              name="contact_email"
              value={companyData?.contact_email || ""}
              onChange={handleChange}
              type="email"
              placeholder="orders@cupcouture.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
              }}
              helperText="For order notifications & billing"
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Contact Phone"
              name="contact_phone"
              value={companyData?.contact_phone || ""}
              onChange={handleChange}
              placeholder="+254 700 000 000"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: alpha(theme.palette.background.paper, 0.8) },
              }}
              helperText="For customer inquiries & courier dispatch"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Navigation Footer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}>
        {activeStep > 1 ? (
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
        ) : (
          <Box />
        )}

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSaving}
          endIcon={!isSaving && <ArrowForwardIcon />}
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
          {isSaving ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Save & Continue"}
        </Button>
      </Box>
    </Box>
  );
};

export default BasicInfo;
