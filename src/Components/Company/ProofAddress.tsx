import { YourChildProps } from "@/Types";
import { PhotoCamera } from "@mui/icons-material";
import {
    TextField,
    Button,
    Box,
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
                 {companyData.utility_bill ? companyData.utility_bill.name : "Upload Utility Bill"}
                 <input hidden type="file" onChange={(e) => handleFileChange(e, "utility_bill")} />
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
                 {companyData.lease_agreement ? companyData.lease_agreement.name : "Upload Lease Agreement"}
                 <input hidden type="file" onChange={(e) => handleFileChange(e, "lease_agreement")} />
                 <PhotoCamera sx={{ ml: "auto" }} />
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