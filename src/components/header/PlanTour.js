// src/components/header/PlanTour.js

import {
  Box,
  VStack,
  Button,
  Text,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Divider,
  ButtonGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import StartFinishInput from "../map/StartFinishInput";
import PubAttractionSelectors from "./PubAttractionSelectors";
import RouteAlert from "../common/RouteAlert";
import { FaBeer, FaMapMarkerAlt, FaRoute } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const PlanTour = ({
  startRef,
  finishRef,
  travelMethod,
  setJourneyWarning,
  pubStops,
  setPubStops,
  attractionStops,
  setAttractionStops,
  calculateRoute,
  directionsService,
  setDirectionsResponse,
  setDistance,
  setTime,
  setCombinedStops,
  setSearchCoverage,
  setRouteLegs,
  plannerMode,
  setPlannerMode,
  localRadius,
  setLocalRadius,
  journeyWarning,
  routeError,
  setRouteError,
  isPlanningRoute,
  setIsPlanningRoute,
  activePicker,
  setActivePicker,
  onPlannerClose,
  distance,
  time,
  clearRoute,
  onAfterSubmit
}) => {
  const theme = useUITheme();

  const planButtonText = plannerMode === "local" ? "Plan my local tour" : "Plan my Tipsy Tour";

  return (
    <Box px={1}>
      <VStack spacing={3} align="stretch">
        <ButtonGroup w="100%" size="sm" bg={theme.bg} border={`1px solid ${theme.accent}`} borderRadius="full" p={1} spacing={1}>
          <Button leftIcon={<FaRoute />} flex={1} borderRadius="full" onClick={() => setPlannerMode("journey")} bg={plannerMode === "journey" ? theme.primary : "transparent"} color={plannerMode === "journey" ? "white" : theme.text} _hover={{ bg: plannerMode === "journey" ? theme.accent : `${theme.accent}22` }}>Start to finish</Button>
          <Button leftIcon={<FaMapMarkerAlt />} flex={1} borderRadius="full" onClick={() => setPlannerMode("local")} bg={plannerMode === "local" ? theme.primary : "transparent"} color={plannerMode === "local" ? "white" : theme.text} _hover={{ bg: plannerMode === "local" ? theme.accent : `${theme.accent}22` }}>Local tour</Button>
        </ButtonGroup>
        <StartFinishInput
          startRef={startRef}
          finishRef={finishRef}
          activePicker={activePicker}
          setActivePicker={setActivePicker}
          onPlannerClose={onPlannerClose}
          plannerMode={plannerMode}
        />
        {plannerMode === "local" && (
          <Box borderWidth="1px" borderColor={theme.accent} borderRadius="2xl" px={4} py={3}>
            <HStack justify="space-between" mb={1}>
              <Box><Text fontSize="xs" fontWeight="extrabold" letterSpacing="0.12em">SEARCH RADIUS</Text><Text fontSize="xs" opacity={0.65}>How far from your chosen location?</Text></Box>
              <Text color={theme.primary} fontWeight="extrabold">{localRadius >= 1000 ? `${localRadius / 1000} km` : `${localRadius} m`}</Text>
            </HStack>
            <Slider aria-label="Local tour search radius" min={500} max={5000} step={250} value={localRadius} onChange={setLocalRadius}>
              <SliderTrack bg={`${theme.accent}44`}><SliderFilledTrack bg={theme.primary} /></SliderTrack><SliderThumb bg={theme.primary} />
            </Slider>
            <HStack justify="space-between"><Text fontSize="xs" opacity={0.6}>500 m</Text><Text fontSize="xs" opacity={0.6}>5 km</Text></HStack>
          </Box>
        )}
        <PubAttractionSelectors
          pubStops={pubStops}
          setPubStops={setPubStops}
          attractionStops={attractionStops}
          setAttractionStops={setAttractionStops}
        />
        <Divider borderColor={theme.accent} opacity={0.45} />
        <Button
          leftIcon={<FaBeer />}
          bg={theme.primary}
          _hover={{ bg: theme.accent, transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }}
          color="white"
          border={`1px solid ${theme.primary}`}
          isLoading={isPlanningRoute}
          loadingText="Planning route"
          onClick={async () => {
            setIsPlanningRoute(true);
            setRouteError("");
            try {
              const planned = await calculateRoute(
                startRef,
                finishRef,
                pubStops,
                attractionStops,
                travelMethod,
                directionsService,
                setDirectionsResponse,
                setDistance,
                setTime,
                setCombinedStops,
                setJourneyWarning,
                setRouteError,
                setSearchCoverage,
                setRouteLegs,
                plannerMode,
                localRadius
              );
              if (planned) onAfterSubmit?.();
            } finally {
              setIsPlanningRoute(false);
            }
          }}
          shadow="md"
          size="md"
          w="100%"
          borderRadius="full"
        >
          {planButtonText}
        </Button>
        {(distance || time) && (
          <SimpleGrid columns={2} spacing={2} w="100%">
            <Stat
              borderWidth="1px"
              borderColor={theme.accent}
              borderRadius="2xl"
              px={3}
              py={2}
            >
              <StatLabel fontSize="xs">Distance</StatLabel>
              <StatNumber fontSize="md">{distance || "-"}</StatNumber>
            </Stat>
            <Stat
              borderWidth="1px"
              borderColor={theme.accent}
              borderRadius="2xl"
              px={3}
              py={2}
            >
              <StatLabel fontSize="xs">Time</StatLabel>
              <StatNumber fontSize="md">{time || "-"}</StatNumber>
            </Stat>
          </SimpleGrid>
        )}
        <RouteAlert error={routeError || journeyWarning} />
        <HStack justify="center">
          <Text fontSize="xs" color={theme.text} opacity={0.75}>
            Walking route
          </Text>
        </HStack>
        <Button
          bg="transparent"
          color={theme.primary}
          border={`1px solid ${theme.accent}`}
          _hover={{ bg: `${theme.accent}22` }}
          onClick={clearRoute}
          size={"sm"}
          variant="outline"
          borderRadius="full"
        >
          Clear Route
        </Button>
      </VStack>
    </Box>
  );
};

export default PlanTour;
