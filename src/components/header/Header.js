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
import logoDark from "../../assets/images/logo_dark.svg";
import logoPlain from "../../assets/images/logo_plain.svg";
import logoNeon from "../../assets/images/logo_neon.svg";

const logoMap = {
  classic: logoClassic,
  dark: logoDark,
  plain: logoPlain,
  neon: logoNeon,
};

const Header = ({
  onSeeItinerary,
  mapTheme,
  setMapTheme,
  isPlannerOpen,
  setIsPlannerOpen,
  startRef,
  finishRef,
  handleCar,
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
  const logoSrc = logoMap[mapTheme] || logoNeon;
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
    <Box
      as="header"
      position="fixed"
      top={{ base: "auto", md: 4 }}
      bottom={{ base: 3, md: "auto" }}
      left={{ base: 3, md: "50%" }}
      right={{ base: 3, md: "auto" }}
      transform={{ base: "none", md: "translateX(-50%)" }}
      zIndex="999"
      bg={theme.bg}
      color={theme.text}
      border={`1px solid ${theme.accent}`}
      borderRadius="xl"
      backdropFilter="blur(10px)"
      boxShadow="0 18px 45px rgba(15, 23, 42, 0.22)"
      py={4}
      px={4}
      w={{ base: "auto", md: "min(460px, calc(100vw - 160px))" }}
      maxH={{ base: "calc(100vh - 24px)", md: "calc(100vh - 32px)" }}
      overflowY="auto"
    >
      <Flex justify="space-between" align="center" wrap="nowrap" gap={3}>
        <Image src={logoSrc} alt="logo" boxSize="40px" marginRight={3}/>

        <Box flex="1" minW={0}>
          <Heading size="md" color={theme.primary} whiteSpace="nowrap">
            {mapTheme === "classic" ? (
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
            ) : (
              <Box as="span" color={theme.primary}>Tipsy Tourist</Box>
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
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box ref={collapseRef}>
          <VStack mt={4} spacing={3} align="stretch">
            <PlanTour
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
    </Box>
  );
};

export default Header;
