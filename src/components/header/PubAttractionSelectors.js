// components/header/PubAttractionSelectors.js

import {
  SimpleGrid,
  HStack,
  Text,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { handlePubs, handleAttractions } from "../../features/routing/stateHandlers";
import { useUITheme } from "../../context/ThemeContext";

const PubAttractionSelectors = ({
  pubStops,
  setPubStops,
  attractionStops,
  setAttractionStops,
  travelMethod,
}) => {
  const theme = useUITheme();

  const inputStyle = {
    width: "80px",
    bg: theme.bg,
    color: theme.text,
    borderColor: theme.accent,
    _placeholder: { color: theme.text },
    _hover: { borderColor: theme.accent },
    _focus: { borderColor: theme.accent, boxShadow: `0 0 0 1px ${theme.accent}` },
  };

  return (
    <SimpleGrid columns={2} spacing={2} w="100%">
      <Box borderWidth="1px" borderColor={theme.accent} borderRadius="md" p={3}>
        <Text color={theme.text} fontSize="xs" mb={2}>Pubs</Text>
        <HStack justify="space-between">
        <NumberInput
          value={pubStops}
          min={1}
          max={travelMethod === "WALKING" ? 7 : 1}
          onChange={(value) => handlePubs(setPubStops, value)}
          maxW="60px"
        >
          <NumberInputField {...inputStyle} width="60px" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        </HStack>
      </Box>
      <Box borderWidth="1px" borderColor={theme.accent} borderRadius="md" p={3}>
        <Text color={theme.text} fontSize="xs" mb={2}>Attractions</Text>
        <HStack justify="space-between">
        <NumberInput
          value={attractionStops}
          min={1}
          max={3}
          onChange={(value) => handleAttractions(setAttractionStops, value)}
          maxW="130px"
        >
          <NumberInputField {...inputStyle} width="60px" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        </HStack>
      </Box>
    </SimpleGrid>
  );
};

export default PubAttractionSelectors;
