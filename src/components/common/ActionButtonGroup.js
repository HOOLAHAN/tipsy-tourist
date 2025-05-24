// components/common/ActionButtonGroup.js

import { VStack, IconButton, Tooltip } from "@chakra-ui/react";
import { FaTimes, FaLocationArrow } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const ActionButtonGroup = ({ clearRoute, onCenter }) => {
  const theme = useUITheme();

  return (
    <VStack spacing={2} px={4} py={3}>
      <Tooltip label="Re-center map" hasArrow>
        <IconButton
          aria-label="Re-center map"
          icon={<FaLocationArrow />}
          onClick={onCenter}
          isRound
          bg={theme.primary}
          color="white"
          _hover={{ bg: theme.accent }}
          boxShadow="md"
        />
      </Tooltip>
      <Tooltip label="Clear route" hasArrow>
        <IconButton
          aria-label="Clear route"
          icon={<FaTimes />}
          onClick={clearRoute}
          isRound
          bg={theme.primary}
          color="white"
          _hover={{ bg: theme.accent }}
          boxShadow="md"
        />
      </Tooltip>
    </VStack>
  );
};

export default ActionButtonGroup;
