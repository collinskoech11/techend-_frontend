import { YourChildProps } from "@/Types";
import { PhotoCamera } from "@mui/icons-material";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { useUpdateCompanyMutation } from "@/Api/services";
import toast from "react-hot-toast";

const ProofAddress = ({ nextStep, prevStep, steps, activeStep, companyData, setCompanyData, token, refetchCompany, triggerRerender }: YourChildProps) => {
    
    const [updateCompany, { isLoading }] = useUpdateCompanyMutation();

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
            nextStep();
            refetchCompany();
            triggerRerender;
        } catch (error) {
            console.error(error);
            toast.error("Failed to save details");
        }
    };

    return (
        <>
            <TextField fullWidth label="Postal Address" name="postal_address" value={companyData.postal_address} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Physical Address" name="physical_address" value={companyData.physical_address} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Country" name="country" value={companyData.country} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="City" name="city" value={companyData.city} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="State" name="state" value={companyData.state} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Postal Code" name="postal_code" value={companyData.postal_code} onChange={handleChange} margin="normal" />

            <Button component="label" variant="outlined" fullWidth
                sx={{
                    mt: 2,
                    justifyContent: "flex-start",
                    borderColor: "#be1f2f",
                    color: "#be1f2f",
                    "&:hover": {
                        borderColor: "#a51a27",
                        background: "rgba(190, 31, 47, 0.05)",
                    },
                }}>
                {companyData.utility_bill_image ? companyData.utility_bill_image.name : "Upload Utility Bill"}
                <input hidden type="file" onChange={(e) => handleFileChange(e, "utility_bill_image")} />
                <PhotoCamera sx={{ ml: "auto" }} />
            </Button>

            <Button component="label" variant="outlined" fullWidth
                sx={{
                    mt: 2,
                    justifyContent: "flex-start",
                    borderColor: "#be1f2f",
                    color: "#be1f2f",
                    "&:hover": {
                        borderColor: "#a51a27",
                        background: "rgba(190, 31, 47, 0.05)",
                    },
                }}>
                {companyData.lease_agreement_image ? companyData.lease_agreement_image.name : "Upload Lease Agreement"}
                <input hidden type="file" onChange={(e) => handleFileChange(e, "lease_agreement_image")} />
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
                    sx={{ background: "#be1f2f" }}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Save & Next"}
                </Button>
            </Box>
        </>
    )
}

export default ProofAddress;
