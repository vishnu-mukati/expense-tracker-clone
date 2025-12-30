import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6d28d9",
    },
    secondary: {
      main: "#38015c",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6d28d9",
    },
    secondary: {
      main: "#38015c",
    },
    background: {
      default: "#1a1a2e",
      paper: "#16213e",
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});
