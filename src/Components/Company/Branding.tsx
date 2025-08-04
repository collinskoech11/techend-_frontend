import { YourChildProps } from "@/Types";
import { PhotoCamera } from "@mui/icons-material";
import { Box, Button, Grid, Typography, CircularProgress, useTheme } from "@mui/material";
import { SketchPicker } from "react-color";
import { useUpdateCompanyMutation } from "@/Api/services";
import toast from "react-hot-toast";

const Branding = ({ nextStep, prevStep, steps, activeStep, companyData, setCompanyData, token, refetchCompany, triggerRerender }: YourChildProps) => {

    const [updateCompany, { isLoading }] = useUpdateCompanyMutation();
    const theme = useTheme();

    const handleColorChange = (field: string, color: any) => {
        setCompanyData({ ...companyData, [field]: color?.hex });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        Object.entries(companyData).forEach(([key, value]) => {
            if (typeof value === "string" || typeof value === "boolean") {
                formData.append(key, value as any);
            }
        });
        console.log(activeStep, "&*&*^*")
        formData.append("company_onboarding_step", (activeStep + 1).toString());
        console.log((activeStep + 1).toString(), "&*^&^&")
        try {
            await updateCompany({ token, body: formData }).unwrap();
            refetchCompany();
            triggerRerender;
            toast.success("Colors saved successfully");
            nextStep();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save colors");
        }
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 3, mb: 2 }}>Primary Color</Typography>
                    <SketchPicker color={companyData.primary_color || "#000000"} onChange={(color) => handleColorChange("primary_color", color)} />                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 3, mb: 2 }}>Secondary Color</Typography>
                    <SketchPicker color={companyData.secondary_color || "#000000"} onChange={(color) => handleColorChange("secondary_color", color)} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 3, mb: 2 }}>Accent Color</Typography>
                    <SketchPicker color={companyData.accent_color || "#000000"} onChange={(color) => handleColorChange("accent_color", color)} />
                </Grid>
            </Grid>

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
    );
};

export default Branding;
