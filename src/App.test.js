import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true }),
  Autocomplete: ({ children }) => <div>{children}</div>,
  GoogleMap: ({ children }) => <div>{children}</div>,
  Marker: () => null,
  DirectionsRenderer: () => null,
}));

beforeAll(() => {
  global.google = {
    maps: {
      DirectionsService: jest.fn(),
      SymbolPath: { CIRCLE: 'CIRCLE' },
      TravelMode: {
        WALKING: 'WALKING',
        DRIVING: 'DRIVING',
        BICYCLING: 'BICYCLING',
      },
    },
  };
});

test('renders the route planner brand', () => {
  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
  expect(screen.getByRole('button', { name: /plan route/i })).toBeInTheDocument();
  expect(screen.getByText(/plan a pub-and-sights route/i)).toBeInTheDocument();
});
