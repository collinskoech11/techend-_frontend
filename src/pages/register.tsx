import Navbar from "@/Components/Navbar";
import { Box, CircularProgress, Typography, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { useUserRegistrationMutation } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { z } from "zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Zod schema for form validation
const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Register() {
  const [register, { isLoading, error }] = useUserRegistrationMutation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    try {
      // Validate form data
      registerSchema.parse(formData);

      const response = await register({ body: formData });
      if (response.data) {
        const { access, refresh, user } = response.data;
        Cookies.set("access", access, { expires: 7 });
        Cookies.set("refresh", refresh, { expires: 7 });
        Cookies.set("user", user, { expires: 7 });
        toast.success("Successful registration");
        router.push("/shop");
      } else if (response.error) {
        const emailError = response.error?.data?.email?.[0];
        const usernameError = response.error?.data?.username?.[0];
        const passwordError = response.error?.data?.password?.[0];
        const error_message = emailError || usernameError || passwordError || "An unknown error occurred";

        toast.error(
          <>
            <Typography>{error_message}</Typography>
          </>
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <Toaster />
      <Navbar textColor={'#000'} bgColor={'#fff'}/>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            margin: "auto",
            padding: "20px",
            marginTop: "50px",
            background: "#fff",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgb(0,0,0,0.1)",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <h1
              style={{
                color: "#000",
                fontSize: "24px",
                fontWeight: "600",
                fontFamily: "sans-serif",
              }}
            >
              Register
            </h1>
            <TextField
              fullWidth
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <button
              style={{
                width: "100%",
                height: "40px",
                padding: "5px",
                marginTop: "20px",
                border: "1px solid rgb(0,0,0,0.2)",
                borderRadius: "5px",
                background: "#BE1E2D",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={registerUser}
            >
              {isLoading ? (
                <CircularProgress style={{ color: "#fff" }} size={24} />
              ) : (
                "Register"
              )}
            </button>
            <p style={{ marginTop: "20px" }}>
              Already have an account?{" "}
              <a
                href="/login"
                style={{ color: "#BE1E2D", textDecoration: "none" }}
              >
                Login
              </a>
            </p>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Register;
