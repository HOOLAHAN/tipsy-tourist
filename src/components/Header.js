// src/components/Header.js

import {
  Box,
  Flex,
  IconButton,
  Image,
  Heading,
  useBreakpointValue,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { FaLocationArrow } from "react-icons/fa";
import tipsyTouristLogo3 from "../assets/images/logo3.svg";
import PlanTripButtons from "./plan/PlanTripButtons";

const Header = ({ onCenter, onPlanTrip, onSeeItinerary }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="999"
      bg="whiteAlpha.900"
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
          <Image src={tipsyTouristLogo3} alt="logo" boxSize="50px" />
          <Heading size={isMobile ? "md" : "lg"} color="#393f49">
            Tipsy Tourist
          </Heading>
        </HStack>

        <HStack spacing={3}>
          <PlanTripButtons onPlanTrip={onPlanTrip} onSeeItinerary={onSeeItinerary} position="left" />
          <PlanTripButtons onPlanTrip={onPlanTrip} onSeeItinerary={onSeeItinerary} position="right" />
          <Tooltip label="Re-center map">
            <IconButton
              icon={<FaLocationArrow />}
              aria-label="Re-center map"
              size="md"
              isRound
              bg="white"
              _hover={{ bg: "gray.100" }}
              onClick={onCenter}
              boxShadow="sm"
            />
          </Tooltip>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
