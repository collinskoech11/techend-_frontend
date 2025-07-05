import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    CircularProgress,
    Tabs,
    Tab,
    Grid,
    Skeleton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import { SketchPicker } from "react-color";
import Cookies from "js-cookie";
import { useUserLoginMutation, useUserRegistrationMutation, useGetCompanyQuery, useCreateCompanyMutation, useUpdateCompanyMutation } from "@/Api/services";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import BasicInfo from "@/Components/Company/BasicInfo";
import KYC from "@/Components/Company/KYC";
import BusinessKYC from "@/Components/Company/BusinessKYC";
import ProofAddress from "@/Components/Company/ProofAddress";
import Branding from "@/Components/Company/Branding";
import TCs from "@/Components/Company/TCs";
import VerificationStatus from "@/Components/Company/VerificationStatus";

const steps = [
    "Authentication",
    "Basic Details",
    "Personal ID",
    "Business Verification",
    "Proof of Address",
    "Branding",
    "Terms & Conditions",
];

export default function CompanyOnboarding() {
    const [activeStep, setActiveStep] = useState(0);
    const [user, setUser] = useState<any>(JSON.parse(Cookies.get("user")));
    const [authToken, setAuthToken] = useState<string | undefined>(Cookies.get("access"))
    const [companyExists, setCompanyExists] = useState<boolean>(false)
    const [tabIndex, setTabIndex] = useState(0);
    const [login, { isLoading: isLoggingIn }] = useUserLoginMutation();
    const [register, { isLoading: isRegistering }] = useUserRegistrationMutation();
    const token = Cookies.get("access");
    const [refresh, setRefresh] = useState(0);

    const triggerRerender = () => {
        console.log("trying to rerender parent")
        setRefresh((prev) => prev + 1); // Changing state forces re-render
        console.log("rerendered parent")
    };

    const { data: companyDetails, refetch: refetch_company_details, isLoading: loading_get_my_company, error: error_company_data } = useGetCompanyQuery(token, { skip: !token });
    const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [showPasswordRegister, setShowPasswordRegister] = useState(false);

    const [companyData, setCompanyData] = useState<any>({
        name: "",
        description: "",
        logo_image: null,
        website: "",
        contact_email: "",
        contact_phone: "",
        id_number: "",
        id_front_image: null,
        id_back_image: null,
        business_registration_number: "",
        business_permit_image: null,
        tax_pin_number: "",
        tax_certificate_image: null,
        utility_bill_image: null,
        lease_agreement_image: null,
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
        company_onboarding_step: 1
    });

    const loginSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
    });

    const registerSchema = z.object({
        username: z.string().min(1, "Username is required"),
        email: z.string().email("Invalid email").min(1, "Email is required"),
        password: z.string().min(6, "Password at least 6 characters"),
    });

    useEffect(() => {
        const username = Cookies.get("username");
        if (username && token) {
            setUser(username);
            setActiveStep(1);
        }
    }, [token]);

    console.log(JSON.parse(Cookies.get("user")), "&*&%^$%%#$")
    useEffect(() => {
        if (error_company_data?.status == 404) {
            setCompanyData({
                "name": "techend_test",
                "description": "We provide modern eCommerce solutions.",
                "logo_image": null,
                "website": "https://www.techendsolutions.com",
                "id_number": null,
                "id_front_image": null,
                "id_back_image": null,
                "business_registration_number": null,
                "business_permit_image": null,
                "tax_pin_number": null,
                "tax_certificate_image": null,
                "utility_bill_image": null,
                "lease_agreement": null,
                "postal_address": null,
                "physical_address": null,
                "country": null,
                "city": null,
                "state": null,
                "postal_code": null,
                "contact_email": null,
                "contact_phone": null,
                "primary_color": null,
                "secondary_color": null,
                "accent_color": null,
                "onboarding_complete": false,
                "kyc_approved": false,
                "kyc_rejected_reason": null,
                "created_at": "2025-07-01T08:35:03.745481Z",
                "updated_at": "2025-07-01T08:35:03.745497Z",
                "company_onboarding_step": 1,
                "owner": user.id || 90
            })
            setActiveStep(1)
        } else {
            console.log(loading_get_my_company, "&*&*&*&", companyDetails)
            setCompanyData((prev: any) => ({
                ...prev,
                ...companyDetails,
            }));
            setCompanyExists(true)
            // 
            setActiveStep(companyDetails?.company_onboarding_step + 1 || 1)
        }
    }, [companyDetails]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const loginUser = async () => {
        try {
            loginSchema.parse(loginData);
            const response = await login({ body: loginData });
            if (response.data) {
                const { access, refresh, user } = response.data;
                Cookies.set("access", access, { expires: 7, secure: true, sameSite: "Strict" });
                Cookies.set("refresh", refresh, { expires: 7, secure: true, sameSite: "Strict" });
                Cookies.set("username", user.username, { expires: 7, secure: true, sameSite: "Strict" });
                setUser(user.username);
                toast.success("Login successful");
                setActiveStep(1);
            } else {
                toast.error(response.error?.data?.non_field_errors?.[0] || "Login failed");
            }
        } catch (error: any) {
            toast.error(error.errors?.[0]?.message || "Login failed");
        }
    };

    const registerUser = async () => {
        try {
            registerSchema.parse(registerData);
            const response = await register({ body: registerData });
            if (response.data) {
                const { access, refresh, user } = response.data;
                Cookies.set("access", access, { expires: 7, secure: true, sameSite: "Strict" });
                Cookies.set("refresh", refresh, { expires: 7, secure: true, sameSite: "Strict" });
                Cookies.set("username", user.username, { expires: 7, secure: true, sameSite: "Strict" });
                setUser(user.username);
                toast.success("Registration successful");
                setActiveStep(1);
            } else {
                const msg =
                    response.error?.data?.email?.[0] ||
                    response.error?.data?.username?.[0] ||
                    response.error?.data?.password?.[0] ||
                    "Registration failed";
                toast.error(msg);
            }
        } catch (error: any) {
            toast.error(error.errors?.[0]?.message || "Registration failed");
        }
    };

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

    const nextStep = () => setActiveStep((prev) => prev + 1);
    const prevStep = () => companyData.company_onboarding_step - 1;

    const submitOnboarding = async () => {
        const formData = new FormData();
        Object.entries(companyData).forEach(([key, value]) => {
            if (value instanceof File || typeof value === "string" || typeof value === "boolean") {
                formData.append(key, value as any);
            }
        });

        try {
            if (!companyDetails) {
                await createCompany({ token, body: formData }).unwrap();
                toast.success("Company created successfully");
            } else {
                await updateCompany({ token, body: formData }).unwrap();
                toast.success("Company details updated successfully");
            }
            refetch_company_details();
        } catch (error) {
            toast.error("Submission failed. Check your details.");
        }
    };


    return (
        <Box
            sx={{
                maxWidth: "700px",
                margin: "50px auto",
                p: 3,
                background: "#fff",
                borderRadius: "5px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
        >
            <Toaster />
            <Typography variant="h5" sx={{ textAlign: "center", mb: 3, fontWeight: 600, color: "#be1f2f" }}>
                Company Onboarding
            </Typography>

            {loading_get_my_company ? (
                <>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: "4px" }} /> {/* Company Name */}
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: "4px" }} /> {/* Website */}
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: "4px" }} /> {/* Contact Email */}
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: "4px" }} /> {/* Contact Phone */}

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                        <Skeleton variant="rectangular" width="48%" height={36} sx={{ borderRadius: "4px" }} /> {/* Back/Submit */}
                        <Skeleton variant="rectangular" width="48%" height={36} sx={{ borderRadius: "4px" }} /> {/* Next */}
                    </Box>
                </>
            ) : (
                <>
                    <Stepper activeStep={companyData.company_onboarding_step} alternativeLabel sx={{ mb: 2 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel
                                    StepIconProps={{
                                        sx: { color: "#be1f2f !important" },
                                    }}
                                />
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
                        {steps.map((label, index) => (
                            <Box key={label} sx={{ textAlign: "center", width: "100%" }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: index === companyData.company_onboarding_step ? "#be1f2f" : "#777",
                                        fontWeight: index === companyData.company_onboarding_step ? "bold" : "normal",
                                    }}
                                >
                                    {label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    {activeStep === 0 && (
                        <>
                            <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} centered sx={{ mb: 2 }}>
                                <Tab label="Login" />
                                <Tab label="Register" />
                            </Tabs>

                            {tabIndex === 0 && (
                                <>
                                    <TextField fullWidth label="Username" name="username" value={loginData.username} onChange={handleLoginChange} margin="normal" />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type={showPasswordLogin ? "text" : "password"}
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        margin="normal"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPasswordLogin(!showPasswordLogin)}>
                                                        {showPasswordLogin ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button fullWidth sx={{ mt: 2, background: "#be1f2f", color: "#fff" }} onClick={loginUser}>
                                        {isLoggingIn ? <CircularProgress sx={{ color: "#fff" }} size={24} /> : "Login"}
                                    </Button>
                                </>
                            )}

                            {tabIndex === 1 && (
                                <>
                                    <TextField fullWidth label="Username" name="username" value={registerData.username} onChange={handleRegisterChange} margin="normal" />
                                    <TextField fullWidth label="Email" name="email" value={registerData.email} onChange={handleRegisterChange} margin="normal" />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type={showPasswordRegister ? "text" : "password"}
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        margin="normal"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPasswordRegister(!showPasswordRegister)}>
                                                        {showPasswordRegister ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button fullWidth sx={{ mt: 2, background: "#be1f2f", color: "#fff" }} onClick={registerUser}>
                                        {isRegistering ? <CircularProgress sx={{ color: "#fff" }} size={24} /> : "Register"}
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                    {companyData.company_onboarding_step === 1 && (
                        <>
                            <BasicInfo nextStep={nextStep} prevStep={prevStep} steps={steps} activeStep={companyData.company_onboarding_step} companyData={companyData} setCompanyData={setCompanyData} token={authToken} companyExists={companyExists} refetchCompany={refetch_company_details} triggerRerender={triggerRerender}/>
                        </>
                    )}
                    {companyData.company_onboarding_step === 2 && (
                        <>
                            <KYC nextStep={nextStep} prevStep={prevStep} steps={steps} activeStep={companyData.company_onboarding_step} companyData={companyData} setCompanyData={setCompanyData} token={authToken} refetchCompany={refetch_company_details} triggerRerender={triggerRerender}/>
                        </>
                    )}
                    {companyData.company_onboarding_step === 3 && (
                        <>
                            <BusinessKYC nextStep={nextStep} prevStep={prevStep} steps={steps} activeStep={companyData.company_onboarding_step} companyData={companyData} setCompanyData={setCompanyData} token={authToken} refetchCompany={refetch_company_details} triggerRerender={triggerRerender}/>
                        </>
                    )}
                    {companyData.company_onboarding_step === 4 && (
                        <>
                            <ProofAddress nextStep={nextStep} prevStep={prevStep} steps={steps} activeStep={companyData.company_onboarding_step} companyData={companyData} setCompanyData={setCompanyData} token={authToken} refetchCompany={refetch_company_details} triggerRerender={triggerRerender}/>
                        </>
                    )}
                    {companyData.company_onboarding_step === 5 && (
                        <>
                            <Branding nextStep={nextStep} prevStep={prevStep} steps={steps} activeStep={companyData.company_onboarding_step} companyData={companyData} setCompanyData={setCompanyData} token={authToken} refetchCompany={refetch_company_details} triggerRerender={triggerRerender}/>
                        </>
                    )}
                    {companyData.company_onboarding_step === 6 && (
                        <>
                            <TCs nextStep={nextStep} prevStep={prevStep} steps={steps} activeStep={companyData.company_onboarding_step} companyData={companyData} setCompanyData={setCompanyData} token={authToken} refetchCompany={refetch_company_details} triggerRerender={triggerRerender}/>
                        </>
                    )}
                    {companyData.company_onboarding_step === 7 && (
                        <>
                            <VerificationStatus nextStep={nextStep} prevStep={prevStep} steps={steps} activeStep={companyData.company_onboarding_step} companyData={companyData} setCompanyData={setCompanyData} token={authToken} refetchCompany={refetch_company_details} triggerRerender={triggerRerender}/>
                        </>
                    )}
                </>)}
        </Box>
    );
}