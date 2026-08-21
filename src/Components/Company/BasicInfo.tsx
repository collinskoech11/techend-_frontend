import { YourChildProps } from "@/Types";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useCreateCompanyMutation, useUpdateCompanyMutation } from "@/Api/services";
import {
    TextField,
    Button,
    Box,
    CircularProgress,
    useTheme,
    Grid,
} from "@mui/material";
import toast from "react-hot-toast";
import { alpha } from "@mui/material/styles";

const BasicInfo = ({ nextStep, prevStep, activeStep, companyData, setCompanyData, token, companyExists, refetchCompany, triggerRerender }: YourChildProps) => {
    const [createCompany, { isLoadingCreate: isLoadingCreate }] = useCreateCompanyMutation();
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
        formData.append("company_onboarding_step", (activeStep + 1).toString());

        try {
            if (!companyExists) {
                await createCompany({ token, body: formData }).unwrap();
            } else {
                await updateCompany({ token, body: formData }).unwrap();
            }
            refetchCompany();
            triggerRerender;
            toast.success("Company created successfully!");
            nextStep();
        } catch (error) {
            toast.error("Failed to create company. Please check your details.");
        }
    };

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
                <TextField 
                    fullWidth 
                    label="Company Name" 
                    name="name" 
                    value={companyData?.name || ""} 
                    onChange={handleChange} 
                    InputProps={{ sx: { borderRadius: "12px" } }}
                />
                <TextField 
                    fullWidth 
                    label="Description" 
                    name="description" 
                    value={companyData?.description || ""} 
                    onChange={handleChange} 
                    multiline 
                    rows={3} 
                    InputProps={{ sx: { borderRadius: "12px" } }}
                />
                <TextField 
                    fullWidth 
                    label="Website" 
                    name="website" 
                    value={companyData?.website || ""} 
                    onChange={handleChange} 
                    placeholder="e.g. cupcoutureshop.com"
                    InputProps={{ sx: { borderRadius: "12px" } }}
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            label="Contact Email" 
                            name="contact_email" 
                            value={companyData?.contact_email || ""} 
                            onChange={handleChange} 
                            type="email"
                            InputProps={{ sx: { borderRadius: "12px" } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            label="Contact Phone" 
                            name="contact_phone" 
                            value={companyData?.contact_phone || ""} 
                            onChange={handleChange} 
                            placeholder="e.g. +254 700 000000"
                            InputProps={{ sx: { borderRadius: "12px" } }}
                        />
                    </Grid>
                </Grid>

                <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    sx={{
                        py: 1.8,
                        borderRadius: "12px",
                        justifyContent: "space-between",
                        borderColor: "rgba(0,0,0,0.12)",
                        color: "text.primary",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                            borderColor: theme.palette.primary.main,
                            background: alpha(theme.palette.primary.main, 0.04),
                        },
                    }}
                >
                    <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
                        {companyData?.logo_image ? (companyData.logo_image instanceof File ? companyData.logo_image.name : "Logo Uploaded") : "Upload Company Logo"}
                    </Box>
                    <input hidden type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logo_image")} />
                    <PhotoCamera sx={{ color: theme.palette.primary.main }} />
                </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
                {activeStep > 1 && (
                    <Button 
                        variant="outlined" 
                        onClick={prevStep}
                        sx={{ borderRadius: "12px", px: 4, textTransform: "none", fontWeight: 700 }}
                    >
                        Back
                    </Button>
                )}
                <Button
                    variant="contained"
                    sx={{ 
                        background: theme.palette.primary.main,
                        borderRadius: "12px",
                        px: 4,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 700,
                        ml: "auto",
                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                        "&:hover": {
                            background: theme.palette.primary.dark,
                            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                        }
                    }}
                    onClick={handleSubmit}
                    disabled={isLoadingCreate || isLoadingUpdate}
                >
                    {isLoadingCreate || isLoadingUpdate ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Next Step"}
                </Button>
            </Box>
        </>
    );
};

export default BasicInfo;
