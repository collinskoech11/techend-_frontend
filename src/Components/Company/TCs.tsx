import React from "react";
import { YourChildProps } from "@/Types";
import { useUpdateCompanyMutation } from "@/Api/services";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  useTheme,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  alpha,
} from "@mui/material";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import toast from "react-hot-toast";

const TCs: React.FC<YourChildProps> = ({
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyData({ ...companyData, acceptTerms: e.target.checked });
  };

  const handleSubmit = async () => {
    if (!companyData.acceptTerms) {
      toast.error("Please accept the Terms & Conditions to proceed.");
      return;
    }

    const formData = new FormData();
    Object.entries(companyData).forEach(([key, value]) => {
      if (value instanceof File || typeof value === "string" || typeof value === "boolean") {
        formData.append(key, value as any);
      }
    });
    formData.append("company_onboarding_step", (activeStep + 1).toString());
    formData.append("onboarding_complete", "true");

    try {
      await updateCompany({
        token,
        id: (companyData as any).id,
        body: formData,
      }).unwrap();
      toast.success("Merchant application submitted successfully!");
      refetchCompany();
      if (triggerRerender) triggerRerender();
      nextStep();
    } catch (error) {
      toast.error("Failed to submit application. Please check your connection.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Section Header */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.01em" }}>
          Merchant Agreement & Service Terms
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Please review the merchant code of conduct and marketplace terms to finalize your store application.
        </Typography>
      </Box>

      {/* Key Merchant Commitments Cards */}
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <Card sx={{ p: 2, borderRadius: "14px", border: `1px solid ${alpha(theme.palette.divider, 0.8)}`, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <LocalShippingOutlinedIcon sx={{ color: theme.palette.primary.main, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Prompt Order Dispatch
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Commit to fulfilling verified customer orders within 24 to 48 hours to maintain high merchant ratings.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6 }}>
          <Card sx={{ p: 2, borderRadius: "14px", border: `1px solid ${alpha(theme.palette.divider, 0.8)}`, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  100% Genuine Merchandise
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Only list original, authentic products adhering to Kenyan consumer safety and trade standards.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6 }}>
          <Card sx={{ p: 2, borderRadius: "14px", border: `1px solid ${alpha(theme.palette.divider, 0.8)}`, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <PaymentsOutlinedIcon sx={{ color: theme.palette.info.main, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Transparent Pricing & Kes Settlements
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Receive prompt automated settlements in Kes directly to your Lipa Na M-Pesa till or business paybill.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6 }}>
          <Card sx={{ p: 2, borderRadius: "14px", border: `1px solid ${alpha(theme.palette.divider, 0.8)}`, bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <SecurityOutlinedIcon sx={{ color: theme.palette.secondary.main, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Data Privacy (KDPA)
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Safeguard buyer shipping addresses and phone contacts strictly for order fulfillment.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Scrollable Terms Text Container */}
      <Box
        sx={{
          maxHeight: 220,
          overflowY: "auto",
          p: 2.5,
          borderRadius: "14px",
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          fontSize: "13px",
          lineHeight: 1.6,
          color: "text.secondary",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
          SokoJunction Marketplace Merchant Code of Conduct
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: "13px" }}>
          1. <strong>Accuracy of Information:</strong> The merchant warrants that all business credentials, permits, tax information, and product listings uploaded to SokoJunction are truthful, valid, and up to date.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: "13px" }}>
          2. <strong>Lawful Commerce:</strong> The merchant agrees to comply with all laws of the Republic of Kenya, including tax obligations with the Kenya Revenue Authority (KRA) and consumer protection statutes.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: "13px" }}>
          3. <strong>Platform Fees & Billing:</strong> Monthly subscription plans and transaction tiers are billed in Kes. Subscriptions renew on a 30-day billing cycle. Detailed invoice records are maintained in your Merchant Portal.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: "13px" }}>
          4. <strong>Customer Protection:</strong> Counterfeit goods, duplicate deceptive listings, or unauthorized brand replication will result in immediate shop suspension and forfeiture of escrow funds.
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "13px" }}>
          5. <strong>Accountability:</strong> Store credentials must be safeguarded. Any orders dispatched through your shop portal remain the legal responsibility of the registered merchant entity.
        </Typography>
      </Box>

      {/* Accept Checkbox */}
      <Box sx={{ p: 2, borderRadius: "14px", bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={companyData.acceptTerms || false}
              onChange={handleCheckboxChange}
              sx={{ color: theme.palette.primary.main, "&.Mui-checked": { color: theme.palette.primary.main } }}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
              I have read, understood, and agree to the SokoJunction Merchant Terms of Service and Code of Conduct.
            </Typography>
          }
        />
      </Box>

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
          disabled={!companyData.acceptTerms || isLoading}
          endIcon={!isLoading && <SendIcon />}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            borderRadius: "12px",
            px: 4,
            py: 1.3,
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
          {isLoading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Submit Application"}
        </Button>
      </Box>
    </Box>
  );
};

export default TCs;
