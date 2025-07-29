import { YourChildProps } from "@/Types";
import { PhotoCamera } from "@mui/icons-material";
import { useCreateCompanyMutation, useUpdateCompanyMutation } from "@/Api/services";
import {
    TextField,
    Button,
    Box,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { alpha } from "@mui/material/styles";

const BasicInfo = ({ nextStep, prevStep, steps, activeStep, companyData, setCompanyData, token, companyExists, refetchCompany, triggerRerender }: YourChildProps) => {
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
            <TextField fullWidth label="Company Name" name="name" value={companyData?.name} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Description" name="description" value={companyData?.description} onChange={handleChange} margin="normal" multiline rows={3} />
            <TextField fullWidth label="Website" name="website" value={companyData?.website} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Contact Email" name="contact_email" value={companyData?.contact_email} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Contact Phone" name="contact_phone" value={companyData?.contact_phone} onChange={handleChange} margin="normal" />

            <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                    mt: 2,
                    justifyContent: "flex-start",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                        borderColor: theme.palette.primary.dark,
                        background: alpha(theme.palette.primary.main, 0.05),
                    },
                }}
            >
                {companyData?.logo_image ? companyData?.logo_image.name : "Upload Company Logo"}
                <input hidden type="file" onChange={(e) => handleFileChange(e, "logo_image")} />
                <PhotoCamera sx={{ ml: "auto", color: theme.palette.primary.main }} />
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
                    disabled={isLoadingCreate || isLoadingUpdate}
                >
                    {isLoadingCreate ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Next"}
                </Button>
            </Box>
        </>
    );
};

export default BasicInfo;
