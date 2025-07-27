import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePickupLocationMutation } from "@/Api/services";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import AuthDialog from "@/Components/AuthDialog";
import { useEffect, useState } from "react";

// Define validation schema for the form
interface AddPickupLocationFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  delivery_fee: number;
  gmaps_link?: string;
}

const addPickupLocationSchema: z.ZodSchema<AddPickupLocationFormData> = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal Code is required"),
  country: z.string().min(1, "Country is required"),
  delivery_fee: z.coerce.number().min(0, "Delivery Fee must be a positive number"),
  gmaps_link: z.string().url("Must be a valid URL").optional(),
});

const AddPickupLocation = () => {
  const [createPickupLocation, { isLoading }] = useCreatePickupLocationMutation();
  const router = useRouter();
  const shopname = Cookies.get("shopname") || "techend";
  const token = Cookies.get("access");
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsAuthDialogOpen(true);
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPickupLocationFormData>({
    resolver: zodResolver(addPickupLocationSchema),
  });

  const onSubmit = async (data: AddPickupLocationFormData) => {
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }
    try {
      const response = await createPickupLocation({
        company_slug: shopname,
        token,
        body: data,
      }).unwrap();
      toast.success("Pickup Location added successfully!");
      reset();
      // Optionally redirect after successful creation
      // router.push(`/company-owner/pickup-locations`);
    } catch (error: any) {
      console.error("Failed to add pickup location:", error);
      toast.error(error.data?.detail || error.data?.message || "Failed to add pickup location.");
    }
  };

    return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto", position: 'relative' }}>
      <Toaster />
      {token ? (
        <>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
            Add New Pickup Location
          </Typography>

          <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location Name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    {...register("city")}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    {...register("state")}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    {...register("postal_code")}
                    error={!!errors.postal_code}
                    helperText={errors.postal_code?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    {...register("country")}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Delivery Fee (Kes)"
                    type="number"
                    inputMode="decimal"
                    {...register("delivery_fee")}
                    error={!!errors.delivery_fee}
                    helperText={errors.delivery_fee?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Google Maps Link (Optional)"
                    {...register("gmaps_link")}
                    error={!!errors.gmaps_link}
                    helperText={errors.gmaps_link?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, py: 1.5, backgroundColor: "#BE1E2D", "&:hover": { backgroundColor: "#a71824" } }}
                  >
                    Add Pickup Location
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </>
      ) : (
        <>
          <Box sx={{ position: 'relative', filter: 'blur(4px)', pointerEvents: 'none' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
              Add New Pickup Location
            </Typography>

            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
              <form noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location Name"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Delivery Fee (Kes)"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Google Maps Link (Optional)"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, py: 1.5, backgroundColor: "#BE1E2D", "&:hover": { backgroundColor: "#a71824" } }}
                      disabled
                    >
                      Add Pickup Location
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white for glass effect
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1, // Ensure it's above the blurred form
            }}
          >
            <Button
              variant="contained"
              onClick={() => setIsAuthDialogOpen(true)}
              sx={{
                backgroundColor: "#BE1E2D",
                "&:hover": { backgroundColor: "#a71824" },
                fontSize: '1.2rem',
                padding: '15px 30px',
              }}
            >
              Login to Add Pickup Location
            </Button>
          </Box>
          <AuthDialog open={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
        </>
      )}
    </Box>
  );
}
export default AddPickupLocation;
