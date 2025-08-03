import React from 'react';
import { Button, styled } from '@mui/material';
import { keyframes } from '@mui/system';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
  100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
`;

const StyledFuturisticButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  border: 0,
  borderRadius: 50,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: `0 3px 5px 2px rgba(255, 105, 135, .3)`,
  transition: 'all 0.3s ease-in-out',
  fontWeight: 700,
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 5px 15px 5px rgba(255, 105, 135, .4)`,
    '&::before': {
      transform: 'scaleX(1)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.5s ease',
  },
  '& .MuiButton-endIcon': {
    marginLeft: theme.spacing(1),
  },
}));

interface FuturisticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  endIcon?: React.ReactNode;
}

const FuturisticButton: React.FC<FuturisticButtonProps> = ({ children, onClick, endIcon }) => {
  return (
    <StyledFuturisticButton onClick={onClick} endIcon={endIcon}>
      {children}
    </StyledFuturisticButton>
  );
};

export default FuturisticButton;
