// ADD IN YOUR API KEY ON LINE 30
// Chakra styling
import Locations from "./Locations2";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  Image
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes, FaBeer } from "react-icons/fa"; // icons

import tipsyTouristLogo from "./images/logo.png"

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api"; // provides 'is loaded'
import { useState, useRef } from "react";
import Geocode from "react-geocode";

const center = { lat: 51.5033, lng: -0.1196 };

function App() {
  // loads google maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const startRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const finishRef = useRef();

  // if script does not load, display SkeletonText
  if (!isLoaded) {
    return <SkeletonText />;
  }

  const findMidpoint = (start, end) => {
    const lat = (end[0] + start[0]) / 2;
    const lng = (end[1] + start[1]) / 2;
    console.log(`midpoint lat:${lat} lng:${lng}`);
    return [lat, lng];
  };

  const findThirdPoints = (start, end) => {
    const latDiff = (end[0] - start[0]) / 4;
    const lngDiff = (end[1] - start[1]) / 4;
    console.log(`thirds lat:${latDiff} lng:${lngDiff}`);
    //return [latDiff, lngDiff]
    let startLat = start[0];
    let startLng = start[1];
    let plotPoints = [{ lat: startLat, lng: startLng }];
    for (let i = 0; i < 4; i++) {
      startLat += latDiff;
      startLng += lngDiff;
      plotPoints.push({ lat: startLat, lng: startLng });
    }
    // console.log(plotPoints);
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
    const pubData = pub.results[0].geometry.location;
    console.log(pub.results[0])
    return pubData
  }

  async function calculateRoute() {
    if (startRef.current.value === "" || finishRef.current.value === "") {
      return;
    }
    const start = await geocode(startRef.current.value);
    const end = await geocode(finishRef.current.value);
    const plotPoints = findThirdPoints(start, end);
    console.log(plotPoints);
    // const pub1 = await Locations(plotPoints[1].lat, plotPoints[1].lng);
    // const pub1Data = pub1.results[0].geometry.location;
    const pub1Data = await getPub(plotPoints[1])
    const pub2Data = await getPub(plotPoints[2])
    const pub3Data = await getPub(plotPoints[3])
    console.log(pub1Data)
    // const pub2 = await Locations(plotPoints[2].lat, plotPoints[2].lng);
    // const pub2Data = pub2.results[0].geometry.location;
    // const pub3 = await Locations(plotPoints[3].lat, plotPoints[3].lng);
    // const pub3Data = pub3.results[0].geometry.location;
    console.log(`pub ${pub1Data}`);
    console.log(`start ${start}`);
    console.log(`end ${end}`);

    const waypoints = [
      {
        location: pub1Data,
        stopover: true,
      },
      {
        location: pub2Data,
        stopover: true,
      },
      {
        location: pub3Data,
        stopover: true,
      },
    ];
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

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    startRef.current.value = "";
    finishRef.current.value = "";
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
          {
            // < //Marker position={center} />
          }

          {
            // <Marker position={{lat: 51.48277839999999, lng: -0.22983910000000002}} />}
            // <Marker position={{lat: 51.50424579999999, lng: -0.15593620000000002}} />}
            // <Marker position={{lat: 51.5257132, lng: -0.08203330000000002}} />}
          }
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
        <HStack spacing={2} justifyContent="space-between">
          <Image boxSize='70px' objectFit='cover' src={tipsyTouristLogo} alt="logo"/>
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
    </Flex>
  );
}

export default App;
