import {
  Box,
  Flex,
  IconButton,
  Image,
  Heading,
  useDisclosure,
  VStack,
  Collapse,
  useOutsideClick
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaBars } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";
import PlanTour from "./PlanTour";

import logoClassic from "../../assets/images/logo_classic.svg";
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
  startRef,
  finishRef,
  handleCar,
  handleBicycling,
  handleWalking,
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
  distance,
  time,
  clearRoute,
  directionsRendererRef,
}) => {
  const { isOpen, onToggle } = useDisclosure();
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
      mt={4}
      borderRadius="lg"
      position="sticky"
      top={0}
      zIndex="999"
      bg={theme.bg}
      color={theme.text}
      backdropFilter="blur(6px)"
      boxShadow="sm"
      py={3}
      px={2}
    >
      <Flex justify="space-between" align="center" wrap="nowrap" px={2}>
        {/* Left: Logo */}
        <Image src={logoSrc} alt="logo" boxSize="40px" />

        {/* Centre: Heading */}
        <Box flex="1" textAlign="center">
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
        </Box>

        {/* Right: Burger Icon */}
        <IconButton
          ref={buttonRef}
          icon={<FaBars />}
          aria-label="Menu"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          variant="ghost"
          color={theme.primary}
        />
      </Flex>

      {/* Dropdown section */}
      <Collapse in={isOpen} animateOpacity>
        <Box ref={collapseRef}>
          <VStack mt={4} spacing={3} align="stretch">
            <PlanTour
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
