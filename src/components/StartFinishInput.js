// components/StartFinishInput.js
import { VStack, Input } from "@chakra-ui/react";
import { Autocomplete } from "@react-google-maps/api"

const StartFinishInput = ({ startRef, finishRef }) => (
  <VStack spacing={2} justifyContent="space-between">
    <Autocomplete>
      <Input
        type="text"
        placeholder="Start (e.g. Camden, UK)"
        ref={startRef}
        width="250px"
      />
    </Autocomplete>
    <Autocomplete>
      <Input
        type="text"
        placeholder="Finish (e.g. Westminster, UK)"
        ref={finishRef}
        width="250px"
      />
    </Autocomplete>
  </VStack>
);

export default StartFinishInput;
