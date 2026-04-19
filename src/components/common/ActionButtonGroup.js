// components/common/ActionButtonGroup.js

import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { FaTimes, FaLocationArrow } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const ActionButtonGroup = ({ clearRoute, onCenter }) => {
  const theme = useUITheme();

  return (
    <Flex gap={2} direction={{ base: "row", md: "column" }}>
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
          size="sm"
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
          size="sm"
        />
      </Tooltip>
    </Flex>
  );
};

export default ActionButtonGroup;
