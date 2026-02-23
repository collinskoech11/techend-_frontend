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
  Card,
  useTheme,
  Avatar,
  Divider,
  Paper,
  alpha
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Cookies from "js-cookie";
import Payment from "@/Components/Company/Payment";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useGetCompanyQuery } from "@/Api/services";
 // Import the new hook

// --- Styled Components ---

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const PricingCard = styled(Card)(({ theme }) => ({
  textAlign: "center",
  padding: "32px 24px",
  borderRadius: "24px",
  border: `1px solid ${theme.palette.divider}`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: 'relative',
  overflow: 'visible',
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
  },
  "&.featured": {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
    "&::before": {
      content: '"CURRENT PLAN"',
      position: 'absolute',
      top: -12,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: '2px 12px',
      borderRadius: '12px',
      fontSize: '0.7rem',
      fontWeight: 800,
      letterSpacing: '1px'
    }
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  marginRight: theme.spacing(1),
  minHeight: '48px',
  borderRadius: '8px',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

function ProfilePage() {
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState(
    JSON.parse(Cookies.get("user") || "{}")
  );
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const token = Cookies.get("access");
  console.log(token, "token in profile page");
  const { data: companyData, error: companyError, isLoading: companyLoading } = useGetCompanyQuery(token, {
      skip: !token,
    });
  console.log(companyData, "company data in profile page");

  const handleTabChange = (event, newValue) => setTab(newValue);

  const renderField = (label, value, key, disabled = false) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
        {label}
      </Typography>
      {editMode && !disabled ? (
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          defaultValue={value}
          onChange={(e) => setUserDetails({ ...userDetails, [key]: e.target.value })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
      ) : (
        <Typography variant="body1" sx={{ fontWeight: 500, color: value ? 'text.primary' : 'text.disabled' }}>
          {value || "Not provided"}
        </Typography>
      )}
    </Box>
  );

  const renderCompanyField = (label, value) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500, color: value ? 'text.primary' : 'text.disabled' }}>
        {value || "Not provided"}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: "1100px", margin: "40px auto", p: { xs: 2, md: 4 } }}>
      
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 3 }}>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: theme.palette.primary.main,
            fontSize: '2rem',
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          {userDetails.first_name?.[0] || userDetails.username?.[0] || "U"}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            {userDetails.first_name} {userDetails.last_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {userDetails.email}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Navigation Sidebar */}
        <Grid item xs={12} md={3}>
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={handleTabChange}
            sx={{
              borderRight: { md: 1 },
              borderColor: 'divider',
              '& .MuiTabs-indicator': { display: 'none' },
            }}
          >
            <StyledTab icon={<PersonOutlineIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Personal Info" />
            <StyledTab icon={<BusinessIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Company" />
            <StyledTab icon={<VerifiedUserIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Permissions" />
            <StyledTab icon={<AccountBalanceWalletIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Billing" />
          </Tabs>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={9}>
          <ContentCard elevation={0}>
            {tab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Profile Details</Typography>
                  <Button 
                    variant={editMode ? "contained" : "outlined"} 
                    onClick={() => setEditMode(!editMode)}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                  >
                    {editMode ? "Save Changes" : "Edit Profile"}
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>{renderField("Username", userDetails.username, "username")}</Grid>
                  <Grid item xs={12} sm={6}>{renderField("Email", userDetails.email, "email")}</Grid>
                  <Grid item xs={12} sm={6}>{renderField("First Name", userDetails.first_name, "first_name")}</Grid>
                  <Grid item xs={12} sm={6}>{renderField("Last Name", userDetails.last_name, "last_name")}</Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>{renderField("Last Login", new Date(userDetails.last_login).toLocaleDateString(), "last_login", true)}</Grid>
                  <Grid item xs={12} sm={6}>{renderField("Member Since", new Date(userDetails.date_joined).toLocaleDateString(), "date_joined", true)}</Grid>
                </Grid>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                {companyLoading && <Typography>Loading company information...</Typography>}
                {companyError && <Typography color="error">Error loading company information.</Typography>}
                {companyData ? (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Company Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Name", companyData.name)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Website", companyData.website)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Business Reg. Number", companyData.business_registration_number)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Tax PIN", companyData.tax_pin_number)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Country", companyData.country)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("City", companyData.city)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Physical Address", companyData.physical_address)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Postal Address", companyData.postal_address)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Postal Code", companyData.postal_code)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Primary Color", companyData.primary_color)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Secondary Color", companyData.secondary_color)}</Grid>
                      <Grid item xs={12} sm={6}>{renderCompanyField("Accent Color", companyData.accent_color)}</Grid>
                    </Grid>
                  </Box>
                ) : (
                  !companyLoading && !companyError && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.secondary">No company information available at this time.</Typography>
                    </Box>
                  )
                )}
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Groups & Access</Typography>
                {userDetails.groups?.length > 0 ? (
                  userDetails.groups.map((group, idx) => (
                    <Chip 
                      key={idx} 
                      label={group} 
                      onDelete={() => {}} // Visual only for now
                      sx={{ mr: 1, mb: 1, borderRadius: '8px', fontWeight: 600 }} 
                      color="primary" 
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">No administrative groups assigned.</Typography>
                )}
              </Box>
            )}

            {tab === 3 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>Subscription Plans</Typography>
                <Grid container spacing={3}>
                  {/* Starter Plan */}
                  <Grid item xs={12} lg={4}>
                    <PricingCard className={userDetails.selected_plan === 'Starter' ? 'featured' : ''}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Starter</Typography>
                      <Typography variant="h4" sx={{ my: 2, fontWeight: 800 }}>0 Kes</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                        For individuals exploring the platform.
                      </Typography>
                      {userDetails.selected_plan === 'Starter' ? <Payment /> : (
                        <Button fullWidth variant="outlined" sx={{ borderRadius: '12px' }} onClick={() => router.push('/payment/Starter')}>Switch Plan</Button>
                      )}
                    </PricingCard>
                  </Grid>

                  {/* Growth Plan */}
                  <Grid item xs={12} lg={4}>
                    <PricingCard className={userDetails.selected_plan === 'Growth' ? 'featured' : ''}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>Growth</Typography>
                      <Typography variant="h4" sx={{ my: 2, fontWeight: 800 }}>550 Kes</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                        Perfect for growing teams and SMEs.
                      </Typography>
                      {userDetails.selected_plan === 'Growth' ? <Payment /> : (
                        <Button fullWidth variant="contained" sx={{ borderRadius: '12px', boxShadow: 'none' }} onClick={() => router.push('/payment/Growth')}>Upgrade Now</Button>
                      )}
                    </PricingCard>
                  </Grid>

                  {/* Pro Plan */}
                  <Grid item xs={12} lg={4}>
                    <PricingCard className={userDetails.selected_plan === 'Pro' ? 'featured' : ''}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Pro</Typography>
                      <Typography variant="h4" sx={{ my: 2, fontWeight: 800 }}>1050 Kes</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                        Full enterprise capabilities and support.
                      </Typography>
                      {userDetails.selected_plan === 'Pro' ? <Payment /> : (
                        <Button fullWidth variant="outlined" sx={{ borderRadius: '12px' }} onClick={() => router.push('/payment/Pro')}>Contact Sales</Button>
                      )}
                    </PricingCard>
                  </Grid>
                </Grid>
              </Box>
            )}
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;