import ItineraryDrawer from './components/ItineraryDrawer';
import Header from './components/Header';
import PlanTripButtons from './components/PlanTripButtons';
import PlanDrawer from './components/PlanDrawer';
import { calculateRoute } from "./functions/calculateRoute";
import { handleCar, handleBicycling, handleWalking } from './functions/stateHandlers';
import { clearRoute } from './functions/clearRoute';

import {
  Box,
  Flex,
  HStack,
  VStack,
  IconButton,
  SkeletonText,
  Center
} from "@chakra-ui/react";

import {
  FaTimes,
} from "react-icons/fa"; // icons

import tipsyTouristLogo3 from "./images/logo3.svg";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
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

  // function clearRoute() {
  //   setCombinedStops([])
  //   setDirectionsResponse(null);
  //   setDistance("");
  //   setJourneyWarning("walking");
  
  //   if (startRef.current) {
  //     startRef.current.value = "";
  //   }
  
  //   if (finishRef.current) {
  //     finishRef.current.value = "";
  //   }
  // }

  const onCenterMap = () => {
    map.panTo(center);
  };

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
    <Header onCenter={onCenterMap} />
    <Box 
    bg="white" 
    py={1} width="100%" zIndex={1}>
      <Center mt={1} mb={1}>
      <PlanTripButtons onPlanTrip={onOpen} onSeeItinerary={onOpenItinerary} />
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
        onClick={() => clearRoute(setCombinedStops, setDirectionsResponse, setDistance, setJourneyWarning, startRef, finishRef)}
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
      <PlanDrawer
        isOpen={isOpen}
        onClose={onClose}
        startRef={startRef}
        finishRef={finishRef}
        handleCar={handleCar}
        handleBicycling={handleBicycling}
        handleWalking={handleWalking}
        travelMethod={travelMethod}
        setTravelMethod={setTravelMethod}
        setJourneyWarning={setJourneyWarning}
        pubStops={pubStops}
        setPubStops={setPubStops}
        attractionStops={attractionStops}
        setAttractionStops={setAttractionStops}
        calculateRoute={calculateRoute}
        directionsService={directionsService}
        setDirectionsResponse={setDirectionsResponse}
        setDistance={setDistance}
        setTime={setTime}
        setCombinedStops={setCombinedStops}
        journeyWarning={journeyWarning}
        distance={distance}
        time={time}
        clearRoute={() => clearRoute(setCombinedStops, setDirectionsResponse, setDistance, setJourneyWarning, startRef, finishRef)}
        tipsyTouristLogo3={tipsyTouristLogo3}
      />
    </Flex>
  );
}

export default App;