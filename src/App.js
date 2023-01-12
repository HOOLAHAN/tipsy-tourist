import Locations from "./Locations";
import Attractions from "./Attractions";
import Details from "./Details"

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
  Center,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";

import {
  StarIcon,
  LinkIcon,
  PhoneIcon,
} from "@chakra-ui/icons";

import {
  // FaEyeSlash,
  FaEye,
  FaLocationArrow,
  FaTimes,
  FaBeer,
  FaHome
  // FaBus, FaCar, FaWalking, FaBicycle,
} from "react-icons/fa"; // icons
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
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [pubStops, setPubStops] = useState(3);
  const [attractionStops, setAttractionStops] = useState(1);
  const [combinedStops, setCombinedStops] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [routeError, setRouteError] = useState(false);
  const [boxZIndex, setBoxZIndex ] = useState("-1")
  const [drawerZIndex, setDrawerZIndex ] = useState("-1")
  const [travelMethod, setTravelMethod] = useState("WALKING")
  const [locationCardData, setLocationCardData] = useState({});

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
    setHasError(false);
    setRouteError(false);
    const start = await geocode(startRef.current.value);
    const end = await geocode(finishRef.current.value);

    const pubPlotPoints = findPlotPoints(start, end, pubStops);
    const attractionPlotPoints = findPlotPoints(start, end, attractionStops);
    
    const pubData = await getAllPubs(pubPlotPoints);
    const attractionData = await getAllAttractions(attractionPlotPoints);
    const combinationArray = pubData.concat(attractionData);
    const filteredCombinationArray = combinationArray.filter(
      (location) => location !== undefined
    );

    console.log(combinationArray);
    console.log(filteredCombinationArray);
    setCombinedStops(filteredCombinationArray);
    
    const waypoints = calculateWaypoints(pubData, attractionData);
    // DIRECTIONS SERVICE DEFINED NOW AT LINE 70
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
      setRouteError(true);
    }
    
    setDirectionsResponse(results);
    setDistance(calculateDistance(results));
    setTime(calculateTime(results));
    setDrawerZIndex("1");
  }
  
  function calculateTime(results) {
    let distance = 0;
    results.routes[0].legs.forEach((leg) => {
      distance += leg.duration.value;
    });
    return `${Math.floor(distance / 60)} mins`;
  }
  function calculateDistance(results) {
    let distance = 0;
    results.routes[0].legs.forEach((leg) => {
      distance += leg.distance.value;
    });
    return `${distance / 1000} km`;
  }
  
  function calculateWaypoints(pubData, attractionData) {
    const waypointsArray = [];
    
    
    pubData.forEach((pub) => {
      if (pub === undefined) {
        setHasError(true);
        return;
      } else {
        const obj = {
          location: pub.geometry.location,
          stopover: true,
        };
        console.log(obj);
        waypointsArray.push(obj);
      }
    });
    attractionData.forEach((attraction) => {
      if (attraction === undefined) {
        setHasError(true);
        return;
      } else {
        const obj = {
          location: attraction.geometry.location,
          stopover: true,
        };
        console.log(obj);
        waypointsArray.push(obj);
      }
    });
    
    return waypointsArray;
  }
  
  function RouteAlert() {
    if (routeError) {
      return (
        <Alert status="error">
          <AlertIcon />
          No viable routes found.
        </Alert>
      );
    } else if (hasError) {
      return (
        <Alert status="warning">
          <AlertIcon />
          Your route has been automatically shortened due to a lack of viable
          stops along your route.
        </Alert>
      );
    } else {
      return;
    }
  }
  
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    
    startRef.current.value = "";
    finishRef.current.value = "";
    console.log(directionsResponse);
    setHasError(false);
    setRouteError(false);
  }
  
  function handlePubs(value) {
    setPubStops(value);
    console.log(value)
  }
  
  function handleAttractions(value) {
    setAttractionStops(value);
  }
  
  const ShowLocations = () => {
    if (combinedStops.length > 0) {
      return(
        <Box
          height="300px"
          position="absolute"
          top="70%"
          borderRadius="lg"
          minW="container.md"
          zIndex={drawerZIndex}
        >
          <HStack spacing={4} mt={10} justifyContent="left" z-index="1">
            {combinedStops.map((result) => (
              <LocationsCard key={result.place_id} {...result} />
              ))}
              <IconButton
                  position="top"
                  aria-label="center back"
                  icon={<FaTimes />}
                  colorScheme="green"
                  onClick={()=> {setDrawerZIndex("-1")}}
              />
          </HStack>
        </Box>
      );
    }
  };

  const LocationsCard = (result) => {
    let imageLink = ""
    if (result.photos === undefined) {
      imageLink = tipsyTouristLogo3
    } else {
      imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${result.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    } 

    return (
      <Box
        justifyContent="left"
        shadow="base"
        borderRadius="lg"
        bgColor="#38A169"
        height="250px"
      >
        <VStack>
          <HStack>
          <Center>
            <Text isTruncated as="b" fontSize="xs" justifyContent="center" color="white">
              {result.name}
            </Text>
          </Center>
            <Button               
              leftIcon={<FaEye />}
              colorScheme="green"
              type="submit"
              onClick={() => {getDetails(result.place_id) ; setBoxZIndex("1")}}
              >
            </Button>
          </HStack>
          <Image src={imageLink} alt="no image" boxSize="200px" maxW="200px" />
        </VStack>
      </Box>
    );
  };

  const LocationDetailsCard = () => {
    let imageLink = ""
    if (locationCardData.photos === undefined) {
      imageLink = tipsyTouristLogo3
    } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${locationCardData.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    }
    return (
      <Box
      p={4}
      borderRadius="lg"
      mt={4}
      bgColor="white"
      shadow="base"
      minW="container.sm"
      zIndex={boxZIndex}>
        <VStack>
          <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={()=> {setBoxZIndex("-1")}}
          />
          <Text as='b'>
            {locationCardData.name}
          </Text>
          <Box display='flex' mt='2' alignItems='center'>
          {Array(5)
            .fill('')
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < Math.round(locationCardData.rating) ? 'yellow.500' : 'gray.300'}
              />
            ))}
            </Box>
          <Link href={locationCardData.website} >
           <LinkIcon/> 
           {locationCardData.website} 
          </Link>
          <Text>
            <PhoneIcon/>
            {locationCardData.formatted_phone_number}
          </Text>
          <Text icon={<FaHome />}>
          {locationCardData.vicinity}
          </Text>
          <Image src={imageLink} alt="no image" maxW="300px" />
        </VStack>
      </Box>
    ) 
  } 

async function getDetails(place_id) {
  const place = await Details(place_id);
  console.log(place)
  const locationData = place.result;
  // console.log(locationData)
  setLocationCardData(locationData) 
  return locationData;
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
            </Button>{" "}
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
          <Text>Total time (walking): {time} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
        <RouteAlert />
      </Box>
      <ShowLocations />
      <LocationDetailsCard/>
    </Flex>
  );
}

export default App;
