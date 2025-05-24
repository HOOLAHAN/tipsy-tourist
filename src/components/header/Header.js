import {
  Box,
  Flex,
  IconButton,
  Image,
  Heading,
  useDisclosure,
  useBreakpointValue,
  HStack,
  VStack,
  Tooltip,
  Select,
  Collapse,
} from "@chakra-ui/react";
import { FaLocationArrow, FaBars } from "react-icons/fa";
import PlanTripButtons from "./PlanTripButtons";
import { useUITheme } from "../../context/ThemeContext";

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

const Header = ({ onCenter, onPlanTrip, onSeeItinerary, mapTheme, setMapTheme }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onToggle } = useDisclosure();
  const theme = useUITheme();
  const logoSrc = logoMap[mapTheme] || logoNeon;

  const buttonStyle = {
    w: "100%",
    borderRadius: "md",
    bg: theme.primary,
    color: "white",
    _hover: { bg: theme.accent },
    border: `1px solid ${theme.accent}`,
    shadow: "md",
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="999"
      bg={theme.bg}
      color={theme.text}
      backdropFilter="blur(6px)"
      boxShadow="sm"
      px={4}
      py={3}
    >
      <Flex justify="space-between" align="center" wrap="wrap">
        <HStack spacing={3} align="center" mx={2}>
          <Image src={logoSrc} alt="logo" boxSize="40px" />
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
        </HStack>

        {isMobile ? (
          <IconButton
            icon={<FaBars />}
            aria-label="Menu"
            size="md"
            onClick={onToggle}
            variant="ghost"
            color={theme.primary}
            ml={2}
          />
        ) : (
          <HStack spacing={3} align="center">
            <PlanTripButtons onPlanTrip={onPlanTrip} onSeeItinerary={onSeeItinerary} position="left" />
            <PlanTripButtons onPlanTrip={onPlanTrip} onSeeItinerary={onSeeItinerary} position="right" />
            <Select
              size="sm"
              variant="filled"
              bg={theme.primary}
              color="white"
              borderRadius="md"
              cursor="pointer"
              border={`1px solid ${theme.accent}`}
              px={3}
              py={1.5}
              minW="110px"
              maxW="140px"
              value={mapTheme}
              onChange={(e) => setMapTheme(e.target.value)}
              shadow="md"
              _hover={{ bg: theme.accent }}
              _focus={{
                outline: "none",
                bg: theme.accent,
                borderColor: theme.accent,
                boxShadow: "0 0 0 2px rgba(255,255,255,0.3)",
              }}
            >
              <option value="classic">Classic</option>
              <option value="dark">Dark</option>
              <option value="plain">Plain</option>
              <option value="neon">Neon</option>
            </Select>
          </HStack>
        )}
      </Flex>

      {/* Mobile dropdown section */}
      {isMobile && (
        <Collapse in={isOpen} animateOpacity>
          <VStack mt={4} spacing={3} align="stretch">
            <Box {...buttonStyle} as="button" onClick={onPlanTrip}>
              Plan Tipsy Tour!
            </Box>
            <Box {...buttonStyle} as="button" onClick={onSeeItinerary}>
              Itinerary
            </Box>
            <Select
              variant="filled"
              bg={theme.primary}
              color="white"
              borderRadius="md"
              border={`1px solid ${theme.accent}`}
              px={3}
              h="32px"
              minH="32px"
              shadow="md"
              cursor="pointer"
              value={mapTheme}
              onChange={(e) => setMapTheme(e.target.value)}
              _hover={{ bg: theme.accent }}
              _focus={{
                outline: "none",
                bg: theme.accent,
                borderColor: theme.accent,
                boxShadow: "0 0 0 2px rgba(255,255,255,0.3)",
              }}
            >
              <option value="classic">Classic</option>
              <option value="dark">Dark</option>
              <option value="plain">Plain</option>
              <option value="neon">Neon</option>
            </Select>
          </VStack>
        </Collapse>
      )}
    </Box>
  );
};

export default Header;
