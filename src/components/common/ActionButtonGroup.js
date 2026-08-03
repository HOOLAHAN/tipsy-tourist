// components/common/ActionButtonGroup.js

import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { FaTimes, FaLocationArrow, FaSearchLocation } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const ActionButtonGroup = ({ clearRoute, onCenter, hasRoute, hasSearchCoverage, showSearchCoverage, onToggleSearchCoverage }) => {
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
          size="lg"
        />
      </Tooltip>
      {hasSearchCoverage && (
        <Tooltip label={`${showSearchCoverage ? "Hide" : "Show"} search coverage`} hasArrow>
          <IconButton
            aria-label={`${showSearchCoverage ? "Hide" : "Show"} search coverage`}
            aria-pressed={showSearchCoverage}
            icon={<FaSearchLocation />}
            onClick={onToggleSearchCoverage}
            isRound
            bg={showSearchCoverage ? theme.accent : theme.bg}
            color={showSearchCoverage ? "white" : theme.text}
            _hover={{ bg: theme.accent, color: "white" }}
            border={`1px solid ${theme.accent}`}
            boxShadow="md"
            size="lg"
          />
        </Tooltip>
      )}
      {hasRoute && (
        <Tooltip label="Clear route" hasArrow>
          <IconButton
            aria-label="Clear route"
            icon={<FaTimes />}
            onClick={clearRoute}
            isRound
            bg={theme.bg}
            color={theme.text}
            _hover={{ bg: theme.accent }}
            boxShadow="md"
            size="lg"
          />
        </Tooltip>
      )}
    </Flex>
  );
};

export default ActionButtonGroup;
