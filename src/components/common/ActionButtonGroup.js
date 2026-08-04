// components/common/ActionButtonGroup.js

import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { FaTimes, FaLocationArrow, FaSearchLocation, FaWalking } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const ActionButtonGroup = ({
  clearRoute,
  onCenter,
  hasRoute,
  hasSearchCoverage,
  showSearchCoverage,
  onToggleSearchCoverage,
  infoControl,
  themeControl,
  itineraryControl,
  showRouteLegs,
  onToggleRouteLegs,
}) => {
  const theme = useUITheme();

  return (
    <Flex
      gap={{ base: 1, md: 2 }}
      direction={{ base: "row", md: "column" }}
      sx={{ "& button": { width: { base: "40px", md: "48px" }, height: { base: "40px", md: "48px" }, minWidth: { base: "40px", md: "48px" } } }}
    >
      <Tooltip label="Re-center map" hasArrow>
        <IconButton
          aria-label="Re-center map"
          icon={<FaLocationArrow />}
          onClick={onCenter}
          isRound
          bg={theme.bg}
          color={theme.text}
          border={`1px solid ${theme.accent}`}
          _hover={{ bg: `${theme.accent}22` }}
          boxShadow="md"
          size="lg"
        />
      </Tooltip>
      {infoControl}
      {themeControl}
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
        <Tooltip label={`${showRouteLegs ? "Hide" : "Show"} walking times and distances`} hasArrow>
          <IconButton
            aria-label={`${showRouteLegs ? "Hide" : "Show"} walking times and distances`}
            aria-pressed={showRouteLegs}
            icon={<FaWalking />}
            onClick={onToggleRouteLegs}
            isRound
            bg={showRouteLegs ? theme.accent : theme.bg}
            color={showRouteLegs ? "white" : theme.text}
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
      {itineraryControl}
    </Flex>
  );
};

export default ActionButtonGroup;
