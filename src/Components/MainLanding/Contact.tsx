"use client";

import React, { useState } from "react";
import { Box, Typography, Grid, TextField, Button, CircularProgress } from "@mui/material";
import { useCreateContactMessageMutation } from "@/Api/services";
import toast from "react-hot-toast";

const darkText = "#212121";
const lightText = "#555555";

const Contact = () => {
  const [createContactMessage, { isLoading }] = useCreateContactMessageMutation();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createContactMessage({ body: formState }).unwrap();
      toast.success("Message sent successfully!");
      setFormState({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  return (
    <Box 
      sx={{ 
        py: 10, 
        px: { xs: 3, md: 6 }, 
        bgcolor: 'background.paper', 
        borderRadius: '32px', 
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
        maxWidth: '1000px',
        mx: 'auto'
      }} 
      id="contact"
    >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Box 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 1, 
              px: 2, 
              py: 0.5, 
              borderRadius: '50px', 
              bgcolor: 'primary.light', 
              opacity: 0.9,
              mb: 1
            }}
          >
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}>
              💬 GET IN TOUCH
            </Typography>
          </Box>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, textAlign: "center", color: darkText }}>
          Contact Us
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: "700px", mx: "auto", mb: 6, color: lightText, textAlign: "center", fontSize: { xs: '1rem', md: '1.15rem' } }}>
          Have a question or want to learn more? Send us a message and we&apos;ll get back to you as soon as possible.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Name" name="name" value={formState.name} onChange={handleInputChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" name="email" value={formState.email} onChange={handleInputChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={4} label="Message" name="message" value={formState.message} onChange={handleInputChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, py: '12px', px: '30px', fontSize: '1rem', borderRadius: '20px', fontWeight: 600 }}>
                    {isLoading ? <CircularProgress size={24} /> : "Send Message"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
    </Box>
  );
};

export default Contact;
