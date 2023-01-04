// Chakra styling
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
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes, FaBeer } from "react-icons/fa"; // icons

import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from "@react-google-maps/api"; // provides 'is loaded'
import { useState, useRef } from 'react';

const center = { lat: 51.5033, lng: 0.1196 };

function App() {
  // loads google maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'API_KEY', //process.env.GOOGLE_MAPS_API
    libraries: ['places']
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const startRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const finishRef = useRef()

  // if script does not load, display SkeletonText
  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (startRef.current.value === '' || finishRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: startRef.current.value,
      destination: finishRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    startRef.current.value = ''
    finishRef.current.value = ''

  }

  // styling
  return (
    <Flex
      // background styling
      position="relative"
      flexDirection="column"
      alignItems="center"
      bgColor="teal.200"
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
          onLoad={map => setMap(map)}
        >

          <Marker position={center} />
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} /> }
          
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="modal"
      >
        <HStack spacing={4}>
          <Autocomplete>
            <Input type="text" placeholder="Start" ref={startRef} />
          </Autocomplete>  
          <Autocomplete>
            <Input type="text" placeholder="Finish" ref={finishRef} />
          </Autocomplete>
          <ButtonGroup>
            <Button leftIcon={<FaBeer />} colorScheme="green" type="submit" onClick={calculateRoute}>
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
