import { YourChildProps } from "@/Types";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import { useState } from "react";

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
                        {/* {activeStep > 1 && (
                        )} */}
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