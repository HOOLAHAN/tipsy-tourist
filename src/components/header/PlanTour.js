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
} from "@chakra-ui/react";
import StartFinishInput from "../map/StartFinishInput";
import TravelModeButtons from "../common/TravelModeButtons";
import PubAttractionSelectors from "./PubAttractionSelectors";
import RouteAlert from "../common/RouteAlert";
import { MdOutlineLocalDrink } from "react-icons/md";
import { FaBeer } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const PlanTour = ({
  startRef,
  finishRef,
  handleCar,
  handleBicycling,
  handleWalking,
  travelMethod,
  setTravelMethod,
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

  const planButtonIcon =
    travelMethod === "DRIVING" || travelMethod === "BICYCLING"
      ? <MdOutlineLocalDrink />
      : <FaBeer />;

  const planButtonText =
    travelMethod === "DRIVING"
      ? "Plan my Sober Sejour"
      : travelMethod === "WALKING"
      ? "Plan my Tipsy Tour"
      : "Plan my best bike route";

  return (
    <Box px={1}>
      <VStack spacing={3} align="stretch">
        <StartFinishInput
          startRef={startRef}
          finishRef={finishRef}
          activePicker={activePicker}
          setActivePicker={setActivePicker}
          onPlannerClose={onPlannerClose}
        />
        <Divider borderColor={theme.accent} opacity={0.45} />
        <TravelModeButtons
          onCarClick={() => handleCar(setTravelMethod, setJourneyWarning)}
          onBikeClick={() => handleBicycling(setTravelMethod, setJourneyWarning)}
          onWalkClick={() => handleWalking(setTravelMethod, setJourneyWarning)}
          travelMethod={travelMethod}
        />
        <PubAttractionSelectors
          pubStops={pubStops}
          setPubStops={setPubStops}
          attractionStops={attractionStops}
          setAttractionStops={setAttractionStops}
          travelMethod={travelMethod}
        />
        <Divider borderColor={theme.accent} opacity={0.45} />
        <Button
          leftIcon={planButtonIcon}
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
                setRouteError
              );
              if (planned) onAfterSubmit?.();
            } finally {
              setIsPlanningRoute(false);
            }
          }}
          shadow="md"
          size="md"
          w="100%"
        >
          {planButtonText}
        </Button>
        {(distance || time) && (
          <SimpleGrid columns={2} spacing={2} w="100%">
            <Stat
              borderWidth="1px"
              borderColor={theme.accent}
              borderRadius="md"
              px={3}
              py={2}
            >
              <StatLabel fontSize="xs">Distance</StatLabel>
              <StatNumber fontSize="md">{distance || "-"}</StatNumber>
            </Stat>
            <Stat
              borderWidth="1px"
              borderColor={theme.accent}
              borderRadius="md"
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
            Route mode: {travelMethod.toLowerCase()}
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
        >
          Clear Route
        </Button>
      </VStack>
    </Box>
  );
};

export default PlanTour;
