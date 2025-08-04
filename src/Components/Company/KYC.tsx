import { YourChildProps } from "@/Types";
import { PhotoCamera } from "@mui/icons-material";
import Payment from "@/Components/Company/Payment"
import {
    TextField,
    Button,
    Box,
    CircularProgress,
    useTheme
} from "@mui/material";
import { useState } from "react";
import { useUpdateCompanyMutation } from "@/Api/services";
import { alpha } from "@mui/material/styles";

interface BasicInfoProps extends YourChildProps {
    companyData: any;
    setCompanyData: (data: any) => void;
}

const KYC = ({ nextStep, prevStep, steps, activeStep, companyData, setCompanyData, token, refetchCompany, triggerRerender }: BasicInfoProps) => {
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
            await updateCompany({
                token,
                id: companyData.id,
                body: formData,
            }).unwrap();
            refetchCompany();
            triggerRerender();
            nextStep();
        } catch (error) {
            console.error(error);
            alert("Failed to update company details.");
        }
    };

    return (
        <>
            <TextField fullWidth label="ID Number" name="id_number" value={companyData.id_number} onChange={handleChange} margin="normal" />
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
                {companyData.id_front_image ? companyData.id_front_image.name : "Upload ID Front"}
                <input hidden type="file" onChange={(e) => handleFileChange(e, "id_front_image")} />
                <PhotoCamera sx={{ ml: "auto" }} />
            </Button>
            {/* <Payment/> */}
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
                {companyData.id_back_image ? companyData.id_back_image.name : "Upload ID Back"}
                <input hidden type="file" onChange={(e) => handleFileChange(e, "id_back_image")} />
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
    );
};

export default KYC;
