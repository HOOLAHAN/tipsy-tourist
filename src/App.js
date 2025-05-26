// App.js
import ItineraryModal from './components/itinerary/ItineraryModal';
import Header from './components/header/Header';
import GoogleMapDisplay from './components/map/GoogleMapDisplay';
import ActionButtonGroup from './components/common/ActionButtonGroup';
import { calculateRoute } from "./features/routing/calculateRoute";
import { handleCar, handleBicycling, handleWalking } from './features/routing/stateHandlers';
import { clearRoute } from './features/routing/clearRoute';
import { ThemeContext } from "./context/ThemeContext";
import { uiThemes } from "./theme/uiThemes";
import ThemeMenu from './components/header/ThemeMenu';
import { FaListUl } from "react-icons/fa";
import { Tooltip, IconButton } from "@chakra-ui/react";

import {
  Box,
  Flex,
  VStack,
  SkeletonText,
} from "@chakra-ui/react";

import {
  useJsApiLoader,
} from "@react-google-maps/api";

import { useState, useRef, React, useEffect } from "react";

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
  const [isOpenItinerary, setIsOpenItinerary] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const getInitialTheme = () => localStorage.getItem("mapTheme") || "classic";
  const [mapTheme, setMapTheme] = useState(getInitialTheme);

  const onCloseItinerary = () => setIsOpenItinerary(false)
  const onOpenItinerary = () => setIsOpenItinerary(true)
  const directionsRendererRef = useRef(null);


  useEffect(() => {
    localStorage.setItem("mapTheme", mapTheme);
  }, [mapTheme]);

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

  const onCenterMap = () => {
    map.panTo(center);
  };

  return (
    <ThemeContext.Provider value={uiThemes[mapTheme]}>
      <Flex position="relative" flexDirection="column" alignItems="center" h="100vh" w="100vw">
        <Header
          onCenter={onCenterMap}
          onSeeItinerary={onOpenItinerary}
          setMapTheme={setMapTheme}
          mapTheme={mapTheme}
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
          clearRoute={() =>
            clearRoute(
              setCombinedStops,
              setDirectionsResponse,
              setDistance,
              setTime,
              setJourneyWarning,
              startRef,
              finishRef,
              directionsRendererRef
            )
          }
          directionsRendererRef={directionsRendererRef}
        />
        <Box position="absolute" top={4} right={4} zIndex="1000">
          <VStack spacing={3}>
            <ThemeMenu mapTheme={mapTheme} setMapTheme={setMapTheme} />
            {directionsResponse && (
              <Tooltip label="Itinerary" hasArrow>
                <IconButton
                  aria-label="Itinerary"
                  icon={<FaListUl />}
                  onClick={onOpenItinerary}
                  isRound
                  bg={uiThemes[mapTheme].primary}
                  color="white"
                  _hover={{ bg: uiThemes[mapTheme].accent }}
                  border={`1px solid ${uiThemes[mapTheme].accent}`}
                  boxShadow="md"
                  size="sm"
                />
              </Tooltip>
            )}
          </VStack>
        </Box>
        <Box position="absolute" left={0} top={0} h="100%" w="100%">
          <GoogleMapDisplay
            center={center}
            map={map}
            setMap={setMap}
            directionsResponse={directionsResponse}
            combinedStops={combinedStops}
            setSelectedLocation={setSelectedLocation}
            selectedLocation={selectedLocation}
            mapTheme={mapTheme}
          />
        </Box>
        <div style={{ position: "absolute", top: "0", left: "0" }}>
        <VStack>
          <ActionButtonGroup
            clearRoute={() =>
              clearRoute(
                setCombinedStops,
                setDirectionsResponse,
                setDistance,
                setTime,
                setJourneyWarning,
                startRef,
                finishRef,
                directionsRendererRef
              )
            }
            onCenter={onCenterMap}
          />
        </VStack>
        </div>
        <ItineraryModal isOpen={isOpenItinerary} onClose={onCloseItinerary} combinedStops={combinedStops} />
      </Flex>
    </ThemeContext.Provider>
  );
}

export default App;
