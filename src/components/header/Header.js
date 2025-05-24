// src/components/header/Header.js

import {
  Box,
  Flex,
  IconButton,
  Image,
  Heading,
  useBreakpointValue,
  HStack,
  Tooltip,
  Select,
} from "@chakra-ui/react";
import { FaLocationArrow } from "react-icons/fa";
import PlanTripButtons from "./PlanTripButtons";
import { useUITheme } from "../../context/ThemeContext";

// Static imports of theme-specific logos
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
  const theme = useUITheme();
  const logoSrc = logoMap[mapTheme] || logoNeon;

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
      py={2}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        gap={3}
      >
        <HStack spacing={3} align="center">
          <Image src={logoSrc} alt="logo" boxSize="50px" />
          <Heading size={isMobile ? "md" : "lg"} color={theme.text}>
            Tipsy Tourist
          </Heading>
        </HStack>

        <HStack spacing={3}>
          <PlanTripButtons
            onPlanTrip={onPlanTrip}
            onSeeItinerary={onSeeItinerary}
            position="left"
          />
          <PlanTripButtons
            onPlanTrip={onPlanTrip}
            onSeeItinerary={onSeeItinerary}
            position="right"
          />
          <Tooltip label="Re-center map">
            <IconButton
              icon={<FaLocationArrow />}
              aria-label="Re-center map"
              size="md"
              isRound
              bg={theme.primary}
              color="white"
              _hover={{ bg: theme.accent }}
              onClick={onCenter}
              boxShadow="sm"
            />
          </Tooltip>
          <Select
            size="sm"
            bg={theme.bg}
            color={theme.text}
            borderColor={theme.accent}
            value={mapTheme}
            onChange={(e) => setMapTheme(e.target.value)}
            w="auto"
            shadow="sm"
            _hover={{ borderColor: theme.accent }}
            _focus={{ borderColor: theme.accent }}
          >
            <option value="classic">Classic</option>
            <option value="dark">Dark</option>
            <option value="plain">Plain</option>
            <option value="neon">Neon</option>
          </Select>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
