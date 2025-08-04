import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Chip,
  Divider,
  Card,
  useTheme
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles"; // Import keyframes
import { useState } from "react";
import Cookies from "js-cookie";
import Payment from "@/Components/Company/Payment";
import CheckIcon from "@mui/icons-material/Check"



function ProfilePage() {
  const theme = useTheme();
  const secondaryColor = "#3f51b5"; // A complementary blue
  const lightGray = "#f8f8f8";
  const darkText = "#333";
  const lightText = "#666";

  const PricingCard:any = styled(Card)({
        textAlign: "center",
        padding: "40px 30px",
        borderRadius: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
        border: `1px solid ${lightGray}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.4s ease, box-shadow 0.4s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.01)",
          boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
        },
      });

      const AccentButton = styled(Button)(({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        textTransform: "capitalize",
        padding: "16px 40px",
        borderRadius: "30px", // More rounded for a softer feel
        fontWeight: 600,
        fontSize: "1.15rem",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)", // Stronger shadow
        transition: "all 0.4s ease",
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
          transform: "translateY(-3px) scale(1.02)", // Enhanced hover effect
          boxShadow: "0 12px 25px rgba(0,0,0,0.4)",
        },
      }));
      
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<any>(
    JSON.parse(Cookies.get("user")) || {}
  );
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [companyTab, setCompanyTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleCompanyTabChange = (event, newValue) => {
    setCompanyTab(newValue);
  };

  const renderField = (
    label: string,
    value: any,
    object: any,
    key: string,
    updateObject: (newObj: any) => void,
    disabled: boolean = false
  ) => {
    const isDate =
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);

    const formattedValue = isDate
      ? new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })
      : value;

      

    return (
      <Grid container spacing={2} sx={{ mb: 2 }} key={key}>
        <Grid item xs={4}>
          <Typography sx={{ fontWeight: "bold" }}>{label}:</Typography>
        </Grid>
        <Grid item xs={8}>
          {editMode ? (
            <TextField
              fullWidth
              size="small"
              defaultValue={formattedValue}
              disabled={disabled}
              onChange={(e) =>
                !disabled && updateObject({ ...object, [key]: e.target.value })
              }
            />
          ) : (
            <Typography>{formattedValue || "-"}</Typography>
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "30px auto", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        My Profile
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="inherit"
        indicatorColor="secondary"
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": { backgroundColor: theme.palette.primary.main },
          "& .MuiTab-root": { color: "#000" },
          "& .Mui-selected": { color: theme.palette.primary.main },
        }}
      >
        <Tab label="Personal Info" />
        <Tab label="Company Info" />
        <Tab label="Groups & Permissions" />
        <Tab label="Payments" />
      </Tabs>

      {/* Personal Info */}
      {tab === 0 && (
        <>
          {renderField("Username", userDetails.username, userDetails, "username", setUserDetails)}
          {renderField("Email", userDetails.email, userDetails, "email", setUserDetails)}
          {renderField("First Name", userDetails.first_name, userDetails, "first_name", setUserDetails)}
          {renderField("Last Name", userDetails.last_name, userDetails, "last_name", setUserDetails)}
          {renderField("Last Login", userDetails.last_login, userDetails, "last_login", setUserDetails, true)}
          {renderField("Date Joined", userDetails.date_joined, userDetails, "date_joined", setUserDetails, true)}
          {renderField("Is Active", userDetails.is_active ? "Yes" : "No", userDetails, "is_active", setUserDetails, true)}
          {renderField("Is Staff", userDetails.is_staff ? "Yes" : "No", userDetails, "is_staff", setUserDetails, true)}
          {renderField("Is Superuser", userDetails.is_superuser ? "Yes" : "No", userDetails, "is_superuser", setUserDetails, true)}
        </>
      )}

      {/* Company Info */}
      {tab === 1 && (
        <>
          {userDetails.companies && userDetails.companies.length > 0 ? (
            userDetails.companies.map((company, index) => (
              <Box
                key={company.id}
                sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: "4px" }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                  Company {index + 1}
                </Typography>

                <Tabs
                  value={companyTab}
                  onChange={handleCompanyTabChange}
                  textColor="inherit"
                  indicatorColor="secondary"
                  sx={{
                    mb: 2,
                    "& .MuiTabs-indicator": { backgroundColor: theme.palette.primary.main },
                    "& .MuiTab-root": { color: "#000" },
                    "& .Mui-selected": { color: theme.palette.primary.main },
                  }}
                >
                  <Tab label="General Info" />
                  <Tab label="Address Info" />
                  <Tab label="Branding" />
                </Tabs>

                {companyTab === 0 && (
                  <>
                    {renderField("Name", company.name, company, "name", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Description", company.description, company, "description", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Website", company.website, company, "website", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Business Reg. Number", company.business_registration_number, company, "business_registration_number", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Tax PIN", company.tax_pin_number, company, "tax_pin_number", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                  </>
                )}

                {companyTab === 1 && (
                  <>
                    {renderField("Country", company.country, company, "country", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("City", company.city, company, "city", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Physical Address", company.physical_address, company, "physical_address", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Postal Address", company.postal_address, company, "postal_address", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Postal Code", company.postal_code, company, "postal_code", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                  </>
                )}

                {companyTab === 2 && (
                  <>
                    {renderField("Primary Color", company.primary_color, company, "primary_color", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Secondary Color", company.secondary_color, company, "secondary_color", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                    {renderField("Accent Color", company.accent_color, company, "accent_color", (updated) => {
                      const newCompanies = [...userDetails.companies];
                      newCompanies[index] = updated;
                      setUserDetails({ ...userDetails, companies: newCompanies });
                    })}
                  </>
                )}
              </Box>
            ))
          ) : (
            <Typography>No company information available.</Typography>
          )}
        </>
      )}

      {/* Groups & Permissions */}
      {tab === 2 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Groups
          </Typography>
          {userDetails.groups && userDetails.groups.length > 0 ? (
            userDetails.groups.map((group, idx) => (
              <Chip key={idx} label={`Group ${group}`} sx={{ mr: 1, mb: 1 }} />
            ))
          ) : (
            <Typography>No groups assigned.</Typography>
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            User Permissions
          </Typography>
          {userDetails.user_permissions && userDetails.user_permissions.length > 0 ? (
            userDetails.user_permissions.map((perm, idx) => (
              <Chip key={idx} label={`Permission ${perm}`} sx={{ mr: 1, mb: 1 }} />
            ))
          ) : (
            <Typography>No permissions assigned.</Typography>
          )}
        </>
      )}

      {/* Payments Tab */}
      {tab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Current Plan
          </Typography>

          <Grid container spacing={6} justifyContent="center">
            {/* Starter Plan */}
            <Grid item xs={12} md={4}>
              <PricingCard sx={{
                border: userDetails.selected_plan === "Starter" ? `2px solid ${theme.palette.primary.main}` : "1px solid #ddd",
                boxShadow: userDetails.selected_plan === "Starter" ? `0 15px 40px rgba(190, 31, 47, 0.2)` : "none"
              }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                    Starter
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    $15<Typography component="span" variant="h6" color="text.secondary">/mo</Typography>
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Ideal for getting your first store online.
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0, textAlign: "left", margin: "0 auto 20px auto", maxWidth: "200px" }}>
                    <li><CheckIcon color="success" fontSize="small" /> Basic Store Setup</li>
                    <li><CheckIcon color="success" fontSize="small" /> Product Listings (up to 50)</li>
                    <li><CheckIcon color="success" fontSize="small" /> Standard Support</li>
                  </ul>
                </Box>
                {userDetails.selected_plan === "Starter" ? (
                  <Payment />
                ) : (
                  <Button variant="outlined" sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, mt: 3, "&:hover": { bgcolor: theme.palette.primary.main, color: "#fff" } }} onClick={() => {userDetails.selected_plan = 'Starter'}}>
                    Choose Plan
                    {userDetails.selected_plan}
                  </Button>
                )}
              </PricingCard>
            </Grid>

            {/* Growth Plan */}
            <Grid item xs={12} md={4}>
              <PricingCard sx={{
                border: userDetails.selected_plan === "Growth" ? `2px solid ${theme.palette.primary.main}` : "1px solid #ddd",
                boxShadow: userDetails.selected_plan === "Growth" ? `0 15px 40px rgba(190, 31, 47, 0.2)` : "none"
              }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                    Growth
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    $39<Typography component="span" variant="h6" color="text.secondary">/mo</Typography>
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    For growing SMEs with inventory and marketing tools.
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0, textAlign: "left", margin: "0 auto 20px auto", maxWidth: "200px" }}>
                    <li><CheckIcon color="success" fontSize="small" /> All Starter Features</li>
                    <li><CheckIcon color="success" fontSize="small" /> Unlimited Products</li>
                    <li><CheckIcon color="success" fontSize="small" /> Inventory Management</li>
                    <li><CheckIcon color="success" fontSize="small" /> Email Marketing Tools</li>
                  </ul>
                </Box>
                {userDetails.selected_plan === "Growth" ? (
                  <AccentButton sx={{ mt: 3 }} onClick={() => {/* trigger payment logic */ }}>
                    Pay Now
                  </AccentButton>
                ) : (
                  <Button variant="outlined" sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, mt: 3, "&:hover": { bgcolor: theme.palette.primary.main, color: "#fff" } }}>
                    Choose Plan
                  </Button>
                )}
              </PricingCard>
            </Grid>

            {/* Pro Plan */}
            <Grid item xs={12} md={4}>
              <PricingCard sx={{
                border: userDetails.selected_plan === "Pro" ? `2px solid ${theme.palette.primary.main}` : "1px solid #ddd",
                boxShadow: userDetails.selected_plan === "Pro" ? `0 15px 40px rgba(190, 31, 47, 0.2)` : "none"
              }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                    Pro
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    $79<Typography component="span" variant="h6" color="text.secondary">/mo</Typography>
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    For established sellers with advanced needs and priority support.
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0, textAlign: "left", margin: "0 auto 20px auto", maxWidth: "200px" }}>
                    <li><CheckIcon color="success" fontSize="small" /> All Growth Features</li>
                    <li><CheckIcon color="success" fontSize="small" /> Advanced Analytics</li>
                    <li><CheckIcon color="success" fontSize="small" /> Multi-User Access</li>
                    <li><CheckIcon color="success" fontSize="small" /> Priority Support</li>
                  </ul>
                </Box>
                {userDetails.selected_plan === "Pro" ? (
                  <AccentButton sx={{ mt: 3 }} onClick={() => {/* trigger payment logic */ }}>
                    Pay Now
                  </AccentButton>
                ) : (
                  <Button variant="outlined" sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, mt: 3, "&:hover": { bgcolor: theme.palette.primary.main, color: "#fff" } }}>
                    Choose Plan
                  </Button>
                )}
              </PricingCard>
            </Grid>
          </Grid>
        </Box>

      )}

      {/* Edit Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          mt: 3,
          textTransform: "capitalize",
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        }}
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "Save Changes" : "Edit Profile"}
      </Button>
    </Box>
  );
}

export default ProfilePage;
