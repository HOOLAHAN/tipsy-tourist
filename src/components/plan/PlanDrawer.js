// src/components/plan/PlanDrawer.js

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  Button,
  VStack,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import StartFinishInput from "../map/StartFinishInput";
import TravelModeButtons from "../common/TravelModeButtons";
import PubAttractionSelectors from "./PubAttractionSelectors";
import RouteAlert from "../common/RouteAlert";
import { MdOutlineLocalDrink } from "react-icons/md";
import { FaBeer } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

function PlanDrawer({
  isOpen,
  onClose,
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
  tipsyTouristLogo3,
}) {
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
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg={theme.bg} color={theme.text}>
        <DrawerCloseButton />
        <DrawerBody>
          <Heading textAlign="center" color={theme.text} mt={4}>
            Tipsy Tourist
          </Heading>

          <VStack spacing={2} mt={4}>
            <Image
              boxSize="60px"
              objectFit="cover"
              src={tipsyTouristLogo3}
              alt="logo"
            />
            <StartFinishInput startRef={startRef} finishRef={finishRef} />
            <TravelModeButtons
              onCarClick={() => handleCar(setTravelMethod, setJourneyWarning)}
              onBikeClick={() => handleBicycling(setTravelMethod, setJourneyWarning)}
              onWalkClick={() => handleWalking(setTravelMethod, setJourneyWarning)}
              travelMethod={travelMethod}
            />
          </VStack>

          <VStack spacing={3} mt={4} align="stretch">
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
              onClick={() =>
                calculateRoute(
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
                )
              }
              width="100%"
              shadow="md"
            >
              {planButtonText}
            </Button>
          </VStack>

          <VStack mt={6} align="stretch">
            <Text>
              Total distance ({travelMethod.toLowerCase()}): {distance}
            </Text>
            <Text>
              Total time ({travelMethod.toLowerCase()}): {time}
            </Text>
          </VStack>

          <RouteAlert error={journeyWarning} />
        </DrawerBody>

        <DrawerFooter justifyContent="space-between" borderTopWidth="1px" borderColor={theme.accent}>
          <Button
            bg={theme.primary}
            color="white"
            _hover={{ bg: theme.accent }}
            onClick={clearRoute}
          >
            Clear Route
          </Button>
          <Button
            bg={theme.primary}
            color="white"
            _hover={{ bg: theme.accent }}
            onClick={onClose}
          >
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default PlanDrawer;
