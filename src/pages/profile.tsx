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
} from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";

const accent = "#be1f2f";

function ProfilePage() {
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
          "& .MuiTabs-indicator": { backgroundColor: accent },
          "& .MuiTab-root": { color: "#000" },
          "& .Mui-selected": { color: accent },
        }}
      >
        <Tab label="Personal Info" />
        <Tab label="Company Info" />
        <Tab label="Groups & Permissions" />
      </Tabs>

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

      {tab === 1 && (
        <>
          {userDetails.companies && userDetails.companies.length > 0 ? (
            userDetails.companies.map((company, index) => (
              <Box
                key={company.id}
                sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: "4px" }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: accent }}>
                  Company {index + 1}
                </Typography>

                <Tabs
                  value={companyTab}
                  onChange={handleCompanyTabChange}
                  textColor="inherit"
                  indicatorColor="secondary"
                  sx={{
                    mb: 2,
                    "& .MuiTabs-indicator": { backgroundColor: accent },
                    "& .MuiTab-root": { color: "#000" },
                    "& .Mui-selected": { color: accent },
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

      <Button
        variant="contained"
        sx={{
          backgroundColor: accent,
          mt: 3,
          textTransform: "capitalize",
          "&:hover": { backgroundColor: "#a01624" },
        }}
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "Save Changes" : "Edit Profile"}
      </Button>
    </Box>
  );
}

export default ProfilePage;
