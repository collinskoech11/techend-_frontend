import { useRouter } from "next/router";
import { Box, Typography, Tabs, Tab, TextField, Button, Grid } from "@mui/material";
import { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const accent = "#be1f2f";

function ProfilePage() {
  const router = useRouter();
  const { email } = router.query;

  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Static Mock Data
  const checkout = {
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+254 712 345 678",
    payment_method: "Card",
    payment_status: "Paid",
    address: "123 TechEnd Avenue",
    city: "Nairobi",
    state: "Nairobi",
    postal_code: "00100",
    country: "Kenya",
  };

  const company = {
    name: "TechEnd Open Commerce",
    website: "https://techendforgranted.com",
  };

  const renderField = (label, value) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={4}>
        <Typography sx={{ fontWeight: "bold" }}>{label}:</Typography>
      </Grid>
      <Grid item xs={8}>
        {editMode ? (
          <TextField fullWidth size="small" defaultValue={value} />
        ) : (
          <Typography>{value}</Typography>
        )}
      </Grid>
    </Grid>
  );

  return (
    <>
      {/* <Navbar textColor={"#000"} bgColor={"#fff"} /> */}

      <Box sx={{ maxWidth: "900px", margin: "30px auto", p: 3 }}>
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
          <Tab label="Shipping Details" />
          <Tab label="Settings" />
        </Tabs>

        {tab === 0 && (
          <>
            {renderField("First Name", checkout.firstName)}
            {renderField("Last Name", checkout.lastName)}
            {renderField("Phone Number", checkout.phoneNumber)}
            {renderField("Payment Method", checkout.payment_method)}
            {renderField("Payment Status", checkout.payment_status)}
          </>
        )}

        {tab === 1 && (
          <>
            {renderField("Address", checkout.address)}
            {renderField("City", checkout.city)}
            {renderField("State", checkout.state)}
            {renderField("Postal Code", checkout.postal_code)}
            {renderField("Country", checkout.country)}
          </>
        )}

        {tab === 2 && (
          <>
            {renderField("Company Name", company.name)}
            {renderField("Company Website", company.website)}
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

      {/* <Footer /> */}
    </>
  );
}

export default ProfilePage;
