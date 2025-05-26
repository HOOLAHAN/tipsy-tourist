import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/raleway/400.css";
import "@fontsource/open-sans/700.css";
import App from "./App";

// Define your theme configuration
const theme = extendTheme({
  styles: {
    global: {
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
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </BrowserRouter>
);
