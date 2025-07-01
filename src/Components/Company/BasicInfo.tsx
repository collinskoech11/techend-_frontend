import { YourChildProps } from "@/Types";
import { PhotoCamera } from "@mui/icons-material";
import {
    TextField,
    Button,
    Box,
} from "@mui/material";
import { useState } from "react";

const BasicInfo = ({ nextStep, prevStep, steps, activeStep, companyData, setCompanyData }: YourChildProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files) {
            setCompanyData({ ...companyData, [field]: e.target.files[0] });
        }
    };


    return (
        <>
            <TextField fullWidth label="Company Name" name="name" value={companyData.name} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Description" name="description" value={companyData.description} onChange={handleChange} margin="normal" multiline rows={3} />
            <TextField fullWidth label="Website" name="website" value={companyData.website} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Contact Email" name="contact_email" value={companyData.contact_email} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Contact Phone" name="contact_phone" value={companyData.contact_phone} onChange={handleChange} margin="normal" />
            <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                    mt: 2,
                    justifyContent: "flex-start",
                    borderColor: "#be1f2f",
                    color: "#be1f2f",
                    "&:hover": {
                        borderColor: "#a51a27",
                        background: "rgba(190, 31, 47, 0.05)",
                    },
                }}
            >
                {companyData.logo_image ? companyData.logo_image.name : "Upload Company Logo"}
                <input hidden type="file" onChange={(e) => handleFileChange(e, "logo")} />
                <PhotoCamera sx={{ ml: "auto", color: "#be1f2f" }} />
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                {activeStep === steps.length - 1 ? (
                    <>
                        <Button
                            variant="contained"
                            sx={{ background: "#be1f2f" }}
                            disabled={!companyData.acceptTerms}
                            onClick={() => alert("Submit onboarding")}
                        >
                            Submit
                        </Button>
                    </>
                ) : (
                    <>
                        {activeStep > 1 && (
                            <Button variant="outlined" onClick={prevStep}>
                                Back
                            </Button>
                        )}
                        <Button variant="contained" sx={{ background: "#be1f2f" }} onClick={nextStep}>
                            Next
                        </Button>
                    </>
                )}
            </Box>
        </>
    )
}
export default BasicInfo