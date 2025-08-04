import { YourChildProps } from "@/Types";
import { Box, Button, Typography, CircularProgress, useTheme } from "@mui/material";
import { useUpdateCompanyMutation } from "@/Api/services";
import toast from "react-hot-toast";

const TCs = ({ nextStep, prevStep, steps, activeStep, companyData, setCompanyData, token, refetchCompany, triggerRerender }: YourChildProps) => {

    const [updateCompany, { isLoading }] = useUpdateCompanyMutation();
    const theme = useTheme();

    const handleSubmit = async () => {
        const formData = new FormData();
        Object.entries(companyData).forEach(([key, value]) => {
            if (value instanceof File || typeof value === "string" || typeof value === "boolean") {
                formData.append(key, value as any);
            }
        });
        formData.append("company_onboarding_step", (activeStep+1).toString());

        try {
            await updateCompany({ token, body: formData }).unwrap();
            toast.success("Onboarding submitted successfully");
            refetchCompany();
            triggerRerender;
            nextStep();
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit onboarding");
        }
    };

    return (
        <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Terms & Conditions
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: "auto", p: 2, border: "1px solid #ccc", borderRadius: "5px", mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Welcome to our eCommerce platform. By completing your onboarding and becoming a merchant, you agree to the following terms:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    1. You are responsible for the accuracy of your business information, documents, and product listings.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    2. You agree to comply with all applicable laws, including those related to taxation, product safety, and consumer protection.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    3. The platform reserves the right to suspend or terminate your account if you are found to be in violation of these terms.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    4. All transactions conducted through the platform are subject to platform fees as communicated to you.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    5. You agree to keep your account credentials secure and notify us immediately of any unauthorized access.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    6. The platform may update these terms from time to time. Continued use constitutes acceptance of the updated terms.
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    By checking the box below and submitting, you confirm that you have read, understood, and agree to the above terms.
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={companyData.acceptTerms || false}
                    onChange={(e) =>
                        setCompanyData({ ...companyData, acceptTerms: e.target.checked })
                    }
                />
                <label htmlFor="acceptTerms" style={{ marginLeft: "8px", fontSize: "14px" }}>
                    I accept the Terms & Conditions
                </label>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button variant="outlined" onClick={prevStep}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    sx={{ background: theme.palette.primary.main }}
                    disabled={!companyData.acceptTerms || isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Submit"}
                </Button>
            </Box>
        </>
    );
};

export default TCs;
