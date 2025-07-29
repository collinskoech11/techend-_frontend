import Navbar from "@/Components/Navbar";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useUserLoginMutation } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { z } from "zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Zod schema for form validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

import { GoogleOAuthProvider } from '@react-oauth/google';

function Login() {
  const [login, { isLoading }] = useUserLoginMutation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [shopname, setShopName] = useState(Cookies.get("shopname") || "techend");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    try {
      // Validate form data
      loginSchema.parse(formData);

      const response = await login({ body: formData });
      if (response.data) {
        const { access, refresh, user } = response.data;
        Cookies.set("access", access, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("refresh", refresh, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("username", user.username, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("user", JSON.stringify(user), { expires: 7, secure: false, sameSite: "Strict" });

        toast.success(<Typography>Log in success</Typography>);
        router.push(`/shop/${shopname}`);
      } else if (response.error) {
        toast.error(<Typography>{response.error.data?.non_field_errors?.[0] || "Login failed"}</Typography>);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("an error occured");
      } else {
        toast.error("Login failed");
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={'233747387248-23lb8510miqkj|2nd0ajc3885ap0023c.apps.googleusercontent.com'}>
      <Toaster />
      {/* <Navbar textColor={'#000'} bgColor={'#fff'} /> */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100dvh - 64px)",
          pt: 8,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            margin: "auto",
            padding: "20px",
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
              Login
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

            {/* Forgot Password Link */}
            <Typography
              variant="body2"
              sx={{
                textAlign: "right",
                mt: 1,
                cursor: "pointer",
                color: "#BE1E2D",
                fontWeight: 500,
              }}
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </Typography>

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
              onClick={loginUser}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress style={{ color: "#fff" }} size={24} />
              ) : (
                "Login"
              )}
            </button>

            <p style={{ marginTop: "20px" }}>
              Don't have an account?{" "}
              <a
                href="/register"
                style={{ color: "#BE1E2D", textDecoration: "none" }}
              >
                Register
              </a>
            </p>
          </Box>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
}

export default Login;
