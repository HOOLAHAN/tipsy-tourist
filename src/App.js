import findPlotPoints from "./functions/findPlotPoints";
import geocode from "./functions/geocode";
import getAllPubs from "./functions/getAllPubs";
import getAllAttractions from "./functions/getAllAttractions";
import onlyUnique from "./functions/onlyUnique";
import calculateTime from "./functions/calculateTime";
import calculateDistance from "./functions/calculateDistance";
import RouteAlert from "./components/RouteAlert";
import Itinerary from "./components/Itinerary";

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
  DrawerHeader,
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

  async function calculateRoute() {
    if (startRef.current.value === "" || finishRef.current.value === "") {
      return;
    }
    setJourneyWarning("walking");
    const start = await geocode(startRef.current.value);
    const end = await geocode(finishRef.current.value);

    const pubPlotPoints = findPlotPoints(start, end, pubStops);
    const attractionPlotPoints = findPlotPoints(start, end, attractionStops);

    const pubData = await getAllPubs(pubPlotPoints);
    const attractionData = await getAllAttractions(attractionPlotPoints);
    const combinationArray = pubData.concat(attractionData);
    const combinationArray2 = combinationArray.filter(
      (location) => location !== undefined
    );

    const filteredCombinationArray = combinationArray2.filter(onlyUnique);

    setCombinedStops(filteredCombinationArray);
    
    const waypoints = calculateWaypoints(pubData, attractionData);
    let results = null;
    try {
      results = await directionsService.route({
        origin: startRef.current.value,
        destination: finishRef.current.value,
        waypoints: waypoints,
        optimizeWaypoints: true,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode[travelMethod],
      });
    } catch (error) {
      console.log(error);
      setJourneyWarning("non-viable");
    }
    
    setDirectionsResponse(results);
    setDistance(calculateDistance(results));
    setTime(calculateTime(results));
  }
  
  function calculateWaypoints(pubData, attractionData) {
    const waypointsArray = [];
    
    pubData.forEach((pub) => {
      if (pub === undefined) {
        setJourneyWarning("shortened");
        return;
      } else {
        const obj = {
          location: pub.geometry.location,
          stopover: true,
        };
        waypointsArray.push(obj);
      }
    });
    attractionData.forEach((attraction) => {
      if (attraction === undefined) {
        setJourneyWarning("shortened");
        return;
      } else {
        const obj = {
          location: attraction.geometry.location,
          stopover: true,
        };
        waypointsArray.push(obj);
      }
    });
    
    return waypointsArray;
  }
  console.log(combinedStops)

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

  function handlePubs(value) {
    setPubStops(value);
  }

  function handleAttractions(value) {
    setAttractionStops(value);
  }

  function handleCar() {
    setTravelMethod("DRIVING");
    setJourneyWarning("driving");
    console.log("selected car");
  }

  function handleBicycling() {
    setTravelMethod("BICYCLING");
    setJourneyWarning("bicycling");
  }

  function handleWalking() {
    setTravelMethod("WALKING");
    setJourneyWarning("walking");
  }
  // styling
  return (
    <Flex
      // background styling
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
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
          <DirectionsRenderer directions={directionsResponse} />
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
              <h3>{selectedLocation.name}</h3>
              <p>{selectedLocation.vicinity}</p>
              <p>Status: {selectedLocation.opening_hours.open_now ? 'Open' : 'Closed'}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      </Box>
      <Box 
      bgColor="white" 
      zIndex={1} marginTop={5}>
        <HStack>
      <Image
        boxSize="40px"
        objectFit="cover"
        src={tipsyTouristLogo3}
        alt="logo"
        zIndex={1}
        />
      <Heading color="#393f49" align="center" 
      zIndex={1}>
        Tipsy Tourist
      </Heading>
      <IconButton
        zIndex={1}
        bgColor="white"
        aria-label="center back"
        icon={<FaLocationArrow />}
        isRound
        onClick={() => map.panTo(center)}
        />
        </HStack>
      </Box>
      <HStack marginTop={2}>
      <Button bgColor="white" onClick={onOpen} placement="left">Plan my Tipsy Tour!</Button>
      <Button bgColor="white" onClick={onOpenItinerary} placement="right">See Itinerary</Button>
      </HStack>
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
        />
      </HStack>
      </VStack>
      </div>
      <>
      <Drawer placement="right" onClose={onCloseItinerary} isOpen={isOpenItinerary} >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <DrawerHeader>
          Itinerary:
          </DrawerHeader>
          <Itinerary combinedStops={combinedStops} />
        </DrawerBody>
        <DrawerFooter>
          <Button colorScheme="green" onClick={onCloseItinerary}>Done</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

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
                    placeholder="Start"
                    ref={startRef}
                    width="250px"
                  />
                </Autocomplete>
                <Autocomplete>
                  <Input
                    type="text"
                    placeholder="Finish"
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
                    onClick={handleCar}
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
                    onClick={handleBicycling}
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
                    onClick={handleWalking}
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
                  onChange={handlePubs}
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
                  onChange={handleAttractions}
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
                  onClick={calculateRoute}
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
