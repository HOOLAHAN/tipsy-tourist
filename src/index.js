import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  </BrowserRouter>
);
