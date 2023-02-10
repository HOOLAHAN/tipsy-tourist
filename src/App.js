import Details from "./Details";
import findPlotPoints from "./functions/findPlotPoints";
import geocode from "./functions/geocode";
import getAllPubs from "./functions/getAllPubs";
import getAllAttractions from "./functions/getAllAttractions";
import onlyUnique from "./functions/onlyUnique";
import calculateTime from "./functions/calculateTime";
import calculateDistance from "./functions/calculateDistance";

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
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";

import { StarIcon, LinkIcon, PhoneIcon } from "@chakra-ui/icons";

import {
  FaLocationArrow,
  FaTimes,
  FaBeer,
  FaHome,
  FaCar,
  FaWalking,
  FaBicycle,
} from "react-icons/fa"; // icons
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { MdOutlineLocalDrink } from "react-icons/md";

import tipsyTouristLogo3 from "./images/logo3.svg";

import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api"; // provides 'is loaded'
import { useState, useRef, React, useEffect } from "react";

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
  const [pubStops, setPubStops] = useState(1);
  const [attractionStops, setAttractionStops] = useState(1);
  const [combinedStops, setCombinedStops] = useState([]);
  const [boxZIndex, setBoxZIndex] = useState("-1");
  const [drawerZIndex, setDrawerZIndex] = useState("-1");
  const [travelMethod, setTravelMethod] = useState("WALKING");
  const [locationCardData, setLocationCardData] = useState({});
  // const [hasError, setHasError] = useState(false);
  // const [routeError, setRouteError] = useState(false);
  const [journeyWarning, setJourneyWarning] = useState("walking");

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
    // setHasError(false);
    // setRouteError(false);
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
      // setRouteError(true);
      setJourneyWarning("non-viable");
      setDrawerZIndex("-1");
    }

    setDirectionsResponse(results);
    setDistance(calculateDistance(results));
    setTime(calculateTime(results));
    setDrawerZIndex("2");
  }

  function calculateWaypoints(pubData, attractionData) {
    const waypointsArray = [];

    pubData.forEach((pub) => {
      if (pub === undefined) {
        // setHasError(true);
        setJourneyWarning("shortened");
        return;
      } else {
        const obj = {
          location: pub.geometry.location,
          stopover: true,
        };
        // console.log(obj);
        waypointsArray.push(obj);
      }
    });
    attractionData.forEach((attraction) => {
      if (attraction === undefined) {
        // setHasError(true);
        setJourneyWarning("shortened");
        return;
      } else {
        const obj = {
          location: attraction.geometry.location,
          stopover: true,
        };
        // console.log(obj);
        waypointsArray.push(obj);
      }
    });

    return waypointsArray;
  }

  // THIS CAN BE PULLED OUT BY PASSING AN ARGUMENT AND CALLING WITH DEPENDENCY INJECTION IN USE EFFECT

  function RouteAlert({ error }) {
    console.log("alert function called");
    if (error === "driving") {
      console.log("driving alert");
      return (
        <Alert status="error" fontSize="14">
          <AlertIcon />
          Do not drink and drive! This route assumes you have a designated
          driver.
          <Link
            href="https://www.zeropercentbrews.com/"
            color="blue"
            paddingLeft="7px"
          >
            Explore alcohol free beverages
          </Link>
        </Alert>
      );
    } else if (error === "bicycling") {
      console.log("cycling alert");
      return (
        <Alert status="warning" fontSize="14">
          <AlertIcon />
          Do not drink and cycle!
          <Link
            href="https://www.zeropercentbrews.com/"
            color="blue"
            paddingLeft="7px"
          >
            Explore alcohol free beverages
          </Link>
        </Alert>
      );
    } else if (error === "shortened") {
      console.log("shortened alert");
      return (
        <Alert status="warning">
          <AlertIcon />
          Your route has been automatically shortened due to a lack of viable
          stops along your route.
        </Alert>
      );
    } else if (error === "non-viable") {
      console.log("non-viable alert");
      return (
        <Alert status="error">
          <AlertIcon />
          No viable routes found.
        </Alert>
      );
    } else {
      console.log("got to else");
      return;
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");

    startRef.current.value = "";
    finishRef.current.value = "";
    // console.log(directionsResponse);
    // setHasError(false);
    // setRouteError(false);
    setJourneyWarning("walking");
  }

  function handlePubs(value) {
    setPubStops(value);
    // console.log(value);
  }

  function handleAttractions(value) {
    setAttractionStops(value);
  }

  // NEXT TWO COMPONENTS CAN ALSO BE TAKEN OUT WITH DEPENDENCY INJECTION IF Z INDEX METHOD OF HIDING BOX IS REWORKED

  const ShowLocations = () => {
    if (combinedStops.length > 0) {
      return (
        <Box
          height="300px"
          position="absolute"
          top="65%"
          borderRadius="lg"
          minW="container.md"
          zIndex={drawerZIndex}
        >
          <HStack justify="right">
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              colorScheme="red"
              isRound
              onClick={() => {
                setDrawerZIndex("-1");
              }}
            />
          </HStack>
          <HStack spacing={4} mt={10} justifyContent="left" z-index="1">
            {combinedStops.map((result) => (
              <LocationsCard key={result.place_id} {...result} />
            ))}
          </HStack>
        </Box>
      );
    }
  };

  // HERE THE GETDETAILS FUNCTION WILL NEED TO LIVE IN THE LOCATIONS CARD FILE FOR THE STATE

  const LocationsCard = (result) => {
    let imageLink = "";
    if (result.photos === undefined) {
      imageLink = tipsyTouristLogo3;
    } else {
      imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${result.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    }

    return (
      <Box
        justifyContent="left"
        shadow="base"
        borderRadius="lg"
        bgColor="white"
        height="250px"
      >
        <VStack>
          <HStack justifyContent="space-between">
            {/* <Center> */}
            <Text
              noOfLines={[1, 2]}
              // isTruncated
              color="#393f49"
              as="b"
              fontSize="m"
              justifyContent="center"
            >
              {result.name}
            </Text>
            {/* </Center> */}
            <IconButton
              leftIcon={<BsFillArrowUpRightCircleFill />}
              isRound
              color="green"
              bgColor="white"
              type="submit"
              onClick={() => {
                getDetails(result.place_id);
                setBoxZIndex("1");
              }}
            ></IconButton>
          </HStack>
          <Image
            src={imageLink}
            borderRadius="lg"
            alt="no image"
            boxSize="200px"
            maxW="200px"
          />
        </VStack>
      </Box>
    );
  };

  //  CAN BE REMOVED WITH Z AXIS REWORK AND DEPENDENCY INJECTION

  const LocationDetailsCard = () => {
    let imageLink = "";
    if (locationCardData.photos === undefined) {
      imageLink = tipsyTouristLogo3;
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
        zIndex={boxZIndex}
      >
        <HStack justifyContent="right">
          <IconButton
            aria-label="center back"
            icon={<FaTimes />}
            colorScheme="red"
            isRound
            onClick={() => {
              setBoxZIndex("-1");
            }}
          />
        </HStack>
        <VStack>
          <Text as="b">{locationCardData.name}</Text>
          <Box display="flex" mt="2" alignItems="center">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={
                    i < Math.round(locationCardData.rating)
                      ? "yellow.500"
                      : "gray.300"
                  }
                />
              ))}
          </Box>
          <Link href={locationCardData.website}>
            <LinkIcon />
            {locationCardData.website}
          </Link>
          <Text>
            <PhoneIcon />
            {locationCardData.formatted_phone_number}
          </Text>
          <Text icon={<FaHome />}>{locationCardData.vicinity}</Text>
          {/* <Image src={imageLink} alt="no image" maxW="300px" /> */}
          <Image src={imageLink} alt="no image" maxW="300px" />
        </VStack>
      </Box>
    );
  };

  async function getDetails(place_id) {
    const place = await Details(place_id);
    // console.log(place);
    const locationData = place.result;
    // console.log(locationData)
    setLocationCardData(locationData);
    return locationData;
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
        <Heading color="#393f49" align="center">
          Tipsy Tourist
        </Heading>
        <HStack spacing={2} justifyContent="space-between">
          <Image
            boxSize="60px"
            objectFit="cover"
            src={tipsyTouristLogo3}
            alt="logo"
          />
          {/* <Autocomplete> */}
          <Input type="text" placeholder="Start" ref={startRef} width="250px" />
          {/* </Autocomplete> */}
          {/* <Autocomplete> */}
          <Input
            type="text"
            placeholder="Finish"
            ref={finishRef}
            width="250px"
          />
          {/* </Autocomplete> */}
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
        </HStack>
        <HStack spacing={3} mt={4} justifyContent="left">
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
            // color={travelMethod === "BICYCLING" ? "black" : "white"}
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
          <IconButton
            aria-label="center back"
            icon={<FaTimes />}
            onClick={clearRoute}
            placement="right"
            isRound
            left="52px"
          />
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            right="48px"
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
        <HStack spacing={163} mt={4}>
          <Text>
            Total distance ({travelMethod.toLowerCase()}): {distance}{" "}
          </Text>
          <Text>
            Total time ({travelMethod.toLowerCase()}): {time}{" "}
          </Text>
        </HStack>
        <RouteAlert error={journeyWarning} />
      </Box>
      <ShowLocations />
      <LocationDetailsCard />
    </Flex>
  );
}

export default App;
