import RouteAlert from "./components/RouteAlert";
import ItineraryDrawer from './components/ItineraryDrawer';
import { calculateRoute } from "./functions/calculateRoute";
import { handlePubs, handleAttractions, handleCar, handleBicycling, handleWalking } from './functions/stateHandlers';

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  VStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Center
} from "@chakra-ui/react";

import {
  FaLocationArrow,
  FaTimes,
  FaBeer,
  FaCar,
  FaWalking,
  FaBicycle,
} from "react-icons/fa"; // icons

import { MdOutlineLocalDrink } from "react-icons/md";

import tipsyTouristLogo3 from "./images/logo3.svg";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api"; // provides 'is loaded'
import { useState, useRef, React } from "react";

const center = { lat: 51.5033, lng: -0.1196 };

// define libraries outside of functional component to prevent useEffect() from triggering each rerender
const libraries = ["places"];

function App() {
  // loads google maps script
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries,
  }); 
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [pubStops, setPubStops] = useState(1);
  const [attractionStops, setAttractionStops] = useState(1);
  const [combinedStops, setCombinedStops] = useState([]);
  const [travelMethod, setTravelMethod] = useState("WALKING");
  const [journeyWarning, setJourneyWarning] = useState("walking");
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenItinerary, setIsOpenItinerary] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const onClose = () => setIsOpen(false)
  const onOpen = () => setIsOpen(true)
  const onCloseItinerary = () => setIsOpenItinerary(false)
  const onOpenItinerary = () => setIsOpenItinerary(true)

  /** @type React.MutableRefObject<HTMLInputElement> */
  const startRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const finishRef = useRef();

  // if script does not load, display SkeletonText
  if (!isLoaded) {
    return <SkeletonText />;
  }

  // eslint-disable-next-line no-undef
  const directionsService = new google.maps.DirectionsService();

  function clearRoute() {
    setCombinedStops([])
    setDirectionsResponse(null);
    setDistance("");
    setJourneyWarning("walking");
  
    if (startRef.current) {
      startRef.current.value = "";
    }
  
    if (finishRef.current) {
      finishRef.current.value = "";
    }
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
    <Box 
    bg="white" 
    py={1} width="100%" zIndex={1}>
      <Center>
        <HStack spacing={2} alignItems="center">
          <Image boxSize="40px" objectFit="cover" src={tipsyTouristLogo3} alt="logo" zIndex={1} />
          <Heading color="#393f49">Tipsy Tourist</Heading>
          <IconButton
            bgColor="white"
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
      </Center>
      <Center mt={1} mb={1}>
        <Button
          backgroundColor="#38A169"
          color="white"
          onClick={onOpen}
          placement="left"
          mr={2}
          size="sm"
          boxShadow="md"
        >
          Plan my Tipsy Tour!
        </Button>
        <Button 
        onClick={onOpenItinerary} placement="right" size="sm" boxShadow="md"
        backgroundColor="#38A169"
        color="white"
        >
          See Itinerary
        </Button>
      </Center>
    </Box>
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullScreenControl: false,
        }}
        onLoad={(map) => setMap(map)}
      >
        {directionsResponse && (
          <DirectionsRenderer 
          directions={directionsResponse} 
          markerOptions={{ visible: false }}
          suppressMarkers={true}
          />
        )}
        
        { combinedStops.length > 0 && combinedStops.map((location) => {
          if (!location.geometry || !location.geometry.location) {
            return null;
          }
          return (
            <Marker
              key={location.id}
              position={{
                lat: location.geometry.location.lat,
                lng: location.geometry.location.lng,
              }}
              onClick={() => {
                setSelectedLocation(location);
              }}
            />
          );
        })}
        {selectedLocation && (
          <InfoWindow
            position={{
              lat: selectedLocation.geometry.location.lat,
              lng: selectedLocation.geometry.location.lng,
            }}
            onCloseClick={() => {
              setSelectedLocation(null);
            }}
          >
            <div>
              <strong><h3>{selectedLocation.name}</h3></strong>
              <p>{selectedLocation.vicinity}</p>
              <p>Status: {selectedLocation.opening_hours.open_now ? 'Open' : 'Closed'}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      </Box>
      <div style={{ position: "absolute", top: "0", left: "0" }}>
      <VStack>
      <HStack>
      <IconButton
        bgColor="white"
        aria-label="center back"
        icon={<FaTimes />}
        onClick={clearRoute}
        placement="left"
        isRound
        left="10px"
        top="10px"
        zIndex={2}
        />
      </HStack>
      </VStack>
      </div>
      <ItineraryDrawer isOpen={isOpenItinerary} onClose={onCloseItinerary} combinedStops={combinedStops} />
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
                <Autocomplete>
                  <Input
                    type="text"
                    placeholder="Start (e.g. Camden, UK)"
                    ref={startRef}
                    width="250px"
                  />
                </Autocomplete>
                <Autocomplete>
                  <Input
                    type="text"
                    placeholder="Finish (e.g. Westminster, UK)"
                    ref={finishRef}
                    width="250px"
                  />
                </Autocomplete>
                <ButtonGroup>
                  <IconButton
                    aria-label="car"
                    icon={
                      <FaCar color={travelMethod === "DRIVING" ? "white" : "black"} />
                    }
                    isRound
                    onClick={() => handleCar(setTravelMethod, setJourneyWarning)}
                    style={{
                      backgroundColor:
                        travelMethod === "DRIVING" ? "#E53E3E" : "#EDF2F7",
                      icon: travelMethod === "DRIVING" ? "white" : "black",
                    }}
                  />
                  <IconButton
                    aria-label="bike"
                    icon={
                      <FaBicycle
                        color={travelMethod === "BICYCLING" ? "white" : "black"}
                      />
                    }
                    isRound
                    onClick={() => handleBicycling(setTravelMethod, setJourneyWarning)}
                    style={{
                      backgroundColor:
                        travelMethod === "BICYCLING" ? "#FFBF00" : "#EDF2F7",
                    }}
                  />
                  <IconButton
                    aria-label="walk"
                    icon={
                      <FaWalking
                        color={travelMethod === "WALKING" ? "white" : "black"}
                      />
                    }
                    isRound
                    onClick={() => handleWalking(setTravelMethod, setJourneyWarning)}
                    style={{
                      backgroundColor:
                        travelMethod === "WALKING" ? "#38A169" : "#EDF2F7",
                    }}
                  />
                </ButtonGroup>
              </VStack>
              <VStack spacing={3} mt={4} justifyContent="left">
                <HStack>
                <Text> Pubs: </Text>
                <NumberInput
                  onChange={(value) => handlePubs(setPubStops, value)}
                  defaultValue={1}
                  min={1}
                  max={travelMethod === "WALKING" ? 7 : 1}
                >
                  <NumberInputField width="80px" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text right="100px"> Attractions: </Text>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  max={3}
                  onChange={(value) => handleAttractions(setAttractionStops, value)}
                  >
                  <NumberInputField width="80px" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                </HStack>
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
    </Flex>
  );
}

export default App;