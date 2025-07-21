import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Dialog,
  DialogContent,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useUserLoginMutation, useUserRegistrationMutation } from "@/Api/services";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { z } from "zod";
import { Visibility, VisibilityOff, AccountCircleOutlined } from "@mui/icons-material";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function AuthDialog({ onTrigger, forceOpen = false, showButton = true }) {
  const [open, setOpen] = useState(forceOpen);
  const [tabIndex, setTabIndex] = useState(0);

  const [login, { isLoading: isLoggingIn }] = useUserLoginMutation();
  const [register, { isLoading: isRegistering }] = useUserRegistrationMutation();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const username = Cookies.get("username");
    if (username) {
      setLoggedInUser(username);
      onTrigger();
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    }
  }, [forceOpen]);

  const handleTabChange = (_e, newValue) => setTabIndex(newValue);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    try {
      loginSchema.parse(loginData);

      const response = await login({ body: loginData });
      if (response.data) {
        const { access, refresh, user } = response.data;
        Cookies.set("access", access, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("refresh", refresh, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("username", user.username, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("user", JSON.stringify(user), { expires: 7, secure: false, sameSite: "Strict" });
        setLoggedInUser(user.username);
        toast.success(<Typography>Log in success</Typography>);
        setOpen(false);
        onTrigger();
      } else if (response.error) {
        toast.error(<Typography>{response.error.data.non_field_errors[0]}</Typography>);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Login failed");
      }
    }
  };

  const registerUser = async () => {
    try {
      registerSchema.parse(registerData);

      const response = await register({ body: registerData });
      if (response.data) {
        const { access, refresh, user } = response.data;
        Cookies.set("access", access, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("refresh", refresh, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("username", user.username, { expires: 7, secure: false, sameSite: "Strict" });
        Cookies.set("user", JSON.stringify(user), { expires: 7, secure: false, sameSite: "Strict" });
        setLoggedInUser(user.username);
        toast.success("Successful registration");
        setOpen(false);
        setTabIndex(0);
        onTrigger();
      } else if (response.error) {
        const emailError = response.error?.data?.email?.[0];
        const usernameError = response.error?.data?.username?.[0];
        const passwordError = response.error?.data?.password?.[0];
        const errorMessage = emailError || usernameError || passwordError || "An unknown error occurred";
        toast.error(<Typography>{errorMessage}</Typography>);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <>
      <Toaster />

      {showButton && (
        loggedInUser ? (
          <IconButton onClick={() => setOpen(true)}>
            <AccountCircleOutlined sx={{ color: "#BE1E2D", fontSize: 32 }} />
          </IconButton>
        ) : (
          <Button color="inherit" onClick={() => setOpen(true)}>
            Login
          </Button>
        )
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Box sx={{ width: "100%", maxWidth: "400px", padding: "20px", background: "#fff", borderRadius: "5px" }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            {tabIndex === 0 && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPasswordLogin ? "text" : "password"}
                  value={loginData.password}
                  onChange={handleLoginChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPasswordLogin(!showPasswordLogin)} edge="end">
                          {showPasswordLogin ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "right",
                    mt: 1,
                    cursor: "pointer",
                    color: "#BE1E2D",
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    setOpen(false);
                    router.push("/forgot-password");
                  }}
                >
                  Forgot Password?
                </Typography>

                <Button
                  fullWidth
                  sx={{ mt: 2, background: "#BE1E2D", color: "#fff", fontWeight: "600", "&:hover": { background: "#a51a27" } }}
                  onClick={loginUser}
                >
                  {isLoggingIn ? <CircularProgress sx={{ color: "#fff" }} size={24} /> : "Login"}
                </Button>
              </Box>
            )}

            {tabIndex === 1 && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPasswordRegister ? "text" : "password"}
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPasswordRegister(!showPasswordRegister)} edge="end">
                          {showPasswordRegister ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  fullWidth
                  sx={{ mt: 2, background: "#BE1E2D", color: "#fff", fontWeight: "600", "&:hover": { background: "#a51a27" } }}
                  onClick={registerUser}
                >
                  {isRegistering ? <CircularProgress sx={{ color: "#fff" }} size={24} /> : "Register"}
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AuthDialog;
