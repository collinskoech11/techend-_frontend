import {
  Box,
  Typography,
  Tabs,
  TextField,
  Button,
  Grid,
  Chip,
  useTheme,
  Avatar,
  Paper,
  alpha,
  Skeleton,
  Stack,
} from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useGetCompanyQuery } from "@/Api/services";
import { ContentCard, StyledTab } from "@/StyledComponents/Hero";
import MyPlan from "@/Components/Subscriptions/MyPlan";

// --- Styled Components ---



const SectionHeader = ({ title }) => (
  <Typography
    variant="overline"
    sx={{
      color: 'primary.main',
      fontWeight: 800,
      display: 'block',
      mb: 2,
      mt: 4,
      letterSpacing: '1px'
    }}
  >
    {title}
  </Typography>
);

function ProfilePage() {
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState(JSON.parse(Cookies.get("user") || "{}"));
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const token = Cookies.get("access");
  const { data: companyData, isLoading: companyLoading } = useGetCompanyQuery(token, {
    skip: !token,
  });

  const handleTabChange = (event, newValue) => {
    console.log("Tab changed to:", event);
    setTab(newValue);
  }
  const renderField = (label, value, key, disabled = false) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      {editMode && !disabled ? (
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          defaultValue={value}
          onChange={(e) => setUserDetails({ ...userDetails, [key]: e.target.value })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: alpha(theme.palette.common.black, 0.02) } }}
        />
      ) : (
        <Typography variant="body1" sx={{ fontWeight: 600, color: value ? 'text.primary' : 'text.disabled' }}>
          {value || "—"}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: "1800px", margin: "40px auto", p: { xs: 2, md: 4 } }}>

      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', mb: 4, bgcolor: alpha(theme.palette.primary.main, 0.03), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              width: 100, height: 100,
              bgcolor: theme.palette.primary.main,
              fontSize: '2.5rem',
              fontWeight: 700,
              boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.25)}`
            }}
          >
            {userDetails.first_name?.[0] || userDetails.username?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', textTransform: 'capitalize' }}>
              {userDetails.first_name || userDetails.username} {userDetails.last_name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, mb:1 }}>
              <Chip label="Verified Member" size="small" color="success" sx={{ fontWeight: 700 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              {userDetails.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': { display: 'none' },
              borderRight: { md: `1px solid ${theme.palette.divider}` },
              pr: { md: 2 }
            }}
          >
            <StyledTab icon={<PersonOutlineIcon sx={{ mr: 2 }} />} iconPosition="start" label="Account Settings" />
            <StyledTab icon={<BusinessIcon sx={{ mr: 2 }} />} iconPosition="start" label="Organization" />
            <StyledTab icon={<VerifiedUserIcon sx={{ mr: 2 }} />} iconPosition="start" label="Access Control" />
            <StyledTab icon={<AccountBalanceWalletIcon sx={{ mr: 2 }} />} iconPosition="start" label="Subscription" />
          </Tabs>
        </Grid>

        <Grid item xs={12} md={9}>
          <ContentCard elevation={0}>
            {tab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  <Typography variant="h6" fontWeight={800}>Personal Information</Typography>
                  <Button
                    variant={editMode ? "contained" : "text"}
                    onClick={() => setEditMode(!editMode)}
                    sx={{ borderRadius: '10px', fontWeight: 700 }}
                  >
                    {editMode ? "Save Changes" : "Edit Details"}
                  </Button>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>{renderField("Username", userDetails.username, "username")}</Grid>
                  <Grid item xs={12} sm={6}>{renderField("Email Address", userDetails.email, "email")}</Grid>
                  <Grid item xs={12} sm={6}>{renderField("First Name", userDetails.first_name, "first_name")}</Grid>
                  <Grid item xs={12} sm={6}>{renderField("Last Name", userDetails.last_name, "last_name")}</Grid>
                </Grid>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={800} mb={3}>Organization Details</Typography>
                {companyLoading ? (
                  <Stack spacing={2}><Skeleton height={40} /><Skeleton height={40} /><Skeleton height={40} /></Stack>
                ) : companyData ? (
                  <Box>
                    <SectionHeader title="Business Identity" />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>{renderField("Company Name", companyData.name, "", true)}</Grid>
                      <Grid item xs={12} sm={6}>{renderField("Website", companyData.website, "", true)}</Grid>
                      <Grid item xs={12} sm={6}>{renderField("Reg. Number", companyData.business_registration_number, "", true)}</Grid>
                      <Grid item xs={12} sm={6}>{renderField("Tax PIN", companyData.tax_pin_number, "", true)}</Grid>
                    </Grid>

                    <SectionHeader title="Location" />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>{renderField("City", companyData.city, "", true)}</Grid>
                      <Grid item xs={12} sm={6}>{renderField("Address", companyData.physical_address, "", true)}</Grid>
                    </Grid>

                    <SectionHeader title="Branding" />
                    <Stack direction="row" spacing={2} mt={1}>
                      {['primary', 'secondary', 'accent'].map(color => (
                        <Box key={color} sx={{ textAlign: 'center' }}>
                          <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: companyData[`${color}_color`], mb: 1, border: '1px solid #eee' }} />
                          <Typography variant="caption" fontWeight={700}>{color}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6, bgcolor: alpha(theme.palette.common.black, 0.02), borderRadius: '16px' }}>
                    <BusinessIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography fontWeight={700}>No Organization Found</Typography>
                    <Typography variant="body2" color="text.secondary">Create a company profile to get started.</Typography>
                  </Box>
                )}
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={800} mb={3}>Security & Permissions</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Your account is associated with the following permission groups:</Typography>
                <Stack direction="row" spacing={1}>
                  {userDetails.groups?.map((group, idx) => (
                    <Chip key={idx} label={group} color="primary" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                  )) || "No groups assigned"}
                </Stack>
              </Box>
            )}

            {tab === 3 && (
              <MyPlan userDetails={userDetails} />
            )}
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;