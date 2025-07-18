import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import {
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
} from "@/Api/services";

export default function ForgotPassword() {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const [confirmPasswordReset] = useConfirmPasswordResetMutation();
  const router = useRouter();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset({ body: { email } });
      if (response?.data) {
        toast.success("OTP sent to your email address.");
        setStep("confirm");
      } else if (response?.error) {
        toast.error(response.error.data?.detail || "Failed to send OTP.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      const response = await confirmPasswordReset({ body: payload });

      if (response?.data) {
        toast.success("Password reset successfully!");
        router.push("/");
      } else if (response?.error) {
        toast.error(response.error.data?.detail || "OTP verification failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
      }}
    >
      <Toaster />
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography
          variant="h5"
          fontWeight={700}
          mb={2}
          textAlign="center"
          color="#BE1E2D"
        >
          {step === "request" ? "Forgot Password" : "Reset Your Password"}
        </Typography>
        <form onSubmit={step === "request" ? handleRequestReset : handleConfirmReset}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            disabled={step === "confirm"}
          />
          {step === "confirm" && (
            <>
              <TextField
                fullWidth
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                margin="normal"
              />
            </>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              background: "#BE1E2D",
              color: "#fff",
              fontWeight: 600,
              "&:hover": { background: "#a51a27" },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : step === "request" ? (
              "Send OTP"
            ) : (
              "Reset Password"
            )}
          </Button>
          <Button fullWidth sx={{ mt: 2 }} onClick={() => router.push("/")}>
            Back to Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
