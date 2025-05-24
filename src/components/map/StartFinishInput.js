// components/map/StartFinishInput.js

import { VStack, Input } from "@chakra-ui/react";
import { Autocomplete } from "@react-google-maps/api";
import { useUITheme } from "../../context/ThemeContext";

const StartFinishInput = ({ startRef, finishRef }) => {
  const theme = useUITheme();

  const inputStyle = {
    bg: theme.bg,
    color: theme.text,
    borderColor: theme.accent,
    _placeholder: { color: theme.text },
    _hover: { borderColor: theme.accent },
    _focus: { borderColor: theme.accent, boxShadow: `0 0 0 1px ${theme.accent}` },
  };

  return (
    <VStack spacing={2} justifyContent="space-between">
      <Autocomplete>
        <Input
          type="text"
          placeholder="Start (e.g. Camden, UK)"
          ref={startRef}
          width="250px"
          {...inputStyle}
        />
      </Autocomplete>
      <Autocomplete>
        <Input
          type="text"
          placeholder="Finish (e.g. Westminster, UK)"
          ref={finishRef}
          width="250px"
          {...inputStyle}
        />
      </Autocomplete>
    </VStack>
  );
};

export default StartFinishInput;
