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
  alpha,
  Skeleton,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Cookies from "js-cookie";
import Payment from "@/Components/Company/Payment";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useGetCompanyQuery } from "@/Api/services";

// --- Styled Components ---

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
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
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  position: 'relative',
  overflow: 'visible',
  "&:hover": {
    transform: "translateY(-12px)",
    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.08)}`,
  },
  "&.featured": {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
    backgroundColor: alpha(theme.palette.primary.main, 0.01),
    "&::before": {
      content: '"CURRENT PLAN"',
      position: 'absolute',
      top: -12,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: '4px 14px',
      borderRadius: '20px',
      fontSize: '0.65rem',
      fontWeight: 900,
      letterSpacing: '1.2px'
    }
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  marginRight: theme.spacing(1),
  minHeight: '48px',
  borderRadius: '12px',
  justifyContent: 'flex-start',
  padding: '12px 20px',
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  }
}));

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
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(JSON.parse(Cookies.get("user") || "{}"));
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const token = Cookies.get("access");
  const { data: companyData, error: companyError, isLoading: companyLoading } = useGetCompanyQuery(token, {
    skip: !token,
  });

  const handleTabChange = (event, newValue) => setTab(newValue);

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
    <Box sx={{ maxWidth: "1200px", margin: "40px auto", p: { xs: 2, md: 4 } }}>

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
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label="Verified Member" size="small" color="success" sx={{ fontWeight: 700 }} />
            </Stack><br/>
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
              <Box>
                <Grid container spacing={3} alignItems="flex-end">
                  {[
                    {
                      title: 'Starter',
                      price: '0',
                      desc: 'Essentials for new setups',
                      features: ['50 Products', 'Standard Analytics', 'Email Support']
                    },
                    {
                      title: 'Growth',
                      price: '550',
                      desc: 'Advanced tools for scaling',
                      features: ['Unlimited Products', 'SMS Notifications', 'Priority Listing', 'M-Pesa Automation'],
                      popular: true
                    },
                    {
                      title: 'Pro',
                      price: '1,050',
                      desc: 'Enterprise grade control',
                      features: ['AI Marketing', 'Custom Domain', 'Dedicated Dev Support', 'Multi-user Roles']
                    }
                  ].map((plan) => {
                    const isCurrent = userDetails.selected_plan === plan.title;
                    const isGrowth = plan.title === 'Growth';

                    return (
                      <Grid item xs={12} lg={4} key={plan.title}>
                        <PricingCard
                          className={isCurrent ? 'featured' : ''}
                          sx={{
                            position: 'relative',
                            pt: plan.popular ? 6 : 4,
                            borderColor: isGrowth ? theme.palette.secondary.main : 'divider',
                            background: isGrowth ? `linear-gradient(to bottom, ${alpha(theme.palette.secondary.main, 0.03)}, #fff)` : '#fff'
                          }}
                        >
                          {plan.popular && !isCurrent && (
                            <Box sx={{
                              position: 'absolute',
                              top: 0, left: 0, right: 0,
                              bgcolor: theme.palette.secondary.main,
                              color: '#white',
                              py: 0.5,
                              borderTopLeftRadius: '22px',
                              borderTopRightRadius: '22px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              letterSpacing: 1
                            }}>
                              MOST POPULAR
                            </Box>
                          )}

                          <Typography variant="subtitle1" fontWeight={800} color={isGrowth ? 'secondary.main' : 'text.primary'}>
                            {plan.title}
                          </Typography>

                          <Box sx={{ my: 2 }}>
                            <Typography variant="h3" sx={{ fontWeight: 900, display: 'inline-flex', alignItems: 'baseline' }}>
                              <Typography component="span" variant="h6" sx={{ mr: 0.5, fontWeight: 700, opacity: 0.7 }}>Kes</Typography>
                              {plan.price}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 600 }}>
                              per month
                            </Typography>
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 1 }}>
                            {plan.desc}
                          </Typography>

                          <Divider sx={{ mb: 3, width: '40px', mx: 'auto', borderWidth: 2, borderColor: isGrowth ? 'secondary.main' : 'divider' }} />

                          <List sx={{ mb: 4, flexGrow: 1 }}>
                            {plan.features.map((feat) => (
                              <ListItem key={feat} sx={{ py: 0.5, px: 0, justifyContent: 'center' }}>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <CheckCircleOutlineIcon sx={{ fontSize: 18, color: isGrowth ? 'secondary.main' : 'primary.main' }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={feat}
                                  primaryTypographyProps={{ variant: 'body2', fontWeight: 600, textAlign: 'left' }}
                                />
                              </ListItem>
                            ))}
                          </List>

                          {isCurrent ? (
                            <Box sx={{ mt: 'auto' }}>
                              <Payment />
                            </Box>
                          ) : (
                            <Button
                              fullWidth
                              variant={isGrowth ? "contained" : "outlined"}
                              color={isGrowth ? "secondary" : "primary"}
                              onClick={() => router.push(`/payment/${plan.title}`)}
                              sx={{
                                mt: 'auto',
                                borderRadius: '14px',
                                py: 1.5,
                                fontWeight: 800,
                                textTransform: 'none',
                                boxShadow: isGrowth ? `0 8px 20px ${alpha(theme.palette.secondary.main, 0.3)}` : 'none'
                              }}
                            >
                              {plan.title === 'Pro' ? 'Contact Sales' : 'Upgrade Plan'}
                            </Button>
                          )}
                        </PricingCard>
                      </Grid>
                    );
                  })}
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