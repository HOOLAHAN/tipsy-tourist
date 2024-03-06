// components/PubAttractionSelectors.js
import { HStack, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";

import { handlePubs, handleAttractions } from '../functions/stateHandlers';

const PubAttractionSelectors = ({ pubStops, setPubStops, attractionStops, setAttractionStops, travelMethod }) => (
  <HStack>
    <Text> Pubs: </Text>
    <NumberInput
      onChange={(value) => handlePubs(setPubStops, value)}
      value={pubStops}
      min={1}
      max={travelMethod === "WALKING" ? 7 : 1}
    >
      <NumberInputField width="80px" />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
    <Text> Attractions: </Text>
    <NumberInput
      value={attractionStops}
      min={1}
      max={3}
      onChange={(value) => handleAttractions(setAttractionStops, value)}
    >
      <NumberInputField width="80px" />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  </HStack>
);

export default PubAttractionSelectors;
