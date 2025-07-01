import { YourChildProps } from "@/Types";
import { PhotoCamera } from "@mui/icons-material";
import {
    Box,
    Button,
    Grid,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { SketchPicker } from "react-color";

const BasicInfo = ({ nextStep, prevStep, steps, activeStep }: YourChildProps) => {
    const [companyData, setCompanyData] = useState<any>({
        name: "",
        description: "",
        logo: null,
        website: "",
        contact_email: "",
        contact_phone: "",
        id_number: "",
        id_front: null,
        id_back: null,
        business_registration_number: "",
        business_permit: null,
        tax_pin_number: "",
        tax_certificate: null,
        utility_bill: null,
        lease_agreement: null,
        postal_address: "",
        physical_address: "",
        country: "",
        city: "",
        state: "",
        postal_code: "",
        primary_color: "#be1f2f",
        secondary_color: "#000000",
        accent_color: "#cccccc",
        acceptTerms: false,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files) {
            setCompanyData({ ...companyData, [field]: e.target.files[0] });
        }
    };

    const handleColorChange = (field: string, color: any) => {
        setCompanyData({ ...companyData, [field]: color.hex });
    };



    return (
        <>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 3, mb: 2 }}>Primary Color</Typography>
                    <SketchPicker color={companyData.primary_color} onChange={(color) => handleColorChange("primary_color", color)} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 3, mb: 2 }}>Secondary Color</Typography>
                    <SketchPicker color={companyData.secondary_color} onChange={(color) => handleColorChange("secondary_color", color)} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 3, mb: 2 }}>Accent Color</Typography>
                    <SketchPicker color={companyData.accent_color} onChange={(color) => handleColorChange("accent_color", color)} />
                </Grid>
            </Grid>
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