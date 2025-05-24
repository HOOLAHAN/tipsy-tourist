// components/plan/PubAttractionSelectors.js

import {
  HStack,
  Text,
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
    <HStack>
      <Text color={theme.text}>Pubs:</Text>
      <NumberInput
        value={pubStops}
        min={1}
        max={travelMethod === "WALKING" ? 7 : 1}
        onChange={(value) => handlePubs(setPubStops, value)}
      >
        <NumberInputField {...inputStyle} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Text color={theme.text}>Attractions:</Text>
      <NumberInput
        value={attractionStops}
        min={1}
        max={3}
        onChange={(value) => handleAttractions(setAttractionStops, value)}
      >
        <NumberInputField {...inputStyle} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </HStack>
  );
};

export default PubAttractionSelectors;
