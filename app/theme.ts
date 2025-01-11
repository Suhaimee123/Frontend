import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0070f3', // สีหลัก
    },
    secondary: {
      main: '#f5f5f5', // สีรอง
    },
    text: {
      primary: '#333', // สีข้อความ
    },
    background: {
      default: '#fff', // สีพื้นหลังหลัก
    },
  },
  typography: {
    fontFamily: 'Kanit, Arial, sans-serif',
    h1: {
      fontFamily: 'Kanit, Arial, sans-serif',
      fontWeight: 700, // Example for heading 1
    },
    body1: {
      fontFamily: 'Kanit, Arial, sans-serif',
      fontWeight: 400, // Example for body text
    },
    // Add other typography variants if needed
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Kanit, Arial, sans-serif',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#ddd', // สีกรอบ
        },
      },
    },
  },
});
