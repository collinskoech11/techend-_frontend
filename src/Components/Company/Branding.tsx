import React, { useState } from "react";
import { YourChildProps } from "@/Types";
import { useUpdateCompanyMutation } from "@/Api/services";
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
  Card,
  CardContent,
  Chip,
  alpha,
  TextField,
  InputAdornment,
} from "@mui/material";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import toast from "react-hot-toast";

interface PalettePreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  tag: string;
}

const PRESET_PALETTES: PalettePreset[] = [
  {
    name: "Soko Classic",
    primary: "#35408F",
    secondary: "#EF5C2A",
    accent: "#F8FAFC",
    tag: "Marketplace Default",
  },
  {
    name: "Cup Couture",
    primary: "#BE1E2D",
    secondary: "#18181B",
    accent: "#FFF1F2",
    tag: "Vibrant & Bold",
  },
  {
    name: "Emerald Trade",
    primary: "#059669",
    secondary: "#10B981",
    accent: "#ECFDF5",
    tag: "Fresh & Organic",
  },
  {
    name: "Royal Sapphire",
    primary: "#2563EB",
    secondary: "#F59E0B",
    accent: "#EFF6FF",
    tag: "Tech & Electronics",
  },
  {
    name: "Nairobi Sunset",
    primary: "#EA580C",
    secondary: "#2563EB",
    accent: "#FFF7ED",
    tag: "Fashion & Lifestyle",
  },
  {
    name: "Obsidian Minimal",
    primary: "#18181B",
    secondary: "#6366F1",
    accent: "#F4F4F5",
    tag: "Modern Luxury",
  },
];

