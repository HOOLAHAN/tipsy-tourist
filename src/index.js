import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/raleway/400.css";
import "@fontsource/open-sans/700.css";
import App from "./App";
import SupportPage from "./components/support/SupportPage";

// Define your theme configuration
const theme = extendTheme({
  styles: {
    global: {
      html: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        overscrollBehavior: "none",
      },
      body: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        overscrollBehavior: "none",
        margin: 0,
      },
      "#root": {
        width: "100%",
        height: "100%",
        overflow: "hidden",
      },
      "@supports (height: 100dvh)": {
        "#root": {
          height: "100dvh",
        },
      },
      // Targeting the Google Maps Autocomplete dropdown
      '.pac-container': {
        zIndex: '9999', // Ensure it's above most other components
      },
    },
  },
  fonts: {
    heading: `'Raleway', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
});

// Get the container element
const container = document.getElementById("root");

// Create a root
const root = createRoot(container);

// Render the app with BrowserRouter and ChakraProvider using the defined theme

// Uncomment the following lines if you want to use React.StrictMode (in dev mode only)
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ChakraProvider theme={theme}>
//         <App />
//       </ChakraProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );

root.render(
  <HashRouter>
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy" element={<SupportPage />} />
        <Route path="/terms" element={<SupportPage />} />
        <Route path="/safety" element={<SupportPage />} />
        <Route path="/data-deletion" element={<SupportPage />} />
        <Route path="*" element={<SupportPage />} />
      </Routes>
    </ChakraProvider>
  </HashRouter>
);
