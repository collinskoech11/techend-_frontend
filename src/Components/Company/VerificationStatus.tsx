import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { YourChildProps } from "@/Types";
import Confetti from "./Confetti";

const VerificationStatus = ({ nextStep, prevStep, steps, activeStep, companyData, setCompanyData, token, refetchCompany, triggerRerender }: YourChildProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "40vh",
        background: "transparent",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <CardContent>
          <Confetti/>
          <Typography variant="h5" align="center" gutterBottom color="success.main">
            Verification In Progress!
          </Typography>
          <Typography variant="body1" align="center">
            Your verification is being processed. Please wait while a sales agent onboards you.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerificationStatus;