const Branding: React.FC<YourChildProps> = ({
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

  const primaryColor = companyData?.primary_color || "#35408F";
  const secondaryColor = companyData?.secondary_color || "#EF5C2A";
  const accentColor = companyData?.accent_color || "#F8FAFC";

  const handleColorChange = (field: string, hexValue: string) => {
    setCompanyData({ ...companyData, [field]: hexValue });
  };

  const applyPreset = (preset: PalettePreset) => {
    setCompanyData({
      ...companyData,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
    });
    toast.success(`Applied ${preset.name} palette!`);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(companyData).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "boolean") {
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
      refetchCompany();
      if (triggerRerender) triggerRerender();
      toast.success("Branding palette saved!");
      nextStep();
    } catch (error) {
      toast.error("Failed to save branding colors.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Section Header */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.01em" }}>
          Storefront Branding & Visual Identity
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Personalize your shop colors. Your primary color themes your storefront navigation, secondary color highlights buttons, and accent color frames promotional badges.
        </Typography>
      </Box>

      {/* Preset Palettes */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <AutoAwesomeIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
            Curated Brand Themes (Click to Apply)
          </Typography>
        </Box>
        <Grid container spacing={1.5}>
          {PRESET_PALETTES.map((preset) => {
            const isSelected =
              primaryColor.toLowerCase() === preset.primary.toLowerCase() &&
              secondaryColor.toLowerCase() === preset.secondary.toLowerCase();

            return (
              <Grid item size={{ xs: 6, sm: 4 }} key={preset.name}>
                <Card
                  onClick={() => applyPreset(preset)}
                  sx={{
                    p: 1.5,
                    cursor: "pointer",
                    borderRadius: "14px",
                    border: `2px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.8)}`,
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.04) : alpha(theme.palette.background.paper, 0.7),
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.8, mb: 1 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: preset.primary, boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }} />
                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: preset.secondary, boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }} />
                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: preset.accent, border: "1px solid rgba(0,0,0,0.1)" }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", fontSize: "13px" }}>
                    {preset.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px" }}>
                    {preset.tag}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Custom Color Inputs & Live Preview */}
      <Grid container spacing={3} alignItems="flex-start">
        {/* Left: Custom Hex Selectors */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
              Fine-tune Hex Codes
            </Typography>

            {/* Primary Color */}
            <Box sx={{ p: 2, borderRadius: "14px", border: `1px solid ${alpha(theme.palette.divider, 0.8)}`, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}>
                  Primary Color (Header & Accents)
                </Typography>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handleColorChange("primary_color", e.target.value)}
                  style={{ width: 32, height: 32, borderRadius: "8px", border: "none", cursor: "pointer", background: "none" }}
                />
              </Box>
              <TextField
                fullWidth
                size="small"
                value={primaryColor}
                onChange={(e) => handleColorChange("primary_color", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ width: 18, height: 18, borderRadius: "4px", bgcolor: primaryColor, mr: 0.5 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "10px", fontFamily: "monospace", fontWeight: 700 },
                }}
              />
            </Box>

            {/* Secondary Color */}
            <Box sx={{ p: 2, borderRadius: "14px", border: `1px solid ${alpha(theme.palette.divider, 0.8)}`, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}>
                  Secondary Color (Buttons & CTAs)
                </Typography>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => handleColorChange("secondary_color", e.target.value)}
                  style={{ width: 32, height: 32, borderRadius: "8px", border: "none", cursor: "pointer", background: "none" }}
                />
              </Box>
              <TextField
                fullWidth
                size="small"
                value={secondaryColor}
                onChange={(e) => handleColorChange("secondary_color", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ width: 18, height: 18, borderRadius: "4px", bgcolor: secondaryColor, mr: 0.5 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "10px", fontFamily: "monospace", fontWeight: 700 },
                }}
              />
            </Box>

            {/* Accent Color */}
            <Box sx={{ p: 2, borderRadius: "14px", border: `1px solid ${alpha(theme.palette.divider, 0.8)}`, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}>
                  Accent / Surface Color
                </Typography>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => handleColorChange("accent_color", e.target.value)}
                  style={{ width: 32, height: 32, borderRadius: "8px", border: "none", cursor: "pointer", background: "none" }}
                />
              </Box>
              <TextField
                fullWidth
                size="small"
                value={accentColor}
                onChange={(e) => handleColorChange("accent_color", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ width: 18, height: 18, borderRadius: "4px", bgcolor: accentColor, mr: 0.5, border: "1px solid #ccc" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "10px", fontFamily: "monospace", fontWeight: 700 },
                }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Right: Live Interactive Storefront Preview */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 1.5 }}>
              Live Storefront Preview
            </Typography>

            <Box
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                bgcolor: "#fff",
              }}
            >
              {/* Mock Browser Header */}
              <Box sx={{ bgcolor: "#f1f5f9", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid #e2e8f0" }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
                <Box
                  sx={{
                    ml: 1,
                    px: 1.5,
                    py: 0.3,
                    borderRadius: "6px",
                    bgcolor: "#fff",
                    fontSize: "11px",
                    color: "#64748b",
                    fontFamily: "monospace",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  sokojunction.com/shop/{(companyData?.name || "my-shop").toLowerCase().replace(/\s+/g, "-")}
                </Box>
              </Box>

              {/* Mock Storefront Nav */}
              <Box
                sx={{
                  bgcolor: primaryColor,
                  color: "#fff",
                  px: 2.5,
                  py: 1.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background 0.3s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <StorefrontIcon sx={{ fontSize: 22 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
                    {companyData?.name || "Your Store"}
                  </Typography>
                </Box>
                <Chip
                  label="Verified"
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", height: 22, fontSize: "11px", fontWeight: 700 }}
                />
              </Box>

              {/* Mock Store Body */}
              <Box sx={{ p: 2.5, bgcolor: accentColor, minHeight: 180, transition: "background 0.3s ease" }}>
                <Typography variant="body2" sx={{ color: "#334155", fontWeight: 600, mb: 1.5 }}>
                  Featured Products
                </Typography>

                <Grid container spacing={2}>
                  {/* Mock Product 1 */}
                  <Grid item size={{ xs: 6 }}>
                    <Box sx={{ bgcolor: "#fff", borderRadius: "12px", p: 1.5, border: "1px solid #e2e8f0" }}>
                      <Box sx={{ height: 60, bgcolor: "#f8fafc", borderRadius: "8px", mb: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShoppingBagOutlinedIcon sx={{ color: "#94a3b8" }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: "block", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Handcrafted Item
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: primaryColor, mt: 0.3 }}>
                        Kes 1,850.00
                      </Typography>
                      <Box
                        sx={{
                          mt: 1,
                          py: 0.6,
                          textAlign: "center",
                          borderRadius: "8px",
                          bgcolor: secondaryColor,
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                        }}
                      >
                        Add to Cart
                      </Box>
                    </Box>
                  </Grid>

                  {/* Mock Product 2 */}
                  <Grid item size={{ xs: 6 }}>
                    <Box sx={{ bgcolor: "#fff", borderRadius: "12px", p: 1.5, border: "1px solid #e2e8f0" }}>
                      <Box sx={{ height: 60, bgcolor: "#f8fafc", borderRadius: "8px", mb: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShoppingBagOutlinedIcon sx={{ color: "#94a3b8" }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: "block", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Premium Collection
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: primaryColor, mt: 0.3 }}>
                        Kes 3,200.00
                      </Typography>
                      <Box
                        sx={{
                          mt: 1,
                          py: 0.6,
                          textAlign: "center",
                          borderRadius: "8px",
                          bgcolor: secondaryColor,
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                        }}
                      >
                        Add to Cart
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
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

export default Branding;
