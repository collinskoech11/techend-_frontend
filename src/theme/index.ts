
import { createTheme } from '@mui/material/styles';

export const createAppTheme = (primaryColor: string) => {
  const accent = primaryColor;
  const lightGray = "#f0f2f5";
  const pageBackground = "#f8f8f8";
  const darkText = "#212121";
  const mediumText = "#4a4a4a";
  const lightText = "#757575";

  return createTheme({
    typography: {
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h3: {
        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
        fontWeight: 800,
        color: darkText,
        lineHeight: 1.2,
      },
      h6: {
        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
        fontWeight: 400,
        color: mediumText,
        lineHeight: 1.6,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: lightText,
      },
      subtitle1: {
        fontSize: '1.15rem',
        fontWeight: 600,
        color: darkText,
      }
    },
    palette: {
      primary: {
        main: accent,
      },
      grey: {
          '50': pageBackground,
          '100': lightGray,
          '200': '#e0e0e0',
      }
    },
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderRadius: '12px !important',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            '&:not(:last-of-type)': {
              marginBottom: '16px',
            },
            '&.Mui-expanded': {
              margin: '16px 0',
            },
            '&::before': {
              display: 'none',
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            backgroundColor: pageBackground,
            borderRadius: '12px !important',
            minHeight: '64px',
            padding: '16px 24px',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#fafafa',
            },
            '&.Mui-expanded': {
              minHeight: '64px',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
            '& .MuiAccordionSummary-content': {
              margin: '0 !important',
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: darkText,
            },
          },
          expandIconWrapper: {
            color: accent,
            transition: 'transform 0.3s ease',
            '&.Mui-expanded': {
              transform: 'rotate(90deg)',
            },
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            backgroundColor: lightGray,
            padding: '24px',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            borderTop: `1px solid ${accent}`,
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
          },
        },
      },
    },
  });
};
