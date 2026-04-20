// App.js
import ItineraryModal from './components/itinerary/ItineraryModal';
import Header from './components/header/Header';
import GoogleMapDisplay from './components/map/GoogleMapDisplay';
import ActionButtonGroup from './components/common/ActionButtonGroup';
import LocationModal from './components/itinerary/LocationModal';
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
  Text,
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
  const [routeError, setRouteError] = useState("");
  const [isPlanningRoute, setIsPlanningRoute] = useState(false);
  const [isOpenItinerary, setIsOpenItinerary] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const getInitialTheme = () => localStorage.getItem("mapTheme") || "classic";
  const [mapTheme, setMapTheme] = useState(getInitialTheme);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [activePicker, setActivePicker] = useState(null);
  const [pickedStart, setPickedStart] = useState(null);
  const [pickedFinish, setPickedFinish] = useState(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const closeLocationModal = () => setSelectedPlaceId(null);

  const onCloseItinerary = () => setIsOpenItinerary(false)
  const onOpenItinerary = () => setIsOpenItinerary(true)
  const directionsRendererRef = useRef(null);

  const moveStop = (fromIndex, direction) => {
    setCombinedStops((currentStops) => {
      const toIndex = fromIndex + direction;
      if (toIndex < 0 || toIndex >= currentStops.length) return currentStops;

      const nextStops = [...currentStops];
      const [movedStop] = nextStops.splice(fromIndex, 1);
      nextStops.splice(toIndex, 0, movedStop);
      return nextStops;
    });
  };

  const handleMapPick = (event) => {
    if (!activePicker || !event.latLng) return;

    const coordinateValue = `${event.latLng.lat().toFixed(6)}, ${event.latLng.lng().toFixed(6)}`;
    const targetRef = activePicker === "start" ? startRef : finishRef;
    if (targetRef.current) {
      targetRef.current.value = coordinateValue;
    }

    if (activePicker === "start") {
      setPickedStart({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    } else {
      setPickedFinish({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    }

    setActivePicker(null);
    setIsPlannerOpen(true);
  };

  const recalculateRouteForMode = async (nextTravelMethod, nextPubStops = pubStops) => {
    if (!directionsResponse || isPlanningRoute) return;

    setIsPlanningRoute(true);
    setRouteError("");
    try {
      await calculateRoute(
        startRef,
        finishRef,
        nextPubStops,
        attractionStops,
        nextTravelMethod,
        directionsService,
        setDirectionsResponse,
        setDistance,
        setTime,
        setCombinedStops,
        setJourneyWarning,
        setRouteError
      );
    } finally {
      setIsPlanningRoute(false);
    }
  };


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
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="100vh"
        minH="100dvh"
        w="100vw"
        overflow="hidden"
      >
        <Header
          onCenter={onCenterMap}
          onSeeItinerary={onOpenItinerary}
          setMapTheme={setMapTheme}
          mapTheme={mapTheme}
          isPlannerOpen={isPlannerOpen}
          setIsPlannerOpen={setIsPlannerOpen}
          startRef={startRef}
          finishRef={finishRef}
          handleCar={handleCar}
          handleBicycling={handleBicycling}
          handleWalking={handleWalking}
          recalculateRouteForMode={recalculateRouteForMode}
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
          routeError={routeError}
          setRouteError={setRouteError}
          isPlanningRoute={isPlanningRoute}
          setIsPlanningRoute={setIsPlanningRoute}
          activePicker={activePicker}
          setActivePicker={setActivePicker}
          distance={distance}
          time={time}
          clearRoute={() =>
            clearRoute(
              setCombinedStops,
              setDirectionsResponse,
              setDistance,
              setTime,
              setJourneyWarning,
              setRouteError,
              setIsPlanningRoute,
              setPickedStart,
              setPickedFinish,
              startRef,
              finishRef,
              directionsRendererRef
            )
          }
          directionsRendererRef={directionsRendererRef}
        />
        <Box position="absolute" left={0} top={0} h="100%" w="100%">
          <GoogleMapDisplay
            center={center}
            map={map}
            setMap={setMap}
            directionsResponse={directionsResponse}
            combinedStops={combinedStops}
            startLabel={startRef.current?.value}
            finishLabel={finishRef.current?.value}
            pickedStart={pickedStart}
            pickedFinish={pickedFinish}
            activePicker={activePicker}
            onMapPick={handleMapPick}
            setSelectedLocation={setSelectedLocation}
            selectedLocation={selectedLocation}
            mapTheme={mapTheme}
            onMarkerClick={(location) => setSelectedPlaceId(location.place_id)}
          />
        </Box>
        {activePicker && (
          <Box
            position="absolute"
            top={{ base: 4, md: 20 }}
            left="50%"
            transform="translateX(-50%)"
            zIndex="1000"
            bg={uiThemes[mapTheme].bg}
            color={uiThemes[mapTheme].text}
            border={`1px solid ${uiThemes[mapTheme].accent}`}
            borderRadius="full"
            boxShadow="lg"
            px={4}
            py={2}
          >
            <Text fontSize="sm" fontWeight="semibold">
              Click the map to set your {activePicker} point
            </Text>
          </Box>
        )}
        <LocationModal isOpen={!!selectedPlaceId} onClose={closeLocationModal} placeId={selectedPlaceId} />
        <Box
          position="absolute"
          zIndex="900"
          right={{ base: "50%", md: 4 }}
          bottom={{ base: "calc(env(safe-area-inset-bottom, 0px) + 18px)", md: "auto" }}
          top={{ base: "auto", md: "50%" }}
          transform={{ base: "translateX(50%)", md: "translateY(-50%)" }}
          bg={uiThemes[mapTheme].bg}
          border={`1px solid ${uiThemes[mapTheme].accent}`}
          borderRadius="full"
          boxShadow="lg"
          px={{ base: 3, md: 2 }}
          py={{ base: 2, md: 3 }}
          minW={{ base: "148px", md: "auto" }}
        >
          <Flex
            gap={{ base: 3, md: 2 }}
            direction={{ base: "row", md: "column" }}
            align="center"
            justify="center"
          >
            <ActionButtonGroup
              clearRoute={() =>
                clearRoute(
                  setCombinedStops,
                  setDirectionsResponse,
                  setDistance,
                  setTime,
                  setJourneyWarning,
                  setRouteError,
                  setIsPlanningRoute,
                  setPickedStart,
                  setPickedFinish,
                  startRef,
                  finishRef,
                  directionsRendererRef
                )
              }
              onCenter={onCenterMap}
            />
            <ThemeMenu mapTheme={mapTheme} setMapTheme={setMapTheme} />
            {directionsResponse && (
              <Tooltip label="Itinerary" hasArrow placement="left">
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
          </Flex>
        </Box>
        <ItineraryModal
          isOpen={isOpenItinerary}
          onClose={onCloseItinerary}
          combinedStops={combinedStops}
          distance={distance}
          time={time}
          travelMethod={travelMethod}
          onMoveStop={moveStop}
        />
      </Flex>
    </ThemeContext.Provider>
  );
}

export default App;
