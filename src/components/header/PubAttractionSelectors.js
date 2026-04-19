// components/header/PubAttractionSelectors.js

import {
  SimpleGrid,
  HStack,
  IconButton,
  Text,
  Box,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { handlePubs, handleAttractions } from "../../features/routing/stateHandlers";
import { useUITheme } from "../../context/ThemeContext";
import { FaCameraRetro, FaMinus, FaPlus } from "react-icons/fa";
import { MdLocalBar } from "react-icons/md";

const PubAttractionSelectors = ({
  pubStops,
  setPubStops,
  attractionStops,
  setAttractionStops,
  travelMethod,
}) => {
  const theme = useUITheme();

  const inputStyle = {
    width: "64px",
    minW: "64px",
    h: "40px",
    bg: theme.bg,
    color: theme.text,
    borderColor: theme.accent,
    textAlign: "center",
    fontSize: "md",
    fontWeight: "semibold",
    lineHeight: "40px",
    px: 0,
    _placeholder: { color: theme.text },
    _hover: { borderColor: theme.accent },
    _focus: { borderColor: theme.accent, boxShadow: `0 0 0 1px ${theme.accent}` },
  };

  const clamp = (value, min, max) => Math.min(Math.max(Number(value) || min, min), max);

  const StepperCard = ({ label, icon, value, min, max, onChange }) => (
    <Box borderWidth="1px" borderColor={theme.accent} borderRadius="md" p={3}>
      <HStack justify="space-between" mb={3}>
        <HStack spacing={2}>
          {icon}
          <Text color={theme.text} fontSize="sm" fontWeight="semibold">{label}</Text>
        </HStack>
        <Text color={theme.text} fontSize="xs" opacity={0.65}>Max {max}</Text>
      </HStack>
      <HStack justify="space-between">
        <IconButton
          aria-label={`Decrease ${label.toLowerCase()}`}
          icon={<FaMinus />}
          size="sm"
          isRound
          isDisabled={Number(value) <= min}
          onClick={() => onChange(clamp(Number(value) - 1, min, max))}
          bg="transparent"
          color={theme.primary}
          border={`1px solid ${theme.accent}`}
          _hover={{ bg: `${theme.accent}22` }}
        />
        <NumberInput
          value={value}
          min={min}
          max={max}
          onChange={(nextValue) => onChange(clamp(nextValue, min, max))}
          w="64px"
          minW="64px"
        >
          <NumberInputField {...inputStyle} />
        </NumberInput>
        <IconButton
          aria-label={`Increase ${label.toLowerCase()}`}
          icon={<FaPlus />}
          size="sm"
          isRound
          isDisabled={Number(value) >= max}
          onClick={() => onChange(clamp(Number(value) + 1, min, max))}
          bg={theme.primary}
          color="white"
          _hover={{ bg: theme.accent }}
        />
      </HStack>
    </Box>
  );

  return (
    <SimpleGrid columns={2} spacing={2} w="100%">
      <StepperCard
        label="Pubs"
        icon={<MdLocalBar color={theme.primary} />}
        value={pubStops}
        min={1}
        max={travelMethod === "WALKING" ? 7 : 1}
        onChange={(value) => handlePubs(setPubStops, value)}
      />
      <StepperCard
        label="Attractions"
        icon={<FaCameraRetro color={theme.primary} />}
        value={attractionStops}
        min={1}
        max={3}
        onChange={(value) => handleAttractions(setAttractionStops, value)}
      />
    </SimpleGrid>
  );
};

export default PubAttractionSelectors;
