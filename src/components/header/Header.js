import {
  Box,
  Flex,
  IconButton,
  Image,
  Heading,
  Text,
  HStack,
  useDisclosure,
  VStack,
  Collapse,
  useOutsideClick
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaBars, FaRoute } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";
import PlanTour from "./PlanTour";

import logoClassic from "../../assets/images/logo_classic.png";

const Header = ({
  onSeeItinerary,
  mapTheme,
  setMapTheme,
  isPlannerOpen,
  setIsPlannerOpen,
  startRef,
  finishRef,
  handleBicycling,
  handleWalking,
  recalculateRouteForMode,
  travelMethod,
  setTravelMethod,
  setJourneyWarning,
  pubStops,
  setPubStops,
  attractionStops,
  setAttractionStops,
  calculateRoute,
  directionsService,
  setDirectionsResponse,
  setDistance,
  setTime,
  setCombinedStops,
  setSearchCoverage,
  journeyWarning,
  routeError,
  setRouteError,
  isPlanningRoute,
  setIsPlanningRoute,
  activePicker,
  setActivePicker,
  distance,
  time,
  clearRoute,
  directionsRendererRef,
}) => {
  const { isOpen, onClose, onToggle } = useDisclosure({
    isOpen: isPlannerOpen,
    onOpen: () => setIsPlannerOpen(true),
    onClose: () => setIsPlannerOpen(false),
  });
  const theme = useUITheme();
  const logoSrc = logoClassic;
  const collapseRef = useRef();
  const buttonRef = useRef();
  
useOutsideClick({
  ref: collapseRef,
  handler: (e) => {
    const clickedInsideAutocomplete = e.target.closest(".pac-container");
    if (isOpen && !buttonRef.current.contains(e.target) && !clickedInsideAutocomplete) {
      onToggle();
    }
  },
});

  return (
    <>
    <Box
      as="header"
      position="fixed"
      top={{ base: 3, md: 4 }}
      bottom="auto"
      left={{ base: 3, md: "50%" }}
      right={{ base: 3, md: "auto" }}
      transform={{ base: "none", md: "translateX(-50%)" }}
      zIndex="999"
      bg={theme.bg}
      color={theme.text}
      border={`1px solid ${theme.accent}`}
      borderRadius="full"
      backdropFilter="blur(10px)"
      boxShadow="0 18px 45px rgba(15, 23, 42, 0.22)"
      py={3}
      px={3}
      w={{ base: "auto", md: "min(460px, calc(100vw - 160px))" }}
    >
      <Flex justify="space-between" align="center" wrap="nowrap" gap={3}>
        <Image src={logoSrc} alt="Tipsy Tourist" boxSize="48px" />

        <Box flex="1" minW={0}>
          <Heading size="md" color={theme.primary} whiteSpace="nowrap">
            {(
              <>
                <Box as="span" color="#EA4335">T</Box>
                <Box as="span" color="#FBBC05">i</Box>
                <Box as="span" color="#4285F4">p</Box>
                <Box as="span" color="#34A853">s</Box>
                <Box as="span" color="#EA4335">y</Box>{" "}
                <Box as="span" color="#FBBC05">T</Box>
                <Box as="span" color="#4285F4">o</Box>
                <Box as="span" color="#34A853">u</Box>
                <Box as="span" color="#EA4335">r</Box>
                <Box as="span" color="#FBBC05">i</Box>
                <Box as="span" color="#4285F4">s</Box>
                <Box as="span" color="#34A853">t</Box>
              </>
            )}
          </Heading>
          <HStack spacing={2} mt={1} color={theme.text} opacity={0.85}>
            <FaRoute />
            <Text fontSize="xs" noOfLines={1}>
              {distance && time
                ? `${distance} · ${time} · ${travelMethod.toLowerCase()}`
                : "Plan a pub-and-sights route"}
            </Text>
          </HStack>
        </Box>

        <IconButton
          ref={buttonRef}
          icon={<FaBars />}
          aria-label="Plan route"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          variant="ghost"
          color={theme.primary}
          marginLeft={3}
          isRound
          bg={`${theme.accent}18`}
        />
      </Flex>
    </Box>

      <Collapse in={isOpen} animateOpacity>
        <Box ref={collapseRef} position="fixed" zIndex="998" left={{ base: 0, md: "50%" }} right={{ base: 0, md: "auto" }} bottom={0} transform={{ base: "none", md: "translateX(-50%)" }} w={{ base: "100%", md: "520px" }} maxH="82dvh" overflowY="auto" bg={theme.bg} color={theme.text} border={`1px solid ${theme.accent}`} borderBottomWidth={0} borderTopRadius="3xl" boxShadow="0 -18px 55px rgba(15,23,42,.18)" px={{ base: 5, md: 6 }} pt={3} pb="calc(env(safe-area-inset-bottom, 0px) + 24px)">
          <Box w="44px" h="5px" bg={theme.accent} opacity={0.45} borderRadius="full" mx="auto" mb={4} />
          <Text color={theme.primary} fontSize="xs" fontWeight="extrabold" letterSpacing="0.18em">BUILD A ROUTE</Text>
          <Heading size="lg" mt={1}>Where are we going?</Heading>
          <Text fontSize="sm" opacity={0.68} mt={1} mb={4}>Choose your route and we’ll find the stops.</Text>
          <VStack spacing={3} align="stretch">
            <PlanTour
            startRef={startRef}
            finishRef={finishRef}
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
            onPlannerClose={onClose}
            distance={distance}
            time={time}
            clearRoute={clearRoute}
            mapTheme={mapTheme}
            onAfterSubmit={onToggle}
          />
        </VStack>
        </Box>
      </Collapse>
    </>
  );
};

export default Header;
