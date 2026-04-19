// components/map/StartFinishInput.js

import { Box, IconButton, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { Autocomplete } from "@react-google-maps/api";
import { useUITheme } from "../../context/ThemeContext";
import { FaMapMarkerAlt } from "react-icons/fa";

const StartFinishInput = ({ startRef, finishRef, activePicker, setActivePicker, onPlannerClose }) => {
  const theme = useUITheme();

  const inputStyle = {
    bg: theme.bg,
    color: theme.text,
    borderColor: theme.accent,
    _placeholder: { color: theme.text },
    _hover: { borderColor: theme.accent },
    _focus: { borderColor: theme.accent, boxShadow: `0 0 0 1px ${theme.accent}` },
  };

  const pickerButtonProps = (picker, label) => ({
    size: "xs",
    icon: <FaMapMarkerAlt />,
    "aria-label": label,
    bg: activePicker === picker ? theme.primary : "transparent",
    color: activePicker === picker ? "white" : theme.primary,
    borderColor: theme.accent,
    borderWidth: "1px",
    _hover: {
      bg: activePicker === picker ? theme.accent : `${theme.accent}22`,
    },
    onClick: () => {
      const nextPicker = activePicker === picker ? null : picker;
      setActivePicker?.(nextPicker);
      if (nextPicker) onPlannerClose?.();
    },
  });

  return (
    <VStack spacing={2} align="stretch">
      <HStack spacing={2}>
        <Box flex="1">
          <Autocomplete>
            <Input
              type="text"
              placeholder="Start location"
              ref={startRef}
              size="md"
              {...inputStyle}
            />
          </Autocomplete>
        </Box>
        <IconButton {...pickerButtonProps("start", "Pick start on map")} />
      </HStack>
      <HStack spacing={2}>
        <Box flex="1">
          <Autocomplete>
            <Input
              type="text"
              placeholder="Finish location"
              ref={finishRef}
              size="md"
              {...inputStyle}
            />
          </Autocomplete>
        </Box>
        <IconButton {...pickerButtonProps("finish", "Pick finish on map")} />
      </HStack>
      {activePicker && (
        <Text fontSize="xs" color={theme.text} opacity={0.75} textAlign="center">
          Click the map to set your {activePicker} point.
        </Text>
      )}
    </VStack>
  );
};

export default StartFinishInput;
