import Locations from "./Locations";
import Attractions from "./Attractions";

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

import { FaLocationArrow, FaTimes, FaBeer } from "react-icons/fa"; // icons
import tipsyTouristLogo3 from "./images/logo3.svg";

import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api"; // provides 'is loaded'
import { useState, useRef, React } from "react";
import Geocode from "react-geocode";

const center = { lat: 51.5033, lng: -0.1196 };

// define libraries outside of functional component to prevent useEffect() from triggering each rerender
const libraries = ["places"];

function App() {
  // loads google maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [pubStops, setPubStops] = useState(3);
  const [attractionStops, setAttractionStops] = useState(1);
  const [combinedStops, setCombinedStops] = useState([]);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const startRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const finishRef = useRef();

  // if script does not load, display SkeletonText
  if (!isLoaded) {
    return <SkeletonText />;
  }

  const findPlotPoints = (start, end, stopsNum) => {
    const latDiff = (end[0] - start[0]) / (stopsNum - 1);
    const lngDiff = (end[1] - start[1]) / (stopsNum - 1);
    let startLat = start[0];
    let startLng = start[1];
    let plotPoints = [{ lat: startLat, lng: startLng }];
    for (let i = 0; i < stopsNum - 1; i++) {
      startLat += latDiff;
      startLng += lngDiff;
      plotPoints.push({ lat: startLat, lng: startLng });
    }
    return plotPoints;
  };

  const geocode = async (address) => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    const response = await Geocode.fromAddress(address);

    const { lat, lng } = response.results[0].geometry.location;
    const array = [lat, lng];
    return array;
  };

  async function getPub(plotPoints) {
    const pub = await Locations(plotPoints.lat, plotPoints.lng);
    const pubData = pub.results[0];
    return pubData;
  }

  async function getAllPubs(plotPoints) {
    const promises = plotPoints.map((point) => {
      return getPub(point);
    });
    const pubsInfo = await Promise.all(promises);
    return pubsInfo;
  }

  async function getAttraction(plotPoints) {
    const attraction = await Attractions(plotPoints.lat, plotPoints.lng);
    const attractionData = attraction.results[0];
    return attractionData;
  }

  async function getAllAttractions(plotPoints) {
    const promises = plotPoints.map((point) => {
      return getAttraction(point);
    });
    const AttragetAllAttractionsInfo = await Promise.all(promises);
    return AttragetAllAttractionsInfo;
  }
  
  async function calculateRoute() {
    if (startRef.current.value === "" || finishRef.current.value === "") {
      return;
    }
    const start = await geocode(startRef.current.value);
    const end = await geocode(finishRef.current.value);

    const pubPlotPoints = findPlotPoints(start, end, pubStops);
    const attractionPlotPoints = findPlotPoints(start, end, attractionStops);

    const pubData = await getAllPubs(pubPlotPoints);
    const attractionData = await getAllAttractions(attractionPlotPoints);
    const combinationArray = pubData.concat(attractionData);
    

    console.log(combinationArray)
    setCombinedStops(combinationArray);

    const waypoints = calculateWaypoints(pubData, attractionData);

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: startRef.current.value,
      destination: finishRef.current.value,
      waypoints: waypoints,
      optimizeWaypoints: true,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
  }

  function calculateWaypoints(pubData, attractionData) {
    const waypointsArray = [];


    pubData.forEach((pub) => {
      const obj = {
        location: pub.geometry.location,
        stopover: true,
      };
      waypointsArray.push(obj);
    });
    attractionData.forEach((attraction) => {
      const obj = {
        location: attraction.geometry.location,
        stopover: true,
      };
      waypointsArray.push(obj);
    });

    return waypointsArray;
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    startRef.current.value = "";
    finishRef.current.value = "";
  }

  function handlePubs(value) {
    setPubStops(value);
  }

  function handleAttractions(value) {
    setAttractionStops(value);
  }

  const ShowLocations = () => {
    console.log("work please")
    if (combinedStops.length > 0) {
      return(
        <Box
        height="100px"
        width="40px"
        position="absolute"
        top="80%"
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="2"
        >
        <HStack spacing={4} mt={4} justifyContent="left" z-index="1">
          {combinedStops.map((result) => (
            <LocationsCard key={result.place_id} {...result} />
          ))}
        </HStack>
      </Box>
    ) 
    } 
  }

  const LocationsCard = (result) => {
    return (
      <VStack 
      justifyContent="left" 
      shadow="base"         
      borderRadius="lg"
      >
        <Text>
          {result.name}
        </Text>
        <Text>
          Rating: {result.rating}
        </Text>
      </VStack>
    ) 
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
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="1"
      >
        <Heading align="center">Tipsy Tourist</Heading>
        <HStack spacing={2} justifyContent="space-between">
          <Image
            boxSize="60px"
            objectFit="cover"
            src={tipsyTouristLogo3}
            alt="logo"
          />
          <Autocomplete>
            <Input type="text" placeholder="Start" ref={startRef} />
          </Autocomplete>
          <Autocomplete>
            <Input type="text" placeholder="Finish" ref={finishRef} />
          </Autocomplete>
          <ButtonGroup>
            <Button
              leftIcon={<FaBeer />}
              colorScheme="green"
              type="submit"
              onClick={calculateRoute}
            >
              Plan my Tipsy Tour!
            </Button>

            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="left">
          <Text> Number of pubs: </Text>
          <NumberInput defaultValue={3} min={1} max={7} onChange={handlePubs}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Text> Number of attractions: </Text>
          <NumberInput
            defaultValue={1}
            min={1}
            max={3}
            onChange={handleAttractions}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>

        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Total distance (walking): {distance} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
      </Box>
      <ShowLocations/>
    </Flex>
  );
}

export default App;
