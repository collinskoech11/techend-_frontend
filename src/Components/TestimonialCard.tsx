import React from "react";
import { Box, Typography, Card, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";

interface TestimonialCardProps {
  name: string;
  description: string;
  avatarSrc?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginBottom: theme.spacing(2),
  border: `3px solid ${theme.palette.primary.main}`,
}));

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, description, avatarSrc }) => {
  return (
    <StyledCard>
      <StyledAvatar src={avatarSrc} alt={name}>
        {!avatarSrc && name ? name.charAt(0).toUpperCase() : null}
      </StyledAvatar>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        &quot;{description}&quot;
      </Typography>
    </StyledCard>
  );
};

export default TestimonialCard;
