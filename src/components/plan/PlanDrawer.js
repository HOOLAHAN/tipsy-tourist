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
} from '@chakra-ui/react';
import StartFinishInput from '../map/StartFinishInput';
import TravelModeButtons from '../common/TravelModeButtons';
import PubAttractionSelectors from "./PubAttractionSelectors";
import RouteAlert from "../common/RouteAlert";

import { MdOutlineLocalDrink } from "react-icons/md";

import {
  FaBeer,
} from "react-icons/fa";

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
  tipsyTouristLogo3
}) {
  return (
    <>
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <Heading color="#393f49" align="center" top="20px">
            Tipsy Tourist
          </Heading>
            <VStack spacing={2} justifyContent="space-between">
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
            <VStack spacing={3} mt={4} justifyContent="left">
              <PubAttractionSelectors
                pubStops={pubStops}
                setPubStops={setPubStops}
                attractionStops={attractionStops}
                setAttractionStops={setAttractionStops}
                travelMethod={travelMethod}
              />
              <Button
                leftIcon={
                  travelMethod === "DRIVING" || "BICYCLING" ? (
                    <MdOutlineLocalDrink />
                  ) : (
                    <FaBeer />
                  )
                }
                backgroundColor={
                  travelMethod === "DRIVING"
                    ? "#E53E3E"
                    : travelMethod === "BICYCLING"
                    ? "#FFBF00"
                    : "#38A169"
                }
                color="white"
                type="submit"
                onClick={(value) => calculateRoute(startRef, finishRef, pubStops, attractionStops, travelMethod, directionsService, setDirectionsResponse, setDistance, setTime, setCombinedStops, setJourneyWarning)}
                width="310px"
                left="5px"
              >
                {travelMethod === "DRIVING"
                  ? "Plan my Sober Sejour"
                  : travelMethod === "WALKING"
                  ? "Plan my Tipsy Tour"
                  : "Plan my best bike route"}
              </Button>{" "}
            </VStack>
            <VStack mt={4}>
              <Text>
                Total distance ({travelMethod.toLowerCase()}): {distance}{" "}
              </Text>
              <Text>
                Total time ({travelMethod.toLowerCase()}): {time}{" "}
              </Text>
              <VStack>
              </VStack>
            </VStack>
            <RouteAlert error={journeyWarning} />
        </DrawerBody>
        <DrawerFooter justifyContent={"space-between"}>
            <Button 
              colorScheme="green"
              type="submit"
              onClick={clearRoute}
            >
              Clear Route
              </Button>
          <Button colorScheme="green" onClick={onClose}>Done</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </>
  );
}

export default PlanDrawer;
