// App.js
import ItineraryModal from './components/itinerary/ItineraryModal';
import Header from './components/header/Header';
import GoogleMapDisplay from './components/map/GoogleMapDisplay';
import ActionButtonGroup from './components/common/ActionButtonGroup';
import LocationModal from './components/itinerary/LocationModal';
import { calculateRoute } from "./features/routing/calculateRoute";
import { handleCar, handleBicycling, handleWalking } from './features/routing/stateHandlers';
import { clearRoute } from './features/routing/clearRoute';
import calculateDistance from "./utils/calculateDistance";
import calculateTime from "./utils/calculateTime";
import Locations from "./lib/Locations";
import Attractions from "./lib/Attractions";
import { ThemeContext } from "./context/ThemeContext";
import { uiThemes } from "./theme/uiThemes";
import ThemeMenu from './components/header/ThemeMenu';
import { FaInfoCircle, FaListUl } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { Tooltip, IconButton } from "@chakra-ui/react";
import { googleMapsApiKey } from "./lib/googleMapsKey";

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
  const [searchCoverage, setSearchCoverage] = useState({ points: [], path: [] });
  const [showSearchCoverage, setShowSearchCoverage] = useState(true);
  const [travelMethod, setTravelMethod] = useState("WALKING");
  const [journeyWarning, setJourneyWarning] = useState("walking");
  const [routeError, setRouteError] = useState("");
  const [isPlanningRoute, setIsPlanningRoute] = useState(false);
  const [isOpenItinerary, setIsOpenItinerary] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const getInitialTheme = () => localStorage.getItem("mapTheme") || "classic";
  const [mapTheme, setMapTheme] = useState(getInitialTheme);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [detailsFromItinerary, setDetailsFromItinerary] = useState(false);
  const [activePicker, setActivePicker] = useState(null);
  const [pickedStart, setPickedStart] = useState(null);
  const [pickedFinish, setPickedFinish] = useState(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [updatingStopId, setUpdatingStopId] = useState(null);
  const closeLocationModal = () => {
    setSelectedPlace(null);
    setDetailsFromItinerary(false);
  };

  const onCloseItinerary = () => setIsOpenItinerary(false)
  const onOpenItinerary = () => setIsOpenItinerary(true)
  const directionsRendererRef = useRef(null);

  const moveStop = async (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= combinedStops.length || isPlanningRoute) return;
    const previousStops = combinedStops;
    const nextStops = [...combinedStops];
    const [movedStop] = nextStops.splice(fromIndex, 1);
    nextStops.splice(toIndex, 0, movedStop);
    setCombinedStops(nextStops);
    setIsPlanningRoute(true);
    try {
      const results = await directionsService.route({
        origin: startRef.current?.value,
        destination: finishRef.current?.value,
        waypoints: nextStops.map((stop) => ({ location: stop.geometry.location, stopover: true })),
        optimizeWaypoints: false,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode[travelMethod],
      });
      setDirectionsResponse(results);
      setDistance(calculateDistance(results));
      setTime(calculateTime(results));
    } catch (error) {
      setCombinedStops(previousStops);
      setRouteError("non-viable");
    } finally {
      setIsPlanningRoute(false);
    }
  };

  const applyStops = async (nextStops, previousStops = combinedStops) => {
    setCombinedStops(nextStops);
    setIsPlanningRoute(true);
    try {
      const results = await directionsService.route({
        origin: startRef.current?.value,
        destination: finishRef.current?.value,
        waypoints: nextStops.map((stop) => ({ location: stop.geometry.location, stopover: true })),
        optimizeWaypoints: false,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode[travelMethod],
      });
      setDirectionsResponse(results);
      setDistance(calculateDistance(results));
      setTime(calculateTime(results));
      return true;
    } catch (error) {
      setCombinedStops(previousStops);
      setRouteError("non-viable");
      return false;
    } finally {
      setIsPlanningRoute(false);
    }
  };

  const removeStop = async (place) => {
    if (updatingStopId || !window.confirm(`Remove ${place.name} and recalculate the route?`)) return;
    setUpdatingStopId(place.place_id);
    const succeeded = await applyStops(combinedStops.filter((stop) => stop.place_id !== place.place_id));
    if (succeeded && selectedPlace?.place_id === place.place_id) closeLocationModal();
    setUpdatingStopId(null);
  };

  const regenerateStop = async (place) => {
    if (updatingStopId) return;
    setUpdatingStopId(place.place_id);
    try {
      const { lat, lng } = place.geometry.location;
      const response = place.stopType === "attraction" ? await Attractions(lat, lng) : await Locations(lat, lng);
      const excluded = new Set(combinedStops.map((stop) => stop.place_id));
      const candidates = (response?.results || [])
        .filter((item) => item.place_id && item.geometry?.location && !excluded.has(item.place_id) && item.business_status !== "CLOSED_PERMANENTLY")
        .sort((a, b) => ((b.rating || 0) * 2.2 + Math.log10((b.user_ratings_total || 0) + 1) * 1.4) - ((a.rating || 0) * 2.2 + Math.log10((a.user_ratings_total || 0) + 1) * 1.4));
      if (!candidates.length) throw new Error("No different place found nearby");
      const replacement = { ...candidates[0], stopType: place.stopType };
      const succeeded = await applyStops(combinedStops.map((stop) => stop.place_id === place.place_id ? replacement : stop));
      if (succeeded && selectedPlace?.place_id === place.place_id) setSelectedPlace(replacement);
    } catch (error) {
      setRouteError("places-failed");
    } finally {
      setUpdatingStopId(null);
    }
  };

  const addStop = async (stopType) => {
    if (!directionsResponse || updatingStopId || isPlanningRoute) return;
    const typeCount = combinedStops.filter((stop) => stop.stopType === stopType).length;
    if (typeCount >= 10) {
      window.alert(`A route can contain up to 10 ${stopType === "pub" ? "pubs" : "attractions"}.`);
      return;
    }

    const valueOf = (value) => typeof value === "function" ? value() : value;
    const firstLeg = directionsResponse.routes?.[0]?.legs?.[0];
    const lastLeg = directionsResponse.routes?.[0]?.legs?.at(-1);
    const toPoint = (location) => ({
      lat: valueOf(location?.lat),
      lng: valueOf(location?.lng),
    });
    const points = [
      toPoint(firstLeg?.start_location),
      ...combinedStops.map((stop) => toPoint(stop.geometry.location)),
      toPoint(lastLeg?.end_location),
    ];
    if (points.some((point) => !Number.isFinite(point.lat) || !Number.isFinite(point.lng))) {
      setRouteError("places-failed");
      return;
    }

    let insertionIndex = 0;
    let largestGap = -1;
    for (let index = 0; index < points.length - 1; index += 1) {
      const latitude = points[index + 1].lat - points[index].lat;
      const longitude = points[index + 1].lng - points[index].lng;
      const gap = latitude * latitude + longitude * longitude;
      if (gap > largestGap) {
        largestGap = gap;
        insertionIndex = index;
      }
    }
    const searchPoint = {
      lat: (points[insertionIndex].lat + points[insertionIndex + 1].lat) / 2,
      lng: (points[insertionIndex].lng + points[insertionIndex + 1].lng) / 2,
    };

    setUpdatingStopId("__adding__");
    setRouteError("");
    try {
      const response = stopType === "attraction"
        ? await Attractions(searchPoint.lat, searchPoint.lng)
        : await Locations(searchPoint.lat, searchPoint.lng);
      const excluded = new Set(combinedStops.map((stop) => stop.place_id));
      const candidates = (response?.results || [])
        .filter((item) =>
          item.place_id &&
          item.geometry?.location &&
          !excluded.has(item.place_id) &&
          item.business_status !== "CLOSED_PERMANENTLY" &&
          (item.rating || 0) >= 3.8
        )
        .sort((a, b) =>
          ((b.rating || 0) * 2.2 + Math.log10((b.user_ratings_total || 0) + 1) * 1.4) -
          ((a.rating || 0) * 2.2 + Math.log10((a.user_ratings_total || 0) + 1) * 1.4)
        );
      if (!candidates.length) throw new Error("No suitable place found");
      const nextStops = [...combinedStops];
      nextStops.splice(insertionIndex, 0, { ...candidates[0], stopType });
      const succeeded = await applyStops(nextStops);
      if (succeeded) {
        if (stopType === "pub") setPubStops((count) => Math.min(10, Number(count) + 1));
        else setAttractionStops((count) => Math.min(10, Number(count) + 1));
      }
    } catch (error) {
      setRouteError("places-failed");
    } finally {
      setUpdatingStopId(null);
    }
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
        setRouteError,
        setSearchCoverage
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
        h="100dvh"
        minH="100dvh"
        w="100%"
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
          setSearchCoverage={setSearchCoverage}
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
              directionsRendererRef,
              setSearchCoverage
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
            onMarkerClick={(location) => {
              setSelectedPlace(location);
              setDetailsFromItinerary(false);
            }}
            searchCoverage={searchCoverage}
            showSearchCoverage={showSearchCoverage}
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
        <LocationModal
          isOpen={!!selectedPlace}
          onClose={closeLocationModal}
          place={selectedPlace}
          stopNumber={selectedPlace ? combinedStops.findIndex((stop) => stop.place_id === selectedPlace.place_id) + 1 : null}
          onBack={detailsFromItinerary ? () => {
            setSelectedPlace(null);
            setDetailsFromItinerary(false);
            setIsOpenItinerary(true);
          } : undefined}
          updating={updatingStopId === selectedPlace?.place_id}
          onRemove={() => removeStop(selectedPlace)}
          onRegenerate={() => regenerateStop(selectedPlace)}
        />
        <Box
          position="absolute"
          zIndex="900"
          right={{ base: "50%", md: 4 }}
          bottom={{ base: "calc(env(safe-area-inset-bottom, 0px) + 24px)", md: "auto" }}
          top={{ base: "auto", md: "50%" }}
          transform={{ base: "translateX(50%)", md: "translateY(-50%)" }}
          bg={uiThemes[mapTheme].bg}
          border={`1px solid ${uiThemes[mapTheme].accent}`}
          borderRadius="full"
          boxShadow="lg"
          px={{ base: 3, md: 2 }}
          py={{ base: 2, md: 3 }}
          minW="auto"
        >
          <Flex
            gap={2}
            direction={{ base: "row", md: "column" }}
            align="center"
            justify="center"
          >
            <ActionButtonGroup
              hasRoute={!!directionsResponse}
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
                  directionsRendererRef,
                  setSearchCoverage
                )
              }
              onCenter={onCenterMap}
              hasSearchCoverage={searchCoverage.points.length > 0}
              showSearchCoverage={showSearchCoverage}
              onToggleSearchCoverage={() => setShowSearchCoverage((visible) => !visible)}
              infoControl={(
                <Tooltip label="About & support" hasArrow placement="left">
                  <IconButton as={RouterLink} to="/support" aria-label="About and support" icon={<FaInfoCircle />} isRound bg={uiThemes[mapTheme].bg} color={uiThemes[mapTheme].text} _hover={{ bg: `${uiThemes[mapTheme].accent}22` }} border={`1px solid ${uiThemes[mapTheme].accent}`} boxShadow="md" size="lg" />
                </Tooltip>
              )}
              themeControl={<ThemeMenu mapTheme={mapTheme} setMapTheme={setMapTheme} />}
              itineraryControl={directionsResponse ? (
                <Tooltip label="Itinerary" hasArrow placement="left">
                  <IconButton
                    aria-label="Itinerary"
                    icon={<FaListUl />}
                    onClick={onOpenItinerary}
                    isRound
                    bg={uiThemes[mapTheme].bg}
                    color={uiThemes[mapTheme].text}
                    _hover={{ bg: uiThemes[mapTheme].accent }}
                    border={`1px solid ${uiThemes[mapTheme].accent}`}
                    boxShadow="md"
                    size="lg"
                  />
                </Tooltip>
              ) : null}
            />
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
          updatingStopId={updatingStopId}
          onRemoveStop={removeStop}
          onRegenerateStop={regenerateStop}
          onAddStop={addStop}
          onSelectStop={(stop) => {
            setIsOpenItinerary(false);
            setSelectedPlace(stop);
            setDetailsFromItinerary(true);
          }}
        />
      </Flex>
    </ThemeContext.Provider>
  );
}

export default App;
