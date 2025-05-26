// src/components/header/PlanTour.js

import {
  Box,
  VStack,
  Button,
  Text,
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
    <Box mt={4} px={4}>
      <VStack spacing={2}>
        <StartFinishInput startRef={startRef} finishRef={finishRef} />
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
        <Button
          leftIcon={planButtonIcon}
          bg={theme.primary}
          _hover={{ bg: theme.accent }}
          color="white"
          onClick={async () => {
            await calculateRoute(
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
              setJourneyWarning
            );
            onAfterSubmit?.();
          }}
          width="100%"
          shadow="md"
          size="sm"
          m={2}
        >
          {planButtonText}
        </Button>
        <Text>
          Total distance ({travelMethod.toLowerCase()}): {distance}
        </Text>
        <Text>
          Total time ({travelMethod.toLowerCase()}): {time}
        </Text>
        <RouteAlert error={journeyWarning} />
        <Button
          bg={theme.primary}
          color="white"
          _hover={{ bg: theme.accent }}
          onClick={clearRoute}
          size={"sm"}
        >
          Clear Route
        </Button>
      </VStack>
    </Box>
  );
};

export default PlanTour;
