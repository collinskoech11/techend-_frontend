import { YourChildProps } from "@/Types";
import { PhotoCamera } from "@mui/icons-material";
import { TextField, Button, Box, CircularProgress, useTheme } from "@mui/material";
import { useUpdateCompanyMutation } from "@/Api/services";
import toast from "react-hot-toast";
import { alpha } from "@mui/material/styles";

const BussinessKYC = ({ nextStep, prevStep, steps, activeStep, companyData, setCompanyData, token, refetchCompany, triggerRerender }: YourChildProps) => {
    
    const [updateCompany, { isLoading }] = useUpdateCompanyMutation();
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files) {
            setCompanyData({ ...companyData, [field]: e.target.files[0] });
        }
    };

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
            toast.success("Details saved successfully");
            refetchCompany();
            triggerRerender;
            nextStep();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save details");
        }
    };

    return (
        <>
            <TextField fullWidth label="Business Registration Number" name="business_registration_number" value={companyData.business_registration_number} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Tax PIN Number" name="tax_pin_number" value={companyData.tax_pin_number} onChange={handleChange} margin="normal" />
            
            <Button component="label" variant="outlined" fullWidth
                sx={{
                    mt: 2,
                    justifyContent: "flex-start",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                        borderColor: theme.palette.primary.dark,
                        background: alpha(theme.palette.primary.main, 0.05),
                    },
                }}>
                {companyData.business_permit_image ? companyData.business_permit_image.name : "Upload Business Permit"}
                <input hidden type="file" onChange={(e) => handleFileChange(e, "business_permit_image")} />
                <PhotoCamera sx={{ ml: "auto" }} />
            </Button>

            <Button component="label" variant="outlined" fullWidth
                sx={{
                    mt: 2,
                    justifyContent: "flex-start",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                        borderColor: theme.palette.primary.dark,
                        background: alpha(theme.palette.primary.main, 0.05),
                    },
                }}>
                {companyData.tax_certificate_image ? companyData.tax_certificate_image.name : "Upload Tax Certificate"}
                <input hidden type="file" onChange={(e) => handleFileChange(e, "tax_certificate_image")} />
                <PhotoCamera sx={{ ml: "auto" }} />
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                {activeStep > 1 && (
                    <Button variant="outlined" onClick={prevStep}>
                        Back
                    </Button>
                )}
                <Button
                    variant="contained"
                    sx={{ background: theme.palette.primary.main }}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Save & Next"}
                </Button>
            </Box>
        </>
    )
}

export default BussinessKYC;
