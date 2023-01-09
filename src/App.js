import Locations from "./Locations";
import Attractions from "./Attractions";

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

import tipsyTouristLogo from "./images/logo.png";

import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api"; // provides 'is loaded'
import { useState, useRef, React} from "react";
import Geocode from "react-geocode";

const center = { lat: 51.5033, lng: -0.1196 };

// define libraries outside of functional component to prevent useEffect() from triggering each rerender
const libraries = ['places'];

function App() {
  // loads google maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // const { isOpen, onOpen, onClose } = useDisclosure()
  // const btnRef = React.useRef()

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

  const findThirdPoints = (start, end) => {
    const latDiff = (end[0] - start[0]) / 4;
    const lngDiff = (end[1] - start[1]) / 4;
    console.log(`thirds lat:${latDiff} lng:${lngDiff}`);
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

  const mockPubs = []

  async function getPub(plotPoints) {
    const pub = await Locations(plotPoints.lat, plotPoints.lng);
    const pubData = pub.results[0].geometry.location;
    mockPubs.push(pub.results[0])
    console.log(mockPubs[0].name)
    return pubData;
  }



  function consolePubs(arrayPubs) {
    console.log(arrayPubs[0])

  }
  
  

  async function calculateRoute() {
    if (startRef.current.value === "" || finishRef.current.value === "") {
      return;
    }
    const start = await geocode(startRef.current.value);
    const end = await geocode(finishRef.current.value);
    const plotPoints = findThirdPoints(start, end);

    const pub1Data = await getPub(plotPoints[1]);
    const pub2Data = await getPub(plotPoints[2]);
    const pub3Data = await getPub(plotPoints[3]);

    const attraction1 = await Attractions(plotPoints[1].lat, plotPoints[1].lng);
    const attraction1Data = attraction1.results[0].geometry.location;
    const attraction2 = await Attractions(plotPoints[2].lat, plotPoints[2].lng);
    const attraction2Data = attraction2.results[0].geometry.location;
    const attraction3 = await Attractions(plotPoints[3].lat, plotPoints[3].lng);
    const attraction3Data = attraction3.results[0].geometry.location;

    console.log(`pub ${pub1Data}`);
    console.log(`start ${start}`);
    console.log(`end ${end}`);

    const waypoints = [
      {
        location: pub1Data,
        stopover: true,
      },
      {
        location: attraction1Data,
        stopover: true,
      },
      {
        location: pub2Data,
        stopover: true,
      },
      {
        location: attraction2Data,
        stopover: true,
      },
      {
        location: pub3Data,
        stopover: true,
      },
      {
        location: attraction3Data,
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
    console.log("Tim")
    // RouteSummary();
    console.log("Iain")
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
          <Image
            boxSize="60px"
            objectFit="cover"
            src={tipsyTouristLogo}
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
          zIndex="1"
          >
            <Button
              leftIcon={<FaBeer />}
              colorScheme="green"
              type="submit"
              onClick={consolePubs(mockPubs)}
            ></Button>
      </Box>

    </Flex>
  );
}

export default App;
